---
layout: single
title: "Hacking The Jetson"
excerpt: "Customize Your NVIDIA Jetson Orin Nano and Turn It Up To the Max With AI"
date: 2026-07-30
classes: wide
categories:
  - blog
tags:
  - nvidia
  - jetson
  - minifi
  - efm
  - edge
  - ai
  - oled
  - i2c
  - cloudera
---

:warning: **Danger!** This is a Work in Progress article. Content and code are updating frequently until this notice is removed. The environment-sensor section in particular is paused on a hardware RMA.
{: .notice--danger}

I bought an NVIDIA Jetson Orin Nano developer kit, dropped it into a Yahboom CubeNano case, and then spent a few weeks turning it into something between a desk toy and a real edge-AI node. It runs a MiNiFi C++ agent that reports into Cloudera Edge Flow Manager and produces to Kafka. It has a tiny OLED on the case that I hacked into a sci-fi strobe. It falls into a Matrix digital-rain screensaver when it's idle. And it answers HTTP requests that launch things on its own physical display. This post is the whole build — the box, the hacks, the edge-AI plumbing, what broke, and what I'd do next. Every path, port, bus number, and I2C address below is real and taken off the live device (hostname `tunastreet`, an ARM Cortex-A78AE / Ampere Jetson Orin Nano on Ubuntu 24.04, JetPack/L4T R39).

<img src="/assets/images/Hack-The-Jetson.jpg" alt="Cloudera EFM with NVIDIA Jetson Orin Nano" width="640">

This is the *build* post. The deep enterprise integration — persisted EFM on Kubernetes, MiNiFi binaries for Windows/Linux/Jetson, the full CSO stack next to it, model metrics into Prometheus — lives in its own companion writeups linked at the end. Here I'm showing you the box and everything I bolted onto it.

## The hardware

Three parts stack up on my desk:

- **[NVIDIA Jetson Orin Nano Super Developer Kit](https://www.amazon.com/dp/B0BZJTQ5YP)** — the compute, and the reason this whole thing is worth doing. **67 TOPS** (Sparse INT8), a 1024-core Ampere GPU with 32 Tensor Cores, a 6-core Arm Cortex-A78AE CPU up to 1.7 GHz, 8GB of 128-bit LPDDR5 at 102 GB/s, in a 7W–25W envelope. NVIDIA lists it at **$249**. That's a data-center-shaped AI stack on a board that draws less than a light bulb — plenty to run MiNiFi, drive a display, and front a nearby inference server at the same time.
- **[Jetson MINI Cube Nano case](https://www.amazon.com/dp/B0GDFTZ64S)** — the case (supports Jetson Nano / Orin Nano / Orin NX / Xavier NX / TX2 NX), with a 40-pin passthrough, a fan, and a small **128×32 SSD1306 OLED** on the header. The OLED is the thing that makes this build fun.
- **[Waveshare Environment Sensor module](https://www.amazon.com/dp/B08YDBKLDV)** — an I2C sensor board (ambient light, temp/humidity/pressure, 9-DOF IMU, UV, VOC) with its own 1.3" OLED, designed to stack on the Jetson Nano 40-pin header. This one is currently paused on an RMA — more on that below.

:information_source: **Confirmed parts.** Jetson Orin Nano Super Developer Kit — NVIDIA, ASIN B0BZJTQ5YP, $249, 67 TOPS. Jetson MINI Cube Nano case — ASIN B0GDFTZ64S. Waveshare Environment Sensors Module for Jetson Nano (I2C, 1.3" OLED) — ASIN B08YDBKLDV, also documented on the [Waveshare wiki](https://www.waveshare.com/wiki/Environment_Sensor_for_Jetson_Nano).
{: .notice--info}

## Hack #1 — the CubeNano OLED, from stats display to CORDY CEPT strobe

The CubeNano case puts a 128×32 SSD1306 OLED on the 40-pin header, driven over I2C at `/dev/i2c-7`, address `0x3c`. Yahboom ships a stats loop for it. Mine lives in `~/CubeNano/oled.py`: it auto-probes I2C buses `[1, 0, 7, 8]` until it finds the panel, then writes four lines — CPU%, time, RAM, disk, IP — refreshing about 10× a second, managed by a systemd unit (`yahboom_oled.service`, enabled so it survives reboot).

That's the baseline. On top of it I built a second display mode: a full-screen black/white strobe at 0.25s intervals with bold, letter-spaced sci-fi text reading **`C O R D Y`** / **`C E P T`** in the Orbitron font. That's `~/CubeNano/oled_strobe.py`.

### Symptom: an OS update wiped the strobe

I ran an `apt` batch that pulled a glibc upgrade, which needs a reboot to take. Rebooted — and the OLED came back showing the plain CPU/RAM/IP stats screen, not my CORDY strobe.

First instinct is "did I kill the panel?" I ruled out hardware in 30 seconds: `i2cdetect -y -r 7` still showed `0x3c` acking, and a live `Adafruit_SSD1306.begin()` against bus 7 succeeded with no exceptions. The panel and bus were never the problem.

### Diagnosis: I never made the strobe survive a reboot

`yahboom_oled.service` is the only thing wired into systemd, and it runs `oled.py` (the stats display). `oled_strobe.py` I had only ever started by hand with `python3 oled_strobe.py &`. A bare `&` backgrounds a process in the current shell's process group — which gets torn down when that shell exits. The reboot killed it, and only the systemd-managed stats display came back. Nothing to do with glibc; *any* reboot would have done it.

### Fix: detach it, then give it its own systemd unit

Immediate fix — kill the stats process and start the strobe fully detached so it survives the shell:

```bash
pkill -f "python3 /home/tunastreet/CubeNano/oled.py"
cd ~/CubeNano
setsid nohup python3 -u oled_strobe.py > /tmp/oled_strobe.log 2>&1 < /dev/null &
```

`setsid` is the part that matters — it puts the process in its own session so it doesn't die with the launching shell. But that's still just a background process; the next reboot blanks it again. The real fix is a dedicated systemd unit and retiring the stats one so they can't fight over the same OLED on boot.

`~/CubeNano/cordy_oled.service`:

```ini
[Unit]
Description=cordy_oled strobe service
After=multi-user.target

[Service]
Type=idle
User=tunastreet
ExecStart=/bin/sh -c "python3 /home/tunastreet/CubeNano/oled_strobe.py"
WorkingDirectory=/home/tunastreet
Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
```

Install it and disable the stats unit in one pass (`~/CubeNano/install_cordy_oled_service.sh`):

```bash
sudo systemctl disable --now yahboom_oled.service
pkill -f oled_strobe.py
sudo cp /home/tunastreet/CubeNano/cordy_oled.service /etc/systemd/system/cordy_oled.service
sudo systemctl daemon-reload
sudo systemctl enable --now cordy_oled.service
```

To flip back to the stats display:

```bash
sudo systemctl disable --now cordy_oled.service
sudo systemctl enable --now yahboom_oled.service
```

I keep a few other renders in `~/CubeNano/` for the same panel: `oled_cordy.py` (static two-line CORDY/CEPT), `oled_cool.py` (a typewriter-reveal "WAKE UP... THE MATRIX HAS YOU..." boot message), and `oled_basic_test.py` (raw black/white/black sanity check to confirm the panel is healthy).

:warning: **Don't persist a display process with a bare `&`.** It looks alive right up until the next reboot or logout, then it's gone with no error anywhere to point at. If you want it to survive, it needs `setsid` (for the current session) and ultimately a systemd unit (for boot). And before you assume a blanked OLED is dead hardware, check whether the *right process* is even running — `i2cdetect` plus a live `begin()` is 30 seconds that saves you pulling the board off the header.
{: .notice--warning}

:bulb: **`sudo` needs a real TTY.** Every install step here is wrapped in a `bash ~/CubeNano/install_*.sh` one-liner on purpose — the automation driving this box can't type a sudo password into an interactive prompt, so the `sudo` calls get committed into a script and run in one shot. Same pattern shows up everywhere on this device.
{: .notice--info}

## Hack #2 — a Matrix digital-rain screensaver, done without xscreensaver

When the Jetson sits idle for two minutes, its monitor falls into a full-screen Matrix-style falling-code effect (binary `0`/`1`, canvas-based, with a small glowing clock in the corner). It's a self-contained HTML file rendered by Chromium in kiosk mode, driven by a standalone idle-watcher — deliberately *not* xscreensaver.

### Why not xscreensaver

I started with xscreensaver's `programs:` hack mechanism to launch Chromium. It was janky. xscreensaver hacks are supposed to render *into* a window ID that xscreensaver hands them so they stay correctly stacked. Chromium's kiosk mode always opens its own independent top-level window, so it rendered *underneath* xscreensaver's black saver window. The screen just looked black, and moving the mouse flashed the scene for a moment right before xscreensaver killed the child.

So I ditched the hack model. `xscreensaver` is stopped, `~/.xscreensaver` has `mode: off`, and a systemd *user* service polls real idle time and manages Chromium directly — no competing window ever gets created.

### The pieces

- `~/matrix-screensaver.html` — the scene, self-contained, no network calls, works as a `file://` URL.
- `~/.local/bin/lofi-idle-watcher.sh` — polls `xprintidle`; once idle crosses the threshold it launches Chromium kiosk at the HTML file and force-fullscreens the window. Kills Chromium the moment activity resumes.
- `~/.config/systemd/user/lofi-idle-watcher.service` — runs the watcher as a persistent user service; inherits `DISPLAY`/`XAUTHORITY` from the systemd user environment.

Current idle threshold is 2 minutes (`IDLE_THRESHOLD_MS` in the watcher).

The rain itself is written to be cheap on the Nano's GPU. An early version redrew a 90-character trail every frame across ~200 columns — roughly 15k `fillText` calls per frame — and visibly bogged down. The current version draws exactly one new glyph per column per frame and lets a very faint semi-transparent black overlay (`rgba(0,0,0,0.035)`) fade the trail. That's the actual technique behind the original effect, and it's roughly 60× cheaper per frame while still producing a long, slow-fading trail. Runs at a fixed 24 FPS via `setInterval` (not `requestAnimationFrame`) to keep the draw rate cheap and independent of monitor refresh.

### Three failure modes worth knowing (all fixed, all verified)

Chromium under kiosk mode fought me three separate ways, and every fix is worth carrying to any Chromium-kiosk build:

1. **Silent failure to launch — no window, no error.** Chromium was using its default shared snap profile. Every kill was an abrupt `pkill`, which could leave a stale `SingletonLock` pointing at a dead PID. On the next launch Chromium tried to hand the URL to what it thought was a live instance over a dead socket, failed silently, and just exited. **Fix:** give the kiosk its own isolated `--user-data-dir` (`~/snap/chromium/common/lofi-screensaver-profile`) and clear stale `Singleton*` files before each launch. The profile dir has to live somewhere the snap confinement can write — `~/snap/chromium/common/` works, `/run/user/1000/` does not (Chromium throws a "Failed To Create Data Directory" dialog storm and silently falls back to the shared profile).
2. **Stacked/duplicate windows.** `stop_saver()` matched the kill on the target URL (`pkill -f matrix-screensaver.html`) — but that string only appears in the top-level browser process's argv, not its zygote/renderer/gpu children. So a kill removed only the parent; the children and their window survived, and the next tick launched a second instance on top. **Fix:** match/kill on `--user-data-dir=$PROFILE_DIR` instead — every process in Chromium's tree carries that flag, so one `pkill -f` takes down the whole tree.
3. **Window comes up the wrong size.** Chromium's own `--kiosk`/`--start-fullscreen`/`--window-position=0,0` flags don't reliably get Mutter to grant real X11 fullscreen — the window came up at, say, `1854×1011` at `80,118` instead of `1920×1080` at `0,0`. **Fix:** after launch, poll for the window and force `_NET_WM_STATE_FULLSCREEN` with `wmctrl`. The poll has to be patient — right after a reboot, or with apt/snap updates running, Chromium can take 7+ seconds to create its window, well past a naive 5-second timeout. I extended the poll loop to up to a minute (240 × 0.25s).

To tweak it (glyph size/speed/color, or the idle threshold) edit the HTML or the watcher script, then:

```bash
systemctl --user restart lofi-idle-watcher.service
```

## The edge-AI plumbing — MiNiFi C++ + Cloudera EFM + Kafka

This is where the Jetson stops being a toy. It runs a **MiNiFi C++ agent** (`nifi-minifi-cpp-1.26.02`, agent class `NvidiaNano`) that reports into a remote Cloudera **Edge Flow Manager** for centralized flow management, and produces data to Kafka. EFM and Kafka run on my Windows desktop across the LAN; the Jetson enrolls over the network and shows up in the EFM UI as a manageable agent.

Install layout on the device:

- Install dir: `/home/tunastreet/nifi-minifi-cpp-1.26.02`, binary `bin/minifi`
- Managed by systemd (`minifi.service`, enabled, starts on boot)
- Config in `conf/`: `minifi.properties` (C2/EFM settings), `minifi.properties.d/` drop-ins, and `config.yml` (the actual flow definition)

EFM (C2) connection:

- Server: `http://192.168.1.121:10090/efm/api` (heartbeat at `.../c2-protocol/heartbeat`)
- Agent class `NvidiaNano`, heartbeat period 5000ms
- Kafka bootstrap `192.168.1.121:31623`, producer client id `minifi-agent-nvidia`

Health check from the device:

```bash
systemctl status minifi --no-pager
tail -f /home/tunastreet/nifi-minifi-cpp-1.26.02/logs/minifi-app.log | grep -i "heartbeat\|kafka"

# port reachability, no nc needed
timeout 3 bash -c "cat < /dev/null > /dev/tcp/192.168.1.121/10090" && echo open || echo closed
timeout 3 bash -c "cat < /dev/null > /dev/tcp/192.168.1.121/31623" && echo open || echo closed
```

This build carries a few extra C++ extensions staged into it — `execute-process`, `lua-script`, `python-script`, `opc`, and `llamacpp` — which pushes it to **79 processors versus the stock 74**. The `python-script` and `llamacpp` extensions are the ones that make "AI at the edge" real: you can run Python inside the agent, or point it at a local model.

:warning: **A remote EFM/Kafka restart has a recognizable signature — don't chase it.** When I restart the stack on the Windows side, the Jetson's `minifi-app.log` fills with Kafka `Connection refused` on every broker, sometimes with a `"verify that security.protocol is correctly configured"` hint. That hint is noise from the broker bouncing, not an auth change. It settles on its own within ~15–20 minutes of the ports reopening. No Jetson-side action needed.
{: .notice--warning}

For the full install story — persisted EFM on Kubernetes, staging the Windows/Linux/Jetson binaries, the WSL2 mirrored-vs-NAT networking that lets the Jetson reach EFM across the LAN — see the companion posts linked at the end. Here I care about what the agent *does*.

## Python over HTTP — making the edge box do things on command

The most fun endpoint on this Jetson: `POST :8081/streamChatListener` with a body of `{"streamer":"<name>"}` opens Chromium to `https://www.twitch.tv/<name>` on the Jetson's *physical* display, fullscreen. It's a MiNiFi `ListenHTTP` processor feeding an `ExecuteScript` that runs `launch_stream.py`. Simple idea. It took four stacked bugs to get right, and each one is a lesson.

### Bug 1 — `ListenHTTP` dropped the request before Python ever saw it

The endpoint returned an HTTP response but Chromium never opened. The log had the answer:

```
[warning] ListenHTTP buffer is NOT full 1/5, 'POST' request for
'/streamChatListener' uri was dropped
```

I'd copy-configured the listener from another endpoint with `Batch Size: 5` / `Buffer Size: 5`. MiNiFi won't turn a request into a FlowFile until the buffer fills — so a single test POST just sat there and got dropped. The endpoint I copied from "worked" only because it gets hammered with back-to-back requests that fill the buffer. **Fix:** `Batch Size: 1` / `Buffer Size: 1`, pushed via EFM.

### Bug 2 — an `XAUTHORITY` placeholder that was never filled in

The script had a literal, angle-brackets-and-all placeholder:

```python
env["XAUTHORITY"] = "/home/<jetson-desktop-user>/.Xauthority"  # fill in real desktop user
```

That path never existed. The real values, pulled from the live GNOME session's own process environment:

```python
env["DISPLAY"] = ":0"
env["XAUTHORITY"] = "/run/user/1000/gdm/Xauthority"
```

### Bug 3 — the agent ran as root, the desktop is uid 1000

`ps` showed `minifi` running as `root` (no `User=` in the unit), while the GNOME/X11 session belongs to `tunastreet` (uid 1000). Root's environment has no `XDG_RUNTIME_DIR` or D-Bus session address, which snap-confined Chromium needs. **Fix:** add `User=tunastreet` to the systemd unit. That immediately caused a follow-on: the service crash-looped with `Failed opening file .../minifi-app.log for writing: Permission denied`, because the logs and RocksDB state dirs had been created `root:root` while the agent ran as root. `sudo chown -R tunastreet:tunastreet /home/tunastreet/nifi-minifi-cpp-1.26.02` and a restart brought it up clean.

### Bug 4 — Chromium opened but wouldn't go fullscreen

Same failure mode as the screensaver: Chromium's own fullscreen flags don't get Mutter to grant real X11 fullscreen. The window came up at `912×991` at `88,122` on a 1920×1080 screen. The fix has the same shape as the screensaver's — after launch, background a detached poller that waits (up to 240 × 0.25s) for a window title ending in `" - Twitch - Chromium"`, then `wmctrl -r "<title>" -b add,fullscreen`, then `xdotool` clicks the video center and sends `f` to trigger Twitch's own player fullscreen. Two things I learned live:

- The poll-and-fullscreen step **must** be a backgrounded/detached subprocess, not inline in `onTrigger`. MiNiFi's `ExecuteScript` runs on a single shared thread — a blocking wait of up to a minute would stall the whole flow (heartbeats, Kafka, the other listener).
- Forcing fullscreen via `wmctrl` bypasses Chromium's own fullscreen toggle, so **F11/Esc won't undo it**. If a test window gets stuck fullscreen, the escape hatch is `wmctrl -r "<title>" -b remove,fullscreen`, not the keyboard.

`xdotool` wasn't installed on this Jetson (only `wmctrl` was) — `sudo apt-get install -y xdotool` fixed that. Verified end to end: `curl -X POST :8081/streamChatListener -d '{"streamer":"xqc"}'` → HTTP 200 → a real fullscreen Chromium window on the Jetson's display, both window-manager and Twitch-player fullscreen applied, no manual steps.

:information_source: **`ListenHTTP` on MiNiFi C++ is fire-and-forget.** There's no `HandleHttpRequest`/`HandleHttpResponse` pair — that's Java-NiFi only. The caller gets its response the instant the request lands, *before* your script runs. Design for async: don't wait on the HTTP response for the result of the work. My "How to AI with MiNiFi" post goes deep on this and on the two different Python paths (`ExecuteScript` vs `ExecutePythonProcessor`) that trip everyone up.
{: .notice--info}

## The environment sensor — honest status: paused on an RMA

I wanted the Jetson to read its own environment — temp, humidity, pressure, light, UV, motion, air quality — so I added a Waveshare Environment Sensor module (I2C, with its own 1.3" OLED) on the same header. Most of it works. The board's OLED does not, and after a full diagnosis I'm treating it as a dead unit.

What responds on I2C bus 7:

| Chip | Function | Address | Working? |
|---|---|---|---|
| TSL25911FN | ambient light | `0x29` | Yes |
| BME280 | temp / humidity / pressure | `0x76` | Yes |
| ICM20948 | 9-DOF IMU | `0x68` | Yes |
| LTR390-UV | UV / IR | `0x53` | Yes |
| SGP40 | VOC gas | `0x59` | Needs a wake command (not a fault) |
| SH1106 | 1.3" OLED | `0x3C` | **No — hard NACK, every method** |

The OLED never ACKs at the I2C protocol level — a hard NACK, meaning zero bytes reach the chip's registers. I ruled out software three ways (the vendor's own driver with its full GPIO reset sequence, the modern `luma.oled` driver, and manual `i2cget`/`i2cdetect` probing) — all fail identically with `OSError: [Errno 121] Remote I/O error`. That's not a driver bug; nothing in software can produce an ACK from a chip that isn't listening. On this board the SGP40 (`0x59`) was also dead on an earlier unit, and the schematic shows the OLED sits on a separate sub-board joined by a 5-pin ribbon (5V/GND/SDA/SCL/RST) with its own local 3.3V regulator — a bad ribbon contact or dead sub-board matches the symptom exactly. Two independent components dead on a fresh board points at a DOA/defective unit, not config.

There were real, reusable software fixes along the way, kept for the replacement unit: the vendor demo is Python 2 written against Raspberry Pi assumptions, so every driver hardcodes `smbus.SMBus(1)` (patched to `SMBus(7)` for the Jetson's bus), and `SH1106.py` used Python-2-only `xrange` and float division (`self.height / 8` → `// 8`).

:warning: **Two OLEDs on one bus will collide.** The CubeNano OLED and the Waveshare OLED both default to `0x3C`. When a healthy Waveshare unit arrives and I stack both, one of them has to move to `0x3D` via its D/C# address jumper. Not a problem today only because the Waveshare OLED is dead — it'll be real the moment there are two live panels on `/dev/i2c-7`.
{: .notice--warning}

Status today: the Waveshare board is set aside, the Yahboom CubeNano board is restacked alone, `yahboom_oled.service` (or the CORDY strobe) is back on its OLED, and a replacement Waveshare unit is inbound. The four working sensors are ready to feed data whenever I wire them into a MiNiFi flow.

## What's next

The build isn't done. The direction it's going:

- **Environment data into the flow.** Wire BME280 / TSL2591 / LTR390 / ICM20948 readings into a MiNiFi Python processor and produce them to Kafka alongside everything else — the Jetson reporting its own room conditions to the same stack it manages flows from.
- **A buzzer and more I2C peripherals** on the header for physical alerts driven by flow conditions.
- **Robotics and messaging.** App-to-robot messaging over Telegram, a robot camera streamed to Twitch, live-streaming robots — the `streamChat` HTTP-to-display pattern already proves the shape: an HTTP endpoint that makes the physical device do something.
- **Metrics and analytics.** System + processor + model metrics from the edge agent into the Prometheus instance inside the CSO stack, the same way the enterprise integration post does it for the cluster.
- **Bigger local models.** The `llamacpp` extension is already staged in this agent. The natural next step up the ladder is a real local-AI workstation (an NVIDIA DGX Spark class box) for the heavy inference, with the Jetson as the always-on edge node in front of it.

## What NOT to do — the traps in one place

- **Don't persist a display process with a bare `&`.** It survives until the next reboot/logout, then vanishes with no error. Use `setsid`, then a systemd unit.
- **Don't assume a blank OLED is dead hardware** before checking whether the right *process* is running and whether the address ACKs (`i2cdetect -y -r 7`).
- **Don't copy a `ListenHTTP` config with `Buffer Size > 1`** onto an endpoint that gets single requests — MiNiFi drops the request until the buffer fills.
- **Don't run the agent as root against a user's desktop session.** Set `User=` to the desktop uid, and fix the log/state dir ownership afterward.
- **Don't block inside `ExecuteScript`** — its thread is shared with the whole flow. Background anything that waits.
- **Don't force fullscreen with `wmctrl` and expect Esc to undo it** — use `wmctrl ... -b remove,fullscreen`.
- **Don't stack two `0x3C` OLEDs** without moving one to `0x3D` first.

## Terminal History

The recipe above is the clean path. Here's the real trail off the device — the actual commands, in roughly the order I ran them, wrong turns and all. Every path, port, and bus number is live.

```terminal
# --- CubeNano OLED: is the panel even there? ---
i2cdetect -y -r 7                                 # 0x3c ack = SSD1306 present on bus 7
python3 ~/CubeNano/oled.py debug                  # init prints for the stats loop
python3 ~/CubeNano/oled.py clear                  # blank it

# --- the CORDY strobe, and why it kept vanishing on reboot ---
python3 oled_strobe.py &                          # <- the mistake: bare & dies with the shell on reboot
# after a glibc-upgrade reboot the stats screen came back, not the strobe. ruled out hardware first:
i2cdetect -y -r 7                                 # 0x3c still acks -> panel/bus fine, it was the process
pkill -f "python3 /home/tunastreet/CubeNano/oled.py"
cd ~/CubeNano
setsid nohup python3 -u oled_strobe.py > /tmp/oled_strobe.log 2>&1 < /dev/null &   # setsid = survives the shell
# real fix: give the strobe its own unit, retire the stats one (sudo scripted - no TTY for the password)
bash ~/CubeNano/install_cordy_oled_service.sh
systemctl is-active cordy_oled.service ; systemctl is-enabled cordy_oled.service

# --- Matrix screensaver (systemd USER service, not root) ---
systemctl --user status lofi-idle-watcher.service
systemctl --user restart lofi-idle-watcher.service    # after editing the html or IDLE_THRESHOLD_MS

# --- MiNiFi C++ agent health ---
systemctl status minifi --no-pager
tail -f /home/tunastreet/nifi-minifi-cpp-1.26.02/logs/minifi-app.log | grep -i "heartbeat\|kafka"
# EFM + Kafka live on the Windows desktop across the LAN - check the ports, no nc needed:
timeout 3 bash -c "cat < /dev/null > /dev/tcp/192.168.1.121/10090" && echo open || echo closed   # EFM
timeout 3 bash -c "cat < /dev/null > /dev/tcp/192.168.1.121/31623" && echo open || echo closed   # Kafka bootstrap
# note: a burst of Kafka "Connection refused" right after a remote restart is NOT an auth problem - it settles in ~15-20 min

# --- native Prometheus publisher on the edge (port 9936 on the Nano itself) ---
ss -tlnp | grep 9936
curl -s http://127.0.0.1:9936/metrics | wc -l     # 204 lines = publisher up
sudo systemctl restart minifi                     # only reliable apply path - needs the interactive sudo password

# --- streamChat: HTTP -> Chromium -> Twitch on the physical display ---
sudo apt-get install -y xdotool                   # only wmctrl was installed; the fullscreen fix needs both
curl -X POST http://localhost:8081/streamChatListener -d '{"streamer":"xqc"}'
ps -ef | grep chromium                            # confirm it launched as tunastreet, not root
wmctrl -l                                          # find the "<name> - Twitch - Chromium" window
wmctrl -r "xQc - Twitch - Chromium" -b add,fullscreen
wmctrl -r "xQc - Twitch - Chromium" -b remove,fullscreen   # <- ESCAPE HATCH: Esc/F11 won't undo a wmctrl fullscreen

# --- Waveshare env sensor: diagnosing the dead OLED ---
i2cdetect -y -r 7                                  # 0x29/0x53/0x68/0x76 answer; 0x3c NACKs every time
sudo shutdown -h now                               # pull the Yahboom board to test the Waveshare OLED alone
pip3 install --user --break-system-packages luma.oled   # 2nd independent driver - fails identically (Errno 121)
gpioinfo | grep -i PY.03                            # confirm BCM24/OLED_RST line is free, not held in reset
# conclusion: hard I2C NACK before any driver runs = DOA unit, not software. RMA it.
```

## Appendix

The reusable operational pieces, grouped by purpose. These are the "your exact command" forms — copy-paste ready.

#### 1. Install the CORDY strobe as a service, retire the stats display

```bash
sudo systemctl disable --now yahboom_oled.service
pkill -f oled_strobe.py
sudo cp /home/tunastreet/CubeNano/cordy_oled.service /etc/systemd/system/cordy_oled.service
sudo systemctl daemon-reload
sudo systemctl enable --now cordy_oled.service
```

Flip back to the stats display:

```bash
sudo systemctl disable --now cordy_oled.service
sudo systemctl enable --now yahboom_oled.service
```

#### 2. MiNiFi agent service control

```bash
# minifi.sh (preferred) — both the script and systemctl work
sudo /home/tunastreet/nifi-minifi-cpp-1.26.02/bin/minifi.sh start
sudo /home/tunastreet/nifi-minifi-cpp-1.26.02/bin/minifi.sh stop
sudo /home/tunastreet/nifi-minifi-cpp-1.26.02/bin/minifi.sh restart
sudo /home/tunastreet/nifi-minifi-cpp-1.26.02/bin/minifi.sh status

sudo systemctl restart minifi        # the only reliable apply-a-config-change path
systemctl status minifi --no-pager
```

#### 3. Full clean reinstall of the MiNiFi agent

```bash
# remove completely
sudo pkill -9 minifi
sudo systemctl stop minifi 2>/dev/null
sudo systemctl disable minifi 2>/dev/null
sudo rm -f /usr/local/lib/systemd/system/minifi.service
sudo systemctl daemon-reload
sudo rm -rf /home/tunastreet/nifi-minifi-cpp-1.26.02
rm -rf ~/.cache/minifi ~/.config/minifi ~/.local/share/minifi
sudo rm -rf /var/lib/minifi 2>/dev/null

# reinstall (after re-extracting the tarball to the same path)
sudo /home/tunastreet/nifi-minifi-cpp-1.26.02/bin/minifi.sh install

# run as the desktop user (uid 1000), not root — add `User=tunastreet` to the unit, then fix ownership
sudo chown -R tunastreet:tunastreet /home/tunastreet/nifi-minifi-cpp-1.26.02
sudo systemctl daemon-reload
sudo systemctl restart minifi
```

#### 4. Native Prometheus publisher on the edge agent

`conf/minifi.properties.d/95-metrics.properties` (drop-in — don't edit `minifi.properties` directly):

```properties
nifi.metrics.publisher.agent.identifier=4ca82a0d-8e04-4ede-b59d-379de1495f2b
nifi.metrics.publisher.class=PrometheusMetricsPublisher
nifi.metrics.publisher.PrometheusMetricsPublisher.port=9936
nifi.metrics.publisher.metrics=QueueMetrics,RepositoryMetrics,DeviceInfoNode,FlowInformation
```

```bash
sudo systemctl restart minifi
ss -tlnp | grep 9936
curl -s http://127.0.0.1:9936/metrics | wc -l
```

#### 5. Trigger streamChat manually, and the fullscreen escape hatch

```bash
curl -X POST http://localhost:8081/streamChatListener -d '{"streamer":"xqc"}'
wmctrl -l                                                     # find the window title
wmctrl -r "xQc - Twitch - Chromium" -b add,fullscreen         # force it fullscreen
wmctrl -r "xQc - Twitch - Chromium" -b remove,fullscreen      # undo — Esc/F11 will NOT
```

#### 6. Env-sensor bring-up check (for the replacement unit)

```bash
i2cdetect -y -r 7        # does 0x3c show up at all? that alone tells you in 5s if the OLED is healthy
```

## NVIDIA Jetson developer resources

- [NVIDIA Jetson Orin family](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/) — the Orin Nano Super Developer Kit specs live here
- [JetPack SDK](https://developer.nvidia.com/embedded/jetpack) (Linux for Tegra / L4T)
- [NVIDIA Jetson developer forums](https://forums.developer.nvidia.com/c/agx-autonomous-machines/jetson-embedded-systems/) and [Jetson developer resources](https://developer.nvidia.com/embedded/develop/software)
- Waveshare Environment Sensor for Jetson Nano — [wiki](https://www.waveshare.com/wiki/Environment_Sensor_for_Jetson_Nano) / [schematic PDF](https://files.waveshare.com/upload/2/27/Environment-Sensor-for-Jetson-Nano-Schematic.pdf)

### Companion Posts

- **[How to AI with NiFi and Python](/blog/How-to-AI-with-NiFi-and-Python/)** — Custom Python Processor success with AI with examples
- **[Edge to AI For Dummies](/blog/Edge-to-AI-for-Dummies/)** — Go grab a copy of this and give it a read
- **[Cloudera Edge Flow Manager on Kubernetes](/blog/Cloudera-Edge-Flow-Manager-on-Kubernetes/)** — the deep enterprise integration: persisted EFM on Kubernetes next to the full CSO stack, model execution inside MiNiFi, metrics into Prometheus.

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.

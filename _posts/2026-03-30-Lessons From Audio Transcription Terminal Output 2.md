---
title:  "Lessons Learned Audio Transcription Terminal Output 2"
date: 2026-03-30
last_modified_at: 2026-03-30
excerpt: "Terminal 2 Output to go along with Audio Transcription RAG post."
header:
  teaser: "/assets/images/2026-03-30-StreamToWhisper-lessons.png"
categories: 
  - blog
tags:
  - cloudera  
  - operator  
  - nifi  
  - kafka  
  - whisper  
  - vllm  
  - rag  
  - gpu

---

This post is comprised of the backing lessons from [Insanely Fast Audio Transcription with Cloudera Streaming Operators](/blog/Audio-Transcription-with-Cloudera-Streaming-Operators/) with a [summary of the hurdles](/blog/Lessons-From-Audio-Transcription-with-Cloudera-Streaming-Operators/), a [log of the terminal history](/blog/Lessons-From-Audio-Transcription-Terminal-History/), [terminal output 1](/blog/Lessons-From-Audio-Transcription-Terminal-Output-1/) [terminal output 2](/blog/Lessons-From-Audio-Transcription-Terminal-Output-2/), and [terminal output 3](/blog/Lessons-From-Audio-Transcription-Terminal-Output-3/).  


## Terminal 2 Output

Testing Insanely Fast Whisper

```terminal
steven@CSO:~$ nano whisper-server.yaml
steven@CSO:~$ kubectl apply -f whisper-server.yaml
deployment.apps/whisper-server created
service/whisper-service created
steven@CSO:~$ kubectl describe pod whisper-server-779f955f5c-j2vr7
Name:             whisper-server-779f955f5c-j2vr7
Namespace:        default
Priority:         0
Service Account:  default
Node:             <none>
Labels:           app=whisper-server
                  pod-template-hash=779f955f5c
Annotations:      <none>
Status:           Pending
IP:
IPs:              <none>
Controlled By:    ReplicaSet/whisper-server-779f955f5c
Containers:
  whisper-server:
    Image:      streamwhisper:latest
    Port:       8001/TCP
    Host Port:  0/TCP
    Limits:
      memory:          20Gi
      nvidia.com/gpu:  1
    Requests:
      memory:          20Gi
      nvidia.com/gpu:  1
    Environment:       <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-w5447 (ro)
Conditions:
  Type           Status
  PodScheduled   False
Volumes:
  kube-api-access-w5447:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    Optional:                false
    DownwardAPI:             true
QoS Class:                   Burstable
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason            Age                 From               Message
  ----     ------            ----                ----               -------
  Warning  FailedScheduling  102s (x3 over 12m)  default-scheduler  0/1 nodes are available: 1 Insufficient nvidia.com/gpu. no new claims to deallocate, preemption: 0/1 nodes are available: 1 No preemption victims found for incoming pod.
steven@CSO:~$ nano whisper-server.yaml
steven@CSO:~$ kubectl delete -f whisper-server.yaml
deployment.apps "whisper-server" deleted from default namespace
service "whisper-service" deleted from default namespace
steven@CSO:~$ kubectl apply -f whisper-server.yaml
deployment.apps/whisper-server created
service/whisper-service created
steven@CSO:~$ kubectl describe pod whisper-server-6486568f56-rsv4v
Name:             whisper-server-6486568f56-rsv4v
Namespace:        default
Priority:         0
Service Account:  default
Node:             <none>
Labels:           app=whisper-server
                  pod-template-hash=6486568f56
Annotations:      <none>
Status:           Pending
IP:
IPs:              <none>
Controlled By:    ReplicaSet/whisper-server-6486568f56
Containers:
  whisper-server:
    Image:      streamwhisper:latest
    Port:       8001/TCP
    Host Port:  0/TCP
    Limits:
      memory:          8Gi
      nvidia.com/gpu:  1
    Requests:
      memory:          8Gi
      nvidia.com/gpu:  1
    Environment:       <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-8l2r4 (ro)
Conditions:
  Type           Status
  PodScheduled   False
Volumes:
  kube-api-access-8l2r4:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    Optional:                false
    DownwardAPI:             true
QoS Class:                   Burstable
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  18s   default-scheduler  0/1 nodes are available: 1 Insufficient nvidia.com/gpu. no new claims to deallocate, preemption: 0/1 nodes are available: 1 No preemption victims found for incoming pod.
steven@CSO:~$ kubectl get nodes -o custom-columns=NAME:.metadata.name,GPU:.status.allocatable."nvidia\.com\/gpu"
NAME       GPU
minikube   1
steven@CSO:~$ kubectl delete -f vllm-qwen.yaml
deployment.apps "vllm-server" deleted from default namespace
service "vllm-service" deleted from default namespace
steven@CSO:~$ kubectl delete -f whisper-server.yaml
deployment.apps "whisper-server" deleted from default namespace
service "whisper-service" deleted from default namespace
steven@CSO:~$ kubectl apply -f whisper-server.yaml
deployment.apps/whisper-server created
service/whisper-service created

steven@CSO:~$ kubectl describe pod whisper-server-6486568f56-xrcg2
Name:             whisper-server-6486568f56-xrcg2
Namespace:        default
Priority:         0
Service Account:  default
Node:             minikube/192.168.49.2
Start Time:       Fri, 27 Mar 2026 17:39:19 -0400
Labels:           app=whisper-server
                  pod-template-hash=6486568f56
Annotations:      <none>
Status:           Running
IP:               10.244.0.58
IPs:
  IP:           10.244.0.58
Controlled By:  ReplicaSet/whisper-server-6486568f56
Containers:
  whisper-server:
    Container ID:   docker://4a27011f083c1c206893cea30dacb826cc92fab426e949b30ff9d626c9316a7d
    Image:          streamwhisper:latest
    Image ID:       docker://sha256:0aef498fd237777f54b6bf049c9250ceadcf682889e6041c75f3261f877e935f
    Port:           8001/TCP
    Host Port:      0/TCP
    State:          Terminated
      Reason:       Error
      Exit Code:    1
      Started:      Fri, 27 Mar 2026 17:39:42 -0400
      Finished:     Fri, 27 Mar 2026 17:39:45 -0400
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
      Started:      Fri, 27 Mar 2026 17:39:25 -0400
      Finished:     Fri, 27 Mar 2026 17:39:28 -0400
    Ready:          False
    Restart Count:  2
    Limits:
      memory:          8Gi
      nvidia.com/gpu:  1
    Requests:
      memory:          8Gi
      nvidia.com/gpu:  1
    Environment:       <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-gddtm (ro)
Conditions:
  Type                        Status
  PodReadyToStartContainers   True
  Initialized                 True
  Ready                       False
  ContainersReady             False
  PodScheduled                True
Volumes:
  kube-api-access-gddtm:
    Type:                    Projected (a volume that contains injected data from multiple sources)
    TokenExpirationSeconds:  3607
    ConfigMapName:           kube-root-ca.crt
    Optional:                false
    DownwardAPI:             true
QoS Class:                   Burstable
Node-Selectors:              <none>
Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                             node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
Events:
  Type     Reason            Age                From               Message
  ----     ------            ----               ----               -------
  Warning  FailedScheduling  40s                default-scheduler  0/1 nodes are available: 1 Insufficient nvidia.com/gpu. no new claims to deallocate, preemption: 0/1 nodes are available: 1 No preemption victims found for incoming pod.
  Normal   Scheduled         39s                default-scheduler  Successfully assigned default/whisper-server-6486568f56-xrcg2 to minikube
  Normal   Pulled            16s (x3 over 39s)  kubelet            Container image "streamwhisper:latest" already present on machine and can be accessed by the pod
  Normal   Created           16s (x3 over 39s)  kubelet            Container created
  Normal   Started           16s (x3 over 38s)  kubelet            Container started
  Warning  BackOff           13s (x2 over 30s)  kubelet            Back-off restarting failed container whisper-server in pod whisper-server-6486568f56-xrcg2_default(02ecffea-ebca-4f84-a8f2-8145b2a3921a)
steven@CSO:~$ # Force a restart of the pod to ensure a clean slate on the GPU
kubectl rollout restart deployment whisper-server
deployment.apps/whisper-server restarted


steven@CSO:~$ steven@CSO:~$ kubectl describe pod whisper-server-6486568f56-xrcg2
Name:             whisper-server-6486568f56-xrcg2
Namespace:        default
Priority:         0
Service Account:  default
Node:             minikube/192.168.49.2
Start Time:       Fri, 27 Mar 2026 17:39:19 -0400
Labels:           app=whisper-server
                  pod-template-hash=6486568f56
Annotations:      <none>
Status:           Running
IP:               10.244.0.58
IPs:
  IP:           10.244.0.58
Controlled By:  ReplicaSet/whisper-server-6486568f56
Containers:
  whisper-server:
    Container ID:   docker://b6f5a7dc6abf916f503c68b3f8bfe72c4a0d5aa1921c5e86e1bc1296732280a4
    Image:          streamwhisper:latest
    Image ID:       docker://sha256:0aef498fd237777f54b6bf049c9250ceadcf682889e6041c75f3261f877e935f
    Port:           8001/TCP
    Host Port:      0/TCP
    State:          Terminated
      Reason:       Error
      Exit Code:    1
      Started:      Fri, 27 Mar 2026 17:42:25 -0400
      Finished:     Fri, 27 Mar 2026 17:42:28 -0400
921a)^Chisper-server in pod whisper-server-6486568f56-xrcg2_default(02ecffea-ebca-4f84-a8f2-8145b2a3
steven@CSO:~$ kubectl logs whisper-server-6486568f56-xrcg2

==========
== CUDA ==
==========

CUDA Version 12.4.1

Container image Copyright (c) 2016-2023, NVIDIA CORPORATION & AFFILIATES. All rights reserved.

This container image and its contents are governed by the NVIDIA Deep Learning Container License.
By pulling and using the container, you accept the terms and conditions of this license:
https://developer.nvidia.com/ngc/nvidia-deep-learning-container-license

A copy of this license is made available in this container at /NGC-DL-CONTAINER-LICENSE for your convenience.

Traceback (most recent call last):
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2169, in __getattr__
    module = self._get_module(self._class_to_module[name])
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2403, in _get_module
    raise e
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2401, in _get_module
    return importlib.import_module("." + module_name, self.__name__)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.11/importlib/__init__.py", line 126, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1206, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1178, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1149, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 690, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 940, in exec_module
  File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
  File "/opt/venv/lib/python3.11/site-packages/transformers/pipelines/__init__.py", line 27, in <module>
    from ..image_processing_utils import BaseImageProcessor
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_utils.py", line 24, in <module>
    from .image_processing_base import BatchFeature, ImageProcessingMixin
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_base.py", line 25, in <module>
    from .image_utils import is_valid_image, load_image
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_utils.py", line 53, in <module>
    from torchvision.transforms import InterpolationMode
  File "/opt/venv/lib/python3.11/site-packages/torchvision/__init__.py", line 10, in <module>
    from torchvision import _meta_registrations, datasets, io, models, ops, transforms, utils  # usort:skip
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torchvision/_meta_registrations.py", line 163, in <module>
    @torch.library.register_fake("torchvision::nms")
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 1087, in register
    use_lib._register_fake(
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 204, in _register_fake
    handle = entry.fake_impl.register(
             ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/_library/fake_impl.py", line 50, in register
    if torch._C._dispatch_has_kernel_for_dispatch_key(self.qualname, "Meta"):
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
RuntimeError: operator torchvision::nms does not exist

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/app/main.py", line 4, in <module>
    from transformers import pipeline
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2257, in __getattr__
    raise ModuleNotFoundError(
ModuleNotFoundError: Could not import module 'pipeline'. Are this object's requirements defined correctly?
steven@CSO:~$ kubectl delete -f whisper-server.yaml
deployment.apps "whisper-server" deleted from default namespace
service "whisper-service" deleted from default namespace
steven@CSO:~$ kubectl apply -f whisper-server.yaml
deployment.apps/whisper-server created
service/whisper-service created
steven@CSO:~$ kubectl logs whisper-server-6486568f56-gzvqs

==========
== CUDA ==
==========

CUDA Version 12.4.1

Container image Copyright (c) 2016-2023, NVIDIA CORPORATION & AFFILIATES. All rights reserved.

This container image and its contents are governed by the NVIDIA Deep Learning Container License.
By pulling and using the container, you accept the terms and conditions of this license:
https://developer.nvidia.com/ngc/nvidia-deep-learning-container-license

A copy of this license is made available in this container at /NGC-DL-CONTAINER-LICENSE for your convenience.

Traceback (most recent call last):
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2169, in __getattr__
    module = self._get_module(self._class_to_module[name])
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2403, in _get_module
    raise e
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2401, in _get_module
    return importlib.import_module("." + module_name, self.__name__)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.11/importlib/__init__.py", line 126, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1206, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1178, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1149, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 690, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 940, in exec_module
  File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
  File "/opt/venv/lib/python3.11/site-packages/transformers/pipelines/__init__.py", line 27, in <module>
    from ..image_processing_utils import BaseImageProcessor
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_utils.py", line 24, in <module>
    from .image_processing_base import BatchFeature, ImageProcessingMixin
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_base.py", line 25, in <module>
    from .image_utils import is_valid_image, load_image
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_utils.py", line 53, in <module>
    from torchvision.transforms import InterpolationMode
  File "/opt/venv/lib/python3.11/site-packages/torchvision/__init__.py", line 10, in <module>
    from torchvision import _meta_registrations, datasets, io, models, ops, transforms, utils  # usort:skip
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torchvision/_meta_registrations.py", line 163, in <module>
    @torch.library.register_fake("torchvision::nms")
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 1087, in register
    use_lib._register_fake(
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 204, in _register_fake
    handle = entry.fake_impl.register(
             ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/_library/fake_impl.py", line 50, in register
    if torch._C._dispatch_has_kernel_for_dispatch_key(self.qualname, "Meta"):
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
RuntimeError: operator torchvision::nms does not exist

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/app/main.py", line 4, in <module>
    from transformers import pipeline
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2257, in __getattr__
    raise ModuleNotFoundError(
ModuleNotFoundError: Could not import module 'pipeline'. Are this object's requirements defined correctly?
steven@CSO:~$ kubectl logs whisper-server-6486568f56-gzvqs

==========
== CUDA ==
==========

CUDA Version 12.4.1

Container image Copyright (c) 2016-2023, NVIDIA CORPORATION & AFFILIATES. All rights reserved.

This container image and its contents are governed by the NVIDIA Deep Learning Container License.
By pulling and using the container, you accept the terms and conditions of this license:
https://developer.nvidia.com/ngc/nvidia-deep-learning-container-license

A copy of this license is made available in this container at /NGC-DL-CONTAINER-LICENSE for your convenience.

Traceback (most recent call last):
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2169, in __getattr__
    module = self._get_module(self._class_to_module[name])
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2403, in _get_module
    raise e
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2401, in _get_module
    return importlib.import_module("." + module_name, self.__name__)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.11/importlib/__init__.py", line 126, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1206, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1178, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1149, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 690, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 940, in exec_module
  File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
  File "/opt/venv/lib/python3.11/site-packages/transformers/pipelines/__init__.py", line 27, in <module>
    from ..image_processing_utils import BaseImageProcessor
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_utils.py", line 24, in <module>
    from .image_processing_base import BatchFeature, ImageProcessingMixin
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_base.py", line 25, in <module>
    from .image_utils import is_valid_image, load_image
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_utils.py", line 53, in <module>
    from torchvision.transforms import InterpolationMode
  File "/opt/venv/lib/python3.11/site-packages/torchvision/__init__.py", line 10, in <module>
    from torchvision import _meta_registrations, datasets, io, models, ops, transforms, utils  # usort:skip
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torchvision/_meta_registrations.py", line 163, in <module>
    @torch.library.register_fake("torchvision::nms")
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 1087, in register
    use_lib._register_fake(
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 204, in _register_fake
    handle = entry.fake_impl.register(
             ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/_library/fake_impl.py", line 50, in register
    if torch._C._dispatch_has_kernel_for_dispatch_key(self.qualname, "Meta"):
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
RuntimeError: operator torchvision::nms does not exist

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/app/main.py", line 4, in <module>
    from transformers import pipeline
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2257, in __getattr__
    raise ModuleNotFoundError(
ModuleNotFoundError: Could not import module 'pipeline'. Are this object's requirements defined correctly?
steven@CSO:~$ kubectl logs whisper-server-6486568f56-gzvqs

==========
== CUDA ==
==========

CUDA Version 12.4.1

Container image Copyright (c) 2016-2023, NVIDIA CORPORATION & AFFILIATES. All rights reserved.

This container image and its contents are governed by the NVIDIA Deep Learning Container License.
By pulling and using the container, you accept the terms and conditions of this license:
https://developer.nvidia.com/ngc/nvidia-deep-learning-container-license

A copy of this license is made available in this container at /NGC-DL-CONTAINER-LICENSE for your convenience.

Traceback (most recent call last):
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2169, in __getattr__
    module = self._get_module(self._class_to_module[name])
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2403, in _get_module
    raise e
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2401, in _get_module
    return importlib.import_module("." + module_name, self.__name__)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.11/importlib/__init__.py", line 126, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1206, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1178, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1149, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 690, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 940, in exec_module
  File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
  File "/opt/venv/lib/python3.11/site-packages/transformers/pipelines/__init__.py", line 27, in <module>
    from ..image_processing_utils import BaseImageProcessor
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_utils.py", line 24, in <module>
    from .image_processing_base import BatchFeature, ImageProcessingMixin
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_base.py", line 25, in <module>
    from .image_utils import is_valid_image, load_image
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_utils.py", line 53, in <module>
    from torchvision.transforms import InterpolationMode
  File "/opt/venv/lib/python3.11/site-packages/torchvision/__init__.py", line 10, in <module>
    from torchvision import _meta_registrations, datasets, io, models, ops, transforms, utils  # usort:skip
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torchvision/_meta_registrations.py", line 163, in <module>
    @torch.library.register_fake("torchvision::nms")
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 1087, in register
    use_lib._register_fake(
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 204, in _register_fake
    handle = entry.fake_impl.register(
             ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/_library/fake_impl.py", line 50, in register
    if torch._C._dispatch_has_kernel_for_dispatch_key(self.qualname, "Meta"):
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
RuntimeError: operator torchvision::nms does not exist

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/app/main.py", line 4, in <module>
    from transformers import pipeline
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2257, in __getattr__
    raise ModuleNotFoundError(
ModuleNotFoundError: Could not import module 'pipeline'. Are this object's requirements defined correctly?

steven@CSO:~$ kubectl logs whisper-server-6486568f56-gzvqs

==========
== CUDA ==
==========

CUDA Version 12.4.1

Container image Copyright (c) 2016-2023, NVIDIA CORPORATION & AFFILIATES. All rights reserved.

This container image and its contents are governed by the NVIDIA Deep Learning Container License.
By pulling and using the container, you accept the terms and conditions of this license:
https://developer.nvidia.com/ngc/nvidia-deep-learning-container-license

A copy of this license is made available in this container at /NGC-DL-CONTAINER-LICENSE for your convenience.

Traceback (most recent call last):
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2169, in __getattr__
    module = self._get_module(self._class_to_module[name])
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2403, in _get_module
    raise e
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2401, in _get_module
    return importlib.import_module("." + module_name, self.__name__)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.11/importlib/__init__.py", line 126, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1206, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1178, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1149, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 690, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 940, in exec_module
  File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
  File "/opt/venv/lib/python3.11/site-packages/transformers/pipelines/__init__.py", line 27, in <module>
    from ..image_processing_utils import BaseImageProcessor
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_utils.py", line 24, in <module>
    from .image_processing_base import BatchFeature, ImageProcessingMixin
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_base.py", line 25, in <module>
    from .image_utils import is_valid_image, load_image
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_utils.py", line 53, in <module>
    from torchvision.transforms import InterpolationMode
  File "/opt/venv/lib/python3.11/site-packages/torchvision/__init__.py", line 10, in <module>
    from torchvision import _meta_registrations, datasets, io, models, ops, transforms, utils  # usort:skip
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torchvision/_meta_registrations.py", line 163, in <module>
    @torch.library.register_fake("torchvision::nms")
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 1087, in register
    use_lib._register_fake(
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 204, in _register_fake
    handle = entry.fake_impl.register(
             ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/_library/fake_impl.py", line 50, in register
    if torch._C._dispatch_has_kernel_for_dispatch_key(self.qualname, "Meta"):
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
RuntimeError: operator torchvision::nms does not exist

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/app/main.py", line 4, in <module>
    from transformers import pipeline
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2257, in __getattr__
    raise ModuleNotFoundError(
ModuleNotFoundError: Could not import module 'pipeline'. Are this object's requirements defined correctly?
steven@CSO:~$ kubectl logs whisper-server-6486568f56-gzvqs

==========
== CUDA ==
==========

CUDA Version 12.4.1

Container image Copyright (c) 2016-2023, NVIDIA CORPORATION & AFFILIATES. All rights reserved.

This container image and its contents are governed by the NVIDIA Deep Learning Container License.
By pulling and using the container, you accept the terms and conditions of this license:
https://developer.nvidia.com/ngc/nvidia-deep-learning-container-license

A copy of this license is made available in this container at /NGC-DL-CONTAINER-LICENSE for your convenience.

Traceback (most recent call last):
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2169, in __getattr__
    module = self._get_module(self._class_to_module[name])
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2403, in _get_module
    raise e
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2401, in _get_module
    return importlib.import_module("." + module_name, self.__name__)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/lib/python3.11/importlib/__init__.py", line 126, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<frozen importlib._bootstrap>", line 1206, in _gcd_import
  File "<frozen importlib._bootstrap>", line 1178, in _find_and_load
  File "<frozen importlib._bootstrap>", line 1149, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 690, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 940, in exec_module
  File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
  File "/opt/venv/lib/python3.11/site-packages/transformers/pipelines/__init__.py", line 27, in <module>
    from ..image_processing_utils import BaseImageProcessor
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_utils.py", line 24, in <module>
    from .image_processing_base import BatchFeature, ImageProcessingMixin
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_processing_base.py", line 25, in <module>
    from .image_utils import is_valid_image, load_image
  File "/opt/venv/lib/python3.11/site-packages/transformers/image_utils.py", line 53, in <module>
    from torchvision.transforms import InterpolationMode
  File "/opt/venv/lib/python3.11/site-packages/torchvision/__init__.py", line 10, in <module>
    from torchvision import _meta_registrations, datasets, io, models, ops, transforms, utils  # usort:skip
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torchvision/_meta_registrations.py", line 163, in <module>
    @torch.library.register_fake("torchvision::nms")
     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 1087, in register
    use_lib._register_fake(
  File "/opt/venv/lib/python3.11/site-packages/torch/library.py", line 204, in _register_fake
    handle = entry.fake_impl.register(
             ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/opt/venv/lib/python3.11/site-packages/torch/_library/fake_impl.py", line 50, in register
    if torch._C._dispatch_has_kernel_for_dispatch_key(self.qualname, "Meta"):
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
RuntimeError: operator torchvision::nms does not exist

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/app/main.py", line 4, in <module>
    from transformers import pipeline
  File "/opt/venv/lib/python3.11/site-packages/transformers/utils/import_utils.py", line 2257, in __getattr__
    raise ModuleNotFoundError(
ModuleNotFoundError: Could not import module 'pipeline'. Are this object's requirements defined correctly?
steven@CSO:~$ kubectl delete -f whisper-server.yaml
deployment.apps "whisper-server" deleted from default namespace
service "whisper-service" deleted from default namespace
steven@CSO:~$ kubectl apply -f whisper-server.yaml
deployment.apps/whisper-server created
service/whisper-service created
steven@CSO:~$ kubectl delete -f whisper-server.yaml
deployment.apps "whisper-server" deleted from default namespace
service "whisper-service" deleted from default namespace
steven@CSO:~$ kubectl apply -f whisper-server.yaml
deployment.apps/whisper-server created
service/whisper-service created
steven@CSO:~$ kubectl delete -f whisper-server.yaml
deployment.apps "whisper-server" deleted from default namespace
service "whisper-service" deleted from default namespace
steven@CSO:~$ kubectl apply -f whisper-server.yaml
deployment.apps/whisper-server created
service/whisper-service created
steven@CSO:~$ kubectl logs whisper-server-6486568f56-bbz6z
Traceback (most recent call last):
  File "/app/main.py", line 1, in <module>
    from fastapi import FastAPI, File, UploadFile
  File "/opt/venv/lib/python3.11/site-packages/fastapi/__init__.py", line 5, in <module>
    from starlette import status as status
ModuleNotFoundError: No module named 'starlette'
```
---
title:  "Lessons Learned Audio Transcription Terminal Output 3"
date: 2026-03-30
last_modified_at: 2026-03-30
excerpt: "Terminal 3 Output to go along with Audio Transcription RAG post."
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


## Terminal 3  Output

With each service working,  I was attempting to get both services (whisper-server and vllm-server) attached to the GPU and running at the same time.   I was not successful during this sitting but will try again.  To complete testing in this session I just ran them separately.

```terminal
tunas@MINI-Gaming-G1:~$ kubectl delete -f vllm-qwen.yaml
deployment.apps "vllm-server" deleted from default namespace
service "vllm-service" deleted from default namespace
tunas@MINI-Gaming-G1:~$ kubectl get svc -A
NAMESPACE       NAME                                              TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                                        AGE
cert-manager    cert-manager                                      ClusterIP      10.96.68.185     <none>        9402/TCP                                       9d
cert-manager    cert-manager-webhook                              ClusterIP      10.96.255.243    <none>        443/TCP                                        9d
cfm-streaming   cfm-operator-controller-manager-metrics-service   ClusterIP      10.97.244.27     <none>        8443/TCP                                       9d
cfm-streaming   cfm-operator-webhook-service                      ClusterIP      10.105.176.237   <none>        443/TCP                                        9d
cfm-streaming   mynifi                                            ClusterIP      None             <none>        6007/TCP,5000/TCP                              9d
cfm-streaming   mynifi-web                                        LoadBalancer   10.104.227.241   127.0.0.1     443:31666/TCP,8443:31190/TCP                   9d
cld-streaming   cloudera-surveyor-service                         NodePort       10.104.39.241    <none>        8080:31659/TCP                                 9d
cld-streaming   my-cluster-kafka-bootstrap                        ClusterIP      10.105.253.110   <none>        9091/TCP,9092/TCP,9093/TCP                     9d
cld-streaming   my-cluster-kafka-brokers                          ClusterIP      None             <none>        9090/TCP,9091/TCP,8443/TCP,9092/TCP,9093/TCP   9d
cld-streaming   schema-registry-service                           NodePort       10.99.115.169    <none>        9090:30714/TCP                                 9d
default         embedding-server-service                          ClusterIP      10.102.75.210    <none>        80/TCP                                         3d7h
default         kubernetes                                        ClusterIP      10.96.0.1        <none>        443/TCP                                        10d
default         qdrant                                            ClusterIP      10.99.157.61     <none>        6333/TCP,6334/TCP                              3d8h
default         whisper-service                                   ClusterIP      10.107.2.89      <none>        8001/TCP                                       84s
ingress-nginx   ingress-nginx-controller                          NodePort       10.108.197.181   <none>        80:30662/TCP,443:30470/TCP                     9d
ingress-nginx   ingress-nginx-controller-admission                ClusterIP      10.100.118.146   <none>        443/TCP                                        9d
kube-system     kube-dns                                          ClusterIP      10.96.0.10       <none>        53/UDP,53/TCP,9153/TCP                         10d
kube-system     metrics-server                                    ClusterIP      10.110.229.243   <none>        443/TCP                                        8d
tunas@MINI-Gaming-G1:~$ kubectl apply -f vllm-qwen.yaml
deployment.apps/vllm-server created
service/vllm-service created
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 3000
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 3000
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:533] Resolved architecture: Qwen2ForCausalLM
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:1582] Using max model len 4096
(APIServer pid=1) INFO 03-28 00:34:07 [scheduler.py:231] Chunked prefill is enabled with max_num_batched_tokens=2048.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:754] Asynchronous scheduling is enabled.
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:964] Cudagraph is disabled under eager mode
(APIServer pid=1) INFO 03-28 00:34:07 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) WARNING 03-28 00:34:09 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [core.py:103] Initializing a V1 LLM engine (v0.18.0) with config: model='Qwen/Qwen2.5-3B-Instruct', speculative_config=None, tokenizer='Qwen/Qwen2.5-3B-Instruct', skip_tokenizer_init=False, tokenizer_mode=auto, revision=None, tokenizer_revision=None, trust_remote_code=False, dtype=torch.bfloat16, max_seq_len=4096, download_dir=None, load_format=bitsandbytes, tensor_parallel_size=1, pipeline_parallel_size=1, data_parallel_size=1, decode_context_parallel_size=1, dcp_comm_backend=ag_rs, disable_custom_all_reduce=False, quantization=bitsandbytes, enforce_eager=True, enable_return_routed_experts=False, kv_cache_dtype=auto, device_config=cuda, structured_outputs_config=StructuredOutputsConfig(backend='auto', disable_any_whitespace=False, disable_additional_properties=False, reasoning_parser='', reasoning_parser_plugin='', enable_in_reasoning=False), observability_config=ObservabilityConfig(show_hidden_metrics_for_version=None, otlp_traces_endpoint=None, collect_detailed_traces=None, kv_cache_metrics=False, kv_cache_metrics_sample=0.01, cudagraph_metrics=False, enable_layerwise_nvtx_tracing=False, enable_mfu_metrics=False, enable_mm_processor_stats=False, enable_logging_iteration_details=False), seed=0, served_model_name=Qwen/Qwen2.5-3B-Instruct, enable_prefix_caching=True, enable_chunked_prefill=True, pooler_config=None, compilation_config={'mode': <CompilationMode.NONE: 0>, 'debug_dump_path': None, 'cache_dir': '', 'compile_cache_save_format': 'binary', 'backend': 'inductor', 'custom_ops': ['all'], 'splitting_ops': [], 'compile_mm_encoder': False, 'compile_sizes': [], 'compile_ranges_endpoints': [2048], 'inductor_compile_config': {'enable_auto_functionalized_v2': False, 'combo_kernels': True, 'benchmark_combo_kernel': True}, 'inductor_passes': {}, 'cudagraph_mode': <CUDAGraphMode.NONE: 0>, 'cudagraph_num_of_warmups': 0, 'cudagraph_capture_sizes': [], 'cudagraph_copy_inputs': False, 'cudagraph_specialize_lora': True, 'use_inductor_graph_partition': False, 'pass_config': {'fuse_norm_quant': True, 'fuse_act_quant': True, 'fuse_attn_quant': False, 'enable_sp': False, 'fuse_gemm_comms': False, 'fuse_allreduce_rms': False}, 'max_cudagraph_capture_size': 0, 'dynamic_shapes_config': {'type': <DynamicShapesType.BACKED: 'backed'>, 'evaluate_guards': False, 'assume_32_bit_indexing': False}, 'local_cache_dir': None, 'fast_moe_cold_start': True, 'static_all_moe_layers': []}
(EngineCore pid=101) WARNING 03-28 00:34:14 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1395] world_size=1 rank=0 local_rank=0 distributed_init_method=tcp://10.244.0.70:46601 backend=nccl
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1717] rank 0 in world size 1 is assigned as DP rank 0, PP rank 0, PCP rank 0, TP rank 0, EP rank N/A, EPLB rank N/A
(EngineCore pid=101) INFO 03-28 00:34:14 [gpu_model_runner.py:4481] Starting to load model Qwen/Qwen2.5-3B-Instruct...
(EngineCore pid=101) INFO 03-28 00:34:16 [cuda.py:317] Using FLASH_ATTN attention backend out of potential backends: ['FLASH_ATTN', 'FLASHINFER', 'TRITON_ATTN', 'FLEX_ATTENTION'].
(EngineCore pid=101) INFO 03-28 00:34:16 [flash_attn.py:598] Using FlashAttention version 2
(EngineCore pid=101) INFO 03-28 00:34:16 [bitsandbytes_loader.py:786] Loading weights with BitsAndBytes quantization. May take a while ...
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:533] Resolved architecture: Qwen2ForCausalLM
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:1582] Using max model len 4096
(APIServer pid=1) INFO 03-28 00:34:07 [scheduler.py:231] Chunked prefill is enabled with max_num_batched_tokens=2048.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:754] Asynchronous scheduling is enabled.
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:964] Cudagraph is disabled under eager mode
(APIServer pid=1) INFO 03-28 00:34:07 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) WARNING 03-28 00:34:09 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [core.py:103] Initializing a V1 LLM engine (v0.18.0) with config: model='Qwen/Qwen2.5-3B-Instruct', speculative_config=None, tokenizer='Qwen/Qwen2.5-3B-Instruct', skip_tokenizer_init=False, tokenizer_mode=auto, revision=None, tokenizer_revision=None, trust_remote_code=False, dtype=torch.bfloat16, max_seq_len=4096, download_dir=None, load_format=bitsandbytes, tensor_parallel_size=1, pipeline_parallel_size=1, data_parallel_size=1, decode_context_parallel_size=1, dcp_comm_backend=ag_rs, disable_custom_all_reduce=False, quantization=bitsandbytes, enforce_eager=True, enable_return_routed_experts=False, kv_cache_dtype=auto, device_config=cuda, structured_outputs_config=StructuredOutputsConfig(backend='auto', disable_any_whitespace=False, disable_additional_properties=False, reasoning_parser='', reasoning_parser_plugin='', enable_in_reasoning=False), observability_config=ObservabilityConfig(show_hidden_metrics_for_version=None, otlp_traces_endpoint=None, collect_detailed_traces=None, kv_cache_metrics=False, kv_cache_metrics_sample=0.01, cudagraph_metrics=False, enable_layerwise_nvtx_tracing=False, enable_mfu_metrics=False, enable_mm_processor_stats=False, enable_logging_iteration_details=False), seed=0, served_model_name=Qwen/Qwen2.5-3B-Instruct, enable_prefix_caching=True, enable_chunked_prefill=True, pooler_config=None, compilation_config={'mode': <CompilationMode.NONE: 0>, 'debug_dump_path': None, 'cache_dir': '', 'compile_cache_save_format': 'binary', 'backend': 'inductor', 'custom_ops': ['all'], 'splitting_ops': [], 'compile_mm_encoder': False, 'compile_sizes': [], 'compile_ranges_endpoints': [2048], 'inductor_compile_config': {'enable_auto_functionalized_v2': False, 'combo_kernels': True, 'benchmark_combo_kernel': True}, 'inductor_passes': {}, 'cudagraph_mode': <CUDAGraphMode.NONE: 0>, 'cudagraph_num_of_warmups': 0, 'cudagraph_capture_sizes': [], 'cudagraph_copy_inputs': False, 'cudagraph_specialize_lora': True, 'use_inductor_graph_partition': False, 'pass_config': {'fuse_norm_quant': True, 'fuse_act_quant': True, 'fuse_attn_quant': False, 'enable_sp': False, 'fuse_gemm_comms': False, 'fuse_allreduce_rms': False}, 'max_cudagraph_capture_size': 0, 'dynamic_shapes_config': {'type': <DynamicShapesType.BACKED: 'backed'>, 'evaluate_guards': False, 'assume_32_bit_indexing': False}, 'local_cache_dir': None, 'fast_moe_cold_start': True, 'static_all_moe_layers': []}
(EngineCore pid=101) WARNING 03-28 00:34:14 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1395] world_size=1 rank=0 local_rank=0 distributed_init_method=tcp://10.244.0.70:46601 backend=nccl
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1717] rank 0 in world size 1 is assigned as DP rank 0, PP rank 0, PCP rank 0, TP rank 0, EP rank N/A, EPLB rank N/A
(EngineCore pid=101) INFO 03-28 00:34:14 [gpu_model_runner.py:4481] Starting to load model Qwen/Qwen2.5-3B-Instruct...
(EngineCore pid=101) INFO 03-28 00:34:16 [cuda.py:317] Using FLASH_ATTN attention backend out of potential backends: ['FLASH_ATTN', 'FLASHINFER', 'TRITON_ATTN', 'FLEX_ATTENTION'].
(EngineCore pid=101) INFO 03-28 00:34:16 [flash_attn.py:598] Using FlashAttention version 2
(EngineCore pid=101) INFO 03-28 00:34:16 [bitsandbytes_loader.py:786] Loading weights with BitsAndBytes quantization. May take a while ...
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:533] Resolved architecture: Qwen2ForCausalLM
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:1582] Using max model len 4096
(APIServer pid=1) INFO 03-28 00:34:07 [scheduler.py:231] Chunked prefill is enabled with max_num_batched_tokens=2048.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:754] Asynchronous scheduling is enabled.
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:964] Cudagraph is disabled under eager mode
(APIServer pid=1) INFO 03-28 00:34:07 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) WARNING 03-28 00:34:09 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [core.py:103] Initializing a V1 LLM engine (v0.18.0) with config: model='Qwen/Qwen2.5-3B-Instruct', speculative_config=None, tokenizer='Qwen/Qwen2.5-3B-Instruct', skip_tokenizer_init=False, tokenizer_mode=auto, revision=None, tokenizer_revision=None, trust_remote_code=False, dtype=torch.bfloat16, max_seq_len=4096, download_dir=None, load_format=bitsandbytes, tensor_parallel_size=1, pipeline_parallel_size=1, data_parallel_size=1, decode_context_parallel_size=1, dcp_comm_backend=ag_rs, disable_custom_all_reduce=False, quantization=bitsandbytes, enforce_eager=True, enable_return_routed_experts=False, kv_cache_dtype=auto, device_config=cuda, structured_outputs_config=StructuredOutputsConfig(backend='auto', disable_any_whitespace=False, disable_additional_properties=False, reasoning_parser='', reasoning_parser_plugin='', enable_in_reasoning=False), observability_config=ObservabilityConfig(show_hidden_metrics_for_version=None, otlp_traces_endpoint=None, collect_detailed_traces=None, kv_cache_metrics=False, kv_cache_metrics_sample=0.01, cudagraph_metrics=False, enable_layerwise_nvtx_tracing=False, enable_mfu_metrics=False, enable_mm_processor_stats=False, enable_logging_iteration_details=False), seed=0, served_model_name=Qwen/Qwen2.5-3B-Instruct, enable_prefix_caching=True, enable_chunked_prefill=True, pooler_config=None, compilation_config={'mode': <CompilationMode.NONE: 0>, 'debug_dump_path': None, 'cache_dir': '', 'compile_cache_save_format': 'binary', 'backend': 'inductor', 'custom_ops': ['all'], 'splitting_ops': [], 'compile_mm_encoder': False, 'compile_sizes': [], 'compile_ranges_endpoints': [2048], 'inductor_compile_config': {'enable_auto_functionalized_v2': False, 'combo_kernels': True, 'benchmark_combo_kernel': True}, 'inductor_passes': {}, 'cudagraph_mode': <CUDAGraphMode.NONE: 0>, 'cudagraph_num_of_warmups': 0, 'cudagraph_capture_sizes': [], 'cudagraph_copy_inputs': False, 'cudagraph_specialize_lora': True, 'use_inductor_graph_partition': False, 'pass_config': {'fuse_norm_quant': True, 'fuse_act_quant': True, 'fuse_attn_quant': False, 'enable_sp': False, 'fuse_gemm_comms': False, 'fuse_allreduce_rms': False}, 'max_cudagraph_capture_size': 0, 'dynamic_shapes_config': {'type': <DynamicShapesType.BACKED: 'backed'>, 'evaluate_guards': False, 'assume_32_bit_indexing': False}, 'local_cache_dir': None, 'fast_moe_cold_start': True, 'static_all_moe_layers': []}
(EngineCore pid=101) WARNING 03-28 00:34:14 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1395] world_size=1 rank=0 local_rank=0 distributed_init_method=tcp://10.244.0.70:46601 backend=nccl
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1717] rank 0 in world size 1 is assigned as DP rank 0, PP rank 0, PCP rank 0, TP rank 0, EP rank N/A, EPLB rank N/A
(EngineCore pid=101) INFO 03-28 00:34:14 [gpu_model_runner.py:4481] Starting to load model Qwen/Qwen2.5-3B-Instruct...
(EngineCore pid=101) INFO 03-28 00:34:16 [cuda.py:317] Using FLASH_ATTN attention backend out of potential backends: ['FLASH_ATTN', 'FLASHINFER', 'TRITON_ATTN', 'FLEX_ATTENTION'].
(EngineCore pid=101) INFO 03-28 00:34:16 [flash_attn.py:598] Using FlashAttention version 2
(EngineCore pid=101) INFO 03-28 00:34:16 [bitsandbytes_loader.py:786] Loading weights with BitsAndBytes quantization. May take a while ...
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:533] Resolved architecture: Qwen2ForCausalLM
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:1582] Using max model len 4096
(APIServer pid=1) INFO 03-28 00:34:07 [scheduler.py:231] Chunked prefill is enabled with max_num_batched_tokens=2048.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:754] Asynchronous scheduling is enabled.
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:964] Cudagraph is disabled under eager mode
(APIServer pid=1) INFO 03-28 00:34:07 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) WARNING 03-28 00:34:09 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [core.py:103] Initializing a V1 LLM engine (v0.18.0) with config: model='Qwen/Qwen2.5-3B-Instruct', speculative_config=None, tokenizer='Qwen/Qwen2.5-3B-Instruct', skip_tokenizer_init=False, tokenizer_mode=auto, revision=None, tokenizer_revision=None, trust_remote_code=False, dtype=torch.bfloat16, max_seq_len=4096, download_dir=None, load_format=bitsandbytes, tensor_parallel_size=1, pipeline_parallel_size=1, data_parallel_size=1, decode_context_parallel_size=1, dcp_comm_backend=ag_rs, disable_custom_all_reduce=False, quantization=bitsandbytes, enforce_eager=True, enable_return_routed_experts=False, kv_cache_dtype=auto, device_config=cuda, structured_outputs_config=StructuredOutputsConfig(backend='auto', disable_any_whitespace=False, disable_additional_properties=False, reasoning_parser='', reasoning_parser_plugin='', enable_in_reasoning=False), observability_config=ObservabilityConfig(show_hidden_metrics_for_version=None, otlp_traces_endpoint=None, collect_detailed_traces=None, kv_cache_metrics=False, kv_cache_metrics_sample=0.01, cudagraph_metrics=False, enable_layerwise_nvtx_tracing=False, enable_mfu_metrics=False, enable_mm_processor_stats=False, enable_logging_iteration_details=False), seed=0, served_model_name=Qwen/Qwen2.5-3B-Instruct, enable_prefix_caching=True, enable_chunked_prefill=True, pooler_config=None, compilation_config={'mode': <CompilationMode.NONE: 0>, 'debug_dump_path': None, 'cache_dir': '', 'compile_cache_save_format': 'binary', 'backend': 'inductor', 'custom_ops': ['all'], 'splitting_ops': [], 'compile_mm_encoder': False, 'compile_sizes': [], 'compile_ranges_endpoints': [2048], 'inductor_compile_config': {'enable_auto_functionalized_v2': False, 'combo_kernels': True, 'benchmark_combo_kernel': True}, 'inductor_passes': {}, 'cudagraph_mode': <CUDAGraphMode.NONE: 0>, 'cudagraph_num_of_warmups': 0, 'cudagraph_capture_sizes': [], 'cudagraph_copy_inputs': False, 'cudagraph_specialize_lora': True, 'use_inductor_graph_partition': False, 'pass_config': {'fuse_norm_quant': True, 'fuse_act_quant': True, 'fuse_attn_quant': False, 'enable_sp': False, 'fuse_gemm_comms': False, 'fuse_allreduce_rms': False}, 'max_cudagraph_capture_size': 0, 'dynamic_shapes_config': {'type': <DynamicShapesType.BACKED: 'backed'>, 'evaluate_guards': False, 'assume_32_bit_indexing': False}, 'local_cache_dir': None, 'fast_moe_cold_start': True, 'static_all_moe_layers': []}
(EngineCore pid=101) WARNING 03-28 00:34:14 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1395] world_size=1 rank=0 local_rank=0 distributed_init_method=tcp://10.244.0.70:46601 backend=nccl
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1717] rank 0 in world size 1 is assigned as DP rank 0, PP rank 0, PCP rank 0, TP rank 0, EP rank N/A, EPLB rank N/A
(EngineCore pid=101) INFO 03-28 00:34:14 [gpu_model_runner.py:4481] Starting to load model Qwen/Qwen2.5-3B-Instruct...
(EngineCore pid=101) INFO 03-28 00:34:16 [cuda.py:317] Using FLASH_ATTN attention backend out of potential backends: ['FLASH_ATTN', 'FLASHINFER', 'TRITON_ATTN', 'FLEX_ATTENTION'].
(EngineCore pid=101) INFO 03-28 00:34:16 [flash_attn.py:598] Using FlashAttention version 2
(EngineCore pid=101) INFO 03-28 00:34:16 [bitsandbytes_loader.py:786] Loading weights with BitsAndBytes quantization. May take a while ...
(EngineCore pid=101) INFO 03-28 00:36:18 [weight_utils.py:574] Time spent downloading weights for Qwen/Qwen2.5-3B-Instruct: 122.387839 seconds
Loading safetensors checkpoint shards:   0% Completed | 0/2 [00:00<?, ?it/s]
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:533] Resolved architecture: Qwen2ForCausalLM
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:1582] Using max model len 4096
(APIServer pid=1) INFO 03-28 00:34:07 [scheduler.py:231] Chunked prefill is enabled with max_num_batched_tokens=2048.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:754] Asynchronous scheduling is enabled.
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:964] Cudagraph is disabled under eager mode
(APIServer pid=1) INFO 03-28 00:34:07 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) WARNING 03-28 00:34:09 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [core.py:103] Initializing a V1 LLM engine (v0.18.0) with config: model='Qwen/Qwen2.5-3B-Instruct', speculative_config=None, tokenizer='Qwen/Qwen2.5-3B-Instruct', skip_tokenizer_init=False, tokenizer_mode=auto, revision=None, tokenizer_revision=None, trust_remote_code=False, dtype=torch.bfloat16, max_seq_len=4096, download_dir=None, load_format=bitsandbytes, tensor_parallel_size=1, pipeline_parallel_size=1, data_parallel_size=1, decode_context_parallel_size=1, dcp_comm_backend=ag_rs, disable_custom_all_reduce=False, quantization=bitsandbytes, enforce_eager=True, enable_return_routed_experts=False, kv_cache_dtype=auto, device_config=cuda, structured_outputs_config=StructuredOutputsConfig(backend='auto', disable_any_whitespace=False, disable_additional_properties=False, reasoning_parser='', reasoning_parser_plugin='', enable_in_reasoning=False), observability_config=ObservabilityConfig(show_hidden_metrics_for_version=None, otlp_traces_endpoint=None, collect_detailed_traces=None, kv_cache_metrics=False, kv_cache_metrics_sample=0.01, cudagraph_metrics=False, enable_layerwise_nvtx_tracing=False, enable_mfu_metrics=False, enable_mm_processor_stats=False, enable_logging_iteration_details=False), seed=0, served_model_name=Qwen/Qwen2.5-3B-Instruct, enable_prefix_caching=True, enable_chunked_prefill=True, pooler_config=None, compilation_config={'mode': <CompilationMode.NONE: 0>, 'debug_dump_path': None, 'cache_dir': '', 'compile_cache_save_format': 'binary', 'backend': 'inductor', 'custom_ops': ['all'], 'splitting_ops': [], 'compile_mm_encoder': False, 'compile_sizes': [], 'compile_ranges_endpoints': [2048], 'inductor_compile_config': {'enable_auto_functionalized_v2': False, 'combo_kernels': True, 'benchmark_combo_kernel': True}, 'inductor_passes': {}, 'cudagraph_mode': <CUDAGraphMode.NONE: 0>, 'cudagraph_num_of_warmups': 0, 'cudagraph_capture_sizes': [], 'cudagraph_copy_inputs': False, 'cudagraph_specialize_lora': True, 'use_inductor_graph_partition': False, 'pass_config': {'fuse_norm_quant': True, 'fuse_act_quant': True, 'fuse_attn_quant': False, 'enable_sp': False, 'fuse_gemm_comms': False, 'fuse_allreduce_rms': False}, 'max_cudagraph_capture_size': 0, 'dynamic_shapes_config': {'type': <DynamicShapesType.BACKED: 'backed'>, 'evaluate_guards': False, 'assume_32_bit_indexing': False}, 'local_cache_dir': None, 'fast_moe_cold_start': True, 'static_all_moe_layers': []}
(EngineCore pid=101) WARNING 03-28 00:34:14 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1395] world_size=1 rank=0 local_rank=0 distributed_init_method=tcp://10.244.0.70:46601 backend=nccl
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1717] rank 0 in world size 1 is assigned as DP rank 0, PP rank 0, PCP rank 0, TP rank 0, EP rank N/A, EPLB rank N/A
(EngineCore pid=101) INFO 03-28 00:34:14 [gpu_model_runner.py:4481] Starting to load model Qwen/Qwen2.5-3B-Instruct...
(EngineCore pid=101) INFO 03-28 00:34:16 [cuda.py:317] Using FLASH_ATTN attention backend out of potential backends: ['FLASH_ATTN', 'FLASHINFER', 'TRITON_ATTN', 'FLEX_ATTENTION'].
(EngineCore pid=101) INFO 03-28 00:34:16 [flash_attn.py:598] Using FlashAttention version 2
(EngineCore pid=101) INFO 03-28 00:34:16 [bitsandbytes_loader.py:786] Loading weights with BitsAndBytes quantization. May take a while ...
(EngineCore pid=101) INFO 03-28 00:36:18 [weight_utils.py:574] Time spent downloading weights for Qwen/Qwen2.5-3B-Instruct: 122.387839 seconds
Loading safetensors checkpoint shards:   0% Completed | 0/2 [00:00<?, ?it/s]
Loading safetensors checkpoint shards:  50% Completed | 1/2 [00:06<00:06,  6.45s/it]
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:533] Resolved architecture: Qwen2ForCausalLM
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:1582] Using max model len 4096
(APIServer pid=1) INFO 03-28 00:34:07 [scheduler.py:231] Chunked prefill is enabled with max_num_batched_tokens=2048.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:754] Asynchronous scheduling is enabled.
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:964] Cudagraph is disabled under eager mode
(APIServer pid=1) INFO 03-28 00:34:07 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) WARNING 03-28 00:34:09 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [core.py:103] Initializing a V1 LLM engine (v0.18.0) with config: model='Qwen/Qwen2.5-3B-Instruct', speculative_config=None, tokenizer='Qwen/Qwen2.5-3B-Instruct', skip_tokenizer_init=False, tokenizer_mode=auto, revision=None, tokenizer_revision=None, trust_remote_code=False, dtype=torch.bfloat16, max_seq_len=4096, download_dir=None, load_format=bitsandbytes, tensor_parallel_size=1, pipeline_parallel_size=1, data_parallel_size=1, decode_context_parallel_size=1, dcp_comm_backend=ag_rs, disable_custom_all_reduce=False, quantization=bitsandbytes, enforce_eager=True, enable_return_routed_experts=False, kv_cache_dtype=auto, device_config=cuda, structured_outputs_config=StructuredOutputsConfig(backend='auto', disable_any_whitespace=False, disable_additional_properties=False, reasoning_parser='', reasoning_parser_plugin='', enable_in_reasoning=False), observability_config=ObservabilityConfig(show_hidden_metrics_for_version=None, otlp_traces_endpoint=None, collect_detailed_traces=None, kv_cache_metrics=False, kv_cache_metrics_sample=0.01, cudagraph_metrics=False, enable_layerwise_nvtx_tracing=False, enable_mfu_metrics=False, enable_mm_processor_stats=False, enable_logging_iteration_details=False), seed=0, served_model_name=Qwen/Qwen2.5-3B-Instruct, enable_prefix_caching=True, enable_chunked_prefill=True, pooler_config=None, compilation_config={'mode': <CompilationMode.NONE: 0>, 'debug_dump_path': None, 'cache_dir': '', 'compile_cache_save_format': 'binary', 'backend': 'inductor', 'custom_ops': ['all'], 'splitting_ops': [], 'compile_mm_encoder': False, 'compile_sizes': [], 'compile_ranges_endpoints': [2048], 'inductor_compile_config': {'enable_auto_functionalized_v2': False, 'combo_kernels': True, 'benchmark_combo_kernel': True}, 'inductor_passes': {}, 'cudagraph_mode': <CUDAGraphMode.NONE: 0>, 'cudagraph_num_of_warmups': 0, 'cudagraph_capture_sizes': [], 'cudagraph_copy_inputs': False, 'cudagraph_specialize_lora': True, 'use_inductor_graph_partition': False, 'pass_config': {'fuse_norm_quant': True, 'fuse_act_quant': True, 'fuse_attn_quant': False, 'enable_sp': False, 'fuse_gemm_comms': False, 'fuse_allreduce_rms': False}, 'max_cudagraph_capture_size': 0, 'dynamic_shapes_config': {'type': <DynamicShapesType.BACKED: 'backed'>, 'evaluate_guards': False, 'assume_32_bit_indexing': False}, 'local_cache_dir': None, 'fast_moe_cold_start': True, 'static_all_moe_layers': []}
(EngineCore pid=101) WARNING 03-28 00:34:14 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1395] world_size=1 rank=0 local_rank=0 distributed_init_method=tcp://10.244.0.70:46601 backend=nccl
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1717] rank 0 in world size 1 is assigned as DP rank 0, PP rank 0, PCP rank 0, TP rank 0, EP rank N/A, EPLB rank N/A
(EngineCore pid=101) INFO 03-28 00:34:14 [gpu_model_runner.py:4481] Starting to load model Qwen/Qwen2.5-3B-Instruct...
(EngineCore pid=101) INFO 03-28 00:34:16 [cuda.py:317] Using FLASH_ATTN attention backend out of potential backends: ['FLASH_ATTN', 'FLASHINFER', 'TRITON_ATTN', 'FLEX_ATTENTION'].
(EngineCore pid=101) INFO 03-28 00:34:16 [flash_attn.py:598] Using FlashAttention version 2
(EngineCore pid=101) INFO 03-28 00:34:16 [bitsandbytes_loader.py:786] Loading weights with BitsAndBytes quantization. May take a while ...
(EngineCore pid=101) INFO 03-28 00:36:18 [weight_utils.py:574] Time spent downloading weights for Qwen/Qwen2.5-3B-Instruct: 122.387839 seconds
Loading safetensors checkpoint shards:   0% Completed | 0/2 [00:00<?, ?it/s]
Loading safetensors checkpoint shards:  50% Completed | 1/2 [00:06<00:06,  6.45s/it]
Loading safetensors checkpoint shards: 100% Completed | 2/2 [00:10<00:00,  5.08s/it]
Loading safetensors checkpoint shards: 100% Completed | 2/2 [00:10<00:00,  5.29s/it]
(EngineCore pid=101)
(EngineCore pid=101) INFO 03-28 00:36:29 [gpu_model_runner.py:4566] Model loading took 2.07 GiB memory and 134.839849 seconds
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:533] Resolved architecture: Qwen2ForCausalLM
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:1582] Using max model len 4096
(APIServer pid=1) INFO 03-28 00:34:07 [scheduler.py:231] Chunked prefill is enabled with max_num_batched_tokens=2048.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:754] Asynchronous scheduling is enabled.
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:964] Cudagraph is disabled under eager mode
(APIServer pid=1) INFO 03-28 00:34:07 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) WARNING 03-28 00:34:09 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [core.py:103] Initializing a V1 LLM engine (v0.18.0) with config: model='Qwen/Qwen2.5-3B-Instruct', speculative_config=None, tokenizer='Qwen/Qwen2.5-3B-Instruct', skip_tokenizer_init=False, tokenizer_mode=auto, revision=None, tokenizer_revision=None, trust_remote_code=False, dtype=torch.bfloat16, max_seq_len=4096, download_dir=None, load_format=bitsandbytes, tensor_parallel_size=1, pipeline_parallel_size=1, data_parallel_size=1, decode_context_parallel_size=1, dcp_comm_backend=ag_rs, disable_custom_all_reduce=False, quantization=bitsandbytes, enforce_eager=True, enable_return_routed_experts=False, kv_cache_dtype=auto, device_config=cuda, structured_outputs_config=StructuredOutputsConfig(backend='auto', disable_any_whitespace=False, disable_additional_properties=False, reasoning_parser='', reasoning_parser_plugin='', enable_in_reasoning=False), observability_config=ObservabilityConfig(show_hidden_metrics_for_version=None, otlp_traces_endpoint=None, collect_detailed_traces=None, kv_cache_metrics=False, kv_cache_metrics_sample=0.01, cudagraph_metrics=False, enable_layerwise_nvtx_tracing=False, enable_mfu_metrics=False, enable_mm_processor_stats=False, enable_logging_iteration_details=False), seed=0, served_model_name=Qwen/Qwen2.5-3B-Instruct, enable_prefix_caching=True, enable_chunked_prefill=True, pooler_config=None, compilation_config={'mode': <CompilationMode.NONE: 0>, 'debug_dump_path': None, 'cache_dir': '', 'compile_cache_save_format': 'binary', 'backend': 'inductor', 'custom_ops': ['all'], 'splitting_ops': [], 'compile_mm_encoder': False, 'compile_sizes': [], 'compile_ranges_endpoints': [2048], 'inductor_compile_config': {'enable_auto_functionalized_v2': False, 'combo_kernels': True, 'benchmark_combo_kernel': True}, 'inductor_passes': {}, 'cudagraph_mode': <CUDAGraphMode.NONE: 0>, 'cudagraph_num_of_warmups': 0, 'cudagraph_capture_sizes': [], 'cudagraph_copy_inputs': False, 'cudagraph_specialize_lora': True, 'use_inductor_graph_partition': False, 'pass_config': {'fuse_norm_quant': True, 'fuse_act_quant': True, 'fuse_attn_quant': False, 'enable_sp': False, 'fuse_gemm_comms': False, 'fuse_allreduce_rms': False}, 'max_cudagraph_capture_size': 0, 'dynamic_shapes_config': {'type': <DynamicShapesType.BACKED: 'backed'>, 'evaluate_guards': False, 'assume_32_bit_indexing': False}, 'local_cache_dir': None, 'fast_moe_cold_start': True, 'static_all_moe_layers': []}
(EngineCore pid=101) WARNING 03-28 00:34:14 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1395] world_size=1 rank=0 local_rank=0 distributed_init_method=tcp://10.244.0.70:46601 backend=nccl
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1717] rank 0 in world size 1 is assigned as DP rank 0, PP rank 0, PCP rank 0, TP rank 0, EP rank N/A, EPLB rank N/A
(EngineCore pid=101) INFO 03-28 00:34:14 [gpu_model_runner.py:4481] Starting to load model Qwen/Qwen2.5-3B-Instruct...
(EngineCore pid=101) INFO 03-28 00:34:16 [cuda.py:317] Using FLASH_ATTN attention backend out of potential backends: ['FLASH_ATTN', 'FLASHINFER', 'TRITON_ATTN', 'FLEX_ATTENTION'].
(EngineCore pid=101) INFO 03-28 00:34:16 [flash_attn.py:598] Using FlashAttention version 2
(EngineCore pid=101) INFO 03-28 00:34:16 [bitsandbytes_loader.py:786] Loading weights with BitsAndBytes quantization. May take a while ...
(EngineCore pid=101) INFO 03-28 00:36:18 [weight_utils.py:574] Time spent downloading weights for Qwen/Qwen2.5-3B-Instruct: 122.387839 seconds
Loading safetensors checkpoint shards:   0% Completed | 0/2 [00:00<?, ?it/s]
Loading safetensors checkpoint shards:  50% Completed | 1/2 [00:06<00:06,  6.45s/it]
Loading safetensors checkpoint shards: 100% Completed | 2/2 [00:10<00:00,  5.08s/it]
Loading safetensors checkpoint shards: 100% Completed | 2/2 [00:10<00:00,  5.29s/it]
(EngineCore pid=101)
(EngineCore pid=101) INFO 03-28 00:36:29 [gpu_model_runner.py:4566] Model loading took 2.07 GiB memory and 134.839849 seconds
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:533] Resolved architecture: Qwen2ForCausalLM
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:1582] Using max model len 4096
(APIServer pid=1) INFO 03-28 00:34:07 [scheduler.py:231] Chunked prefill is enabled with max_num_batched_tokens=2048.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:754] Asynchronous scheduling is enabled.
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:964] Cudagraph is disabled under eager mode
(APIServer pid=1) INFO 03-28 00:34:07 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) WARNING 03-28 00:34:09 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [core.py:103] Initializing a V1 LLM engine (v0.18.0) with config: model='Qwen/Qwen2.5-3B-Instruct', speculative_config=None, tokenizer='Qwen/Qwen2.5-3B-Instruct', skip_tokenizer_init=False, tokenizer_mode=auto, revision=None, tokenizer_revision=None, trust_remote_code=False, dtype=torch.bfloat16, max_seq_len=4096, download_dir=None, load_format=bitsandbytes, tensor_parallel_size=1, pipeline_parallel_size=1, data_parallel_size=1, decode_context_parallel_size=1, dcp_comm_backend=ag_rs, disable_custom_all_reduce=False, quantization=bitsandbytes, enforce_eager=True, enable_return_routed_experts=False, kv_cache_dtype=auto, device_config=cuda, structured_outputs_config=StructuredOutputsConfig(backend='auto', disable_any_whitespace=False, disable_additional_properties=False, reasoning_parser='', reasoning_parser_plugin='', enable_in_reasoning=False), observability_config=ObservabilityConfig(show_hidden_metrics_for_version=None, otlp_traces_endpoint=None, collect_detailed_traces=None, kv_cache_metrics=False, kv_cache_metrics_sample=0.01, cudagraph_metrics=False, enable_layerwise_nvtx_tracing=False, enable_mfu_metrics=False, enable_mm_processor_stats=False, enable_logging_iteration_details=False), seed=0, served_model_name=Qwen/Qwen2.5-3B-Instruct, enable_prefix_caching=True, enable_chunked_prefill=True, pooler_config=None, compilation_config={'mode': <CompilationMode.NONE: 0>, 'debug_dump_path': None, 'cache_dir': '', 'compile_cache_save_format': 'binary', 'backend': 'inductor', 'custom_ops': ['all'], 'splitting_ops': [], 'compile_mm_encoder': False, 'compile_sizes': [], 'compile_ranges_endpoints': [2048], 'inductor_compile_config': {'enable_auto_functionalized_v2': False, 'combo_kernels': True, 'benchmark_combo_kernel': True}, 'inductor_passes': {}, 'cudagraph_mode': <CUDAGraphMode.NONE: 0>, 'cudagraph_num_of_warmups': 0, 'cudagraph_capture_sizes': [], 'cudagraph_copy_inputs': False, 'cudagraph_specialize_lora': True, 'use_inductor_graph_partition': False, 'pass_config': {'fuse_norm_quant': True, 'fuse_act_quant': True, 'fuse_attn_quant': False, 'enable_sp': False, 'fuse_gemm_comms': False, 'fuse_allreduce_rms': False}, 'max_cudagraph_capture_size': 0, 'dynamic_shapes_config': {'type': <DynamicShapesType.BACKED: 'backed'>, 'evaluate_guards': False, 'assume_32_bit_indexing': False}, 'local_cache_dir': None, 'fast_moe_cold_start': True, 'static_all_moe_layers': []}
(EngineCore pid=101) WARNING 03-28 00:34:14 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1395] world_size=1 rank=0 local_rank=0 distributed_init_method=tcp://10.244.0.70:46601 backend=nccl
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1717] rank 0 in world size 1 is assigned as DP rank 0, PP rank 0, PCP rank 0, TP rank 0, EP rank N/A, EPLB rank N/A
(EngineCore pid=101) INFO 03-28 00:34:14 [gpu_model_runner.py:4481] Starting to load model Qwen/Qwen2.5-3B-Instruct...
(EngineCore pid=101) INFO 03-28 00:34:16 [cuda.py:317] Using FLASH_ATTN attention backend out of potential backends: ['FLASH_ATTN', 'FLASHINFER', 'TRITON_ATTN', 'FLEX_ATTENTION'].
(EngineCore pid=101) INFO 03-28 00:34:16 [flash_attn.py:598] Using FlashAttention version 2
(EngineCore pid=101) INFO 03-28 00:34:16 [bitsandbytes_loader.py:786] Loading weights with BitsAndBytes quantization. May take a while ...
(EngineCore pid=101) INFO 03-28 00:36:18 [weight_utils.py:574] Time spent downloading weights for Qwen/Qwen2.5-3B-Instruct: 122.387839 seconds
Loading safetensors checkpoint shards:   0% Completed | 0/2 [00:00<?, ?it/s]
Loading safetensors checkpoint shards:  50% Completed | 1/2 [00:06<00:06,  6.45s/it]
Loading safetensors checkpoint shards: 100% Completed | 2/2 [00:10<00:00,  5.08s/it]
Loading safetensors checkpoint shards: 100% Completed | 2/2 [00:10<00:00,  5.29s/it]
(EngineCore pid=101)
(EngineCore pid=101) INFO 03-28 00:36:29 [gpu_model_runner.py:4566] Model loading took 2.07 GiB memory and 134.839849 seconds
(EngineCore pid=101) INFO 03-28 00:36:39 [gpu_worker.py:456] Available KV cache memory: 3.75 GiB
(EngineCore pid=101) INFO 03-28 00:36:39 [kv_cache_utils.py:1316] GPU KV cache size: 109,264 tokens
(EngineCore pid=101) INFO 03-28 00:36:39 [kv_cache_utils.py:1321] Maximum concurrency for 4,096 tokens per request: 26.68x
(EngineCore pid=101) INFO 03-28 00:36:39 [core.py:281] init engine (profile, create kv cache, warmup model) took 9.49 seconds
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:533] Resolved architecture: Qwen2ForCausalLM
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:1582] Using max model len 4096
(APIServer pid=1) INFO 03-28 00:34:07 [scheduler.py:231] Chunked prefill is enabled with max_num_batched_tokens=2048.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:754] Asynchronous scheduling is enabled.
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:964] Cudagraph is disabled under eager mode
(APIServer pid=1) INFO 03-28 00:34:07 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) WARNING 03-28 00:34:09 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [core.py:103] Initializing a V1 LLM engine (v0.18.0) with config: model='Qwen/Qwen2.5-3B-Instruct', speculative_config=None, tokenizer='Qwen/Qwen2.5-3B-Instruct', skip_tokenizer_init=False, tokenizer_mode=auto, revision=None, tokenizer_revision=None, trust_remote_code=False, dtype=torch.bfloat16, max_seq_len=4096, download_dir=None, load_format=bitsandbytes, tensor_parallel_size=1, pipeline_parallel_size=1, data_parallel_size=1, decode_context_parallel_size=1, dcp_comm_backend=ag_rs, disable_custom_all_reduce=False, quantization=bitsandbytes, enforce_eager=True, enable_return_routed_experts=False, kv_cache_dtype=auto, device_config=cuda, structured_outputs_config=StructuredOutputsConfig(backend='auto', disable_any_whitespace=False, disable_additional_properties=False, reasoning_parser='', reasoning_parser_plugin='', enable_in_reasoning=False), observability_config=ObservabilityConfig(show_hidden_metrics_for_version=None, otlp_traces_endpoint=None, collect_detailed_traces=None, kv_cache_metrics=False, kv_cache_metrics_sample=0.01, cudagraph_metrics=False, enable_layerwise_nvtx_tracing=False, enable_mfu_metrics=False, enable_mm_processor_stats=False, enable_logging_iteration_details=False), seed=0, served_model_name=Qwen/Qwen2.5-3B-Instruct, enable_prefix_caching=True, enable_chunked_prefill=True, pooler_config=None, compilation_config={'mode': <CompilationMode.NONE: 0>, 'debug_dump_path': None, 'cache_dir': '', 'compile_cache_save_format': 'binary', 'backend': 'inductor', 'custom_ops': ['all'], 'splitting_ops': [], 'compile_mm_encoder': False, 'compile_sizes': [], 'compile_ranges_endpoints': [2048], 'inductor_compile_config': {'enable_auto_functionalized_v2': False, 'combo_kernels': True, 'benchmark_combo_kernel': True}, 'inductor_passes': {}, 'cudagraph_mode': <CUDAGraphMode.NONE: 0>, 'cudagraph_num_of_warmups': 0, 'cudagraph_capture_sizes': [], 'cudagraph_copy_inputs': False, 'cudagraph_specialize_lora': True, 'use_inductor_graph_partition': False, 'pass_config': {'fuse_norm_quant': True, 'fuse_act_quant': True, 'fuse_attn_quant': False, 'enable_sp': False, 'fuse_gemm_comms': False, 'fuse_allreduce_rms': False}, 'max_cudagraph_capture_size': 0, 'dynamic_shapes_config': {'type': <DynamicShapesType.BACKED: 'backed'>, 'evaluate_guards': False, 'assume_32_bit_indexing': False}, 'local_cache_dir': None, 'fast_moe_cold_start': True, 'static_all_moe_layers': []}
(EngineCore pid=101) WARNING 03-28 00:34:14 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1395] world_size=1 rank=0 local_rank=0 distributed_init_method=tcp://10.244.0.70:46601 backend=nccl
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1717] rank 0 in world size 1 is assigned as DP rank 0, PP rank 0, PCP rank 0, TP rank 0, EP rank N/A, EPLB rank N/A
(EngineCore pid=101) INFO 03-28 00:34:14 [gpu_model_runner.py:4481] Starting to load model Qwen/Qwen2.5-3B-Instruct...
(EngineCore pid=101) INFO 03-28 00:34:16 [cuda.py:317] Using FLASH_ATTN attention backend out of potential backends: ['FLASH_ATTN', 'FLASHINFER', 'TRITON_ATTN', 'FLEX_ATTENTION'].
(EngineCore pid=101) INFO 03-28 00:34:16 [flash_attn.py:598] Using FlashAttention version 2
(EngineCore pid=101) INFO 03-28 00:34:16 [bitsandbytes_loader.py:786] Loading weights with BitsAndBytes quantization. May take a while ...
(EngineCore pid=101) INFO 03-28 00:36:18 [weight_utils.py:574] Time spent downloading weights for Qwen/Qwen2.5-3B-Instruct: 122.387839 seconds
Loading safetensors checkpoint shards:   0% Completed | 0/2 [00:00<?, ?it/s]
Loading safetensors checkpoint shards:  50% Completed | 1/2 [00:06<00:06,  6.45s/it]
Loading safetensors checkpoint shards: 100% Completed | 2/2 [00:10<00:00,  5.08s/it]
Loading safetensors checkpoint shards: 100% Completed | 2/2 [00:10<00:00,  5.29s/it]
(EngineCore pid=101)
(EngineCore pid=101) INFO 03-28 00:36:29 [gpu_model_runner.py:4566] Model loading took 2.07 GiB memory and 134.839849 seconds
(EngineCore pid=101) INFO 03-28 00:36:39 [gpu_worker.py:456] Available KV cache memory: 3.75 GiB
(EngineCore pid=101) INFO 03-28 00:36:39 [kv_cache_utils.py:1316] GPU KV cache size: 109,264 tokens
(EngineCore pid=101) INFO 03-28 00:36:39 [kv_cache_utils.py:1321] Maximum concurrency for 4,096 tokens per request: 26.68x
(EngineCore pid=101) INFO 03-28 00:36:39 [core.py:281] init engine (profile, create kv cache, warmup model) took 9.49 seconds
(EngineCore pid=101) INFO 03-28 00:36:40 [vllm.py:754] Asynchronous scheduling is enabled.
(EngineCore pid=101) WARNING 03-28 00:36:40 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(EngineCore pid=101) WARNING 03-28 00:36:40 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(EngineCore pid=101) INFO 03-28 00:36:40 [vllm.py:964] Cudagraph is disabled under eager mode
(EngineCore pid=101) INFO 03-28 00:36:40 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) INFO 03-28 00:36:40 [api_server.py:576] Supported tasks: ['generate']
tunas@MINI-Gaming-G1:~$ kubectl logs -l app=vllm-server --tail 300
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]        █     █     █▄   ▄█
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]  ▄▄ ▄█ █     █     █ ▀▄▀ █  version 0.18.0
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]   █▄█▀ █     █     █     █  model   Qwen/Qwen2.5-3B-Instruct
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]    ▀▀  ▀▀▀▀▀ ▀▀▀▀▀ ▀     ▀
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:297]
(APIServer pid=1) INFO 03-28 00:34:01 [utils.py:233] non-default args: {'model_tag': 'Qwen/Qwen2.5-3B-Instruct', 'model': 'Qwen/Qwen2.5-3B-Instruct', 'max_model_len': 4096, 'quantization': 'bitsandbytes', 'enforce_eager': True, 'load_format': 'bitsandbytes', 'gpu_memory_utilization': 0.8}
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PORT
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_SERVICE_HOST
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_PROTO
(APIServer pid=1) WARNING 03-28 00:34:01 [envs.py:1717] Unknown vLLM environment variable detected: VLLM_SERVICE_PORT_8000_TCP_ADDR
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:533] Resolved architecture: Qwen2ForCausalLM
(APIServer pid=1) INFO 03-28 00:34:07 [model.py:1582] Using max model len 4096
(APIServer pid=1) INFO 03-28 00:34:07 [scheduler.py:231] Chunked prefill is enabled with max_num_batched_tokens=2048.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:754] Asynchronous scheduling is enabled.
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(APIServer pid=1) WARNING 03-28 00:34:07 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(APIServer pid=1) INFO 03-28 00:34:07 [vllm.py:964] Cudagraph is disabled under eager mode
(APIServer pid=1) INFO 03-28 00:34:07 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) WARNING 03-28 00:34:09 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [core.py:103] Initializing a V1 LLM engine (v0.18.0) with config: model='Qwen/Qwen2.5-3B-Instruct', speculative_config=None, tokenizer='Qwen/Qwen2.5-3B-Instruct', skip_tokenizer_init=False, tokenizer_mode=auto, revision=None, tokenizer_revision=None, trust_remote_code=False, dtype=torch.bfloat16, max_seq_len=4096, download_dir=None, load_format=bitsandbytes, tensor_parallel_size=1, pipeline_parallel_size=1, data_parallel_size=1, decode_context_parallel_size=1, dcp_comm_backend=ag_rs, disable_custom_all_reduce=False, quantization=bitsandbytes, enforce_eager=True, enable_return_routed_experts=False, kv_cache_dtype=auto, device_config=cuda, structured_outputs_config=StructuredOutputsConfig(backend='auto', disable_any_whitespace=False, disable_additional_properties=False, reasoning_parser='', reasoning_parser_plugin='', enable_in_reasoning=False), observability_config=ObservabilityConfig(show_hidden_metrics_for_version=None, otlp_traces_endpoint=None, collect_detailed_traces=None, kv_cache_metrics=False, kv_cache_metrics_sample=0.01, cudagraph_metrics=False, enable_layerwise_nvtx_tracing=False, enable_mfu_metrics=False, enable_mm_processor_stats=False, enable_logging_iteration_details=False), seed=0, served_model_name=Qwen/Qwen2.5-3B-Instruct, enable_prefix_caching=True, enable_chunked_prefill=True, pooler_config=None, compilation_config={'mode': <CompilationMode.NONE: 0>, 'debug_dump_path': None, 'cache_dir': '', 'compile_cache_save_format': 'binary', 'backend': 'inductor', 'custom_ops': ['all'], 'splitting_ops': [], 'compile_mm_encoder': False, 'compile_sizes': [], 'compile_ranges_endpoints': [2048], 'inductor_compile_config': {'enable_auto_functionalized_v2': False, 'combo_kernels': True, 'benchmark_combo_kernel': True}, 'inductor_passes': {}, 'cudagraph_mode': <CUDAGraphMode.NONE: 0>, 'cudagraph_num_of_warmups': 0, 'cudagraph_capture_sizes': [], 'cudagraph_copy_inputs': False, 'cudagraph_specialize_lora': True, 'use_inductor_graph_partition': False, 'pass_config': {'fuse_norm_quant': True, 'fuse_act_quant': True, 'fuse_attn_quant': False, 'enable_sp': False, 'fuse_gemm_comms': False, 'fuse_allreduce_rms': False}, 'max_cudagraph_capture_size': 0, 'dynamic_shapes_config': {'type': <DynamicShapesType.BACKED: 'backed'>, 'evaluate_guards': False, 'assume_32_bit_indexing': False}, 'local_cache_dir': None, 'fast_moe_cold_start': True, 'static_all_moe_layers': []}
(EngineCore pid=101) WARNING 03-28 00:34:14 [interface.py:525] Using 'pin_memory=False' as WSL is detected. This may slow down the performance.
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1395] world_size=1 rank=0 local_rank=0 distributed_init_method=tcp://10.244.0.70:46601 backend=nccl
(EngineCore pid=101) INFO 03-28 00:34:14 [parallel_state.py:1717] rank 0 in world size 1 is assigned as DP rank 0, PP rank 0, PCP rank 0, TP rank 0, EP rank N/A, EPLB rank N/A
(EngineCore pid=101) INFO 03-28 00:34:14 [gpu_model_runner.py:4481] Starting to load model Qwen/Qwen2.5-3B-Instruct...
(EngineCore pid=101) INFO 03-28 00:34:16 [cuda.py:317] Using FLASH_ATTN attention backend out of potential backends: ['FLASH_ATTN', 'FLASHINFER', 'TRITON_ATTN', 'FLEX_ATTENTION'].
(EngineCore pid=101) INFO 03-28 00:34:16 [flash_attn.py:598] Using FlashAttention version 2
(EngineCore pid=101) INFO 03-28 00:34:16 [bitsandbytes_loader.py:786] Loading weights with BitsAndBytes quantization. May take a while ...
(EngineCore pid=101) INFO 03-28 00:36:18 [weight_utils.py:574] Time spent downloading weights for Qwen/Qwen2.5-3B-Instruct: 122.387839 seconds
Loading safetensors checkpoint shards:   0% Completed | 0/2 [00:00<?, ?it/s]
Loading safetensors checkpoint shards:  50% Completed | 1/2 [00:06<00:06,  6.45s/it]
Loading safetensors checkpoint shards: 100% Completed | 2/2 [00:10<00:00,  5.08s/it]
Loading safetensors checkpoint shards: 100% Completed | 2/2 [00:10<00:00,  5.29s/it]
(EngineCore pid=101)
(EngineCore pid=101) INFO 03-28 00:36:29 [gpu_model_runner.py:4566] Model loading took 2.07 GiB memory and 134.839849 seconds
(EngineCore pid=101) INFO 03-28 00:36:39 [gpu_worker.py:456] Available KV cache memory: 3.75 GiB
(EngineCore pid=101) INFO 03-28 00:36:39 [kv_cache_utils.py:1316] GPU KV cache size: 109,264 tokens
(EngineCore pid=101) INFO 03-28 00:36:39 [kv_cache_utils.py:1321] Maximum concurrency for 4,096 tokens per request: 26.68x
(EngineCore pid=101) INFO 03-28 00:36:39 [core.py:281] init engine (profile, create kv cache, warmup model) took 9.49 seconds
(EngineCore pid=101) INFO 03-28 00:36:40 [vllm.py:754] Asynchronous scheduling is enabled.
(EngineCore pid=101) WARNING 03-28 00:36:40 [vllm.py:788] Enforce eager set, disabling torch.compile and CUDAGraphs. This is equivalent to setting -cc.mode=none -cc.cudagraph_mode=none
(EngineCore pid=101) WARNING 03-28 00:36:40 [vllm.py:799] Inductor compilation was disabled by user settings, optimizations settings that are only active during inductor compilation will be ignored.
(EngineCore pid=101) INFO 03-28 00:36:40 [vllm.py:964] Cudagraph is disabled under eager mode
(EngineCore pid=101) INFO 03-28 00:36:40 [compilation.py:289] Enabled custom fusions: norm_quant, act_quant
(APIServer pid=1) INFO 03-28 00:36:40 [api_server.py:576] Supported tasks: ['generate']
(APIServer pid=1) WARNING 03-28 00:36:40 [model.py:1376] Default vLLM sampling parameters have been overridden by the model's `generation_config.json`: `{'repetition_penalty': 1.05, 'temperature': 0.7, 'top_k': 20, 'top_p': 0.8}`. If this is not intended, please relaunch vLLM instance with `--generation-config vllm`.
(APIServer pid=1) INFO 03-28 00:36:42 [hf.py:320] Detected the chat template content format to be 'string'. You can set `--chat-template-content-format` to override this.
(APIServer pid=1) INFO 03-28 00:36:42 [api_server.py:580] Starting vLLM server on http://0.0.0.0:8000
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:37] Available routes are:
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /openapi.json, Methods: GET, HEAD
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /docs, Methods: GET, HEAD
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /docs/oauth2-redirect, Methods: GET, HEAD
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /redoc, Methods: GET, HEAD
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /tokenize, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /detokenize, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /load, Methods: GET
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /version, Methods: GET
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /health, Methods: GET
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /metrics, Methods: GET
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /v1/models, Methods: GET
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /ping, Methods: GET
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /ping, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /invocations, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /v1/chat/completions, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /v1/responses, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /v1/responses/{response_id}, Methods: GET
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /v1/responses/{response_id}/cancel, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /v1/completions, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /v1/messages, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /v1/messages/count_tokens, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /inference/v1/generate, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /scale_elastic_ep, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /is_scaling_elastic_ep, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /v1/chat/completions/render, Methods: POST
(APIServer pid=1) INFO 03-28 00:36:42 [launcher.py:46] Route: /v1/completions/render, Methods: POST
(APIServer pid=1) INFO:     Started server process [1]
(APIServer pid=1) INFO:     Waiting for application startup.
(APIServer pid=1) INFO:     Application startup complete.

tunas@MINI-Gaming-G1:~$ python3 query-rag-whisper.py

=== ANSWER ===
Rice is often served in round bowls. It can be prepared in various ways, such as plain, with sides like peanut sauce, or in different flavored broths. It's a staple food that is consumed by billions worldwide and has numerous cultural and culinary associations.
tunas@MINI-Gaming-G1:~$ python3 query-rag-whisper.py

=== ANSWER ===
Rice is often served in round bowls. It can be prepared in various ways, such as plain, with sauce, or seasoned. Its round shape helps it cook evenly and absorb flavors.
```
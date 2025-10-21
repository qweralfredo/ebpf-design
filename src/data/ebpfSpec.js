// Complete eBPF Program Types based on documentation
export const eBPFProgramTypes = {
  network: {
    name: "Network Program Types",
    programs: [
      {
        type: "BPF_PROG_TYPE_SOCKET_FILTER",
        description: "Socket packet filtering",
        context: "sk_buff",
        attachPoints: ["socket"],
        capabilities: ["packet filtering", "socket monitoring"]
      },
      {
        type: "BPF_PROG_TYPE_SCHED_CLS",
        description: "Traffic control classifier",
        context: "sk_buff",
        attachPoints: ["tc ingress", "tc egress"],
        capabilities: ["packet classification", "traffic shaping"]
      },
      {
        type: "BPF_PROG_TYPE_SCHED_ACT",
        description: "Traffic control action",
        context: "sk_buff",
        attachPoints: ["tc action"],
        capabilities: ["packet modification", "traffic action"]
      },
      {
        type: "BPF_PROG_TYPE_XDP",
        description: "eXpress Data Path",
        context: "xdp_md",
        attachPoints: ["network interface"],
        capabilities: ["high-performance packet processing", "DDOS mitigation", "load balancing"]
      },
      {
        type: "BPF_PROG_TYPE_SOCK_OPS",
        description: "Socket operations monitoring",
        context: "bpf_sock_ops",
        attachPoints: ["socket operations"],
        capabilities: ["socket state monitoring", "connection tracking"]
      },
      {
        type: "BPF_PROG_TYPE_SK_SKB",
        description: "Socket buffer redirection",
        context: "sk_buff",
        attachPoints: ["socket map"],
        capabilities: ["socket redirection", "load balancing"]
      },
      {
        type: "BPF_PROG_TYPE_SK_MSG",
        description: "Socket message processing",
        context: "sk_msg_md",
        attachPoints: ["socket message"],
        capabilities: ["message filtering", "protocol parsing"]
      },
      {
        type: "BPF_PROG_TYPE_SK_LOOKUP",
        description: "Socket lookup",
        context: "bpf_sk_lookup",
        attachPoints: ["socket lookup"],
        capabilities: ["custom socket selection", "load balancing"]
      },
      {
        type: "BPF_PROG_TYPE_SK_REUSEPORT",
        description: "Socket reuseport selection",
        context: "sk_reuseport_md",
        attachPoints: ["reuseport group"],
        capabilities: ["socket selection", "load distribution"]
      },
      {
        type: "BPF_PROG_TYPE_FLOW_DISSECTOR",
        description: "Flow dissection",
        context: "__sk_buff",
        attachPoints: ["flow dissector"],
        capabilities: ["packet parsing", "flow identification"]
      },
      {
        type: "BPF_PROG_TYPE_NETFILTER",
        description: "Netfilter integration",
        context: "bpf_nf_ctx",
        attachPoints: ["netfilter hooks"],
        capabilities: ["packet filtering", "connection tracking"]
      }
    ]
  },
  
  tracing: {
    name: "Tracing Program Types",
    programs: [
      {
        type: "BPF_PROG_TYPE_KPROBE",
        description: "Kernel probe",
        context: "pt_regs",
        attachPoints: ["kernel functions", "return probes"],
        capabilities: ["kernel function tracing", "dynamic instrumentation"]
      },
      {
        type: "BPF_PROG_TYPE_TRACEPOINT",
        description: "Static tracepoint",
        context: "tracepoint context",
        attachPoints: ["static tracepoints"],
        capabilities: ["static kernel tracing", "event monitoring"]
      },
      {
        type: "BPF_PROG_TYPE_PERF_EVENT",
        description: "Performance event sampling",
        context: "bpf_perf_event_data",
        attachPoints: ["perf events"],
        capabilities: ["performance monitoring", "profiling"]
      }
    ]
  },

  other: {
    name: "Other Program Types",
    programs: [
      {
        type: "BPF_PROG_TYPE_LSM",
        description: "Linux Security Module",
        context: "function arguments",
        attachPoints: ["LSM hooks"],
        capabilities: ["security policy", "access control", "audit"]
      },
      {
        type: "BPF_PROG_TYPE_STRUCT_OPS",
        description: "Struct operations",
        context: "kernel struct",
        attachPoints: ["kernel structures"],
        capabilities: ["kernel structure operations", "custom implementations"],
        subTypes: ["tcp_congestion_ops", "hid_bpf_ops", "sched_ext_ops", "Qdisc_ops"]
      }
    ]
  }
};

// eBPF Map Types (expanded version)
export const eBPFMapTypes = {
  generic: {
    name: "Generic Map Types",
    maps: [
      {
        type: "BPF_MAP_TYPE_HASH",
        description: "Hash table",
        keyType: "any",
        valueType: "any",
        features: ["O(1) lookup", "dynamic sizing", "concurrent access"]
      },
      {
        type: "BPF_MAP_TYPE_ARRAY",
        description: "Array map",
        keyType: "uint32",
        valueType: "any",
        features: ["O(1) lookup", "fixed size", "index-based access"]
      },
      {
        type: "BPF_MAP_TYPE_PERCPU_HASH",
        description: "Per-CPU hash table",
        keyType: "any", 
        valueType: "any",
        features: ["per-CPU storage", "no locks", "aggregation"]
      },
      {
        type: "BPF_MAP_TYPE_PERCPU_ARRAY",
        description: "Per-CPU array",
        keyType: "uint32",
        valueType: "any",
        features: ["per-CPU storage", "fixed size", "no locks"]
      },
      {
        type: "BPF_MAP_TYPE_LRU_HASH",
        description: "LRU hash table",
        keyType: "any",
        valueType: "any",
        features: ["LRU eviction", "bounded memory", "automatic cleanup"]
      }
    ]
  },
  streaming: {
    name: "Streaming Maps",
    maps: [
      {
        type: "BPF_MAP_TYPE_RINGBUF",
        description: "Ring buffer",
        keyType: "none",
        valueType: "any",
        features: ["single producer/consumer", "memory efficient", "ordering guarantees"]
      },
      {
        type: "BPF_MAP_TYPE_PERF_EVENT_ARRAY",
        description: "Performance event array",
        keyType: "uint32",
        valueType: "event_data",
        features: ["event streaming", "userspace notification", "per-CPU buffers"]
      }
    ]
  }
};

// Empty initial canvas - users start building from scratch
export const initialElements = {
  nodes: [],
  edges: []
};

// eBPF Helper Functions organized by category
export const eBPFHelperFunctions = {
  mapHelpers: {
    name: "Map Helpers",
    subcategories: {
      generic: {
        name: "Generic Map Helpers",
        functions: [
          "bpf_map_lookup_elem", "bpf_map_update_elem", "bpf_map_delete_elem",
          "bpf_for_each_map_elem", "bpf_map_lookup_percpu_elem", 
          "bpf_spin_lock", "bpf_spin_unlock"
        ]
      },
      perfEvent: {
        name: "Perf Event Array Helpers", 
        functions: [
          "bpf_perf_event_read", "bpf_perf_event_output", "bpf_perf_event_read_value",
          "bpf_skb_output", "bpf_xdp_output"
        ]
      },
      ringBuffer: {
        name: "Ring Buffer Helpers",
        functions: [
          "bpf_ringbuf_output", "bpf_ringbuf_reserve", "bpf_ringbuf_submit",
          "bpf_ringbuf_discard", "bpf_ringbuf_query"
        ]
      },
      storage: {
        name: "Storage Helpers",
        functions: [
          "bpf_sock_map_update", "bpf_sock_hash_update", "bpf_task_storage_get",
          "bpf_task_storage_delete", "bpf_sk_storage_get", "bpf_sk_storage_delete"
        ]
      }
    }
  },
  
  networkHelpers: {
    name: "Network Helpers",
    subcategories: {
      packet: {
        name: "Packet Manipulation",
        functions: [
          "bpf_skb_store_bytes", "bpf_skb_load_bytes", "bpf_skb_change_head",
          "bpf_skb_change_tail", "bpf_skb_adjust_room", "bpf_clone_redirect"
        ]
      },
      redirect: {
        name: "Redirect Helpers",
        functions: [
          "bpf_redirect", "bpf_redirect_map", "bpf_redirect_peer",
          "bpf_redirect_neigh", "bpf_msg_redirect_hash", "bpf_msg_redirect_map"
        ]
      }
    }
  },
  
  tracingHelpers: {
    name: "Tracing Helpers",
    subcategories: {
      tracing: {
        name: "Tracing Functions",
        functions: [
          "bpf_trace_printk", "bpf_printk", "bpf_get_current_pid_tgid",
          "bpf_get_current_uid_gid", "bpf_get_current_comm", "bpf_get_current_task"
        ]
      },
      probes: {
        name: "Probe Helpers",
        functions: [
          "bpf_probe_read", "bpf_probe_read_user", "bpf_probe_read_kernel",
          "bpf_probe_write_user", "bpf_override_return"
        ]
      }
    }
  }
};

// eBPF Concepts completos
export const eBPFConcepts = {
  maps: {
    name: "Maps",
    description: "Data structures for sharing data between eBPF programs and userspace",
    features: [
      "Key-value storage", "Concurrent access", "Persistent across program runs",
      "Communication mechanism", "State management", "Data aggregation"
    ],
    keyPoints: [
      "Essential for eBPF program state",
      "Bridge between kernel and userspace",
      "Multiple map types for different use cases"
    ]
  },
  
  verifier: {
    name: "Verifier",
    description: "Kernel component that ensures eBPF program safety",
    features: [
      "Static analysis", "Memory safety", "Bounds checking", "Termination guarantee",
      "Type safety", "Pointer validation", "Register tracking", "Branch analysis"
    ],
    keyPoints: [
      "Ensures program safety before execution",
      "Prevents kernel crashes and security issues",
      "Complex but essential for eBPF ecosystem"
    ]
  },

  functions: {
    name: "Functions",
    description: "Subroutines and function calls in eBPF programs",
    features: [
      "Function calls", "Stack management", "Argument passing", "Return values",
      "Tail calls", "Function pointers", "Inlining", "Static functions"
    ],
    keyPoints: [
      "Code modularity and reusability",
      "Limited call stack depth",
      "Tail calls for program chaining"
    ]
  },

  concurrency: {
    name: "Concurrency",
    description: "Handling concurrent execution in eBPF programs",
    features: [
      "Spinlocks", "Atomic operations", "Per-CPU data", "Lock-free algorithms",
      "Memory ordering", "Synchronization primitives"
    ],
    keyPoints: [
      "eBPF programs can run concurrently",
      "Per-CPU maps avoid locking",
      "Atomic operations for shared state"
    ]
  },

  tailCalls: {
    name: "Tail Calls",
    description: "Mechanism for chaining eBPF programs together",
    features: [
      "Program chaining", "Call without return", "Map-based dispatch",
      "Constant stack usage", "Dynamic program selection"
    ],
    keyPoints: [
      "Allows complex program architectures",
      "No stack growth with tail calls",
      "Maximum 32 tail calls in chain"
    ]
  }
};

// eBPF Libraries
export const eBPFLibraries = {
  libbpf: {
    name: "libbpf",
    description: "Main eBPF library for loading and managing programs",
    purpose: "Core eBPF library",
    maintainer: "Linux Kernel Community", 
    language: "C",
    keyFeatures: [
      "Program loading", "Map management", "CO-RE support", "BTF handling",
      "Auto-attachment", "Object lifecycle", "Error handling"
    ]
  },
  
  libxdp: {
    name: "libxdp", 
    description: "Library for XDP program management",
    purpose: "XDP program management",
    maintainer: "XDP Project",
    language: "C", 
    keyFeatures: [
      "XDP program loading", "Multi-program support", "AF_XDP integration",
      "Dispatcher management", "Program chaining", "Hardware offload"
    ]
  },

  bcc: {
    name: "BCC",
    description: "BPF Compiler Collection with Python/Lua bindings",
    purpose: "Rapid eBPF development",
    maintainer: "IO Visor Project",
    language: "Python/C++",
    keyFeatures: [
      "Python bindings", "Runtime compilation", "Built-in helpers",
      "Tracing tools", "Easy scripting", "LLVM backend"
    ]
  },

  aya: {
    name: "Aya",
    description: "Rust library for eBPF programming", 
    purpose: "Rust eBPF development",
    maintainer: "Aya Community",
    language: "Rust",
    keyFeatures: [
      "Memory safety", "Type safety", "Async support",
      "CO-RE support", "Cargo integration", "Modern tooling"
    ]
  }
};
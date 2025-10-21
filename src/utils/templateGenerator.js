// Template generators para diferentes tipos de programas eBPF

export const generateProgramTemplate = (programType, options = {}) => {
  const templates = {
    // Network Program Templates
    'BPF_PROG_TYPE_XDP': generateXDPTemplate,
    'BPF_PROG_TYPE_SOCKET_FILTER': generateSocketFilterTemplate,
    'BPF_PROG_TYPE_SCHED_CLS': generateSchedClsTemplate,
    'BPF_PROG_TYPE_SCHED_ACT': generateSchedActTemplate,
    'BPF_PROG_TYPE_SOCK_OPS': generateSockOpsTemplate,
    'BPF_PROG_TYPE_SK_SKB': generateSkSkbTemplate,
    'BPF_PROG_TYPE_SK_MSG': generateSkMsgTemplate,
    'BPF_PROG_TYPE_NETFILTER': generateNetfilterTemplate,
    
    // Tracing Program Templates  
    'BPF_PROG_TYPE_KPROBE': generateKprobeTemplate,
    'BPF_PROG_TYPE_TRACEPOINT': generateTracepointTemplate,
    'BPF_PROG_TYPE_PERF_EVENT': generatePerfEventTemplate,
    'BPF_PROG_TYPE_RAW_TRACEPOINT': generateRawTracepointTemplate,
    'BPF_PROG_TYPE_TRACING': generateTracingTemplate,
    
    // cGroup Program Templates
    'BPF_PROG_TYPE_CGROUP_SKB': generateCgroupSkbTemplate,
    'BPF_PROG_TYPE_CGROUP_SOCK': generateCgroupSockTemplate,
    'BPF_PROG_TYPE_CGROUP_DEVICE': generateCgroupDeviceTemplate,
    'BPF_PROG_TYPE_CGROUP_SOCK_ADDR': generateCgroupSockAddrTemplate,
    'BPF_PROG_TYPE_CGROUP_SOCKOPT': generateCgroupSockoptTemplate,
    'BPF_PROG_TYPE_CGROUP_SYSCTL': generateCgroupSysctlTemplate,
    
    // Light Weight Tunnel Templates
    'BPF_PROG_TYPE_LWT_IN': generateLwtInTemplate,
    'BPF_PROG_TYPE_LWT_OUT': generateLwtOutTemplate,
    'BPF_PROG_TYPE_LWT_XMIT': generateLwtXmitTemplate,
    'BPF_PROG_TYPE_LWT_SEG6LOCAL': generateLwtSeg6LocalTemplate,
    
    // Other Program Templates
    'BPF_PROG_TYPE_LSM': generateLsmTemplate,
    'BPF_PROG_TYPE_EXT': generateExtTemplate,
    'BPF_PROG_TYPE_STRUCT_OPS': generateStructOpsTemplate,
    'BPF_PROG_TYPE_SYSCALL': generateSyscallTemplate,
    'BPF_PROG_TYPE_LIRC_MODE2': generateLircTemplate
  };

  const generator = templates[programType];
  if (!generator) {
    throw new Error(`Template not found for program type: ${programType}`);
  }
  
  return generator(options);
};

// XDP Program Template
function generateXDPTemplate(options = {}) {
  const { 
    action = 'XDP_PASS',
    withMaps = true,
    withMetrics = false,
    withPacketParsing = false 
  } = options;

  return `// SPDX-License-Identifier: GPL-2.0
#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>
#include <linux/if_ether.h>
#include <linux/ip.h>
#include <linux/tcp.h>
#include <linux/udp.h>
#include <linux/in.h>

${withMaps ? `
// XDP statistics map
struct {
    __uint(type, BPF_MAP_TYPE_PERCPU_ARRAY);
    __type(key, __u32);
    __type(value, __u64);
    __uint(max_entries, 256);
} xdp_stats_map SEC(".maps");

// Packet counters
enum xdp_stats_keys {
    XDP_STATS_TOTAL = 0,
    XDP_STATS_PASS,
    XDP_STATS_DROP,
    XDP_STATS_ABORTED,
    XDP_STATS_TX,
    XDP_STATS_REDIRECT,
};
` : ''}

${withPacketParsing ? `
// Packet parsing helper
static __always_inline int parse_packet(struct xdp_md *ctx) {
    void *data_end = (void *)(long)ctx->data_end;
    void *data = (void *)(long)ctx->data;
    
    // Ethernet header
    struct ethhdr *eth = data;
    if (eth + 1 > data_end)
        return -1;
    
    // Check if IP packet
    if (eth->h_proto != __constant_htons(ETH_P_IP))
        return 0;
    
    // IP header
    struct iphdr *ip = data + sizeof(*eth);
    if (ip + 1 > data_end)
        return -1;
    
    // TCP/UDP parsing can be added here
    
    return 0;
}
` : ''}

${withMetrics ? `
// Update statistics
static __always_inline void update_stats(__u32 key) {
    __u64 *value = bpf_map_lookup_elem(&xdp_stats_map, &key);
    if (value)
        (*value)++;
}
` : ''}

SEC("xdp")
int xdp_prog(struct xdp_md *ctx) {
    ${withMetrics ? 'update_stats(XDP_STATS_TOTAL);' : ''}
    
    ${withPacketParsing ? `
    // Parse packet
    if (parse_packet(ctx) < 0) {
        ${withMetrics ? 'update_stats(XDP_STATS_ABORTED);' : ''}
        return XDP_ABORTED;
    }
    ` : ''}
    
    // Program logic here
    
    ${withMetrics ? `update_stats(XDP_STATS_${action.replace('XDP_', '')});` : ''}
    return ${action};
}

char _license[] SEC("license") = "GPL";`;
}

// Socket Filter Template
function generateSocketFilterTemplate(options = {}) {
  const { withMaps = true, filterType = 'all' } = options;
  
  return `// SPDX-License-Identifier: GPL-2.0
#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>
#include <linux/if_ether.h>
#include <linux/ip.h>

${withMaps ? `
// Packet statistics
struct {
    __uint(type, BPF_MAP_TYPE_HASH);
    __type(key, __u32);
    __type(value, __u64);
    __uint(max_entries, 1024);
} packet_stats SEC(".maps");
` : ''}

SEC("socket")
int socket_filter(struct __sk_buff *skb) {
    // Socket buffer processing
    __u32 protocol = skb->protocol;
    
    ${withMaps ? `
    // Update statistics
    __u64 *count = bpf_map_lookup_elem(&packet_stats, &protocol);
    if (count) {
        (*count)++;
    } else {
        __u64 init_val = 1;
        bpf_map_update_elem(&packet_stats, &protocol, &init_val, BPF_ANY);
    }
    ` : ''}
    
    // Filter logic based on type
    ${filterType === 'tcp' ? 'if (protocol != ETH_P_IP) return 0;' : ''}
    ${filterType === 'udp' ? 'if (protocol != ETH_P_IP) return 0;' : ''}
    
    return 1; // Accept packet
}

char _license[] SEC("license") = "GPL";`;
}

// Kprobe Template
function generateKprobeTemplate(options = {}) {
  const { 
    function_name = 'sys_openat',
    withMaps = true,
    withContext = true 
  } = options;
  
  return `// SPDX-License-Identifier: GPL-2.0
#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>
#include <linux/ptrace.h>

${withMaps ? `
// Event map for userspace communication
struct {
    __uint(type, BPF_MAP_TYPE_RINGBUF);
    __uint(max_entries, 256 * 1024);
} events SEC(".maps");

// Event structure
struct event {
    __u32 pid;
    __u32 tgid;
    char comm[16];
    ${withContext ? '__u64 args[6];' : ''}
};
` : ''}

SEC("kprobe/${function_name}")
int kprobe_${function_name.replace(/[^a-zA-Z0-9_]/g, '_')}(struct pt_regs *ctx) {
    ${withMaps ? `
    struct event *e;
    
    // Reserve space in ring buffer
    e = bpf_ringbuf_reserve(&events, sizeof(*e), 0);
    if (!e)
        return 0;
    
    // Get process information
    __u64 pid_tgid = bpf_get_current_pid_tgid();
    e->pid = pid_tgid;
    e->tgid = pid_tgid >> 32;
    bpf_get_current_comm(&e->comm, sizeof(e->comm));
    
    ${withContext ? `
    // Get function arguments
    e->args[0] = PT_REGS_PARM1(ctx);
    e->args[1] = PT_REGS_PARM2(ctx);
    e->args[2] = PT_REGS_PARM3(ctx);
    e->args[3] = PT_REGS_PARM4(ctx);
    e->args[4] = PT_REGS_PARM5(ctx);
    e->args[5] = PT_REGS_PARM6(ctx);
    ` : ''}
    
    // Submit event
    bpf_ringbuf_submit(e, 0);
    ` : ''}
    
    return 0;
}

SEC("kretprobe/${function_name}")
int kretprobe_${function_name.replace(/[^a-zA-Z0-9_]/g, '_')}(struct pt_regs *ctx) {
    // Return probe logic
    __s64 ret = PT_REGS_RC(ctx);
    
    ${withMaps ? `
    // Process return value
    // Add custom logic here
    ` : ''}
    
    return 0;
}

char _license[] SEC("license") = "GPL";`;
}

// Tracepoint Template
function generateTracepointTemplate(options = {}) {
  const { 
    tracepoint = 'syscalls/sys_enter_openat',
    withMaps = true 
  } = options;
  
  return `// SPDX-License-Identifier: GPL-2.0
#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>

${withMaps ? `
// Statistics map
struct {
    __uint(type, BPF_MAP_TYPE_HASH);
    __type(key, __u32);
    __type(value, __u64);
    __uint(max_entries, 1024);
} stats SEC(".maps");
` : ''}

// Tracepoint context structure (update based on actual tracepoint)
struct trace_event_raw_sys_enter {
    __u64 unused;
    __s32 nr;
    __u64 args[6];
};

SEC("tracepoint/${tracepoint}")
int trace_${tracepoint.replace(/[^a-zA-Z0-9_]/g, '_')}(struct trace_event_raw_sys_enter *ctx) {
    __u32 pid = bpf_get_current_pid_tgid();
    
    ${withMaps ? `
    // Update statistics
    __u64 *count = bpf_map_lookup_elem(&stats, &pid);
    if (count) {
        (*count)++;
    } else {
        __u64 init_val = 1;
        bpf_map_update_elem(&stats, &pid, &init_val, BPF_ANY);
    }
    ` : ''}
    
    // Process tracepoint data
    // Add custom logic here
    
    return 0;
}

char _license[] SEC("license") = "GPL";`;
}

// Placeholder templates for other program types
function generateSchedClsTemplate(options = {}) {
  return `// SPDX-License-Identifier: GPL-2.0
#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>
#include <linux/pkt_cls.h>

SEC("tc")
int tc_classifier(struct __sk_buff *skb) {
    // TC classifier logic
    return TC_ACT_OK;
}

char _license[] SEC("license") = "GPL";`;
}

function generateSchedActTemplate(options = {}) {
  return `// SPDX-License-Identifier: GPL-2.0
#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>
#include <linux/pkt_cls.h>

SEC("tc")
int tc_action(struct __sk_buff *skb) {
    // TC action logic
    return TC_ACT_OK;
}

char _license[] SEC("license") = "GPL";`;
}

function generatePerfEventTemplate(options = {}) {
  return `// SPDX-License-Identifier: GPL-2.0
#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>

SEC("perf_event")
int perf_event_prog(struct bpf_perf_event_data *ctx) {
    // Perf event processing
    return 0;
}

char _license[] SEC("license") = "GPL";`;
}

function generateCgroupSkbTemplate(options = {}) {
  const { direction = 'egress', withMaps = true } = options;
  
  return `// SPDX-License-Identifier: GPL-2.0
#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>
#include <linux/if_ether.h>

${withMaps ? `
// Traffic statistics per cgroup
struct {
    __uint(type, BPF_MAP_TYPE_CGROUP_STORAGE);
    __type(key, struct bpf_cgroup_storage_key);
    __type(value, __u64);
} traffic_stats SEC(".maps");
` : ''}

SEC("cgroup_skb/${direction}")
int cgroup_skb_${direction}(struct __sk_buff *skb) {
    ${withMaps ? `
    // Update traffic statistics
    __u64 *bytes = bpf_get_local_storage(&traffic_stats, 0);
    if (bytes)
        *bytes += skb->len;
    ` : ''}
    
    // cGroup networking policy
    // Add custom logic here
    
    return 1; // Allow packet
}

char _license[] SEC("license") = "GPL";`;
}

// Stub functions for other templates
function generateSockOpsTemplate() { return `// Sock Ops template - implement based on needs`; }
function generateSkSkbTemplate() { return `// SK SKB template - implement based on needs`; }
function generateSkMsgTemplate() { return `// SK MSG template - implement based on needs`; }
function generateNetfilterTemplate() { return `// Netfilter template - implement based on needs`; }
function generateRawTracepointTemplate() { return `// Raw Tracepoint template - implement based on needs`; }
function generateTracingTemplate() { return `// Tracing (fentry/fexit) template - implement based on needs`; }
function generateCgroupSockTemplate() { return `// cGroup Socket template - implement based on needs`; }
function generateCgroupDeviceTemplate() { return `// cGroup Device template - implement based on needs`; }
function generateCgroupSockAddrTemplate() { return `// cGroup Socket Address template - implement based on needs`; }
function generateCgroupSockoptTemplate() { return `// cGroup Sockopt template - implement based on needs`; }
function generateCgroupSysctlTemplate() { return `// cGroup Sysctl template - implement based on needs`; }
function generateLwtInTemplate() { return `// LWT Input template - implement based on needs`; }
function generateLwtOutTemplate() { return `// LWT Output template - implement based on needs`; }
function generateLwtXmitTemplate() { return `// LWT Transmit template - implement based on needs`; }
function generateLwtSeg6LocalTemplate() { return `// LWT Seg6Local template - implement based on needs`; }
function generateLsmTemplate() { return `// LSM template - implement based on needs`; }
function generateExtTemplate() { return `// Extension template - implement based on needs`; }
function generateStructOpsTemplate() { return `// Struct Ops template - implement based on needs`; }
function generateSyscallTemplate() { return `// Syscall template - implement based on needs`; }
function generateLircTemplate() { return `// LIRC template - implement based on needs`; }

// Map definition template generator
export const generateMapTemplate = (mapType, options = {}) => {
  const {
    name = 'my_map',
    keyType = '__u32',
    valueType = '__u64',
    maxEntries = 1024,
    flags = 0
  } = options;

  return `struct {
    __uint(type, ${mapType});
    __type(key, ${keyType});
    __type(value, ${valueType});
    __uint(max_entries, ${maxEntries});
    ${flags ? `__uint(map_flags, ${flags});` : ''}
} ${name} SEC(".maps");`;
};
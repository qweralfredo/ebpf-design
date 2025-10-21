/**
 * eBPF Code Generator
 * Converts a React Flow graph into valid C code for eBPF programs
 */

export class EBPFCodeGenerator {
  constructor() {
    this.includes = new Set();
    this.maps = new Map();
    this.helperFunctions = new Set();
    this.variables = new Set();
  }

  /**
   * Main function to generate C source code from nodes and edges
   */
  generateCSource(nodes, edges) {
    this.reset();
    
    // Find the entry point node
    const entryNode = nodes.find(node => node.type === 'attachment');
    if (!entryNode) {
      return this.generateError('No program entry point found. Add an Attachment node to define the program entry point.');
    }

    // Analyze the graph structure
    this.analyzeGraph(nodes, edges);

    // Generate code sections
    const includes = this.generateIncludes();
    const mapDefinitions = this.generateMapDefinitions();
    const helperDeclarations = this.generateHelperDeclarations();
    const mainFunction = this.generateMainFunction(entryNode, nodes, edges);
    const license = this.generateLicense();

    return [
      includes,
      mapDefinitions,
      helperDeclarations,
      mainFunction,
      license
    ].filter(Boolean).join('\n\n');
  }

  /**
   * Reset internal state for new generation
   */
  reset() {
    this.includes.clear();
    this.maps.clear();
    this.helperFunctions.clear();
    this.variables.clear();

    // Add basic includes
    this.includes.add('#include <linux/bpf.h>');
    this.includes.add('#include <bpf/bpf_helpers.h>');
    this.includes.add('#include <linux/if_ether.h>');
    this.includes.add('#include <linux/ip.h>');
    this.includes.add('#include <linux/tcp.h>');
    this.includes.add('#include <linux/udp.h>');
  }

  /**
   * Analyze the graph to determine required includes, maps, etc.
   */
  analyzeGraph(nodes, edges) {
    nodes.forEach(node => {
      switch (node.type) {
        case 'mapAction':
          this.analyzeMapAction(node);
          break;
        case 'conditional':
          this.analyzeConditional(node);
          break;
        case 'packet':
          this.analyzePacketAccess(node);
          break;
        case 'helper':
          this.analyzeHelper(node);
          break;
      }
    });
  }

  /**
   * Analyze map action nodes
   */
  analyzeMapAction(node) {
    const { mapName, actionType, keyType, valueType } = node.data;
    
    if (mapName && !this.maps.has(mapName)) {
      this.maps.set(mapName, {
        name: mapName,
        keyType: keyType || '__u32',
        valueType: valueType || '__u64',
        maxEntries: 1024,
        mapType: this.getMapTypeForAction(actionType)
      });
    }

    // Add helper functions based on action type
    switch (actionType) {
      case 'lookup':
        this.helperFunctions.add('bpf_map_lookup_elem');
        break;
      case 'update':
        this.helperFunctions.add('bpf_map_update_elem');
        break;
      case 'delete':
        this.helperFunctions.add('bpf_map_delete_elem');
        break;
      case 'lookup_and_delete':
        this.helperFunctions.add('bpf_map_lookup_and_delete_elem');
        break;
    }
  }

  /**
   * Analyze conditional nodes
   */
  analyzeConditional(node) {
    const { condition, conditionType } = node.data;
    
    if (conditionType === 'packet') {
      this.includes.add('#include <linux/pkt_cls.h>');
    }
  }

  /**
   * Analyze packet access nodes
   */
  analyzePacketAccess(node) {
    this.includes.add('#include <linux/skbuff.h>');
    this.helperFunctions.add('bpf_skb_load_bytes');
  }

  /**
   * Analyze helper function nodes
   */
  analyzeHelper(node) {
    const { helperName } = node.data;
    if (helperName) {
      this.helperFunctions.add(helperName);
    }
  }

  /**
   * Generate includes section
   */
  generateIncludes() {
    return Array.from(this.includes).sort().join('\n');
  }

  /**
   * Generate map definitions
   */
  generateMapDefinitions() {
    if (this.maps.size === 0) return '';

    const mapDefs = [];
    mapDefs.push('/* eBPF Map Definitions */');

    this.maps.forEach(map => {
      mapDefs.push(
        `struct {\n` +
        `    __uint(type, ${map.mapType});\n` +
        `    __type(key, ${map.keyType});\n` +
        `    __type(value, ${map.valueType});\n` +
        `    __uint(max_entries, ${map.maxEntries});\n` +
        `} ${map.name} SEC(".maps");`
      );
    });

    return mapDefs.join('\n\n');
  }

  /**
   * Generate helper function declarations (optional, for documentation)
   */
  generateHelperDeclarations() {
    if (this.helperFunctions.size === 0) return '';

    const helpers = [];
    helpers.push('/* eBPF Helper Functions Used */');
    
    this.helperFunctions.forEach(helper => {
      helpers.push(`// ${helper}`);
    });

    return helpers.join('\n');
  }

  /**
   * Generate the main program function
   */
  generateMainFunction(entryNode, nodes, edges) {
    const attachType = entryNode.data.attachType || 'XDP_RX';
    const secName = this.getSecName(attachType);
    const contextType = this.getContextType(attachType);
    const functionName = this.getFunctionName(attachType);

    let functionCode = [];
    functionCode.push(`/* Main eBPF Program Function */`);
    functionCode.push(`SEC("${secName}")`);
    functionCode.push(`int ${functionName}(${contextType} *ctx) {`);

    // Add verifier constraints comment
    functionCode.push(`    /* eBPF Verifier Constraints:`);
    functionCode.push(`     * - Stack limit: 512 bytes`);
    functionCode.push(`     * - No unbounded loops`);
    functionCode.push(`     * - All memory access must be bounds-checked`);
    functionCode.push(`     * - Return values must be valid for program type`);
    functionCode.push(`     */`);
    functionCode.push(``);

    // Add context validation
    functionCode.push(`    // Validate context pointer`);
    functionCode.push(`    if (!ctx) return -1;`);
    functionCode.push(``);

    // Generate variables for data flow
    this.generateVariableDeclarations(functionCode);

    // Traverse the graph starting from entry node
    const visited = new Set();
    this.generateNodeCode(entryNode, nodes, edges, functionCode, visited, '    ');

    // Default return if no explicit return found
    functionCode.push(`    // Default return - allow packet`);
    functionCode.push(`    return ${this.getDefaultReturn(attachType)};`);
    functionCode.push(`}`);

    return functionCode.join('\n');
  }

  /**
   * Generate variable declarations
   */
  generateVariableDeclarations(functionCode) {
    if (this.variables.size > 0) {
      functionCode.push(`    // Variable declarations`);
      this.variables.forEach(variable => {
        functionCode.push(`    ${variable};`);
      });
      functionCode.push(``);
    }
  }

  /**
   * Generate code for a specific node and traverse to connected nodes
   */
  generateNodeCode(node, nodes, edges, functionCode, visited, indent) {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    functionCode.push(`${indent}// Node: ${node.type} (${node.id})`);

    switch (node.type) {
      case 'attachment':
        // Entry point - just continue to next nodes
        break;
        
      case 'conditional':
        this.generateConditionalCode(node, nodes, edges, functionCode, visited, indent);
        return; // Conditional handles its own traversal
        
      case 'mapAction':
        this.generateMapActionCode(node, functionCode, indent);
        break;
        
      case 'return':
        this.generateReturnCode(node, functionCode, indent);
        return; // Return stops traversal
        
      default:
        functionCode.push(`${indent}// TODO: Implement ${node.type} node`);
    }

    // Find and traverse to next nodes
    const outgoingEdges = edges.filter(edge => edge.source === node.id);
    outgoingEdges.forEach(edge => {
      const nextNode = nodes.find(n => n.id === edge.target);
      if (nextNode) {
        this.generateNodeCode(nextNode, nodes, edges, functionCode, visited, indent);
      }
    });
  }

  /**
   * Generate conditional logic code
   */
  generateConditionalCode(node, nodes, edges, functionCode, visited, indent) {
    const { condition } = node.data;
    
    if (!condition) {
      functionCode.push(`${indent}// Empty condition - skipping`);
      return;
    }

    // Sanitize and validate condition
    const sanitizedCondition = this.sanitizeCondition(condition);
    
    functionCode.push(`${indent}if (${sanitizedCondition}) {`);
    
    // Find true branch
    const trueEdge = edges.find(edge => edge.source === node.id && edge.sourceHandle === 'true');
    if (trueEdge) {
      const trueNode = nodes.find(n => n.id === trueEdge.target);
      if (trueNode) {
        this.generateNodeCode(trueNode, nodes, edges, functionCode, visited, indent + '    ');
      }
    }
    
    functionCode.push(`${indent}} else {`);
    
    // Find false branch
    const falseEdge = edges.find(edge => edge.source === node.id && edge.sourceHandle === 'false');
    if (falseEdge) {
      const falseNode = nodes.find(n => n.id === falseEdge.target);
      if (falseNode) {
        this.generateNodeCode(falseNode, nodes, edges, functionCode, visited, indent + '    ');
      }
    }
    
    functionCode.push(`${indent}}`);
  }

  /**
   * Generate map action code
   */
  generateMapActionCode(node, functionCode, indent) {
    const { mapName, actionType, keyType } = node.data;
    
    if (!mapName) {
      functionCode.push(`${indent}// Map name not specified`);
      return;
    }

    switch (actionType) {
      case 'lookup':
        functionCode.push(`${indent}// Map lookup operation`);
        functionCode.push(`${indent}${keyType} key = 0; // TODO: Set appropriate key`);
        functionCode.push(`${indent}void *value = bpf_map_lookup_elem(&${mapName}, &key);`);
        functionCode.push(`${indent}if (!value) {`);
        functionCode.push(`${indent}    // Key not found in map`);
        functionCode.push(`${indent}    return -1;`);
        functionCode.push(`${indent}}`);
        break;
        
      case 'update':
        functionCode.push(`${indent}// Map update operation`);
        functionCode.push(`${indent}${keyType} key = 0; // TODO: Set appropriate key`);
        functionCode.push(`${indent}__u64 value = 1; // TODO: Set appropriate value`);
        functionCode.push(`${indent}int ret = bpf_map_update_elem(&${mapName}, &key, &value, BPF_ANY);`);
        functionCode.push(`${indent}if (ret < 0) {`);
        functionCode.push(`${indent}    // Update failed`);
        functionCode.push(`${indent}    return -1;`);
        functionCode.push(`${indent}}`);
        break;
        
      default:
        functionCode.push(`${indent}// TODO: Implement ${actionType} operation for map ${mapName}`);
    }
  }

  /**
   * Generate return statement code
   */
  generateReturnCode(node, functionCode, indent) {
    const { returnValue, returnType } = node.data;
    const value = returnValue || 'XDP_PASS';
    
    functionCode.push(`${indent}// Program return`);
    functionCode.push(`${indent}return ${value};`);
  }

  /**
   * Generate license section
   */
  generateLicense() {
    return '/* License */\nchar _license[] SEC("license") = "GPL";';
  }

  /**
   * Generate error message
   */
  generateError(message) {
    return `/*
 * eBPF Code Generation Error
 * ${message}
 * 
 * Please fix the issue and try again.
 */

#include <linux/bpf.h>
#include <bpf/bpf_helpers.h>

SEC("xdp")
int error_program(struct xdp_md *ctx) {
    // Error: ${message}
    return XDP_DROP;
}

char _license[] SEC("license") = "GPL";`;
  }

  // Helper methods

  getMapTypeForAction(actionType) {
    switch (actionType) {
      case 'peek':
      case 'pop':
      case 'push':
        return 'BPF_MAP_TYPE_QUEUE';
      default:
        return 'BPF_MAP_TYPE_HASH';
    }
  }

  getSecName(attachType) {
    const secMap = {
      'XDP_RX': 'xdp',
      'XDP_TX': 'xdp',
      'TC_INGRESS': 'tc',
      'TC_EGRESS': 'tc',
      'KPROBE': 'kprobe',
      'KRETPROBE': 'kretprobe',
      'TRACEPOINT': 'tracepoint',
      'SOCKET_FILTER': 'socket'
    };
    return secMap[attachType] || 'xdp';
  }

  getContextType(attachType) {
    const contextMap = {
      'XDP_RX': 'struct xdp_md',
      'XDP_TX': 'struct xdp_md',
      'TC_INGRESS': 'struct __sk_buff',
      'TC_EGRESS': 'struct __sk_buff',
      'KPROBE': 'struct pt_regs',
      'KRETPROBE': 'struct pt_regs',
      'TRACEPOINT': 'void',
      'SOCKET_FILTER': 'struct __sk_buff'
    };
    return contextMap[attachType] || 'struct xdp_md';
  }

  getFunctionName(attachType) {
    return attachType.toLowerCase().replace(/_/g, '_') + '_program';
  }

  getDefaultReturn(attachType) {
    const returnMap = {
      'XDP_RX': 'XDP_PASS',
      'XDP_TX': 'XDP_PASS',
      'TC_INGRESS': 'TC_ACT_OK',
      'TC_EGRESS': 'TC_ACT_OK',
      'KPROBE': '0',
      'KRETPROBE': '0',
      'TRACEPOINT': '0',
      'SOCKET_FILTER': '0'
    };
    return returnMap[attachType] || 'XDP_PASS';
  }

  sanitizeCondition(condition) {
    // Basic sanitization - in a real implementation, this would be more sophisticated
    // Remove potentially dangerous constructs and validate syntax
    
    // For now, just return the condition with basic validation
    if (condition.includes('while') || condition.includes('for')) {
      return '0 /* LOOPS NOT ALLOWED IN EBPF */';
    }
    
    // Replace common patterns with eBPF-safe equivalents
    return condition
      .replace(/packet\.protocol/g, 'protocol')
      .replace(/packet\.src_port/g, 'src_port')
      .replace(/packet\.dst_port/g, 'dst_port')
      .replace(/packet\.length/g, 'data_end - data');
  }
}

// Export a default instance
export const ebpfGenerator = new EBPFCodeGenerator();

// Export the main function for convenience
export function generateCSource(nodes, edges) {
  return ebpfGenerator.generateCSource(nodes, edges);
}
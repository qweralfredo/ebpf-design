import React, { useState } from 'react';
import { X, Brain, Wand2, Check, RefreshCw, Save } from 'lucide-react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const AIFlowBuilder = ({ isOpen, onClose, onApplyFlow, onSaveAsTemplate }) => {
  const [step, setStep] = useState('prompt'); // prompt, preview, confirmed
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedFlow, setGeneratedFlow] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flowDescription, setFlowDescription] = useState('');
  const [suggestedName, setSuggestedName] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState('');

  // AI Simulation - converts prompt into eBPF flow
  const generateFlowFromPrompt = async (prompt) => {
    setIsGenerating(true);
    
    // Simulates AI delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Basic prompt analysis to generate appropriate flow
    const analysis = analyzePrompt(prompt);
    const flow = createFlowFromAnalysis(analysis);
    
    setGeneratedFlow(flow);
    setFlowDescription(analysis.description);
    setSuggestedName(analysis.name);
    setSuggestedCategory(analysis.category);
    setIsGenerating(false);
    setStep('preview');
  };

  // Intelligent prompt analysis
  const analyzePrompt = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Common pattern detection
    if (lowerPrompt.includes('network') || lowerPrompt.includes('tcp') || lowerPrompt.includes('http')) {
      return {
        type: 'network',
        name: 'Network Monitor',
        category: 'Networking (XDP & TC)',
        description: 'Network traffic monitor with TCP/HTTP protocol analysis and performance metrics.',
        keywords: ['network', 'tcp', 'http', 'traffic']
      };
    }
    
    if (lowerPrompt.includes('security') || lowerPrompt.includes('syscall') || lowerPrompt.includes('malware')) {
      return {
        type: 'security',
        name: 'Security Monitor',
        category: 'Security (Runtime & Kernel)',
        description: 'Security monitoring system with suspicious syscall detection and behavioral analysis.',
        keywords: ['security', 'syscall', 'malware', 'detection']
      };
    }
    
    if (lowerPrompt.includes('process') || lowerPrompt.includes('cpu') || lowerPrompt.includes('memory')) {
      return {
        type: 'performance',
        name: 'Performance Monitor',
        category: 'Observability & Performance Analysis',
        description: 'Process performance monitor with CPU, memory and system resource analysis.',
        keywords: ['process', 'cpu', 'memory', 'performance']
      };
    }
    
    if (lowerPrompt.includes('file') || lowerPrompt.includes('filesystem') || lowerPrompt.includes('io')) {
      return {
        type: 'filesystem',
        name: 'File System Monitor',
        category: 'File Systems & Storage',
        description: 'File system operations monitor with I/O analysis and file access tracking.',
        keywords: ['file', 'filesystem', 'io', 'storage']
      };
    }
    
    // Generic default
    return {
      type: 'generic',
      name: 'Custom eBPF Monitor',
      category: 'System Tools & Administration',
      description: 'Custom monitor based on requirements specified in the prompt.',
      keywords: ['custom', 'monitor', 'ebpf']
    };
  };

  // Creates flow structure based on analysis
  const createFlowFromAnalysis = (analysis) => {
    const baseNodes = [
      {
        id: 'kernel-1',
        type: 'kernel',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Kernel Space',
          description: 'Kernel space execution context'
        }
      },
      {
        id: 'userspace-1',
        type: 'userspace',
        position: { x: 400, y: 100 },
        data: { 
          label: 'User Space',
          description: 'User space application context'
        }
      }
    ];

    const baseEdges = [
      {
        id: 'e1-2',
        source: 'kernel-1',
        target: 'userspace-1',
        type: 'smoothstep',
        animated: true,
        label: 'Data Flow'
      }
    ];

    // Adds specific nodes based on type
    switch (analysis.type) {
      case 'network':
        return {
          nodes: [
            ...baseNodes,
            {
              id: 'xdp-1',
              type: 'ebpf',
              position: { x: 100, y: 200 },
              data: { 
                label: 'XDP Program',
                description: 'High-performance packet processing',
                category: 'Network'
              }
            },
            {
              id: 'tc-1',
              type: 'ebpf',
              position: { x: 250, y: 200 },
              data: { 
                label: 'TC Program',
                description: 'Traffic control and shaping',
                category: 'Network'
              }
            },
            {
              id: 'metrics-1',
              type: 'userspace',
              position: { x: 400, y: 200 },
              data: { 
                label: 'Metrics Collector',
                description: 'Network metrics aggregation'
              }
            }
          ],
          edges: [
            ...baseEdges,
            { id: 'e-xdp', source: 'kernel-1', target: 'xdp-1', animated: true },
            { id: 'e-tc', source: 'kernel-1', target: 'tc-1', animated: true },
            { id: 'e-metrics', source: 'tc-1', target: 'metrics-1', animated: true }
          ]
        };

      case 'security':
        return {
          nodes: [
            ...baseNodes,
            {
              id: 'tracepoint-1',
              type: 'ebpf',
              position: { x: 100, y: 200 },
              data: { 
                label: 'Syscall Tracer',
                description: 'Monitor system calls',
                category: 'Security'
              }
            },
            {
              id: 'kprobe-1',
              type: 'ebpf',
              position: { x: 250, y: 200 },
              data: { 
                label: 'Security Probe',
                description: 'Behavioral analysis',
                category: 'Security'
              }
            },
            {
              id: 'alert-1',
              type: 'userspace',
              position: { x: 400, y: 200 },
              data: { 
                label: 'Alert System',
                description: 'Security event notifications'
              }
            }
          ],
          edges: [
            ...baseEdges,
            { id: 'e-trace', source: 'kernel-1', target: 'tracepoint-1', animated: true },
            { id: 'e-probe', source: 'kernel-1', target: 'kprobe-1', animated: true },
            { id: 'e-alert', source: 'kprobe-1', target: 'alert-1', animated: true }
          ]
        };

      case 'performance':
        return {
          nodes: [
            ...baseNodes,
            {
              id: 'perf-1',
              type: 'ebpf',
              position: { x: 100, y: 200 },
              data: { 
                label: 'CPU Profiler',
                description: 'CPU usage monitoring',
                category: 'Performance'
              }
            },
            {
              id: 'memory-1',
              type: 'ebpf',
              position: { x: 250, y: 200 },
              data: { 
                label: 'Memory Tracer',
                description: 'Memory allocation tracking',
                category: 'Performance'
              }
            },
            {
              id: 'dashboard-1',
              type: 'userspace',
              position: { x: 400, y: 200 },
              data: { 
                label: 'Performance Dashboard',
                description: 'Real-time performance metrics'
              }
            }
          ],
          edges: [
            ...baseEdges,
            { id: 'e-cpu', source: 'kernel-1', target: 'perf-1', animated: true },
            { id: 'e-mem', source: 'kernel-1', target: 'memory-1', animated: true },
            { id: 'e-dash', source: 'memory-1', target: 'dashboard-1', animated: true }
          ]
        };

      case 'filesystem':
        return {
          nodes: [
            ...baseNodes,
            {
              id: 'fs-1',
              type: 'ebpf',
              position: { x: 100, y: 200 },
              data: { 
                label: 'File Operations',
                description: 'Monitor file system calls',
                category: 'FileSystem'
              }
            },
            {
              id: 'io-1',
              type: 'ebpf',
              position: { x: 250, y: 200 },
              data: { 
                label: 'I/O Tracer',
                description: 'Track I/O operations',
                category: 'FileSystem'
              }
            },
            {
              id: 'log-1',
              type: 'userspace',
              position: { x: 400, y: 200 },
              data: { 
                label: 'Access Logger',
                description: 'File access logging'
              }
            }
          ],
          edges: [
            ...baseEdges,
            { id: 'e-fs', source: 'kernel-1', target: 'fs-1', animated: true },
            { id: 'e-io', source: 'kernel-1', target: 'io-1', animated: true },
            { id: 'e-log', source: 'io-1', target: 'log-1', animated: true }
          ]
        };

      default:
        return { nodes: baseNodes, edges: baseEdges };
    }
  };

  const handleGenerate = () => {
    if (!userPrompt.trim()) return;
    generateFlowFromPrompt(userPrompt);
  };

  const handleRefine = () => {
    setStep('prompt');
  };

  const handleConfirm = () => {
    onApplyFlow(generatedFlow);
    setStep('confirmed');
  };

  const handleSaveAsTemplate = () => {
    const template = {
      id: `ai_generated_${Date.now()}`,
      name: suggestedName,
      category: suggestedCategory,
      description: flowDescription,
      tags: ['ai-generated', 'custom'],
      software: ['eBPF', 'Custom'],
      nodes: generatedFlow.nodes,
      edges: generatedFlow.edges,
      createdAt: new Date().toISOString(),
      isCustom: true
    };
    
    onSaveAsTemplate(template);
    alert('Template saved successfully!');
  };

  const handleReset = () => {
    setStep('prompt');
    setUserPrompt('');
    setGeneratedFlow(null);
    setFlowDescription('');
    setSuggestedName('');
    setSuggestedCategory('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Flow Builder</h2>
              <p className="text-gray-600">Create eBPF flows using artificial intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {step === 'prompt' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-purple-600" />
                  Describe your eBPF application
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe what you want to monitor or implement:
                    </label>
                    <textarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Ex: I want to monitor HTTP network traffic in real time, detect DDoS attacks, analyze process performance, trace file operations..."
                      className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for better results:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Mention the type of monitoring (network, security, performance, files)</li>
                      <li>• Specify protocols or systems (TCP, HTTP, syscalls, CPU, memory)</li>
                      <li>• Include the objective (alerts, metrics, logs, dashboards)</li>
                      <li>• Describe the use context (web server, security, DevOps)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-200 flex-shrink-0">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!userPrompt.trim() || isGenerating}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Generate Flow
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && generatedFlow && (
            <div className="h-full flex">
              {/* Preview do fluxo */}
              <div className="flex-1 relative">
                <div className="absolute inset-4 bg-gray-50 rounded-lg overflow-hidden">
                  <ReactFlow
                    nodes={generatedFlow.nodes}
                    edges={generatedFlow.edges}
                    fitView
                    attributionPosition="bottom-left"
                  >
                    <Background />
                    <Controls />
                    <MiniMap />
                  </ReactFlow>
                </div>
              </div>

              {/* Information and controls */}
              <div className="w-80 border-l bg-gray-50 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Generated Flow</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                      <input
                        value={suggestedName}
                        onChange={(e) => setSuggestedName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
                      <input
                        value={suggestedCategory}
                        onChange={(e) => setSuggestedCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                      <textarea
                        value={flowDescription}
                        onChange={(e) => setFlowDescription(e.target.value)}
                        className="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2">Flow Components:</h4>
                      <div className="max-h-32 overflow-y-auto">
                        <ul className="text-sm space-y-1">
                          {generatedFlow.nodes.map(node => (
                            <li key={node.id} className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                node.type === 'kernel' ? 'bg-red-500' :
                                node.type === 'ebpf' ? 'bg-blue-500' : 'bg-green-500'
                              }`}></div>
                              <span>{node.data.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 space-y-3">
                  <button
                    onClick={handleConfirm}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Confirm and Apply
                  </button>
                  
                  <button
                    onClick={handleSaveAsTemplate}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save as Template
                  </button>
                  
                  <button
                    onClick={handleRefine}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refine Prompt
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="h-full flex items-center justify-center overflow-y-auto p-6">
              <div className="text-center">
                <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Flow Applied Successfully!</h3>
                <p className="text-gray-600 mb-6">The eBPF flow has been loaded into the visual editor.</p>
                <div className="space-x-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create New Flow
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIFlowBuilder;
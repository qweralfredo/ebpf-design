import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Components
import ConfigPanel from '../components/ConfigPanel';
import Sidebar from '../components/Sidebar';
import TemplatesModal from '../components/TemplatesModal';
import AIFlowBuilder from '../components/AIFlowBuilder';
import SaveAsTemplateModal from '../components/SaveAsTemplateModal';
import DeployModal from '../components/DeployModal';
import AnnotationNode from '../nodes/AnnotationNode';
import ToolbarNode from '../nodes/ToolbarNode';
import ResizerNode from '../nodes/ResizerNode';
import CircleNode from '../nodes/CircleNode';
import TextInputNode from '../nodes/TextInputNode';
import CategoryNode from '../nodes/CategoryNode';
import ProgramTypeNode from '../nodes/ProgramTypeNode';
import MapTypeNode from '../nodes/MapTypeNode';
import HelperNode from '../components/HelperNode';
import LibraryNode from '../components/LibraryNode';
import ConceptNode from '../components/ConceptNode';
import ButtonEdge from '../edges/ButtonEdge';

// New eBPF-specific nodes
import AttachmentNode from '../components/NodeTypes/AttachmentNode';
import ConditionalNode from '../components/NodeTypes/ConditionalNode';
import MapActionNode from '../components/NodeTypes/MapActionNode';
import ReturnActionNode from '../components/NodeTypes/ReturnActionNode';
import PacketAccessNode from '../components/NodeTypes/PacketAccessNode';
import VariableNode from '../components/NodeTypes/VariableNode';
import CounterNode from '../components/NodeTypes/CounterNode';

// Data and Utils
import { 
  initialElements, 
  eBPFHelperFunctions, 
  eBPFConcepts, 
  eBPFLibraries 
} from '../data/ebpfSpec';
import { generateCSource } from '../utils/ebpfGenerator';

// Node types
const nodeTypes = {
  annotation: AnnotationNode,
  tools: ToolbarNode,
  resizer: ResizerNode,
  circle: CircleNode,
  textinput: TextInputNode,
  category: CategoryNode,
  programType: ProgramTypeNode,
  mapType: MapTypeNode,
  helper: HelperNode,
  library: LibraryNode,
  concept: ConceptNode,
  programTypeNode: ProgramTypeNode,
  mapTypeNode: MapTypeNode,
  // eBPF-specific nodes
  attachment: AttachmentNode,
  conditional: ConditionalNode,
  mapAction: MapActionNode,
  return: ReturnActionNode,
  packet: PacketAccessNode,
  variable: VariableNode,
  counter: CounterNode,
};

// Edge types
const edgeTypes = {
  button: ButtonEdge,
};

const EBPFFlowBuilder = () => {
  // Load layout preferences from localStorage
  const loadLayoutPreferences = () => {
    try {
      const saved = localStorage.getItem('ebpf-builder-layout');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load layout preferences:', error);
    }
    return {
      showSidebar: false,
      showConfig: false,
      showCodeViewer: false,
    };
  };

  // Save layout preferences to localStorage
  const saveLayoutPreferences = (preferences) => {
    try {
      localStorage.setItem('ebpf-builder-layout', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save layout preferences:', error);
    }
  };

  // Load workspace (nodes and edges) from localStorage
  const loadWorkspace = () => {
    try {
      const saved = localStorage.getItem('ebpf-builder-workspace');
      if (saved) {
        const workspace = JSON.parse(saved);
        return {
          nodes: workspace.nodes || initialElements.nodes,
          edges: workspace.edges || initialElements.edges,
        };
      }
    } catch (error) {
      console.warn('Failed to load workspace:', error);
    }
    return {
      nodes: initialElements.nodes,
      edges: initialElements.edges,
    };
  };

  // Save workspace to localStorage
  const saveWorkspace = (nodes, edges) => {
    try {
      localStorage.setItem('ebpf-builder-workspace', JSON.stringify({
        nodes,
        edges,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.warn('Failed to save workspace:', error);
    }
  };

  const initialLayoutPrefs = loadLayoutPreferences();
  const initialWorkspace = loadWorkspace();
  
  // Default viewport with smaller zoom
  const defaultViewport = { x: 0, y: 0, zoom: 0.5 };
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialWorkspace.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialWorkspace.edges);
  const [config, setConfig] = useState(null);
  const [showCodeViewer, setShowCodeViewer] = useState(initialLayoutPrefs.showCodeViewer);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showSidebar, setShowSidebar] = useState(initialLayoutPrefs.showSidebar);
  const [showConfig, setShowConfig] = useState(initialLayoutPrefs.showConfig);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAIBuilderOpen, setIsAIBuilderOpen] = useState(false);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);
  
  // Accordion states for toolbar sections
  const [toolbarSections, setToolbarSections] = useState({
    layout: true,
    actions: true,
    workspace: false
  });

  // Save layout preferences whenever they change
  useEffect(() => {
    saveLayoutPreferences({
      showSidebar,
      showConfig,
      showCodeViewer,
    });
  }, [showSidebar, showConfig, showCodeViewer]);

  // Save workspace whenever nodes or edges change
  useEffect(() => {
    // Debounce the save operation to avoid excessive localStorage writes
    const timeoutId = setTimeout(() => {
      saveWorkspace(nodes, edges);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges]);

  // Validation function for eBPF connections
  const isValidConnection = useCallback((connection) => {
    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);
    
    if (!sourceNode || !targetNode) return false;
    
    // Control flow connections (green handles)
    if (connection.sourceHandle?.includes('control-flow') || 
        connection.targetHandle?.includes('control-flow')) {
      // Most nodes can connect via control flow
      return true;
    }
    
    // Data connections (blue/purple handles)
    if (connection.sourceHandle?.includes('value') || 
        connection.targetHandle?.includes('key') ||
        connection.targetHandle?.includes('value')) {
      // Data type compatibility would be checked here
      return true;
    }
    
    // Conditional nodes have special outputs
    if (sourceNode.type === 'conditional') {
      if (connection.sourceHandle === 'true' || connection.sourceHandle === 'false') {
        return true;
      }
    }
    
    return true;
  }, [nodes]);

  const onConnect = useCallback((params) => {
    if (isValidConnection(params)) {
      setEdges((eds) => addEdge(params, eds));
    }
  }, [setEdges, isValidConnection]);

  const handleConfigChange = useCallback((newConfig) => {
    setConfig(newConfig);
    console.log('Configuration updated:', newConfig);
  }, []);

  const addHelperNode = useCallback(() => {
    const newNode = {
      id: `helper-${Date.now()}`,
      type: 'helper',
      position: { x: 100, y: 200 },
      data: { 
        title: 'eBPF Helper Functions',
        categories: eBPFHelperFunctions
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addLibraryNode = useCallback(() => {
    const newNode = {
      id: `library-${Date.now()}`,
      type: 'library', 
      position: { x: 400, y: 200 },
      data: { 
        title: 'eBPF Libraries',
        libraries: eBPFLibraries
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addConceptNode = useCallback(() => {
    const newNode = {
      id: `concept-${Date.now()}`,
      type: 'concept',
      position: { x: 700, y: 200 },
      data: { 
        title: 'eBPF Concepts',
        concepts: eBPFConcepts
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // Add node from sidebar
  const onAddNode = useCallback((nodeType) => {
    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position: { 
        x: Math.random() * 300 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: { 
        label: `${nodeType} node`,
        onUpdate: (nodeId, newData) => {
          setNodes((nds) => 
            nds.map((node) => 
              node.id === nodeId 
                ? { ...node, data: { ...node.data, ...newData } }
                : node
            )
          );
        }
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // Handle drag and drop from sidebar
  const onDrop = useCallback((event) => {
    event.preventDefault();
    
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const nodeType = event.dataTransfer.getData('application/reactflow');
    
    if (!nodeType) return;
    
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position,
      data: { 
        label: `${nodeType} node`,
        onUpdate: (nodeId, newData) => {
          setNodes((nds) => 
            nds.map((node) => 
              node.id === nodeId 
                ? { ...node, data: { ...node.data, ...newData } }
                : node
            )
          );
        }
      },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const generateCode = useCallback(() => {
    // Use the new eBPF code generator
    const code = generateCSource(nodes, edges);
    setGeneratedCode(code);
    setShowCodeViewer(true);
  }, [nodes, edges]);

  // Template functions
  const handleOpenTemplateModal = useCallback(() => {
    setIsTemplateModalOpen(true);
  }, []);

  const handleCloseTemplateModal = useCallback(() => {
    setIsTemplateModalOpen(false);
  }, []);

  const handleLoadTemplate = useCallback((template) => {
    if (template && template.initialNodes && template.initialEdges) {
      // Load template nodes and edges
      setNodes(template.initialNodes);
      setEdges(template.initialEdges);
      
      // Close modal
      setIsTemplateModalOpen(false);
      
      // Optional: Show notification or feedback
      console.log(`Template "${template.name}" loaded successfully`);
    }
  }, [setNodes, setEdges]);

  // AI Builder functions
  const handleOpenAIBuilder = useCallback(() => {
    setIsAIBuilderOpen(true);
  }, []);

  const handleCloseAIBuilder = useCallback(() => {
    setIsAIBuilderOpen(false);
  }, []);

  const handleApplyAIFlow = useCallback((flow) => {
    if (flow && flow.nodes && flow.edges) {
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setIsAIBuilderOpen(false);
      console.log('AI-generated flow applied successfully');
    }
  }, [setNodes, setEdges]);

  // Save as Template functions
  const handleOpenSaveTemplate = useCallback(() => {
    setIsSaveTemplateModalOpen(true);
  }, []);

  const handleCloseSaveTemplate = useCallback(() => {
    setIsSaveTemplateModalOpen(false);
  }, []);

  const handleSaveAsTemplate = useCallback((template) => {
    // Add to custom templates
    setCustomTemplates(prev => [...prev, template]);
    
    // Save to localStorage
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('ebpf-custom-templates') || '[]');
      savedTemplates.push(template);
      localStorage.setItem('ebpf-custom-templates', JSON.stringify(savedTemplates));
      console.log('Template saved successfully:', template.name);
    } catch (error) {
      console.warn('Failed to save template:', error);
    }
    
    setIsSaveTemplateModalOpen(false);
  }, []);

  // Load custom templates on component mount
  useEffect(() => {
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('ebpf-custom-templates') || '[]');
      setCustomTemplates(savedTemplates);
    } catch (error) {
      console.warn('Failed to load custom templates:', error);
    }
  }, []);

  // Deploy modal functions
  const handleOpenDeployModal = useCallback(() => {
    // Generate code before opening deploy modal
    if (nodes.length > 0) {
      const code = generateCSource(nodes, edges);
      setGeneratedCode(code);
    }
    setIsDeployModalOpen(true);
  }, [nodes, edges]);

  const handleCloseDeployModal = useCallback(() => {
    setIsDeployModalOpen(false);
  }, []);

  const toggleSection = useCallback((sectionName) => {
    setToolbarSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  }, []);

  const nodeClassName = (node) => node.type;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {showSidebar && <Sidebar onAddNode={onAddNode} />}

      {/* Configuration Panel */}
      {showConfig && <ConfigPanel onConfigChange={handleConfigChange} />}

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          isValidConnection={isValidConnection}
          defaultViewport={defaultViewport}
          attributionPosition="top-right"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          <MiniMap 
            nodeClassName={nodeClassName}
            nodeStrokeWidth={3}
            pannable
            zoomable
          />

          {/* Empty Canvas Message */}
          {nodes.length === 0 && (
            <Panel position="center" className="pointer-events-none">
              <div className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-md text-center border-2 border-dashed border-gray-300">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Empty Canvas
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start building your eBPF program by dragging nodes from the sidebar or clicking the add buttons.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Start with <strong>Program Entry</strong></span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Add <strong>Conditional Logic</strong></span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Use <strong>Map Operations</strong></span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onAddNode('attachment')}
                    className="pointer-events-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
                  >
                    🚀 Add Program Entry
                  </button>
                </div>
              </div>
            </Panel>
          )}
          
          {/* Action Panel */}
          <Panel position="top-right" className="space-y-2">
            <div className="bg-white rounded-lg shadow-lg p-3 space-y-2 max-w-xs">
              <h3 className="font-bold text-gray-800 text-sm">eBPF Builder</h3>
              
              {/* Layout Section */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('layout')}
                  className="w-full flex items-center justify-between p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
                >
                  <span>Layout Controls</span>
                  {toolbarSections.layout ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {toolbarSections.layout && (
                  <div className="border-t border-gray-200 p-2 space-y-2">
                    <button
                      onClick={() => setShowSidebar(!showSidebar)}
                      className="w-full px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                    >
                      {showSidebar ? 'Hide' : 'Show'} Palette
                    </button>
                    <button
                      onClick={() => setShowConfig(!showConfig)}
                      className="w-full px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs"
                    >
                      {showConfig ? 'Hide' : 'Show'} Config
                    </button>
                  </div>
                )}
              </div>

              {/* Actions Section */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('actions')}
                  className="w-full flex items-center justify-between p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
                >
                  <span>Actions</span>
                  {toolbarSections.actions ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {toolbarSections.actions && (
                  <div className="border-t border-gray-200 p-2 space-y-2">
                    <button
                      onClick={handleOpenDeployModal}
                      className="w-full px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-xs font-medium flex items-center justify-center space-x-1"
                      disabled={nodes.length === 0}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Deploy</span>
                    </button>

                    <button
                      onClick={handleOpenTemplateModal}
                      className="w-full px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-xs font-medium flex items-center justify-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Templates</span>
                    </button>

                    <button
                      onClick={handleOpenAIBuilder}
                      className="w-full px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs font-medium flex items-center justify-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>AI Builder</span>
                    </button>

                    <button
                      onClick={handleOpenSaveTemplate}
                      className="w-full px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium flex items-center justify-center space-x-1"
                      disabled={nodes.length === 0}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      <span>Save</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Workspace Section */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection('workspace')}
                  className="w-full flex items-center justify-between p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
                >
                  <span>Workspace</span>
                  {toolbarSections.workspace ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {toolbarSections.workspace && (
                  <div className="border-t border-gray-200 p-2 space-y-2">
                    <button
                      onClick={() => {
                        setNodes([]);
                        setEdges([]);
                      }}
                      className="w-full px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                    >
                      Clear Canvas
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Reset workspace? This will clear all nodes and saved data.')) {
                          setNodes([]);
                          setEdges([]);
                          localStorage.removeItem('ebpf-builder-workspace');
                          localStorage.removeItem('ebpf-builder-layout');
                        }
                      }}
                      className="w-full px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs"
                    >
                      Reset All
                    </button>
                    
                    <div className="pt-2 border-t border-gray-200 text-xs text-gray-600">
                      <div className="space-y-1">
                        <div>Nodes: {nodes.length}</div>
                        <div>Connections: {edges.length}</div>
                        <div>Entry Points: {nodes.filter(n => n.type === 'attachment').length}</div>
                        <div className="pt-1 border-t border-gray-300 mt-2">
                          <div className="text-green-600 text-xs">✓ Auto-save enabled</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Code Viewer Panel */}
      {showCodeViewer && (
        <div className="w-96 bg-gray-900 text-gray-100 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Generated Code</h3>
            <button
              onClick={() => setShowCodeViewer(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <pre className="text-sm bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code>{generatedCode}</code>
          </pre>
          
          <div className="mt-4 space-y-2">
            <button
              onClick={() => navigator.clipboard.writeText(generatedCode)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Copy to Clipboard
            </button>
            
            <button
              onClick={() => {
                const blob = new Blob([generatedCode], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'ebpf_program.c';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Download File
            </button>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={isTemplateModalOpen}
        onClose={handleCloseTemplateModal}
        onSelectTemplate={handleLoadTemplate}
      />

      {/* AI Flow Builder Modal */}
      <AIFlowBuilder
        isOpen={isAIBuilderOpen}
        onClose={handleCloseAIBuilder}
        onApplyFlow={handleApplyAIFlow}
        onSaveAsTemplate={handleSaveAsTemplate}
      />

      {/* Save as Template Modal */}
      <SaveAsTemplateModal
        isOpen={isSaveTemplateModalOpen}
        onClose={handleCloseSaveTemplate}
        onSave={handleSaveAsTemplate}
        currentFlow={{ nodes, edges }}
      />

      {/* Deploy Modal */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={handleCloseDeployModal}
        currentFlow={{ nodes, edges }}
        generatedCode={generatedCode}
      />
    </div>
  );
};

export default EBPFFlowBuilder;
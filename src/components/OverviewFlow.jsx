import React, { useCallback } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { initialElements } from '../data/ebpfSpec';
import FlowControls from './FlowControls';
import AnnotationNode from '../nodes/AnnotationNode';
import ToolbarNode from '../nodes/ToolbarNode';
import ResizerNode from '../nodes/ResizerNode';
import CircleNode from '../nodes/CircleNode';
import TextInputNode from '../nodes/TextInputNode';
import CategoryNode from '../nodes/CategoryNode';
import ProgramTypeNode from '../nodes/ProgramTypeNode';
import MapTypeNode from '../nodes/MapTypeNode';
import HelperNode from './HelperNode';
import LibraryNode from './LibraryNode';
import ConceptNode from './ConceptNode';
import ButtonEdge from '../edges/ButtonEdge';

// Define custom node types
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
};

// Define custom edge types
const edgeTypes = {
  button: ButtonEdge,
};

// Helper function for MiniMap node styling
const nodeClassName = (node) => node.type;

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialElements.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialElements.edges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onNodeClick = useCallback((event, node) => {
    console.log('Node clicked:', node);
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    console.log('Edge clicked:', edge);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="top-right"
        className="overview-flow"
      >
        <MiniMap 
          zoomable 
          pannable 
          nodeClassName={nodeClassName}
          position="bottom-right"
        />
        <Controls position="bottom-left" />
        <Background variant={BackgroundVariant.Dots} />
        
        {/* Custom Panel with Title */}
        <Panel position="top-left" className="welcome-panel">
          <div style={{ 
            background: 'white', 
            padding: '12px 16px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
              eBPF Script Generator
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
              Build complete eBPF programs with visual interface
            </p>
          </div>
        </Panel>

        {/* Flow Controls */}
        <FlowControls />
      </ReactFlow>
    </div>
  );
};

export default OverviewFlow;
import React, { useCallback, useState } from 'react';
import { useReactFlow, Panel } from '@xyflow/react';
import { eBPFProgramTypes, eBPFMapTypes } from '../data/ebpfSpec';
import { generateProgramTemplate } from '../utils/templateGenerator';
import CodeViewer from './CodeViewer';

const FlowControls = () => {
  const { 
    getNodes, 
    getEdges, 
    addNodes, 
    deleteElements, 
    fitView, 
    zoomIn, 
    zoomOut,
    setCenter,
    screenToFlowPosition 
  } = useReactFlow();

  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleExpandNetworkPrograms = useCallback(() => {
    const networkPrograms = eBPFProgramTypes.network.programs;
    const startY = 300;
    const spacing = 200;
    
    networkPrograms.forEach((program, index) => {
      const newNode = {
        id: `network-${program.type}-${Date.now()}-${index}`,
        type: 'programTypeNode',
        position: { x: 500 + (index * spacing), y: startY },
        data: { 
          label: program.type,
          programType: program
        },
      };
      addNodes(newNode);
    });
  }, [addNodes]);

  const handleExpandTracingPrograms = useCallback(() => {
    const tracingPrograms = eBPFProgramTypes.tracing.programs;
    const startY = 600;
    const spacing = 250;
    
    tracingPrograms.forEach((program, index) => {
      const newNode = {
        id: `tracing-${program.type}-${Date.now()}-${index}`,
        type: 'programTypeNode',
        position: { x: 500 + (index * spacing), y: startY },
        data: { 
          label: program.type,
          programType: program
        },
      };
      addNodes(newNode);
    });
  }, [addNodes]);

  const handleExpandMapTypes = useCallback(() => {
    // Expandir Generic Maps
    const genericMaps = eBPFMapTypes.generic.maps;
    const startY = 100;
    const spacing = 200;
    
    genericMaps.forEach((map, index) => {
      const newNode = {
        id: `generic-map-${map.type}-${Date.now()}-${index}`,
        type: 'mapTypeNode',
        position: { x: 800 + (index * 300), y: startY },
        data: map,
      };
      addNodes(newNode);
    });

    // Expandir Streaming Maps
    const streamingMaps = eBPFMapTypes.streaming.maps;
    const streamingStartY = 400;
    
    streamingMaps.forEach((map, index) => {
      const newNode = {
        id: `streaming-map-${map.type}-${Date.now()}-${index}`,
        type: 'mapTypeNode',
        position: { x: 800 + (index * 300), y: streamingStartY },
        data: map,
      };
      addNodes(newNode);
    });
  }, [addNodes]);

  const handleAddNode = useCallback(() => {
    const newNode = {
      id: `node-${Date.now()}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `New Node ${getNodes().length + 1}` },
      style: {
        background: '#10b981',
        color: 'white',
        border: '1px solid #059669',
        borderRadius: '8px',
      },
    };
    addNodes(newNode);
  }, [addNodes, getNodes]);

  const handleDeleteSelected = useCallback(() => {
    const nodes = getNodes().filter((node) => node.selected);
    const edges = getEdges().filter((edge) => edge.selected);
    deleteElements({ nodes, edges });
  }, [getNodes, getEdges, deleteElements]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 800 });
  }, [fitView]);

  const handleCenterFirstNode = useCallback(() => {
    const nodes = getNodes();
    if (nodes.length > 0) {
      const firstNode = nodes[0];
      setCenter(
        firstNode.position.x + (firstNode.width || 150) / 2,
        firstNode.position.y + (firstNode.height || 50) / 2,
        { zoom: 1.2, duration: 800 }
      );
    }
  }, [getNodes, setCenter]);

  const handleGenerateCode = useCallback(() => {
    try {
      // Generate XDP code as example
      const code = generateProgramTemplate('BPF_PROG_TYPE_XDP', {
        action: 'XDP_PASS',
        withMaps: true,
        withMetrics: true,
        withPacketParsing: true
      });
      
      setGeneratedCode(code);
      setShowCodeViewer(true);
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Error generating code: ' + error.message);
    }
  }, []);

  const handleAddNodeAtCenter = useCallback(() => {
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newNode = {
      id: `center-node-${Date.now()}`,
      position,
      data: { label: 'Center Node' },
      style: {
        background: '#3b82f6',
        color: 'white',
        border: '1px solid #2563eb',
        borderRadius: '8px',
      },
    };
    addNodes(newNode);
  }, [screenToFlowPosition, addNodes]);

  if (showCodeViewer) {
    return (
      <CodeViewer 
        code={generatedCode}
        onClose={() => setShowCodeViewer(false)}
        language="c"
      />
    );
  }

  return (
    <Panel position="top-right">
      <div style={{ 
        background: 'white', 
        padding: '12px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minWidth: '200px'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
          Flow Controls
        </h3>
        
        <button 
          onClick={handleExpandNetworkPrograms}
          style={{
            padding: '8px 12px',
            border: '1px solid #059669',
            borderRadius: '6px',
            background: '#d1fae5',
            color: '#059669',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Expand Network Programs
        </button>
        
        <button 
          onClick={handleExpandTracingPrograms}
          style={{
            padding: '8px 12px',
            border: '1px solid #dc2626',
            borderRadius: '6px',
            background: '#fef2f2',
            color: '#dc2626',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Expand Tracing Programs
        </button>
        
        <button 
          onClick={handleExpandMapTypes}
          style={{
            padding: '8px 12px',
            border: '1px solid #ea580c',
            borderRadius: '6px',
            background: '#fff7ed',
            color: '#ea580c',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Expand Map Types
        </button>
        
        <button 
          onClick={handleGenerateCode}
          style={{
            padding: '8px 12px',
            border: '1px solid #7c3aed',
            borderRadius: '6px',
            background: '#f3e8ff',
            color: '#7c3aed',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Generate XDP Code
        </button>
        
        <button 
          onClick={handleAddNode}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            background: '#f9fafb',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Add Random Node
        </button>
        
        <button 
          onClick={handleAddNodeAtCenter}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            background: '#f9fafb',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Add Node at Center
        </button>
        
        <button 
          onClick={handleDeleteSelected}
          style={{
            padding: '8px 12px',
            border: '1px solid #dc2626',
            borderRadius: '6px',
            background: '#fef2f2',
            color: '#dc2626',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Delete Selected
        </button>
        
        <div style={{ borderTop: '1px solid #e5e7eb', margin: '8px 0', paddingTop: '8px' }}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <button 
              onClick={zoomIn}
              style={{
                flex: 1,
                padding: '6px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: '#f9fafb',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Zoom +
            </button>
            <button 
              onClick={zoomOut}
              style={{
                flex: 1,
                padding: '6px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: '#f9fafb',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Zoom -
            </button>
          </div>
          
          <button 
            onClick={handleFitView}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              background: '#f9fafb',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Fit View
          </button>
          
          <button 
            onClick={handleCenterFirstNode}
            style={{
              width: '100%',
              padding: '6px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              background: '#f9fafb',
              cursor: 'pointer',
              fontSize: '12px',
              marginTop: '4px'
            }}
          >
            Center First Node
          </button>
        </div>
      </div>
    </Panel>
  );
};

export default FlowControls;
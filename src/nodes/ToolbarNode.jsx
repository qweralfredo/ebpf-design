import React, { useState } from 'react';
import { NodeToolbar, Position } from '@xyflow/react';

const ToolbarNode = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <NodeToolbar
        isVisible={isVisible}
        position={Position.Top}
        style={{
          background: '#374151',
          color: 'white',
          borderRadius: '6px',
          padding: '4px',
          display: 'flex',
          gap: '4px'
        }}
      >
        <button 
          style={{ 
            background: '#10b981', 
            border: 'none', 
            color: 'white', 
            padding: '4px 8px', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          onClick={() => console.log('Edit clicked')}
        >
          Edit
        </button>
        <button 
          style={{ 
            background: '#ef4444', 
            border: 'none', 
            color: 'white', 
            padding: '4px 8px', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          onClick={() => console.log('Delete clicked')}
        >
          Delete
        </button>
        <button 
          style={{ 
            background: '#3b82f6', 
            border: 'none', 
            color: 'white', 
            padding: '4px 8px', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          onClick={() => console.log('Copy clicked')}
        >
          Copy
        </button>
      </NodeToolbar>
      
      <div 
        style={{
          background: '#e5e7eb',
          border: '2px solid #9ca3af',
          borderRadius: '8px',
          padding: '12px',
          minWidth: '150px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          🔧 Toolbar Node
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {data.label || 'Hover to see toolbar'}
        </div>
      </div>
    </>
  );
};

export default ToolbarNode;
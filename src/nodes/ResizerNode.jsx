import React from 'react';
import { NodeResizer } from '@xyflow/react';

const ResizerNode = ({ data, selected }) => {
  return (
    <>
      <NodeResizer
        color="#3b82f6"
        isVisible={selected}
        minWidth={100}
        minHeight={60}
      />
      <div style={{
        background: '#dbeafe',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '12px',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#1e40af' }}>
          📏 Resizable Node
        </div>
        <div style={{ fontSize: '12px', color: '#3730a3', textAlign: 'center' }}>
          {data.label || 'Select this node to see resize handles'}
        </div>
      </div>
    </>
  );
};

export default ResizerNode;
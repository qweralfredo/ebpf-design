import React from 'react';
import { Handle, Position } from '@xyflow/react';

const CircleNode = ({ data }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#10b981' }}
      />
      <div style={{
        background: '#10b981',
        color: 'white',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '3px solid #059669',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '20px', marginBottom: '2px' }}>
          ⭕
        </div>
        <div style={{ fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>
          {data.label || 'Circle'}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#10b981' }}
      />
    </>
  );
};

export default CircleNode;
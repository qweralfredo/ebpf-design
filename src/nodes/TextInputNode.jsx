import React, { useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const TextInputNode = ({ data, id }) => {
  const [text, setText] = useState(data.label || 'Edit me');

  const onChange = useCallback((evt) => {
    setText(evt.target.value);
  }, []);

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#8b5cf6' }}
      />
      <div style={{
        background: '#f3f4f6',
        border: '2px solid #8b5cf6',
        borderRadius: '8px',
        padding: '12px',
        minWidth: '180px'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#7c3aed' }}>
          📝 Text Input Node
        </div>
        <input
          value={text}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '12px',
            outline: 'none',
            background: 'white'
          }}
          placeholder="Enter text..."
        />
        <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>
          Node ID: {id}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#8b5cf6' }}
      />
    </>
  );
};

export default TextInputNode;
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const ProgramTypeNode = ({ data, selected }) => {
  const { programType } = data;
  
  return (
    <div className={`p-4 border-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transition-all max-w-sm ${
      selected ? 'ring-4 ring-yellow-400' : ''
    }`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
      
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">🔧 {programType.type}</h3>
        <p className="text-sm opacity-90 mb-3">{programType.description}</p>
        
        <div className="bg-white/20 rounded p-2 mb-3">
          <div className="text-xs mb-1">
            <strong>Context:</strong> {programType.context}
          </div>
          <div className="text-xs">
            <strong>Attach Points:</strong> {programType.attachPoints.join(', ')}
          </div>
        </div>
        
        <div className="text-xs">
          <strong>Capabilities:</strong>
          <ul className="mt-1 list-disc list-inside">
            {programType.capabilities.map((cap, index) => (
              <li key={index} className="text-left">{cap}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProgramTypeNode;
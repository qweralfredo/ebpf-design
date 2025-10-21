import React from 'react';
import { Handle, Position } from '@xyflow/react';

const MapTypeNode = ({ data }) => {
  return (
    <div className="min-w-64 bg-orange-500 border-2 border-orange-600 rounded-lg shadow-lg">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      {/* Header */}
      <div className="bg-orange-600 text-white p-3 rounded-t-lg">
        <h3 className="font-bold text-sm">{data.type}</h3>
      </div>
      
      {/* Content */}
      <div className="p-4 text-white">
        <p className="text-sm mb-3 font-medium">{data.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-orange-700 px-2 py-1 rounded">Key:</span>
            <span className="text-xs">{data.keyType}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-orange-700 px-2 py-1 rounded">Value:</span>
            <span className="text-xs">{data.valueType}</span>
          </div>
        </div>
        
        {/* Features */}
        {data.features && data.features.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-semibold mb-1">Features:</p>
            <div className="flex flex-wrap gap-1">
              {data.features.map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-orange-400 text-orange-900 px-2 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

export default MapTypeNode;
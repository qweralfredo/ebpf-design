import React from 'react';
import { Handle, Position } from '@xyflow/react';

const CategoryNode = ({ data, selected }) => {
  return (
    <div className={`p-4 border-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transition-all ${
      selected ? 'ring-4 ring-yellow-400' : ''
    }`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-blue-500"
      />
      
      <div className="text-center">
        <h3 className="text-lg font-bold mb-1">{data.label}</h3>
        <p className="text-sm opacity-90 mb-2">{data.description || 'Select a category'}</p>
        {data.items && (
          <div className="bg-white/20 rounded px-2 py-1 text-xs">
            {data.items.length} items available
          </div>
        )}
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-xs bg-white/30 px-2 py-1 rounded">
          Click to expand
        </span>
      </div>
    </div>
  );
};

export default CategoryNode;
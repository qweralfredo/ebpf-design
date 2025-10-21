import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDownIcon, ChevronRightIcon, CodeBracketIcon } from '../utils/icons';

const HelperNode = ({ data, selected }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const toggleCategory = (categoryKey) => {
    setSelectedCategory(selectedCategory === categoryKey ? null : categoryKey);
  };

  const renderCategoryContent = (category) => {
    if (!category.subcategories) return null;

    return Object.entries(category.subcategories).map(([subKey, subcategory]) => (
      <div key={subKey} className="mb-3 p-2 bg-purple-50 rounded border">
        <h5 className="font-medium text-purple-800 mb-2 text-sm">
          {subcategory.name}
        </h5>
        <div className="grid grid-cols-1 gap-1">
          {subcategory.functions.map((func, idx) => (
            <div
              key={idx}
              className="px-2 py-1 bg-purple-100 rounded text-xs font-mono text-purple-900 hover:bg-purple-200 transition-colors cursor-pointer"
              title={`Helper function: ${func}`}
            >
              {func}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className={`
      bg-gradient-to-br from-purple-100 to-purple-200 
      border-2 rounded-lg shadow-lg p-3 min-w-[280px] max-w-[400px]
      transition-all duration-200 hover:shadow-xl
      ${selected ? 'border-purple-500 ring-2 ring-purple-300' : 'border-purple-300'}
    `}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#9333ea' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <CodeBracketIcon className="h-5 w-5 text-purple-600" />
          <h3 className="font-bold text-purple-800">
            {data.title || 'eBPF Helper Functions'}
          </h3>
        </div>
        <button
          onClick={toggleExpansion}
          className="p-1 hover:bg-purple-200 rounded transition-colors"
        >
          {expanded ? 
            <ChevronDownIcon className="h-4 w-4 text-purple-600" /> :
            <ChevronRightIcon className="h-4 w-4 text-purple-600" />
          }
        </button>
      </div>

      {/* Summary */}
      <div className="text-sm text-purple-700 mb-3">
        Helper functions available for eBPF programs
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="space-y-3">
          {/* Category Selection */}
          <div className="grid grid-cols-1 gap-2">
            {data.categories && Object.entries(data.categories).map(([categoryKey, category]) => (
              <div key={categoryKey}>
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className={`
                    w-full text-left px-3 py-2 rounded border transition-colors
                    ${selectedCategory === categoryKey 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.name}</span>
                    {selectedCategory === categoryKey ? 
                      <ChevronDownIcon className="h-4 w-4" /> :
                      <ChevronRightIcon className="h-4 w-4" />
                    }
                  </div>
                </button>
                
                {/* Category Content */}
                {selectedCategory === categoryKey && (
                  <div className="mt-2 p-3 bg-white rounded border border-purple-200">
                    {renderCategoryContent(category)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Function Count */}
          {data.categories && (
            <div className="text-xs text-purple-600 text-center pt-2 border-t border-purple-200">
              {Object.values(data.categories).reduce((total, category) => {
                if (!category.subcategories) return total;
                return total + Object.values(category.subcategories).reduce((subtotal, sub) => 
                  subtotal + (sub.functions ? sub.functions.length : 0), 0
                );
              }, 0)} helper functions available
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#9333ea' }}
      />
    </div>
  );
};

export default HelperNode;
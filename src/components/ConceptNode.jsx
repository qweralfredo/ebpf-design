import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDownIcon, ChevronRightIcon, AcademicCapIcon, LightBulbIcon } from '../utils/icons';

const ConceptNode = ({ data, selected }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(null);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const toggleConcept = (conceptKey) => {
    setSelectedConcept(selectedConcept === conceptKey ? null : conceptKey);
  };

  const renderConceptDetails = (concept) => {
    return (
      <div className="mt-2 p-3 bg-white rounded border border-red-200">
        <div className="space-y-3">
          {/* Description */}
          <div>
            <h5 className="font-medium text-red-800 mb-1">Description</h5>
            <p className="text-sm text-gray-700">{concept.description}</p>
          </div>

          {/* Features */}
          <div>
            <h5 className="font-medium text-red-800 mb-2">Features</h5>
            <div className="grid grid-cols-2 gap-1">
              {concept.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 bg-red-50 rounded text-xs text-red-900 border border-red-200 hover:bg-red-100 transition-colors"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Key Points */}
          <div>
            <h5 className="font-medium text-red-800 mb-2">Key Points</h5>
            <div className="space-y-1">
              {concept.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2 p-2 bg-red-50 rounded border border-red-200"
                >
                  <LightBulbIcon className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-800">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`
      bg-gradient-to-br from-red-100 to-red-200 
      border-2 rounded-lg shadow-lg p-3 min-w-[300px] max-w-[450px]
      transition-all duration-200 hover:shadow-xl
      ${selected ? 'border-red-500 ring-2 ring-red-300' : 'border-red-300'}
    `}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#dc2626' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <AcademicCapIcon className="h-5 w-5 text-red-600" />
          <h3 className="font-bold text-red-800">
            {data.title || 'eBPF Concepts'}
          </h3>
        </div>
        <button
          onClick={toggleExpansion}
          className="p-1 hover:bg-red-200 rounded transition-colors"
        >
          {expanded ? 
            <ChevronDownIcon className="h-4 w-4 text-red-600" /> :
            <ChevronRightIcon className="h-4 w-4 text-red-600" />
          }
        </button>
      </div>

      {/* Summary */}
      <div className="text-sm text-red-700 mb-3">
        Core concepts for understanding eBPF
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="space-y-3">
          {/* Concept Selection */}
          <div className="grid grid-cols-1 gap-2">
            {data.concepts && Object.entries(data.concepts).map(([conceptKey, concept]) => (
              <div key={conceptKey}>
                <button
                  onClick={() => toggleConcept(conceptKey)}
                  className={`
                    w-full text-left px-3 py-2 rounded border transition-colors
                    ${selectedConcept === conceptKey 
                      ? 'bg-red-600 text-white border-red-600' 
                      : 'bg-white text-red-700 border-red-300 hover:bg-red-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AcademicCapIcon className="h-4 w-4" />
                      <span className="font-medium">{concept.name}</span>
                    </div>
                    {selectedConcept === conceptKey ? 
                      <ChevronDownIcon className="h-4 w-4" /> :
                      <ChevronRightIcon className="h-4 w-4" />
                    }
                  </div>
                </button>
                
                {/* Concept Details */}
                {selectedConcept === conceptKey && renderConceptDetails(concept)}
              </div>
            ))}
          </div>

          {/* Concept Count */}
          {data.concepts && (
            <div className="text-xs text-red-600 text-center pt-2 border-t border-red-200">
              {Object.keys(data.concepts).length} concepts available
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#dc2626' }}
      />
    </div>
  );
};

export default ConceptNode;
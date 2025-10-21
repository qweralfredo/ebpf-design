import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDownIcon, ChevronRightIcon, BookOpenIcon, CodeBracketSquareIcon } from '../utils/icons';

const LibraryNode = ({ data, selected }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState(null);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const toggleLibrary = (libraryKey) => {
    setSelectedLibrary(selectedLibrary === libraryKey ? null : libraryKey);
  };

  const getLanguageColor = (language) => {
    const colors = {
      'C': 'bg-blue-100 text-blue-800',
      'Python/C++': 'bg-green-100 text-green-800',
      'Rust': 'bg-orange-100 text-orange-800',
      'JavaScript': 'bg-yellow-100 text-yellow-800'
    };
    return colors[language] || 'bg-gray-100 text-gray-800';
  };

  const renderLibraryDetails = (library) => {
    return (
      <div className="mt-2 p-3 bg-white rounded border border-cyan-200">
        <div className="space-y-3">
          {/* Description */}
          <div>
            <h5 className="font-medium text-cyan-800 mb-1">Description</h5>
            <p className="text-sm text-gray-700">{library.description}</p>
          </div>

          {/* Purpose & Maintainer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-cyan-800 mb-1">Purpose</h5>
              <p className="text-sm text-gray-700">{library.purpose}</p>
            </div>
            <div>
              <h5 className="font-medium text-cyan-800 mb-1">Maintainer</h5>
              <p className="text-sm text-gray-700">{library.maintainer}</p>
            </div>
          </div>

          {/* Language */}
          <div>
            <h5 className="font-medium text-cyan-800 mb-1">Language</h5>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getLanguageColor(library.language)}`}>
              {library.language}
            </span>
          </div>

          {/* Key Features */}
          <div>
            <h5 className="font-medium text-cyan-800 mb-2">Key Features</h5>
            <div className="grid grid-cols-2 gap-1">
              {library.keyFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1 bg-cyan-50 rounded text-xs text-cyan-900 border border-cyan-200"
                >
                  {feature}
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
      bg-gradient-to-br from-cyan-100 to-cyan-200 
      border-2 rounded-lg shadow-lg p-3 min-w-[300px] max-w-[450px]
      transition-all duration-200 hover:shadow-xl
      ${selected ? 'border-cyan-500 ring-2 ring-cyan-300' : 'border-cyan-300'}
    `}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#0891b2' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <BookOpenIcon className="h-5 w-5 text-cyan-600" />
          <h3 className="font-bold text-cyan-800">
            {data.title || 'eBPF Libraries'}
          </h3>
        </div>
        <button
          onClick={toggleExpansion}
          className="p-1 hover:bg-cyan-200 rounded transition-colors"
        >
          {expanded ? 
            <ChevronDownIcon className="h-4 w-4 text-cyan-600" /> :
            <ChevronRightIcon className="h-4 w-4 text-cyan-600" />
          }
        </button>
      </div>

      {/* Summary */}
      <div className="text-sm text-cyan-700 mb-3">
        Essential libraries for eBPF development
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="space-y-3">
          {/* Library Selection */}
          <div className="grid grid-cols-1 gap-2">
            {data.libraries && Object.entries(data.libraries).map(([libraryKey, library]) => (
              <div key={libraryKey}>
                <button
                  onClick={() => toggleLibrary(libraryKey)}
                  className={`
                    w-full text-left px-3 py-2 rounded border transition-colors
                    ${selectedLibrary === libraryKey 
                      ? 'bg-cyan-600 text-white border-cyan-600' 
                      : 'bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CodeBracketSquareIcon className="h-4 w-4" />
                      <span className="font-medium">{library.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getLanguageColor(library.language)}`}>
                        {library.language}
                      </span>
                    </div>
                    {selectedLibrary === libraryKey ? 
                      <ChevronDownIcon className="h-4 w-4" /> :
                      <ChevronRightIcon className="h-4 w-4" />
                    }
                  </div>
                </button>
                
                {/* Library Details */}
                {selectedLibrary === libraryKey && renderLibraryDetails(library)}
              </div>
            ))}
          </div>

          {/* Library Count */}
          {data.libraries && (
            <div className="text-xs text-cyan-600 text-center pt-2 border-t border-cyan-200">
              {Object.keys(data.libraries).length} libraries available
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#0891b2' }}
      />
    </div>
  );
};

export default LibraryNode;
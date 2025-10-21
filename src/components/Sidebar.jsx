import React, { memo, useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const Sidebar = memo(({ onAddNode }) => {
  // Load accordion state from localStorage
  const loadAccordionState = () => {
    try {
      const saved = localStorage.getItem('ebpf-sidebar-accordion');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load accordion state:', error);
    }
    return {
      'Program Flow': true, // Start with Program Flow expanded as it's most important
      'Control Flow': false,
      'Data Operations': false,
      'Network': false,
      'Kernel Helpers': false,
      'Monitoring': false
    };
  };

  // State for accordion sections
  const [expandedSections, setExpandedSections] = useState(loadAccordionState);

  // Save accordion state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ebpf-sidebar-accordion', JSON.stringify(expandedSections));
    } catch (error) {
      console.warn('Failed to save accordion state:', error);
    }
  }, [expandedSections]);

  const toggleSection = (category) => {
    setExpandedSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleAllSections = () => {
    const allExpanded = Object.values(expandedSections).every(value => value);
    const newState = {};
    categories.forEach(category => {
      newState[category] = !allExpanded;
    });
    setExpandedSections(newState);
  };
  const nodeTypes = [
    {
      type: 'attachment',
      title: 'Program Entry',
      description: 'Define eBPF program attachment point',
      icon: '🎯',
      color: 'bg-green-500',
      category: 'Program Flow'
    },
    {
      type: 'conditional',
      title: 'Conditional Logic',
      description: 'If/else branching logic',
      icon: '❓',
      color: 'bg-yellow-500',
      category: 'Control Flow'
    },
    {
      type: 'mapAction',
      title: 'Map Operation',
      description: 'Interact with eBPF maps',
      icon: '🗂️',
      color: 'bg-purple-500',
      category: 'Data Operations'
    },
    {
      type: 'return',
      title: 'Return Action',
      description: 'Program return with verdict',
      icon: '↩️',
      color: 'bg-blue-500',
      category: 'Program Flow'
    },
    {
      type: 'helper',
      title: 'Helper Function',
      description: 'Call eBPF helper function',
      icon: '🔧',
      color: 'bg-orange-500',
      category: 'Kernel Helpers'
    },
    {
      type: 'variable',
      title: 'Variable',
      description: 'Store and manipulate data',
      icon: '📦',
      color: 'bg-cyan-500',
      category: 'Data Operations'
    },
    {
      type: 'packet',
      title: 'Packet Access',
      description: 'Read/write packet data',
      icon: '📡',
      color: 'bg-red-500',
      category: 'Network'
    },
    {
      type: 'counter',
      title: 'Counter/Stats',
      description: 'Increment counters and statistics',
      icon: '📊',
      color: 'bg-indigo-500',
      category: 'Monitoring'
    }
  ];

  const categories = ['Program Flow', 'Control Flow', 'Data Operations', 'Network', 'Kernel Helpers', 'Monitoring'];

  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddClick = (nodeType) => {
    if (onAddNode) {
      onAddNode(nodeType);
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-800">eBPF Node Palette</h2>
          <button
            onClick={toggleAllSections}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Expand/Collapse All"
          >
            {Object.values(expandedSections).every(value => value) ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Drag nodes to canvas or click to add them
        </p>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 border-b border-blue-200">
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-2">🚀 Getting Started:</div>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Start with a <strong>Program Entry</strong> node to define attachment</li>
            <li>Add <strong>Conditional Logic</strong> for decision making</li>
            <li>Use <strong>Map Operations</strong> for data storage and retrieval</li>
            <li>Add <strong>Packet Access</strong> for network data manipulation</li>
            <li>End with a <strong>Return Action</strong> to define program behavior</li>
            <li>Connect nodes with handles to create program flow</li>
          </ol>
        </div>
      </div>

      {/* Empty Canvas Helper */}
      <div className="p-4 bg-green-50 border-b border-green-200">
        <div className="text-sm text-green-800">
          <div className="font-medium mb-2">🎯 Canvas is Empty!</div>
          <div className="text-xs text-green-700">
            The canvas starts clean. Drag your first node from below or click to add it directly to the canvas.
          </div>
        </div>
      </div>

      {/* Node Categories - Accordion */}
      {categories.map((category) => {
        const isExpanded = expandedSections[category];
        const categoryNodes = nodeTypes.filter((node) => node.category === category);
        
        return (
          <div key={category} className="border-b border-gray-100">
            {/* Category Header - Clickable */}
            <button
              onClick={() => toggleSection(category)}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-between group border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  {category}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full min-w-[24px] text-center">
                  {categoryNodes.length}
                </span>
                {isExpanded && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    expanded
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                  <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                </div>
              </div>
            </button>
            
            {/* Category Content - Collapsible */}
            <div className={`transition-all duration-300 ease-in-out ${
              isExpanded 
                ? 'max-h-screen opacity-100 visible' 
                : 'max-h-0 opacity-0 invisible'
            }`}>
              <div className={`p-2 space-y-2 transform transition-transform duration-300 ${
                isExpanded ? 'translate-y-0' : '-translate-y-2'
              }`}>
                {categoryNodes.map((node) => (
                  <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type)}
                    onClick={() => handleAddClick(node.type)}
                    className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-move bg-white group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${node.color} rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {node.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 mb-1">
                          {node.title}
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                          {node.description}
                        </div>
                      </div>
                    </div>

                    {/* Drag hint */}
                    <div className="mt-2 text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                      Drag to canvas or click to add
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Footer with Tips */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <div className="font-medium mb-2">💡 Tips:</div>
          <ul className="space-y-1">
            <li>• Connect green handles for control flow</li>
            <li>• Blue handles carry data values</li>
            <li>• Hover over nodes to see connection options</li>
            <li>• Right-click nodes for more options</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
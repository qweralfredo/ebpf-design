import React, { useState, useEffect } from 'react';
import templatesData from '../data/templates_100.json';

const TemplatesModal = ({ isOpen, onClose, onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customTemplates, setCustomTemplates] = useState([]);

  // Load custom templates from localStorage
  useEffect(() => {
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('ebpf-custom-templates') || '[]');
      setCustomTemplates(savedTemplates);
    } catch (error) {
      console.warn('Failed to load custom templates:', error);
    }
  }, [isOpen]); // Reload when modal opens

  if (!isOpen) return null;

  const handleTemplateSelect = (template) => {
    // Convert template format for compatibility
    const compatibleTemplate = {
      ...template,
      initialNodes: template.nodes || template.initialNodes || [],
      initialEdges: template.edges || template.initialEdges || []
    };
    onSelectTemplate(compatibleTemplate);
  };

  const getCategoryColor = (categoryKey) => {
    const colors = {
      'observability': 'bg-blue-100 text-blue-800',
      'networking': 'bg-green-100 text-green-800',
      'security': 'bg-red-100 text-red-800',
      'filesystem': 'bg-yellow-100 text-yellow-800',
      'runtime': 'bg-purple-100 text-purple-800',
      'containers': 'bg-indigo-100 text-indigo-800',
      'development': 'bg-pink-100 text-pink-800',
      'protocols': 'bg-cyan-100 text-cyan-800',
      'system': 'bg-orange-100 text-orange-800',
      'future': 'bg-gray-100 text-gray-800'
    };
    return colors[categoryKey] || 'bg-gray-100 text-gray-800';
  };

  const getFilteredTemplates = () => {
    // Combine built-in templates with custom templates
    const allTemplates = [
      ...templatesData.templates.map(t => ({...t, isBuiltIn: true})),
      ...customTemplates.map(t => ({...t, isCustom: true}))
    ];
    
    let filtered = allTemplates;
    
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'custom') {
        filtered = allTemplates.filter(template => template.isCustom);
      } else {
        filtered = allTemplates.filter(template => template.category === selectedCategory);
      }
    }
    
    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.software?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.tags && template.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }
    
    return filtered;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">eBPF Templates Library</h2>
              <p className="text-blue-100 mt-1">
                100+ templates for eBPF applications across 10 categories
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              title="Close Templates"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates, software, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="custom">🎯 Custom Templates ({customTemplates.length})</option>
                {Object.entries(templatesData.categories).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredTemplates().map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                {/* Template Header */}
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-800 leading-tight">
                        {template.name}
                      </h3>
                      {template.isCustom && (
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                          Custom
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      template.isCustom ? 'bg-purple-100 text-purple-800' : getCategoryColor(template.category)
                    }`}>
                      {template.isCustom ? 'Custom' : templatesData.categories[template.category]}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">
                    {template.description}
                  </p>
                  {template.software && (
                    <p className="text-xs text-blue-600 font-medium">
                      🔧 {template.software}
                    </p>
                  )}
                  {template.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{template.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Template Stats */}
                <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                      </svg>
                      {template.nodes?.length || template.initialNodes?.length || 0} Nodes
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {template.edges?.length || template.initialEdges?.length || 0} Edges
                    </span>
                  </div>
                </div>

                {/* Load Template Button */}
                <button
                  onClick={() => handleTemplateSelect(template)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center space-x-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>Load Template</span>
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {getFilteredTemplates().length === 0 && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Templates Found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No templates are available.'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {getFilteredTemplates().length} of {templatesData.templates.length} templates
              {selectedCategory !== 'all' && ` in ${templatesData.categories[selectedCategory]}`}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;
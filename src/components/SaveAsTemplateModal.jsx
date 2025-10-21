import React, { useState } from 'react';
import { X, Save, Tag, Folder, FileText, Hash } from 'lucide-react';

const SaveAsTemplateModal = ({ isOpen, onClose, onSave, currentFlow }) => {
  const [templateData, setTemplateData] = useState({
    name: '',
    category: 'System & Administration Tools',
    description: '',
    tags: '',
    software: ''
  });

  const categories = [
    'Observability & Performance Analysis',
    'Networking (XDP & TC)',
    'Security (Runtime & Kernel)',
    'Filesystem & Storage',
    'Runtime & Processes',
    'Container & Cloud Platforms',
    'Development & Build Tools',
    'Network & Application Protocols',
    'System & Administration Tools',
    'Future Projects & Concepts'
  ];

  const handleSave = () => {
    if (!templateData.name.trim() || !templateData.description.trim()) {
      alert('Name and description are required!');
      return;
    }

    const template = {
      id: `custom_${Date.now()}`,
      name: templateData.name.trim(),
      category: templateData.category,
      description: templateData.description.trim(),
      tags: templateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      software: templateData.software.split(',').map(soft => soft.trim()).filter(soft => soft),
      nodes: currentFlow.nodes || [],
      edges: currentFlow.edges || [],
      createdAt: new Date().toISOString(),
      isCustom: true,
      author: 'User'
    };

    onSave(template);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setTemplateData({
      name: '',
      category: 'System Tools & Administration',
      description: '',
      tags: '',
      software: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Save className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Save as Template</h2>
              <p className="text-gray-600">Convert your flow into a reusable template</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content (scrollable) */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Nome do Template */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Template Name *
            </label>
            <input
              type="text"
              value={templateData.name}
              onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
              placeholder="Ex: Advanced HTTP Network Monitor"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Folder className="w-4 h-4" />
              Category
            </label>
            <select
              value={templateData.category}
              onChange={(e) => setTemplateData({...templateData, category: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Description *
            </label>
            <textarea
              value={templateData.description}
              onChange={(e) => setTemplateData({...templateData, description: e.target.value})}
              placeholder="Describe what this template does, when to use it and which problems it solves..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4" />
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={templateData.tags}
              onChange={(e) => setTemplateData({...templateData, tags: e.target.value})}
              placeholder="Ex: network, http, monitoring, performance"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Software/Tecnologias */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              Software / Technologies (comma separated)
            </label>
            <input
              type="text"
              value={templateData.software}
              onChange={(e) => setTemplateData({...templateData, software: e.target.value})}
              placeholder="Ex: Nginx, Apache, Prometheus, Grafana"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Current Flow Information */}
          {currentFlow && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Current Flow Summary:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• <strong>Nodes:</strong> {currentFlow.nodes?.length || 0} components</p>
                <p>• <strong>Connections:</strong> {currentFlow.edges?.length || 0} links</p>
                <div className="mt-2">
                  <p><strong>Node types:</strong></p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Array.from(new Set(currentFlow.nodes?.map(node => node.type) || [])).map(type => (
                      <span 
                        key={type}
                        className={`px-2 py-1 rounded text-xs ${
                          type === 'kernel' ? 'bg-red-100 text-red-800' :
                          type === 'ebpf' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveAsTemplateModal;
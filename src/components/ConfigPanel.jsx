import React, { useState } from 'react';
import { 
  CogIcon, 
  CodeBracketIcon, 
  WrenchScrewdriverIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon
} from '../utils/icons';

const ConfigPanel = ({ onConfigChange }) => {
  const [config, setConfig] = useState({
    language: 'c',
    framework: 'libbpf',
    features: {
      coReSupport: true,
      btfGeneration: true,
      mapPinning: false,
      tailCalls: false,
      functionCalls: true,
      arrayMaps: true,
      hashMaps: true,
      ringBuffer: false,
      perfEvents: false
    },
    codeGeneration: {
      includeComments: true,
      includeErrorHandling: true,
      includeLogging: false,
      optimizeSize: false,
      debugMode: false
    }
  });

  const [expandedSections, setExpandedSections] = useState({
    language: true,
    features: false,
    codeGen: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateConfig = (newConfig) => {
    setConfig(newConfig);
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  };

  const handleLanguageChange = (language) => {
    const newConfig = { ...config, language };
    updateConfig(newConfig);
  };

  const handleFrameworkChange = (framework) => {
    const newConfig = { ...config, framework };
    updateConfig(newConfig);
  };

  const handleFeatureToggle = (feature) => {
    const newConfig = {
      ...config,
      features: {
        ...config.features,
        [feature]: !config.features[feature]
      }
    };
    updateConfig(newConfig);
  };

  const handleCodeGenToggle = (option) => {
    const newConfig = {
      ...config,
      codeGeneration: {
        ...config.codeGeneration,
        [option]: !config.codeGeneration[option]
      }
    };
    updateConfig(newConfig);
  };

  const languages = [
    { id: 'c', name: 'C', description: 'Traditional eBPF development' },
    { id: 'rust', name: 'Rust', description: 'Memory-safe eBPF with Aya' },
    { id: 'python', name: 'Python', description: 'Rapid prototyping with BCC' },
    { id: 'go', name: 'Go', description: 'Go bindings for eBPF' }
  ];

  const frameworks = {
    c: [
      { id: 'libbpf', name: 'libbpf', description: 'Standard eBPF library' },
      { id: 'bcc', name: 'BCC', description: 'BPF Compiler Collection' }
    ],
    rust: [
      { id: 'aya', name: 'Aya', description: 'Rust eBPF library' },
      { id: 'redbpf', name: 'RedBPF', description: 'Alternative Rust library' }
    ],
    python: [
      { id: 'bcc', name: 'BCC', description: 'Python BCC bindings' },
      { id: 'bpfcc', name: 'bpfcc', description: 'Enhanced BCC' }
    ],
    go: [
      { id: 'ebpf-go', name: 'ebpf-go', description: 'Pure Go eBPF library' },
      { id: 'gobpf', name: 'gobpf', description: 'Go BCC bindings' }
    ]
  };

  const featureDefinitions = {
    coReSupport: 'Compile Once, Run Everywhere support',
    btfGeneration: 'BTF (BPF Type Format) generation',
    mapPinning: 'Pin maps to filesystem',
    tailCalls: 'Enable tail call functionality',
    functionCalls: 'Support function calls',
    arrayMaps: 'Include array map types',
    hashMaps: 'Include hash map types',
    ringBuffer: 'Ring buffer support',
    perfEvents: 'Perf event arrays'
  };

  const codeGenDefinitions = {
    includeComments: 'Add explanatory comments',
    includeErrorHandling: 'Add error handling code',
    includeLogging: 'Add debug logging',
    optimizeSize: 'Optimize for code size',
    debugMode: 'Enable debug symbols'
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto h-full">
      <div className="flex items-center space-x-2 mb-6">
        <CogIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Configuration</h2>
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('language')}
          className="flex items-center justify-between w-full p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <CodeBracketIcon className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-700">Language & Framework</span>
          </div>
          {expandedSections.language ? 
            <ChevronDownIcon className="h-4 w-4 text-gray-600" /> :
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          }
        </button>

        {expandedSections.language && (
          <div className="mt-3 space-y-3">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programming Language
              </label>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageChange(lang.id)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      config.language === lang.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{lang.name}</div>
                        <div className="text-xs text-gray-600">{lang.description}</div>
                      </div>
                      {config.language === lang.id && (
                        <CheckIcon className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Framework Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Framework
              </label>
              <div className="space-y-2">
                {frameworks[config.language]?.map((framework) => (
                  <button
                    key={framework.id}
                    onClick={() => handleFrameworkChange(framework.id)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      config.framework === framework.id
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{framework.name}</div>
                        <div className="text-xs text-gray-600">{framework.description}</div>
                      </div>
                      {config.framework === framework.id && (
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* eBPF Features */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <WrenchScrewdriverIcon className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-700">eBPF Features</span>
          </div>
          {expandedSections.features ? 
            <ChevronDownIcon className="h-4 w-4 text-gray-600" /> :
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          }
        </button>

        {expandedSections.features && (
          <div className="mt-3 space-y-2">
            {Object.entries(config.features).map(([feature, enabled]) => (
              <label key={feature} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleFeatureToggle(feature)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">
                    {featureDefinitions[feature]}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Code Generation */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('codeGen')}
          className="flex items-center justify-between w-full p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <CodeBracketIcon className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-700">Code Generation</span>
          </div>
          {expandedSections.codeGen ? 
            <ChevronDownIcon className="h-4 w-4 text-gray-600" /> :
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          }
        </button>

        {expandedSections.codeGen && (
          <div className="mt-3 space-y-2">
            {Object.entries(config.codeGeneration).map(([option, enabled]) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleCodeGenToggle(option)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">
                    {codeGenDefinitions[option]}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Current Config Summary */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">Current Configuration</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Language: <span className="font-medium">{config.language.toUpperCase()}</span></div>
          <div>Framework: <span className="font-medium">{config.framework}</span></div>
          <div>Features: <span className="font-medium">
            {Object.values(config.features).filter(Boolean).length} enabled
          </span></div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
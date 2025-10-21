import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Download, X } from 'lucide-react';

const CodeViewer = ({ code, onClose, language = 'c' }) => {
  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ebpf_program.${language === 'c' ? 'c' : language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!');
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-bold">Generated Code</h3>
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            <Copy size={14} />
            <span>Copy</span>
          </button>
          <button
            onClick={downloadCode}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            <Download size={14} />
            <span>Download</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            <X size={14} />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={tomorrow}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '12px',
            lineHeight: '1.4'
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {code || '// No code generated yet'}
        </SyntaxHighlighter>
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          <p>💡 <strong>Compilation:</strong> clang -O2 -target bpf -c program.c -o program.o</p>
          <p>🚀 <strong>Loading:</strong> Use the generated loader or tools like bpftool</p>
          <p>📊 <strong>Monitoring:</strong> Use bpftool to inspect loaded maps and programs</p>
        </div>
      </div>
    </div>
  );
};

export default CodeViewer;
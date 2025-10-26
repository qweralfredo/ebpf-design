import React from 'react';
import { ExternalLink, Copy, Play } from 'lucide-react';

const WebVMIntegration = ({ generatedCode, language = 'c' }) => {
  const openWebVM = () => {
    // Abre WebVM em uma nova aba
    window.open('https://webvm.io/', '_blank');
  };

  const generateWebVMScript = () => {
    let commands = [];

    // Clone do repositório
    commands.push('git clone https://github.com/qweralfredo/ebpf-design.git');
    commands.push('cd ebpf-design');

    // Instalação de dependências
    commands.push('npm install');

    // Iniciar servidor de desenvolvimento
    commands.push('npm run dev');

    return commands.join(' && ');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('📋 Comando copiado para clipboard!');
  };

  const testInWebVM = () => {
    // Salvar o código gerado em localStorage
    localStorage.setItem('ebpf-generated-code', generatedCode);
    localStorage.setItem('ebpf-code-language', language);

    // Abrir WebVM e copiar instruções
    const setupCommand = generateWebVMScript();
    copyToClipboard(setupCommand);
    
    alert(
      '✅ Comando de setup copiado!\n\n' +
      'Passos:\n' +
      '1. Clique em "Abrir WebVM"\n' +
      '2. Cole o comando no terminal\n' +
      '3. Aguarde o npm install e npm run dev\n' +
      '4. Seu código será carregado automaticamente'
    );

    // Abre WebVM após 1 segundo
    setTimeout(() => openWebVM(), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20m0 0l-.75 3M9 20H5m4 0h10m0 0l.75 3M19 20l.75 3M19 20h4m-4 0h.01M12 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Test in WebVM.io
        </h4>
        <p className="text-blue-800 text-sm mb-4">
          Run your eBPF program directly in a browser-based Linux environment without any installation!
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={testInWebVM}
          disabled={!generatedCode}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Test in WebVM
        </button>

        <button
          onClick={openWebVM}
          className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Open WebVM.io →
        </button>

        <button
          onClick={() => copyToClipboard(generateWebVMScript())}
          className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Setup Command
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
        <p className="font-semibold mb-2">💡 How it works:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>WebVM setup command is copied to clipboard</li>
          <li>WebVM opens in a new browser tab</li>
          <li>Paste and run the command in the WebVM terminal</li>
          <li>Access your eBPF builder application locally</li>
          <li>Your generated code is available for testing</li>
        </ol>
      </div>
    </div>
  );
};

export default WebVMIntegration;

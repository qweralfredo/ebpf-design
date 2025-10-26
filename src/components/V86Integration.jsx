import React from 'react';
import { ExternalLink, Copy, Play } from 'lucide-react';

const V86Integration = ({ generatedCode, language = 'c' }) => {
  const openV86 = () => {
    // Abre v86 com Arch Linux em uma nova aba
    window.open('https://copy.sh/v86/?profile=archlinux', '_blank');
  };

  const generateV86Script = () => {
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

  const testInV86 = () => {
    // Salvar o código gerado em localStorage
    localStorage.setItem('ebpf-generated-code', generatedCode);
    localStorage.setItem('ebpf-code-language', language);

    // Abrir v86 e copiar instruções
    const setupCommand = generateV86Script();
    copyToClipboard(setupCommand);
    
    alert(
      '✅ Comando de setup copiado!\n\n' +
      'Passos:\n' +
      '1. Clique em "Abrir v86 (Arch Linux)"\n' +
      '2. Cole o comando no terminal\n' +
      '3. Aguarde o npm install e npm run dev\n' +
      '4. Seu código será carregado automaticamente\n\n' +
      '💡 Dica: v86 oferece uma máquina virtual x86 completa com performance otimizada'
    );

    // Abre v86 após 1 segundo
    setTimeout(() => openV86(), 1000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20m0 0l-.75 3M9 20H5m4 0h10m0 0l.75 3M19 20l.75 3M19 20h4m-4 0h.01M12 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Test in v86 (Arch Linux)
        </h4>
        <p className="text-purple-800 text-sm mb-2">
          Run your eBPF program in a full x86 virtual machine with Arch Linux via WebAssembly!
        </p>
        <p className="text-purple-700 text-xs">
          💻 Complete Linux environment with native eBPF support and package management
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={testInV86}
          disabled={!generatedCode}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Test in v86
        </button>

        <button
          onClick={openV86}
          className="w-full px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
        >
          Open v86 (Arch Linux) →
        </button>

        <button
          onClick={() => copyToClipboard(generateV86Script())}
          className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Setup Command
        </button>
      </div>

      <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-900">
        <p className="font-semibold mb-2">💡 How it works:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>v86 setup command is copied to clipboard</li>
          <li>v86 with Arch Linux opens in a new browser tab</li>
          <li>Paste and run the command in the v86 terminal</li>
          <li>Access your eBPF builder application locally</li>
          <li>Your generated code is available for testing with full Linux tools</li>
        </ol>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
        <p className="font-semibold mb-1">⚡ Performance Note:</p>
        <p>v86 provides a more complete Linux environment but may run slower than WebVM. Choose WebVM for quick tests, v86 for comprehensive testing with full Linux tools.</p>
      </div>
    </div>
  );
};

export default V86Integration;

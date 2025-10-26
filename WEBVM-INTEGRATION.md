# WebVM Integration Plugin

O eBPF Low-Code Builder agora inclui uma integração nativa com WebVM.io, permitindo testar seus programas eBPF diretamente em um ambiente Linux virtual no navegador.

## 🌐 O que é WebVM Integration?

WebVM Integration é um plugin integrado que permite:

- ✅ Abrir WebVM.io diretamente da aplicação
- ✅ Clonar o repositório eBPF-Design automaticamente
- ✅ Instalar e rodar a aplicação no WebVM
- ✅ Testar o código gerado sem instalação local
- ✅ Copiar comandos de setup com um clique

## 🚀 Como Usar

### Passo 1: Gerar Código eBPF
1. Crie um fluxo no eBPF Builder
2. Adicione nós e conecte-os
3. Clique em "Deploy" ou gere o código

### Passo 2: Acessar WebVM Integration
1. Abra o modal de Deploy
2. Veja a seção "Test in WebVM.io" no topo

### Passo 3: Opções Disponíveis

#### Opção A: Test in WebVM (Automático)
```bash
# Clique em "Test in WebVM"
# Isso:
# 1. Copia o comando de setup
# 2. Abre WebVM.io em uma nova aba
# 3. Fornece instruções
```

#### Opção B: Open WebVM.io
```bash
# Clique para abrir WebVM.io manualmente
# Use quando preferir fazer tudo passo a passo
```

#### Opção C: Copy Setup Command
```bash
# Copia apenas o comando de clone e setup
# Útil para pegar o comando em caso de necessidade
```

## 📋 Comando de Setup

O comando padrão executado é:

```bash
git clone https://github.com/qweralfredo/ebpf-design.git && \
cd ebpf-design && \
npm install && \
npm run dev
```

Este comando:
- 📥 Clona o repositório completo
- 📁 Navega para o diretório
- 📦 Instala todas as dependências (npm packages)
- 🚀 Inicia o servidor de desenvolvimento

## 🔄 Fluxo Completo

```
┌─────────────────────────────────────┐
│   eBPF Low-Code Builder App         │
│  (http://localhost:3007)            │
└──────────────┬──────────────────────┘
               │
               ▼ Clique em "Test in WebVM"
┌─────────────────────────────────────┐
│  Setup command é copiado            │
│  WebVM.io abre em nova aba          │
└──────────────┬──────────────────────┘
               │
               ▼ Cole o comando no terminal
┌─────────────────────────────────────┐
│  WebVM Terminal                     │
│  $ git clone ... && npm install ... │
└──────────────┬──────────────────────┘
               │
               ▼ Aguarde conclusão
┌─────────────────────────────────────┐
│  eBPF Builder rodando em WebVM      │
│  (http://localhost:5173)            │
│  Código gerado pronto para teste    │
└─────────────────────────────────────┘
```

## 📝 Exemplos de Uso

### Exemplo 1: Testar Programa XDP
```
1. Na aplicação local, crie um programa XDP
2. Clique em "Deploy" → "Test in WebVM"
3. Em WebVM, acesse http://localhost:5173
4. Seu programa está disponível para teste
5. Gere o código C e teste com clang
```

### Exemplo 2: Desenvolvimento Remoto
```
1. Abra WebVM.io em um dispositivo mobile
2. Clone o repositório via WebVM
3. Desenvolva seu programa eBPF
4. Teste tudo sem instalar nada localmente
```

### Exemplo 3: Prototipagem Rápida
```
1. Gere um programa no builder
2. Teste rapidamente no WebVM
3. Faça ajustes e regenere
4. Repita até estar satisfeito
```

## 🛠️ Configuração Técnica

### Arquivo: `WebVMIntegration.jsx`

O componente está localizado em:
```
src/components/WebVMIntegration.jsx
```

### Integração no DeployModal

O componente é importado e renderizado em:
```jsx
import WebVMIntegration from './WebVMIntegration';

// No JSX:
<WebVMIntegration generatedCode={generatedCode} language="c" />
```

## 💾 Armazenamento de Dados

O componente usa `localStorage` para armazenar:
- `ebpf-generated-code`: Código gerado
- `ebpf-code-language`: Linguagem do código

Isso permite que o código seja recuperado em WebVM se necessário.

## 🔗 Links Relacionados

- [WebVM.io Oficial](https://webvm.io/)
- [WEBVM.md - Guia Detalhado](/WEBVM.md)
- [TESTING.md - Guia de Testes](/TESTING.md)

## 🚨 Troubleshooting

### O comando de clone falha
- Verifique sua conexão de internet
- Certifique-se que o repositório é público
- Tente usar um proxy se necessário

### npm install é muito lento
- WebVM tem recursos limitados
- Aguarde pacientemente (pode levar alguns minutos)
- Feche outras abas do navegador

### npm run dev não inicia
- Verifique se Node.js está disponível em WebVM
- Tente reinstalar com `npm ci` ao invés de `npm install`
- Limpe cache com `npm cache clean --force`

### Porta 5173 já está em uso
- Vite usará automaticamente a próxima porta disponível
- Verifique o output do terminal para a URL correta

## 📚 Recursos Adicionais

### Documentação
- [README.md](./README.md) - Visão geral do projeto
- [WEBVM.md](./WEBVM.md) - Guia completo do WebVM
- [TESTING.md](./TESTING.md) - Guia de testes

### Comunidade
- [GitHub Issues](https://github.com/qweralfredo/ebpf-design/issues)
- [Discussions](https://github.com/qweralfredo/ebpf-design/discussions)

## 🎯 Próximas Melhorias

Melhorias planejadas para o WebVM Integration:
- [ ] Suportar múltiplas linguagens de saída
- [ ] Armazenar histórico de testes
- [ ] Compartilhar código via URL
- [ ] Integração com Docker Hub
- [ ] Preview em tempo real

---

**Versão**: 1.0.0  
**Última atualização**: Outubro 2025  
**Status**: ✅ Ativo e em desenvolvimento

# Testing Guide - eBPF Low-Code Builder

Este guia explica como testar a aplicação eBPF Low-Code Builder de diferentes maneiras.

## 🏃‍♂️ Teste Local (Desenvolvimento)

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Output esperado:
```
  VITE v5.4.10  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Passo 3: Abrir a Aplicação
Abra seu navegador e acesse: **http://localhost:5173**

## 🧪 Testes Manuais

### 1. Teste de Interface
```
✓ Verificar se a página carrega sem erros
✓ Verificar se o canvas é renderizado corretamente
✓ Verificar se os botões da toolbar funcionam
✓ Verificar se a sidebar pode ser aberta/fechada
✓ Verificar se o painel de config pode ser aberto/fechado
```

### 2. Teste de Adição de Nós
```bash
# No canvas:
1. Clique em "Show Palette" para abrir a sidebar
2. Arraste um nó "Attachment" para o canvas
3. Arraste um nó "Conditional" para o canvas
4. Clique em "Add Program Entry" (botão quick add)
5. Verifique se os nós aparecem no canvas
```

**Resultado esperado**: Nós aparecem nas posições arrastadas

### 3. Teste de Conexões
```bash
1. Adicione 2 nós ao canvas
2. Clique e arraste de um handle de saída para um handle de entrada
3. Uma linha de conexão deve aparecer
4. Tente deletar a conexão clicando no botão X da aresta
```

**Resultado esperado**: Conexões são criadas e deletadas corretamente

### 4. Teste de Geração de Código
```bash
1. Adicione alguns nós ao canvas
2. Clique em "Generate Code" ou no botão Deploy
3. O painel de código deve mostrar o código C gerado
4. Clique em "Copy to Clipboard"
5. Cole em um editor de texto para verificar
```

**Resultado esperado**: Código C válido é gerado

### 5. Teste de Templates
```bash
1. Clique no botão "Templates"
2. Selecione um template (ex: "XDP DDOS Mitigation")
3. Confirme o carregamento
4. Verifique se os nós foram adicionados ao canvas
```

**Resultado esperado**: Template carrega corretamente

### 6. Teste de AI Builder
```bash
1. Clique no botão "AI Builder"
2. Digite uma descrição (ex: "Monitor network traffic")
3. Clique em "Generate Flow"
4. Verifique se o fluxo foi gerado
```

**Resultado esperado**: Fluxo eBPF é gerado conforme a descrição

### 7. Teste de Salvamento como Template
```bash
1. Crie um fluxo com alguns nós
2. Clique em "Save"
3. Preencha o nome, categoria e descrição
4. Clique em "Save as Template"
5. Abra os templates novamente para verificar se aparece
```

**Resultado esperado**: Template é salvo e pode ser recarregado

### 8. Teste de Download
```bash
1. Crie um fluxo simples
2. Clique em "Deploy" -> "Download Files"
3. Selecione uma linguagem (C, Rust, Go, etc)
4. Clique em "Download Files"
5. Verifique se os arquivos foram baixados
```

**Resultado esperado**: 3 arquivos são baixados (código, build config, README)

### 9. Teste de Zoom
```bash
1. Use a roda do mouse para zoom
2. Clique nos botões de zoom na sidebar
3. Use o minimap para navegar
4. Verifique se o pan funciona (arrastar com espaço)
```

**Resultado esperado**: Zoom e pan funcionam suavemente

### 10. Teste de Persistência
```bash
1. Crie um fluxo
2. Atualize a página (F5)
3. Verifique se os nós e arestas ainda estão lá
```

**Resultado esperado**: Workspace é restaurado do localStorage

## 🐳 Teste com Docker

### Teste Local com Docker
```bash
# Build da imagem
docker build -t ebpf-design-test .

# Rodar o container
docker run -d -p 3007:3007 --name ebpf-test ebpf-design-test

# Acessar a aplicação
# Abra http://localhost:3007 no navegador

# Parar o container
docker stop ebpf-test
docker rm ebpf-test
```

### Teste da Imagem do Docker Hub
```bash
# Puxar a imagem do Docker Hub
docker pull qweralfredo/ebpf-design:latest

# Rodar
docker run -d -p 3007:3007 qweralfredo/ebpf-design:latest

# Acessar http://localhost:3007
```

## 🌐 Teste no WebVM.io

### Passo 1: Abrir WebVM
Acesse https://webvm.io/

### Passo 2: Clonar e Configurar
```bash
git clone https://github.com/qweralfredo/ebpf-design.git
cd ebpf-design
npm install
npm run dev
```

### Passo 3: Acessar
Clique na URL local fornecida pelo Vite

## 🔍 Teste de Performance

### Teste com Muitos Nós
```bash
1. Abra o DevTools (F12)
2. Vá para a aba "Performance"
3. Adicione 50+ nós ao canvas
4. Registre a performance
5. Verifique se a aplicação permanece responsiva
```

**Métricas esperadas**:
- FPS: > 30
- Latência de clique: < 100ms
- Latência de zoom: < 50ms

### Teste de Memória
```bash
1. Abra DevTools
2. Vá para "Memory"
3. Tire um snapshot
4. Crie e delete muitos nós
5. Tire outro snapshot
6. Verifique se não há memory leaks
```

## 🧪 Teste no Navegador

### Navegadores Suportados
- ✅ Chrome/Chromium (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Edge (v90+)

### Teste de Responsividade
```bash
1. Abra DevTools
2. Clique em "Toggle device toolbar" (Ctrl+Shift+M)
3. Teste em:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
4. Verifique se a interface se adapta corretamente
```

## 🐛 Teste de Erro

### Teste de Validação de Conexão
```bash
1. Adicione dois nós
2. Tente conectar um handle inválido
3. Verifique se a conexão é bloqueada
```

**Resultado esperado**: Conexões inválidas são prevenidas

### Teste de Limpeza do Canvas
```bash
1. Crie um fluxo complexo
2. Clique em "Clear Canvas"
3. Verifique se todos os nós são removidos
4. Clique em "Reset All" para resetar completamente
```

**Resultado esperado**: Canvas é limpo corretamente

## 📊 Teste de Código Gerado

### Validação do Código C
```bash
1. Gere um programa simples
2. Copie o código gerado
3. Salve como `test.c`
4. Tente compilar com:
   clang -O2 -target bpf -c test.c -o test.o
```

**Resultado esperado**: Código compila sem erros

## ✅ Checklist de Teste Completo

- [ ] Interface carrega sem erros
- [ ] Nós podem ser adicionados ao canvas
- [ ] Nós podem ser conectados
- [ ] Código C é gerado corretamente
- [ ] Templates carregam corretamente
- [ ] AI Builder funciona
- [ ] Salvamento como template funciona
- [ ] Download de arquivos funciona
- [ ] Zoom e pan funcionam
- [ ] Dados persistem ao recarregar
- [ ] Responsividade em mobile funciona
- [ ] Performance é aceitável
- [ ] Docker build e run funcionam
- [ ] WebVM.io funciona corretamente

## 🚀 Teste Automatizado (Futuro)

Para adicionar testes automatizados no futuro:

```bash
# Instalar Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Criar testes em src/__tests__/
npm run test
```

## 🆘 Troubleshooting

### Aplicação não carrega
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Porta 5173 em uso
```bash
# Encontrar processo usando a porta
lsof -i :5173

# Kill do processo
kill -9 <PID>

# Ou especificar outra porta
npm run dev -- --port 5174
```

### Docker não funciona
```bash
# Verificar se Docker está rodando
docker ps

# Rebuild sem cache
docker build --no-cache -t ebpf-design .
```

---

**Dúvidas?** Abra uma issue no [GitHub](https://github.com/qweralfredo/ebpf-design/issues)

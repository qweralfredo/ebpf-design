# Dockerfile otimizado para React + Vite
FROM node:20-alpine AS base

# Instalar dependências necessárias para o Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Etapa 1: Instalar dependências
FROM base AS deps

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Etapa 2: Build da aplicação
FROM base AS builder
WORKDIR /app

# Copiar dependências da etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Instalar todas as dependências (incluindo dev)
RUN npm ci

# Build da aplicação Vite
RUN npm run build

# Etapa 3: Produção com servidor estático
FROM nginx:alpine AS runner

# Configurações de produção
ENV NODE_ENV=production

# Copiar configuração do nginx
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 3007;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Configuração para SPA (Single Page Application)
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff";
    }

    # Configurações específicas para JavaScript modules
    location ~* \.js$ {
        add_header Content-Type "application/javascript; charset=utf-8";
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Configurações de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # GZIP
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types 
        text/plain 
        text/css 
        text/xml 
        text/javascript 
        application/javascript 
        application/xml+rss 
        application/json
        application/ld+json
        application/atom+xml
        image/svg+xml;

    # Logs para debug
    error_log /var/log/nginx/error.log debug;
    access_log /var/log/nginx/access.log;
}
EOF

# Copiar arquivos de build do Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 3007

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3007/ || exit 1

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]

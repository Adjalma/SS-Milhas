# Dockerfile para Sistema de Gestão de Milhas
# Multi-stage build para otimizar o tamanho da imagem

# Estágio 1: Build do frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/client

# Copiar package.json e instalar dependências
COPY client/package*.json ./
RUN npm ci --only=production

# Copiar código fonte e fazer build
COPY client/ .
RUN npm run build

# Estágio 2: Build do backend
FROM node:18-alpine AS backend-build

WORKDIR /app/server

# Copiar package.json e instalar dependências
COPY server/package*.json ./
RUN npm ci --only=production

# Copiar código fonte
COPY server/ .

# Copiar build do frontend
COPY --from=frontend-build /app/client/build ./public

# Estágio 3: Imagem final
FROM node:18-alpine AS production

# Instalar dumb-init para gerenciamento de processos
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copiar arquivos do backend
COPY --from=backend-build --chown=nodejs:nodejs /app/server ./

# Criar diretórios necessários
RUN mkdir -p uploads/accounts uploads/transactions uploads/users logs
RUN chown -R nodejs:nodejs uploads logs

# Expor porta
EXPOSE 5000

# Configurar usuário
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Iniciar aplicação
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js"]

#!/bin/bash

# Script de configuração inicial do Sistema de Gestão de Milhas
# Este script configura o ambiente de desenvolvimento

echo "🚀 Configurando Sistema de Gestão de Milhas..."
echo "================================================"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar se MongoDB está instalado
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB não encontrado. Certifique-se de que o MongoDB está instalado e rodando."
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Instalar dependências do projeto principal
echo "📦 Instalando dependências do projeto..."
npm install

# Instalar dependências do servidor
echo "📦 Instalando dependências do servidor..."
cd server
npm install
cd ..

# Instalar dependências do cliente
echo "📦 Instalando dependências do cliente..."
cd client
npm install
cd ..

# Criar diretórios necessários
echo "📁 Criando diretórios..."
mkdir -p server/uploads/accounts
mkdir -p server/uploads/transactions
mkdir -p server/uploads/users
mkdir -p server/logs

# Copiar arquivo de configuração de exemplo
echo "⚙️  Configurando variáveis de ambiente..."
if [ ! -f server/.env ]; then
    cp server/env.example server/.env
    echo "📝 Arquivo .env criado. Configure suas variáveis de ambiente."
else
    echo "✅ Arquivo .env já existe."
fi

# Criar arquivo .env para o cliente (se necessário)
if [ ! -f client/.env ]; then
    cat > client/.env << EOL
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_VERSION=1.0.0
EOL
    echo "📝 Arquivo .env do cliente criado."
fi

# Verificar se MongoDB está rodando
echo "🔍 Verificando conexão com MongoDB..."
if mongosh --eval "db.runCommand('ping')" &> /dev/null; then
    echo "✅ MongoDB está rodando"
else
    echo "⚠️  MongoDB não está rodando. Inicie o MongoDB antes de executar a aplicação."
fi

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no arquivo server/.env"
echo "2. Certifique-se de que o MongoDB está rodando"
echo "3. Execute 'npm run dev' para iniciar a aplicação"
echo ""
echo "🌐 URLs da aplicação:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   API:      http://localhost:5000/api"
echo ""
echo "📚 Documentação: consulte o README.md para mais informações"

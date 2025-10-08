#!/bin/bash

echo "🚀 Configurando SS Milhas para Deploy..."

# Verificar se estamos na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script na pasta raiz do projeto"
    exit 1
fi

# Criar arquivos necessários para deploy
echo "📁 Criando arquivos de configuração..."

# Verificar se .env existe no server
if [ ! -f "server/.env" ]; then
    echo "📝 Criando arquivo .env..."
    cp server/env.example server/.env
    echo "✅ Arquivo .env criado. Configure as variáveis necessárias."
fi

# Criar diretórios necessários
echo "📂 Criando diretórios..."
mkdir -p server/uploads/{accounts,transactions,users}
mkdir -p server/logs
mkdir -p client/build

# Verificar dependências
echo "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do root..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "Instalando dependências do server..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "Instalando dependências do client..."
    cd client && npm install && cd ..
fi

echo "✅ Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure MongoDB Atlas: https://www.mongodb.com/atlas"
echo "2. Atualize server/.env com sua string de conexão"
echo "3. Crie repositório no GitHub"
echo "4. Configure deploy no Vercel"
echo ""
echo "📖 Consulte setup-deploy.md para instruções detalhadas"

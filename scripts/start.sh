#!/bin/bash

# Script para iniciar o Sistema de Gestão de Milhas
# Inicia tanto o backend quanto o frontend

echo "🚀 Iniciando Sistema de Gestão de Milhas..."
echo "============================================"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "❌ Dependências não encontradas. Execute 'npm run setup' primeiro."
    exit 1
fi

if [ ! -d "server/node_modules" ]; then
    echo "❌ Dependências do servidor não encontradas. Execute 'npm run setup' primeiro."
    exit 1
fi

if [ ! -d "client/node_modules" ]; then
    echo "❌ Dependências do cliente não encontradas. Execute 'npm run setup' primeiro."
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f "server/.env" ]; then
    echo "❌ Arquivo .env não encontrado. Execute 'npm run setup' primeiro."
    exit 1
fi

# Verificar se MongoDB está rodando
echo "🔍 Verificando MongoDB..."
if ! mongosh --eval "db.runCommand('ping')" &> /dev/null; then
    echo "⚠️  MongoDB não está rodando. Tentando iniciar..."
    
    # Tentar iniciar MongoDB (funciona no macOS com Homebrew)
    if command -v brew &> /dev/null; then
        brew services start mongodb-community &> /dev/null || true
    fi
    
    # Aguardar um pouco para o MongoDB inicializar
    sleep 3
    
    if ! mongosh --eval "db.runCommand('ping')" &> /dev/null; then
        echo "❌ Não foi possível conectar ao MongoDB. Inicie manualmente o MongoDB."
        echo "   macOS (Homebrew): brew services start mongodb-community"
        echo "   Linux: sudo systemctl start mongod"
        echo "   Windows: net start MongoDB"
        exit 1
    fi
fi

echo "✅ MongoDB está rodando"

# Criar diretórios de upload se não existirem
mkdir -p server/uploads/accounts
mkdir -p server/uploads/transactions
mkdir -p server/uploads/users

# Iniciar a aplicação
echo "🌟 Iniciando aplicação em modo de desenvolvimento..."
echo ""

# Usar concurrently para iniciar backend e frontend
if command -v npx &> /dev/null; then
    npx concurrently \
        --names "BACKEND,FRONTEND" \
        --prefix-colors "blue,green" \
        "cd server && npm run dev" \
        "cd client && npm start"
else
    echo "❌ npx não encontrado. Instale o npm corretamente."
    exit 1
fi

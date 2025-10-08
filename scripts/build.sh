#!/bin/bash

# Script para build de produção do Sistema de Gestão de Milhas

echo "🏗️  Construindo Sistema de Gestão de Milhas para produção..."
echo "=========================================================="

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "❌ Dependências não encontradas. Execute 'npm run setup' primeiro."
    exit 1
fi

# Verificar se o arquivo .env de produção existe
if [ ! -f "server/.env" ]; then
    echo "❌ Arquivo .env não encontrado. Configure as variáveis de ambiente."
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf client/build
rm -rf server/dist

# Build do cliente (React)
echo "⚛️  Construindo frontend..."
cd client
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build do frontend"
    exit 1
fi

cd ..

# Build do servidor (se necessário)
echo "🔧 Preparando servidor..."
cd server

# Copiar arquivos estáticos do build do React para o servidor
if [ -d "../client/build" ]; then
    echo "📁 Copiando arquivos estáticos do frontend..."
    mkdir -p public
    cp -r ../client/build/* public/
fi

cd ..

# Criar diretórios necessários para produção
echo "📁 Criando estrutura de produção..."
mkdir -p server/uploads/accounts
mkdir -p server/uploads/transactions
mkdir -p server/uploads/users
mkdir -p server/logs

# Verificar se o build foi bem-sucedido
if [ -d "client/build" ]; then
    echo "✅ Frontend construído com sucesso"
else
    echo "❌ Falha no build do frontend"
    exit 1
fi

echo ""
echo "🎉 Build de produção concluído!"
echo ""
echo "📁 Arquivos gerados:"
echo "   Frontend: client/build/"
echo "   Backend:  server/ (com arquivos estáticos em server/public/)"
echo ""
echo "🚀 Para iniciar em produção:"
echo "   cd server && npm start"
echo ""
echo "🌐 A aplicação estará disponível em:"
echo "   http://localhost:5000"

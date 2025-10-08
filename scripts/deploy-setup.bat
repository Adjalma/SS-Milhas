@echo off
echo 🚀 Configurando SS Milhas para Deploy...

REM Verificar se estamos na pasta correta
if not exist "package.json" (
    echo ❌ Execute este script na pasta raiz do projeto
    pause
    exit /b 1
)

REM Criar arquivos necessários para deploy
echo 📁 Criando arquivos de configuração...

REM Verificar se .env existe no server
if not exist "server\.env" (
    echo 📝 Criando arquivo .env...
    copy "server\env.example" "server\.env"
    echo ✅ Arquivo .env criado. Configure as variáveis necessárias.
)

REM Criar diretórios necessários
echo 📂 Criando diretórios...
mkdir "server\uploads\accounts" 2>nul
mkdir "server\uploads\transactions" 2>nul
mkdir "server\uploads\users" 2>nul
mkdir "server\logs" 2>nul
mkdir "client\build" 2>nul

REM Verificar dependências
echo 📦 Verificando dependências...
if not exist "node_modules" (
    echo Instalando dependências do root...
    npm install
)

if not exist "server\node_modules" (
    echo Instalando dependências do server...
    cd server
    npm install
    cd ..
)

if not exist "client\node_modules" (
    echo Instalando dependências do client...
    cd client
    npm install
    cd ..
)

echo ✅ Configuração concluída!
echo.
echo 📋 Próximos passos:
echo 1. Configure MongoDB Atlas: https://www.mongodb.com/atlas
echo 2. Atualize server\.env com sua string de conexão
echo 3. Crie repositório no GitHub
echo 4. Configure deploy no Vercel
echo.
echo 📖 Consulte setup-deploy.md para instruções detalhadas
pause

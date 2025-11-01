# 🚀 Guia de Deploy no Vercel - SS Milhas

## 📋 Pré-requisitos

✅ Conta no Vercel (https://vercel.com)  
✅ Projeto no GitHub (https://github.com/Adjalma/SS-Milhas)  
✅ MongoDB Atlas configurado  
✅ Node.js 18+ instalado localmente

---

## 🔧 Configuração do Projeto

### 1. Estrutura do Projeto

O projeto possui **duas** configurações do Vercel:

```
SS_Milhas/
├── vercel.json          # Configuração do projeto completo
├── server/
│   └── vercel.json      # Configuração do backend
└── client/
    └── vercel.json      # Configuração do frontend
```

### 2. Arquivos de Configuração

#### 📄 `vercel.json` (Raiz - Projeto Completo)
```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/build",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/server/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 📄 `server/vercel.json` (Backend)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

#### 📄 `client/vercel.json` (Frontend)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/build/$1"
    }
  ]
}
```

---

## 🌐 Opções de Deploy

### 📌 Opção 1: Deploy Separado (Recomendado)

**Vantagens:**
- ✅ Melhor controle individual
- ✅ Escalabilidade independente
- ✅ Deploy mais rápido
- ✅ URLs específicas para frontend e backend

#### **1.1 Deploy do Backend**

1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **"New Project"**
3. Importe o repositório do GitHub: `Adjalma/SS-Milhas`
4. Configure:
   - **Project Name**: `ss-milhas-backend`
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: (deixe vazio)
   - **Output Directory**: (deixe vazio)

5. Configure as **variáveis de ambiente**:

```env
# Banco de Dados
MONGODB_URI=mongodb+srv://seu-usuario:senha@cluster.mongodb.net/ss-milhas
DB_NAME=ss_milhas

# Autenticação
JWT_SECRET=seu_jwt_secret_super_seguro_com_pelo_menos_32_caracteres
JWT_EXPIRES_IN=7d

# Servidor
PORT=5000
NODE_ENV=production

# Frontend URL (atualize após deploy do frontend)
FRONTEND_URL=https://ss-milhas-frontend.vercel.app

# Email (Opcional - pode desabilitar)
EMAIL_ENABLED=false
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
EMAIL_FROM=seu_email@gmail.com

# APIs Externas (Opcional)
LATAM_API_KEY=
SMILES_API_KEY=
```

6. Clique em **"Deploy"**
7. **Anote a URL do backend**: `https://ss-milhas-backend.vercel.app`

#### **1.2 Deploy do Frontend**

1. No Vercel Dashboard, clique em **"New Project"**
2. Importe o mesmo repositório: `Adjalma/SS-Milhas`
3. Configure:
   - **Project Name**: `ss-milhas-frontend`
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. Configure a **variável de ambiente**:

```env
REACT_APP_API_URL=https://ss-milhas-backend.vercel.app
```

5. Clique em **"Deploy"**
6. **Anote a URL do frontend**: `https://ss-milhas-frontend.vercel.app`

#### **1.3 Atualizar URL do Frontend no Backend**

1. Volte ao projeto do backend no Vercel
2. Vá em **Settings** > **Environment Variables**
3. Edite `FRONTEND_URL` com a URL do frontend
4. Faça um **redeploy** do backend

---

### 📌 Opção 2: Deploy Monolítico

**Use se:** Quiser tudo em um único projeto

1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **"New Project"**
3. Importe o repositório: `Adjalma/SS-Milhas`
4. Configure:
   - **Project Name**: `ss-milhas`
   - **Framework Preset**: Other
   - **Root Directory**: (deixe em branco - raiz)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/build`

5. Configure **todas as variáveis de ambiente** (mesmas da Opção 1)

6. Clique em **"Deploy"**

---

## 🔐 Configuração de Variáveis de Ambiente no Vercel

### Método 1: Via Dashboard (Mais Fácil)

1. Acesse seu projeto no Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione cada variável:
   - Nome: `MONGODB_URI`
   - Value: `mongodb+srv://...`
   - Environments: `Production`, `Preview`, `Development`
4. Clique em **"Save"**

### Método 2: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Adicionar variáveis
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add FRONTEND_URL production
# ... adicione todas as variáveis necessárias
```

---

## ✅ Checklist de Deploy

### Antes do Deploy

- [ ] Código commitado e enviado ao GitHub
- [ ] MongoDB Atlas configurado e acessível
- [ ] Variáveis de ambiente preparadas
- [ ] Arquivo `.env` local **NÃO** enviado ao Git (verificar .gitignore)
- [ ] Build local testado (`npm run build` no client)
- [ ] Backend testado localmente

### Durante o Deploy

- [ ] Projeto importado do GitHub
- [ ] Configurações corretas (root directory, build command)
- [ ] Todas as variáveis de ambiente adicionadas
- [ ] Deploy iniciado sem erros

### Após o Deploy

- [ ] URLs anotadas (frontend e backend)
- [ ] Testar acesso ao frontend
- [ ] Testar chamadas da API
- [ ] Verificar logs do Vercel por erros
- [ ] Atualizar CORS no backend se necessário
- [ ] Testar login e funcionalidades principais

---

## 🔍 Verificação e Testes

### 1. Verificar Build do Frontend

```bash
cd client
npm run build
```

✅ Deve criar a pasta `client/build` sem erros

### 2. Testar Backend Localmente

```bash
cd server
npm install
node index.js
```

✅ Servidor deve iniciar em `http://localhost:5000`

### 3. Testar Conexão com MongoDB

Verifique se o MongoDB Atlas permite conexões de qualquer IP:
- Acesse MongoDB Atlas
- Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0)

### 4. Verificar Logs no Vercel

1. Acesse seu projeto no Vercel
2. Vá em **Deployments**
3. Clique no último deployment
4. Veja os **Build Logs** e **Function Logs**

---

## 🐛 Troubleshooting

### Erro: "Module not found"

**Causa:** Dependências não instaladas  
**Solução:** Verifique se `package.json` tem todas as dependências

### Erro: "Cannot connect to MongoDB"

**Causa:** URI incorreta ou IP não autorizado  
**Solução:** 
1. Verifique `MONGODB_URI` nas variáveis de ambiente
2. Permita acesso de qualquer IP no MongoDB Atlas

### Erro: "CORS Error"

**Causa:** Frontend não autorizado no backend  
**Solução:** Atualize `FRONTEND_URL` no backend e configure CORS

### Erro: "Build Failed"

**Causa:** Erro no código ou dependências  
**Solução:** 
1. Verifique os logs de build no Vercel
2. Teste o build localmente: `npm run build`
3. Corrija erros e faça novo push

### Frontend carrega mas API não responde

**Causa:** URL da API incorreta no frontend  
**Solução:** 
1. Verifique `REACT_APP_API_URL` nas variáveis de ambiente do frontend
2. Use a URL completa: `https://ss-milhas-backend.vercel.app`

---

## 📊 Status do Projeto

### ✅ Pronto para Deploy

- ✅ Código no GitHub atualizado
- ✅ `.gitignore` configurado corretamente
- ✅ Arquivos `.env` não estão no repositório
- ✅ Configurações do Vercel (`vercel.json`) presentes
- ✅ Build do frontend funciona
- ✅ Backend inicia sem erros
- ✅ Dependências instaladas

### 🚀 Próximos Passos

1. **Criar conta no MongoDB Atlas** (se ainda não tiver)
   - https://www.mongodb.com/cloud/atlas/register

2. **Criar conta no Vercel** (se ainda não tiver)
   - https://vercel.com/signup

3. **Conectar GitHub ao Vercel**
   - No Vercel Dashboard > Import Project > GitHub

4. **Seguir os passos da Opção 1 ou 2**

5. **Testar a aplicação em produção**

---

## 📱 URLs de Produção

Após o deploy, suas URLs serão:

### Opção 1 (Separado):
- **Frontend**: https://ss-milhas-frontend.vercel.app
- **Backend API**: https://ss-milhas-backend.vercel.app/api

### Opção 2 (Monolítico):
- **Aplicação Completa**: https://ss-milhas.vercel.app
- **API**: https://ss-milhas.vercel.app/api

---

## 🔗 Links Úteis

- [Documentação do Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [GitHub Repository](https://github.com/Adjalma/SS-Milhas)

---

## 💡 Dicas de Otimização

1. **Habilite Caching**: Vercel faz isso automaticamente
2. **Use Environment Variables**: Nunca hardcode credenciais
3. **Monitore Logs**: Verifique regularmente os logs do Vercel
4. **Configure Alertas**: Receba notificações de falhas
5. **Use Preview Deployments**: Teste mudanças antes de produção

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Vercel Dashboard
2. Consulte a documentação do Vercel
3. Verifique o GitHub Issues do projeto

---

**Deploy realizado por:** Especialista em Programação  
**Data:** 01/11/2025  
**Versão:** 1.0.0

🎉 **Boa sorte com seu deploy!**


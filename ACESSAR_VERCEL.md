# 🌐 COMO ACESSAR O SISTEMA PELO VERCEL

## 🔍 Verificar se já está deployado

### **Opção 1: Testar URL existente**

Tente acessar diretamente:

**URL Principal:**
- 🌐 https://ss-milhas.vercel.app

**Health Check (teste rápido):**
- 🔍 https://ss-milhas.vercel.app/api/health
- 🔍 https://ss-milhas.vercel.app/api/debug

**Se funcionar:**
- ✅ O sistema já está no ar!
- 📧 Login: `admin@ssmilhas.com`
- 🔑 Senha: `admin123`

---

## 🚀 Se NÃO estiver deployado - Fazer Deploy Agora

### **Método Rápido (Recomendado para testes)**

#### **1. Pré-requisitos:**
- ✅ Conta no GitHub (https://github.com)
- ✅ Código commitado no GitHub
- ✅ Conta no Vercel (https://vercel.com/signup - grátis)

#### **2. Deploy via Vercel Dashboard (Mais Fácil):**

1. **Acesse:** https://vercel.com/dashboard

2. **Clique em "New Project"**

3. **Importe do GitHub:**
   - Conecte sua conta do GitHub (se ainda não conectou)
   - Selecione o repositório `SS-Milhas` ou `SS_Milhas`

4. **Configure o Projeto:**
   - **Project Name:** `ss-milhas` (ou qualquer nome)
   - **Framework Preset:** `Other` ou `Create React App`
   - **Root Directory:** `client` (para frontend) ou deixe vazio
   - **Build Command:** `npm run build` (automático se detectar React)
   - **Output Directory:** `build` (automático)

5. **Configure Variáveis de Ambiente:**
   
   Clique em "Environment Variables" e adicione:

   ```env
   # Obrigatórias:
   MONGODB_URI=mongodb+srv://seu-usuario:senha@cluster.mongodb.net/ss-milhas
   JWT_SECRET=seu_secret_super_seguro_com_pelo_menos_32_caracteres_aqui
   NODE_ENV=production
   PORT=5000
   
   # Opcionais (pode deixar vazio para testar):
   EMAIL_ENABLED=false
   ```

6. **Clique em "Deploy"**

7. **Aguarde 2-3 minutos** (build automático)

8. **Acesse a URL fornecida:**
   - Exemplo: `https://ss-milhas-xyz.vercel.app`

---

## 🎯 Opções de Deploy

### **Opção A: Deploy Frontend Apenas (Mais Simples)**

**Ideal para:** Testar a interface rapidamente

**Configuração:**
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `build`
- Framework: Create React App

**Nota:** O backend precisa estar em outro lugar (Railway, Heroku, etc.)

---

### **Opção B: Deploy Monolítico (Frontend + Backend)**

**Ideal para:** Tudo em um único projeto

**Configuração:**
- Root Directory: (deixe vazio - raiz do projeto)
- Build Command: `cd client && npm install && npm run build`
- Output Directory: `client/build`
- Framework: Other

**Vercel.json configurado:**
```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/build",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

### **Opção C: Deploy Separado (Profissional)**

**Backend (Projeto 1):**
- Root Directory: `server`
- Build Command: (vazio)
- Output Directory: (vazio)
- URL: `https://ss-milhas-backend.vercel.app`

**Frontend (Projeto 2):**
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `build`
- Environment Variable: `REACT_APP_API_URL=https://ss-milhas-backend.vercel.app`
- URL: `https://ss-milhas-frontend.vercel.app`

---

## 🔐 Variáveis de Ambiente Necessárias

### **Mínimas para funcionar:**

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/database
JWT_SECRET=qualquer_string_secreta_longa_aqui_123456789
NODE_ENV=production
```

### **Completas (recomendado):**

```env
# Banco de Dados
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/ss-milhas
DB_NAME=ss_milhas

# Autenticação
JWT_SECRET=seu_jwt_secret_super_seguro_com_pelo_menos_32_caracteres
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=seu_refresh_token_secret

# Servidor
PORT=5000
NODE_ENV=production

# Frontend (se deploy separado)
FRONTEND_URL=https://ss-milhas-frontend.vercel.app

# Email (opcional)
EMAIL_ENABLED=false
```

---

## 📊 MongoDB Atlas (Gratuito)

**Se não tem MongoDB ainda:**

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie conta grátis
3. Crie um cluster M0 (Free Forever)
4. Em "Database Access": Crie usuário
5. Em "Network Access": Adicione `0.0.0.0/0` (permitir qualquer IP)
6. Clique "Connect" → "Connect your application"
7. Copie a connection string
8. Substitua `<password>` pela senha do usuário
9. Cole no `MONGODB_URI` do Vercel

**Exemplo de URI:**
```
mongodb+srv://admin:minhasenha123@cluster0.xyz.mongodb.net/ss-milhas?retryWrites=true&w=majority
```

---

## ✅ Verificar se Deploy Funcionou

### **1. Teste Health Check:**
```
https://sua-url.vercel.app/api/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### **2. Teste Frontend:**
```
https://sua-url.vercel.app
```

**Deve mostrar:** Tela de login

### **3. Fazer Login:**
- 📧 Email: `admin@ssmilhas.com`
- 🔑 Senha: `admin123`

**Se não funcionar o login:**
- O usuário admin será criado automaticamente na primeira requisição
- Ou execute: `POST https://sua-url.vercel.app/api/create-admin`

---

## 🐛 Problemas Comuns

### **Erro: "Cannot connect to MongoDB"**

**Solução:**
1. Verifique se `MONGODB_URI` está correta
2. Verifique se o MongoDB Atlas permite conexões de qualquer IP (`0.0.0.0/0`)
3. Verifique se a senha no URI está correta (sem caracteres especiais ou encode URL)

### **Erro: "Build Failed"**

**Solução:**
1. Veja os logs no Vercel (Deployments → Último deploy → Logs)
2. Verifique se todas as dependências estão no `package.json`
3. Teste build localmente: `cd client && npm run build`

### **Erro: "CORS Error"**

**Solução:**
1. O backend já está configurado para aceitar `*.vercel.app`
2. Se usar domínio customizado, adicione no código em `server/index.js` (allowedOrigins)

### **Frontend carrega mas não conecta ao backend**

**Solução:**
1. Verifique se `REACT_APP_API_URL` está configurada (se deploy separado)
2. Verifique se as rotas estão corretas no `vercel.json`
3. Teste diretamente: `https://sua-url.vercel.app/api/health`

---

## 🔗 URLs Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Vercel:** https://vercel.com/docs
- **MongoDB Atlas:** https://cloud.mongodb.com
- **GitHub (se aplicável):** https://github.com

---

## 📝 Checklist Rápido

- [ ] Conta no Vercel criada
- [ ] Conta no MongoDB Atlas criada
- [ ] MongoDB URI configurada
- [ ] Projeto importado do GitHub (ou código commitado)
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy iniciado
- [ ] URL de produção anotada
- [ ] Health check funcionando
- [ ] Login funcionando

---

## 🎉 Pronto!

Depois do deploy, você terá uma URL como:

**https://ss-milhas.vercel.app**

Ou

**https://ss-milhas-abc123.vercel.app**

Acesse e teste! 🚀

---

**Dica:** O Vercel oferece deploy automático a cada push no GitHub. Configure isso nas Settings do projeto!


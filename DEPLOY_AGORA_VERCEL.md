# 🚀 DEPLOY NO VERCEL - PASSO A PASSO SIMPLES

## ❌ Erro Recebido:
```
404: NOT_FOUND
Code: DEPLOYMENT_NOT_FOUND
```

**Isso significa:** O projeto ainda não está deployado no Vercel. Vamos fazer agora!

---

## 📋 PRÉ-REQUISITOS

Antes de começar, você precisa:

1. ✅ **Conta no GitHub** (se ainda não tiver: https://github.com/signup)
2. ✅ **Conta no Vercel** (se ainda não tiver: https://vercel.com/signup)
3. ✅ **MongoDB Atlas** (gratuito: https://www.mongodb.com/cloud/atlas/register)

---

## 🎯 OPÇÃO 1: Deploy Frontend Apenas (MAIS FÁCIL - Recomendado para testar)

### **Passo 1: Preparar MongoDB Atlas**

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie conta gratuita
3. Crie um **Cluster M0** (Free Forever)
4. **Crie usuário do banco:**
   - Username: `admin` (ou qualquer nome)
   - Password: Anote a senha (exemplo: `Senha123456`)
5. **Network Access:**
   - Clique em "Add IP Address"
   - Selecione "Allow Access from Anywhere" (`0.0.0.0/0`)
   - Clique "Confirm"
6. **Obter Connection String:**
   - Clique em "Connect"
   - Escolha "Connect your application"
   - Copie a string que aparece (exemplo):
     ```
     mongodb+srv://admin:Senha123456@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Substitua `<password>` pela senha real**
   - **Adicione o nome do banco:** `/ss-milhas` no final (antes do `?`)
   - **Resultado final:**
     ```
     mongodb+srv://admin:Senha123456@cluster0.xxxxx.mongodb.net/ss-milhas?retryWrites=true&w=majority
     ```

### **Passo 2: Subir código para GitHub**

Se o código ainda não está no GitHub:

```powershell
# Na pasta do projeto
cd "C:\Users\XBZF\Projetos Triarc\Sistema Sentinela\SS_Milhas"

# Inicializar git (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - SS Milhas system"

# Criar repositório no GitHub primeiro, depois:
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ss-milhas.git
git push -u origin main
```

**OU** se já está no GitHub, apenas certifique-se que está atualizado:
```powershell
git add .
git commit -m "Update before deploy"
git push
```

### **Passo 3: Deploy no Vercel**

1. **Acesse:** https://vercel.com/dashboard

2. **Clique em "New Project"**

3. **Importe do GitHub:**
   - Se ainda não conectou o GitHub, clique em "Import Git Repository"
   - Autorize o Vercel a acessar seus repositórios
   - Selecione o repositório `SS-Milhas` (ou o nome do seu repositório)

4. **Configure o Projeto:**
   
   **Configurações importantes:**
   - **Project Name:** `ss-milhas` (ou qualquer nome)
   - **Framework Preset:** `Create React App` (o Vercel detecta automaticamente)
   - **Root Directory:** `client` ⚠️ **MUITO IMPORTANTE!**
   - **Build Command:** `npm run build` (automático)
   - **Output Directory:** `build` (automático)
   - **Install Command:** `npm install` (automático)

5. **Configure Variáveis de Ambiente:**
   
   Clique em "Environment Variables" e adicione:

   | Nome | Valor | Ambientes |
   |------|-------|-----------|
   | `REACT_APP_API_URL` | `https://ss-milhas-api.vercel.app` | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |

   ⚠️ **Nota:** Vamos fazer o deploy do backend depois, então por enquanto deixe a API URL como está ou deixe vazio. O frontend ainda vai carregar, só não vai conectar ao backend.

6. **Clique em "Deploy"**

7. **Aguarde 2-3 minutos**

8. **Anote a URL:** Será algo como `https://ss-milhas-abc123.vercel.app`

### **Passo 4: Deploy do Backend (Opcional - Para sistema completo)**

**Agora vamos fazer o deploy do backend separadamente:**

1. No Vercel Dashboard, clique em **"New Project"** novamente

2. **Importe o mesmo repositório**

3. **Configure:**
   - **Project Name:** `ss-milhas-api` (ou `ss-milhas-backend`)
   - **Framework Preset:** `Other`
   - **Root Directory:** `server` ⚠️ **MUITO IMPORTANTE!**
   - **Build Command:** (deixe vazio)
   - **Output Directory:** (deixe vazio)

4. **Configure Variáveis de Ambiente:**
   
   Adicione estas variáveis:

   | Nome | Valor | Ambientes |
   |------|-------|-----------|
   | `MONGODB_URI` | `mongodb+srv://admin:Senha123456@cluster0.xxxxx.mongodb.net/ss-milhas?retryWrites=true&w=majority` | Todos |
   | `JWT_SECRET` | `qualquer_string_longa_e_secreta_aqui_123456789` | Todos |
   | `NODE_ENV` | `production` | Production |
   | `PORT` | `5000` | Todos |
   | `FRONTEND_URL` | `https://ss-milhas-abc123.vercel.app` | Todos |

   ⚠️ **Substitua:**
   - `MONGODB_URI` pela sua string do MongoDB Atlas
   - `FRONTEND_URL` pela URL do frontend que você anotou no Passo 3

5. **Clique em "Deploy"**

6. **Aguarde 2-3 minutos**

7. **Anote a URL do backend:** Exemplo: `https://ss-milhas-api.vercel.app`

8. **Atualize o Frontend:**
   - Volte ao projeto do frontend no Vercel
   - Vá em "Settings" → "Environment Variables"
   - Edite `REACT_APP_API_URL` com a URL do backend
   - Clique em "Save"
   - Vá em "Deployments" → Clique nos 3 pontinhos → "Redeploy"

---

## 🎯 OPÇÃO 2: Deploy Monolítico (Frontend + Backend juntos)

Se preferir tudo em um único projeto:

1. **Acesse:** https://vercel.com/dashboard
2. **Clique em "New Project"**
3. **Importe do GitHub**

4. **Configure:**
   - **Project Name:** `ss-milhas`
   - **Framework Preset:** `Other`
   - **Root Directory:** (deixe vazio - raiz do projeto)
   - **Build Command:** `cd client && npm install && npm run build`
   - **Output Directory:** `client/build`

5. **Configure TODAS as variáveis de ambiente** (lista completa abaixo)

6. **Clique em "Deploy"**

⚠️ **Nota:** O deploy monolítico pode ter limitações no Vercel para backends. A Opção 1 (separado) é mais recomendada.

---

## 📝 LISTA COMPLETA DE VARIÁVEIS DE AMBIENTE

Para o **Backend**, você precisa destas variáveis:

```env
# OBRIGATÓRIAS:
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/ss-milhas?retryWrites=true&w=majority
JWT_SECRET=qualquer_string_secreta_longa_com_pelo_menos_32_caracteres_123456789
NODE_ENV=production
PORT=5000

# IMPORTANTES:
FRONTEND_URL=https://sua-url-frontend.vercel.app
DB_NAME=ss_milhas
JWT_EXPIRES_IN=7d

# OPCIONAIS (pode deixar vazio para testar):
EMAIL_ENABLED=false
EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=
```

Para o **Frontend**, você precisa:

```env
REACT_APP_API_URL=https://sua-url-backend.vercel.app
```

---

## ✅ VERIFICAR SE FUNCIONOU

### 1. Teste o Frontend:
- Acesse a URL do frontend
- Deve mostrar a tela de login

### 2. Teste o Backend:
- Acesse: `https://sua-url-backend.vercel.app/api/health`
- Deve retornar JSON com status "OK"

### 3. Teste o Login:
- Email: `admin@ssmilhas.com`
- Senha: `admin123`
- Se não funcionar, o usuário admin será criado automaticamente na primeira requisição

---

## 🐛 PROBLEMAS COMUNS

### "Build Failed"
- Veja os logs no Vercel (clique no deployment → "Logs")
- Verifique se o Root Directory está correto (`client` para frontend, `server` para backend)
- Verifique se todas as dependências estão no `package.json`

### "Cannot connect to MongoDB"
- Verifique se a `MONGODB_URI` está correta
- Certifique-se que substituiu `<password>` pela senha real
- Verifique se adicionou o IP `0.0.0.0/0` no MongoDB Atlas

### "CORS Error"
- Verifique se `FRONTEND_URL` está correto no backend
- A URL deve ser exatamente igual (com https, sem barra no final)

### Frontend não conecta ao backend
- Verifique se `REACT_APP_API_URL` está correto no frontend
- Certifique-se que fez redeploy do frontend após adicionar a variável

---

## 🔗 LINKS ÚTEIS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **GitHub:** https://github.com
- **Documentação Vercel:** https://vercel.com/docs

---

## 🎉 PRONTO!

Depois de seguir estes passos, você terá:

- ✅ Frontend rodando: `https://ss-milhas-xyz.vercel.app`
- ✅ Backend rodando: `https://ss-milhas-api.vercel.app`
- ✅ Sistema completo funcionando!

**Dúvidas?** Veja os logs no Vercel Dashboard para identificar problemas específicos.


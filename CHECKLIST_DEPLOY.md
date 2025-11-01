# ✅ Checklist de Deploy - SS Milhas

## 📋 Status da Preparação para Deploy

**Data:** 01/11/2025  
**Repositório:** https://github.com/Adjalma/SS-Milhas  
**Status:** ✅ PRONTO PARA DEPLOY

---

## ✅ Itens Verificados

### 1. Controle de Versão (Git/GitHub)

- [x] Repositório conectado ao GitHub
- [x] Remote configurado: `origin  https://github.com/Adjalma/SS-Milhas.git`
- [x] Branch principal: `main`
- [x] Todos os commits locais enviados (push realizado)
- [x] Working tree limpo (sem arquivos pendentes)
- [x] `.gitignore` configurado corretamente
- [x] Arquivos sensíveis (.env) não estão no repositório

### 2. Configurações do Vercel

- [x] Arquivo `vercel.json` na raiz (projeto completo)
- [x] Arquivo `server/vercel.json` (backend)
- [x] Arquivo `client/vercel.json` (frontend)
- [x] Arquivo `.vercelignore` criado
- [x] Configurações de build corretas
- [x] Rotas (rewrites) configuradas

### 3. Backend (Node.js + Express)

- [x] `package.json` com todas as dependências
- [x] Script de start: `"start": "node index.js"`
- [x] Arquivo principal: `server/index.js`
- [x] Middleware de CORS configurado
- [x] Tratamento de erros implementado
- [x] Suporte a variáveis de ambiente
- [x] Conexão com MongoDB via Mongoose
- [x] Autenticação JWT implementada

### 4. Frontend (React)

- [x] `package.json` com todas as dependências
- [x] Script de build: `"build": "CI=false react-scripts build"`
- [x] Configuração de proxy: `"proxy": "http://localhost:5000"`
- [x] Pasta `build` será gerada no deploy
- [x] Material-UI configurado
- [x] React Router configurado
- [x] Axios para chamadas de API
- [x] Tratamento de erros

### 5. Banco de Dados

- [x] Modelos do Mongoose definidos
- [x] Conexão via variável de ambiente `MONGODB_URI`
- [x] Seeds preparados (scripts/seed*.js)
- [ ] ⚠️ **AÇÃO NECESSÁRIA:** Criar cluster no MongoDB Atlas
- [ ] ⚠️ **AÇÃO NECESSÁRIA:** Configurar IP 0.0.0.0/0 no Atlas

### 6. Segurança

- [x] Senhas hasheadas com bcrypt
- [x] JWT para autenticação
- [x] Helmet configurado no Express
- [x] Rate limiting implementado
- [x] Sanitização de inputs do MongoDB
- [x] CORS configurado
- [x] Validação de dados com express-validator
- [x] Arquivos .env no .gitignore

### 7. Documentação

- [x] README.md atualizado
- [x] DEPLOY_VERCEL.md criado (guia completo)
- [x] CHECKLIST_DEPLOY.md criado (este arquivo)
- [x] Variáveis de ambiente documentadas
- [x] Instruções de instalação
- [x] Estrutura do projeto documentada

---

## 🔧 Últimas Mudanças Enviadas

### Commit 1:
```
94163b7 - feat(users): cria/edita usuários com permissões granulares e padrões por role
```

### Commit 2:
```
e4c61b2 - feat(email): adiciona controle para desabilitar envio de emails via EMAIL_ENABLED
```

**Status:** ✅ Ambos os commits enviados ao GitHub com sucesso

---

## 📋 Variáveis de Ambiente Necessárias

### Backend (Obrigatórias)

```env
# Banco de Dados
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/ss-milhas
DB_NAME=ss_milhas

# Autenticação
JWT_SECRET=gere_uma_chave_aleatoria_de_pelo_menos_32_caracteres
JWT_EXPIRES_IN=7d

# Servidor
PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://sua-url-do-frontend.vercel.app
```

### Backend (Opcionais)

```env
# Email (pode desabilitar)
EMAIL_ENABLED=false
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
EMAIL_FROM=seu_email@gmail.com

# APIs Externas (deixe vazio se não usar)
LATAM_API_KEY=
SMILES_API_KEY=
```

### Frontend

```env
REACT_APP_API_URL=https://sua-url-do-backend.vercel.app
```

---

## 🚀 Próximos Passos para Deploy

### Passo 1: Preparar MongoDB Atlas

1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta (se não tiver)
3. Crie um cluster GRATUITO (M0)
4. Em **Database Access**, crie um usuário
5. Em **Network Access**, adicione IP: `0.0.0.0/0` (permite Vercel)
6. Copie a **Connection String** (URI)
7. Substitua `<password>` pela senha do usuário

**Exemplo de URI:**
```
mongodb+srv://admin:senha123@cluster0.abc123.mongodb.net/ss-milhas?retryWrites=true&w=majority
```

### Passo 2: Gerar JWT Secret

Execute no terminal (Node.js):
```javascript
require('crypto').randomBytes(64).toString('hex')
```

Ou use um gerador online: https://www.grc.com/passwords.htm

### Passo 3: Deploy no Vercel

#### Opção A: Deploy Separado (Recomendado)

**1. Deploy do Backend:**
```
1. Acesse: https://vercel.com/new
2. Importe: Adjalma/SS-Milhas
3. Configure:
   - Name: ss-milhas-backend
   - Root Directory: server
4. Adicione as variáveis de ambiente (Backend Obrigatórias)
5. Deploy!
6. Anote a URL: https://ss-milhas-backend.vercel.app
```

**2. Deploy do Frontend:**
```
1. Acesse: https://vercel.com/new
2. Importe: Adjalma/SS-Milhas (novamente)
3. Configure:
   - Name: ss-milhas-frontend
   - Framework: Create React App
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: build
4. Adicione a variável:
   REACT_APP_API_URL=https://ss-milhas-backend.vercel.app
5. Deploy!
```

**3. Atualizar Backend:**
```
1. Volte ao projeto backend no Vercel
2. Settings > Environment Variables
3. Edite FRONTEND_URL com a URL do frontend
4. Redeploy (Deployments > ... > Redeploy)
```

#### Opção B: Deploy Monolítico

```
1. Acesse: https://vercel.com/new
2. Importe: Adjalma/SS-Milhas
3. Configure:
   - Name: ss-milhas
   - Root Directory: (deixe vazio)
   - Build Command: cd client && npm install && npm run build
   - Output Directory: client/build
4. Adicione TODAS as variáveis de ambiente
5. Deploy!
```

### Passo 4: Testar Aplicação

1. **Acesse o frontend** no navegador
2. **Teste o registro** de um novo usuário
3. **Teste o login**
4. **Verifique o dashboard**
5. **Teste algumas funcionalidades** (criar conta, transação, etc)

### Passo 5: Criar Usuário Admin

Execute via Vercel CLI ou diretamente no servidor:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Entrar no projeto
cd server

# Executar script
vercel dev
# Em outro terminal:
node force-create-admin.js
```

Ou use o MongoDB Atlas Compass para inserir manualmente.

---

## 🐛 Problemas Comuns e Soluções

### 1. Erro: "Cannot connect to MongoDB"

**Solução:**
- Verifique se o IP `0.0.0.0/0` está permitido no Atlas
- Confirme a `MONGODB_URI` nas variáveis de ambiente
- Teste a conexão: `mongosh "sua-connection-string"`

### 2. Erro: "CORS Error"

**Solução:**
- Atualize `FRONTEND_URL` no backend
- Verifique se o CORS está permitindo a origem correta
- Faça redeploy do backend após atualizar

### 3. Erro: "Build Failed"

**Solução:**
- Verifique os logs no Vercel
- Teste localmente: `npm run build` na pasta client
- Verifique se todas as dependências estão no package.json

### 4. Frontend carrega mas não faz login

**Solução:**
- Verifique `REACT_APP_API_URL` no frontend
- Abra o DevTools (F12) e veja erros de rede
- Confirme que o backend está acessível

### 5. Erro: "Module not found"

**Solução:**
- Certifique-se de que `node_modules` está no `.gitignore`
- Vercel vai instalar dependências automaticamente
- Verifique se o `package.json` está correto

---

## 📊 Arquitetura do Deploy

```
┌─────────────────────────────────────────────┐
│           Vercel (Frontend)                 │
│   https://ss-milhas-frontend.vercel.app    │
│                                             │
│   • React 18                                │
│   • Material-UI                             │
│   • Chart.js                                │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTPS/REST API
                   │
┌──────────────────▼──────────────────────────┐
│           Vercel (Backend)                  │
│    https://ss-milhas-backend.vercel.app    │
│                                             │
│   • Node.js + Express                       │
│   • JWT Authentication                      │
│   • Mongoose ODM                            │
└──────────────────┬──────────────────────────┘
                   │
                   │ MongoDB Protocol
                   │
┌──────────────────▼──────────────────────────┐
│         MongoDB Atlas (Database)            │
│   cluster0.mongodb.net                      │
│                                             │
│   • Cloud Database (M0 Free)                │
│   • Automatic Backups                       │
│   • Replication                             │
└─────────────────────────────────────────────┘
```

---

## ✅ Checklist Final Antes do Deploy

- [ ] MongoDB Atlas criado e configurado
- [ ] IP 0.0.0.0/0 permitido no Atlas
- [ ] Connection String do MongoDB copiada
- [ ] JWT Secret gerado
- [ ] Conta no Vercel criada
- [ ] GitHub conectado ao Vercel
- [ ] Variáveis de ambiente preparadas
- [ ] Leu o guia DEPLOY_VERCEL.md

---

## 📞 Links Importantes

- **GitHub:** https://github.com/Adjalma/SS-Milhas
- **Vercel:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Guia Completo:** [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)

---

## 🎉 Status Final

**✅ PROJETO 100% PRONTO PARA DEPLOY NO VERCEL**

Todos os arquivos estão configurados, código está no GitHub, e você pode fazer o deploy a qualquer momento seguindo o guia [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md).

---

**Preparado por:** Especialista em Programação  
**Data:** 01 de Novembro de 2025  
**Versão do Checklist:** 1.0.0


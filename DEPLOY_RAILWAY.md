# 🚂 Deploy do Backend no Railway

## 📋 PASSO A PASSO COMPLETO

### **1. Criar conta no Railway:**
1. Acesse: https://railway.app
2. Clique em "Start a New Project"
3. Faça login com GitHub
4. Autorize o Railway a acessar seus repositórios

### **2. Criar novo projeto:**
1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha o repositório: `Adjalma/SS-Milhas`
4. Clique em "Deploy Now"

### **3. Configurar variáveis de ambiente:**
1. No painel do Railway, clique no seu projeto
2. Vá em "Variables"
3. Adicione as seguintes variáveis:

```
MONGODB_URI=sua_connection_string_mongodb_atlas
JWT_SECRET=seu_secret_super_seguro_aqui
PORT=5000
NODE_ENV=production
```

### **4. Configurar MongoDB Atlas (se não tiver):**
1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um cluster (M0 - Free)
4. Em "Database Access": Crie um usuário
5. Em "Network Access": Adicione IP `0.0.0.0/0` (permitir de qualquer lugar)
6. Clique em "Connect" → "Connect your application"
7. Copie a connection string:
   ```
   mongodb+srv://usuario:senha@cluster.mongodb.net/gestao-milhas?retryWrites=true&w=majority
   ```
8. Cole em `MONGODB_URI` no Railway

### **5. Aguardar deploy:**
- O Railway vai fazer o build automaticamente
- Aguarde ~2-3 minutos
- Quando terminar, você verá a URL do backend

### **6. Copiar URL do backend:**
Exemplo: `https://ss-milhas-production.up.railway.app`

### **7. Configurar no Vercel:**
1. Acesse: https://vercel.com/dashboard
2. Entre no projeto SS-Milhas
3. Vá em "Settings" → "Environment Variables"
4. Adicione:
   ```
   REACT_APP_API_URL=https://sua-url-do-railway.up.railway.app/api
   ```
5. Clique em "Save"
6. Vá em "Deployments"
7. Clique nos 3 pontinhos do último deploy
8. Clique em "Redeploy"

### **8. Testar:**
1. Aguarde o Vercel fazer redeploy (~2 min)
2. Acesse seu site no Vercel
3. Faça login
4. Adicione uma etiqueta
5. ✅ Deve funcionar!

## 🎯 Arquivos Criados

- ✅ `railway.json` - Configuração do Railway
- ✅ `Procfile` - Comando de start
- ✅ `DEPLOY_RAILWAY.md` - Este guia

## ⚡ Comandos Rápidos

```bash
# Adicionar e commitar
git add railway.json Procfile DEPLOY_RAILWAY.md
git commit -m "feat: Adiciona configuração para deploy no Railway"
git push origin main
```

## 🔧 Troubleshooting

### **Erro: "Cannot connect to MongoDB"**
- Verifique se a connection string está correta
- Verifique se o IP 0.0.0.0/0 está permitido no MongoDB Atlas

### **Erro: "Application failed to respond"**
- Verifique se a variável PORT está configurada
- Verifique os logs do Railway

### **Erro: "Module not found"**
- Railway vai instalar as dependências automaticamente
- Verifique se package.json está correto

## ✅ Resultado Final

Depois de seguir todos os passos:
- ✅ Backend rodando no Railway
- ✅ Frontend rodando no Vercel
- ✅ MongoDB no Atlas
- ✅ Tudo integrado e funcionando!

**Tempo estimado: 10-15 minutos** ⏱️

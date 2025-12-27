# 🔧 CORRIGIR PÁGINA EM BRANCO NO VERCEL

## ⚠️ PROBLEMA

Página aparece em branco após deploy no Vercel.

---

## 🔍 DIAGNÓSTICO

A página em branco geralmente ocorre por:

1. **Erro de JavaScript** (mais comum)
2. **Configuração errada no Vercel** (Root Directory, Output Directory)
3. **Rotas não configuradas** (SPA precisa de redirects)
4. **Build falhou** mas não mostrou erro
5. **Erro no AuthContext** ou componente inicial

---

## ✅ SOLUÇÃO 1: Verificar Configuração no Vercel

### **Configurações CORRETAS:**

1. **Acesse:** https://vercel.com/dashboard
2. **Clique no seu projeto**
3. **Vá em Settings → General**

**Verifique:**

- ✅ **Root Directory:** `client` (MUITO IMPORTANTE!)
- ✅ **Build Command:** `npm run build`
- ✅ **Output Directory:** `build`
- ✅ **Install Command:** `npm install`

### **Se estiver errado, corrija:**

1. Clique em **"Edit"** ao lado de "Root Directory"
2. Altere para: `client`
3. Salve
4. Vá em **Deployments** → Clique nos 3 pontinhos → **Redeploy**

---

## ✅ SOLUÇÃO 2: Adicionar Arquivo _redirects

O React Router precisa de um arquivo `_redirects` para funcionar no Vercel.

### **Criar arquivo `client/public/_redirects`:**

```bash
/*    /index.html   200
```

Este arquivo já deve existir, mas vamos verificar.

---

## ✅ SOLUÇÃO 3: Verificar Build Logs

1. **No Vercel Dashboard:**
   - Clique no deployment mais recente
   - Veja os **"Build Logs"**
   - Procure por erros (linhas vermelhas)

### **Erros Comuns:**

- `Module not found` → Dependência faltando
- `Cannot find module` → Arquivo não encontrado
- `SyntaxError` → Erro de sintaxe
- `TypeError` → Erro de tipo

---

## ✅ SOLUÇÃO 4: Verificar Console do Navegador

1. **Abra o site no navegador**
2. **Pressione F12** (abre DevTools)
3. **Vá na aba "Console"**
4. **Veja se há erros em vermelho**

### **Erros Comuns no Console:**

- `Failed to fetch` → API não configurada
- `Cannot read property` → Erro de código
- `ChunkLoadError` → Problema de build
- `CORS error` → Backend não configurado

---

## ✅ SOLUÇÃO 5: Criar/Verificar vercel.json no client

O arquivo `client/vercel.json` deve existir e ter esta configuração:

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
      "dest": "/index.html"
    }
  ]
}
```

---

## ✅ SOLUÇÃO 6: Testar Build Localmente

Antes de fazer deploy, teste o build localmente:

```powershell
cd client
npm install
npm run build
```

**Se der erro:**
- Corrija o erro
- Commit e push
- Redeploy no Vercel

**Se funcionar localmente:**
- O problema é configuração no Vercel
- Verifique Root Directory e Output Directory

---

## ✅ SOLUÇÃO 7: Verificar se _redirects existe

O arquivo `client/public/_redirects` deve existir:

```
/*    /index.html   200
```

**Se não existir, crie:**

1. Crie arquivo: `client/public/_redirects`
2. Adicione conteúdo: `/*    /index.html   200`
3. Commit e push
4. Redeploy

---

## 🔍 CHECKLIST DE VERIFICAÇÃO

### **No Vercel Dashboard:**

- [ ] Root Directory: `client`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Install Command: `npm install`
- [ ] Build Status: ✅ Ready (não erro)
- [ ] Deployments: Último deploy foi bem-sucedido

### **No Código:**

- [ ] Arquivo `client/public/_redirects` existe
- [ ] Arquivo `client/vercel.json` existe e está correto
- [ ] `package.json` tem script `build`: `"build": "CI=false react-scripts build"`
- [ ] Build funciona localmente: `npm run build`

### **No Navegador:**

- [ ] Console (F12) não mostra erros
- [ ] Network (F12 → Network) mostra arquivos carregando
- [ ] Verificar se `index.html` carrega
- [ ] Verificar se arquivos JS carregam

---

## 🚀 SOLUÇÃO RÁPIDA (Teste Esta Primeiro)

### **1. Verificar Root Directory:**

1. Vercel Dashboard → Seu Projeto → Settings → General
2. Root Directory deve ser: `client`
3. Se não for, altere e faça redeploy

### **2. Criar _redirects (se não existir):**

Crie arquivo `client/public/_redirects`:

```
/*    /index.html   200
```

### **3. Commit e Push:**

```powershell
cd "C:\Users\XBZF\Projetos Triarc\Sistema Sentinela\SS_Milhas"
git add .
git commit -m "fix: Adiciona _redirects para SPA no Vercel"
git push
```

### **4. Redeploy no Vercel:**

- O Vercel faz deploy automático
- Ou vá em Deployments → Redeploy

---

## 📝 CONFIGURAÇÃO COMPLETA DO VERCEL.JSON (client/)

Se o problema persistir, certifique-se que `client/vercel.json` está assim:

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
      "dest": "/index.html"
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🐛 ERROS ESPECÍFICOS

### **Erro: "Cannot GET /"**

**Causa:** Rotas não configuradas  
**Solução:** Adicione `_redirects` ou `vercel.json` com rewrites

### **Erro: "ChunkLoadError"**

**Causa:** Build quebrado ou cache  
**Solução:** 
1. Limpe cache do navegador (Ctrl+Shift+Delete)
2. Faça novo deploy no Vercel

### **Erro: "Failed to fetch" ou CORS**

**Causa:** Backend não configurado  
**Solução:** Configure `REACT_APP_API_URL` ou faça deploy do backend

### **Erro: "Loading..." infinito**

**Causa:** AuthContext não consegue conectar ao backend  
**Solução:** Configure backend ou desabilite verificação de auth temporariamente

---

## ✅ TESTE FINAL

Depois de fazer as correções:

1. **Acesse a URL do Vercel**
2. **Pressione F12** → Console
3. **Verifique se há erros**
4. **Deve aparecer:** Tela de login ou dashboard

**Se ainda estiver em branco:**
- Copie os erros do console
- Veja os Build Logs no Vercel
- Verifique se todos os arquivos estão sendo carregados (Network tab)

---

**Próximo passo:** Me diga qual erro aparece no console do navegador (F12) para eu ajudar melhor! 🔍


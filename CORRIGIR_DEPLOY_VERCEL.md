# 🔧 CORRIGIR DEPLOY NO VERCEL

## ⚠️ PROBLEMA IDENTIFICADO

Você está fazendo deploy do **projeto errado**!

**Projeto atual (errado):**
- ❌ `Conexao-Pessoas` 
- ❌ Next.js + Supabase
- ❌ Precisa de variáveis do Supabase

**Projeto correto (SS-Milhas):**
- ✅ React + Express
- ✅ MongoDB
- ✅ Precisa de variáveis do MongoDB

---

## 🎯 SOLUÇÃO 1: Deploy do Projeto Correto (SS-Milhas)

### **Passo a Passo:**

1. **Acesse:** https://vercel.com/dashboard

2. **Delete o projeto atual (Conexao-Pessoas):**
   - Vá em Settings → Scroll até "Delete Project"
   - Confirme a exclusão

3. **Crie Novo Projeto:**
   - Clique em "New Project"
   - Importe do GitHub
   - **IMPORTANTE:** Selecione o repositório **SS-Milhas** (não Conexao-Pessoas)

4. **Configure:**
   - **Root Directory:** `client`
   - **Framework Preset:** `Create React App`
   - **Build Command:** `npm run build` (automático)
   - **Output Directory:** `build` (automático)

5. **Variáveis de Ambiente (se necessário):**
   ```
   REACT_APP_API_URL=https://sua-url-backend.vercel.app
   ```

6. **Deploy!**

---

## 🎯 SOLUÇÃO 2: Se Quiser Continuar com Conexao-Pessoas

Se você realmente quer fazer deploy do projeto **Conexao-Pessoas**, precisa adicionar as variáveis do Supabase:

### **Variáveis Necessárias:**

1. **No Vercel Dashboard:**
   - Vá em Settings → Environment Variables

2. **Adicione estas variáveis:**

   | Nome | Valor | Ambientes |
   |------|-------|-----------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://seu-projeto.supabase.co` | Todos |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sua_chave_anonima_aqui` | Todos |

3. **Onde encontrar os valores:**
   - Acesse: https://app.supabase.com
   - Selecione seu projeto
   - Vá em Settings → API
   - Copie:
     - **URL:** Project URL
     - **Anon Key:** anon/public key

4. **Faça Redeploy:**
   - Vá em Deployments
   - Clique nos 3 pontinhos do último deploy
   - Clique em "Redeploy"

---

## 🔍 VERIFICAR QUAL REPOSITÓRIO ESTÁ CONECTADO

1. No Vercel Dashboard, clique no seu projeto
2. Vá em **Settings** → **Git**
3. Veja o campo **Repository**
4. Se estiver **"Conexao-Pessoas"**, você está no projeto errado!

---

## ✅ CHECKLIST

- [ ] Verifiquei qual repositório está conectado
- [ ] Se for Conexao-Pessoas, deletei e criei novo com SS-Milhas
- [ ] Configurei Root Directory: `client`
- [ ] Adicionei variáveis de ambiente corretas
- [ ] Build funcionou sem erros

---

## 📝 DIFERENÇAS ENTRE OS PROJETOS

| Característica | Conexao-Pessoas | SS-Milhas |
|----------------|-----------------|-----------|
| Framework | Next.js | React (CRA) |
| Backend | Supabase | Express.js |
| Banco | Supabase (PostgreSQL) | MongoDB |
| Variáveis | NEXT_PUBLIC_SUPABASE_* | MONGODB_URI, JWT_SECRET |
| Root Dir | `.` (raiz) | `client` |

---

**Ação recomendada:** Use a Solução 1 para fazer deploy do SS-Milhas corretamente! 🚀


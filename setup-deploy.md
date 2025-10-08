# Setup Completo para Deploy - SS Milhas

## 1. MongoDB Atlas (Banco de Dados)

### Criar conta e cluster:
1. Acesse: https://www.mongodb.com/atlas
2. Crie conta gratuita
3. Crie cluster gratuito (M0 Sandbox)
4. Crie usuário do banco de dados:
   - Username: `ssmilhas-admin`
   - Password: `SenhaSegura123!`
5. Whitelist IP: Adicione `0.0.0.0/0` (permitir qualquer IP)
6. Copie a connection string (exemplo):
   ```
   mongodb+srv://ssmilhas-admin:SenhaSegura123!@cluster0.xxxxx.mongodb.net/gestao-milhas?retryWrites=true&w=majority
   ```

### Configurar no projeto:
1. Edite `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://ssmilhas-admin:SenhaSegura123!@cluster0.xxxxx.mongodb.net/gestao-milhas?retryWrites=true&w=majority
   ```

## 2. GitHub Setup

### Criar repositório:
1. Acesse: https://github.com/new
2. Nome: `ss-milhas`
3. Público ou Privado
4. NÃO inicializar com README

### Commits iniciais:
```bash
git init
git add .
git commit -m "Initial commit - SS Milhas system"
git branch -M main
git remote add origin https://github.com/SEU_USERNAME/ss-milhas.git
git push -u origin main
```

## 3. Vercel Deploy

### Conectar GitHub:
1. Acesse: https://vercel.com/new
2. Importe do GitHub: `SEU_USERNAME/ss-milhas`
3. Configure variáveis de ambiente:
   - `MONGODB_URI`: Sua string do MongoDB Atlas
   - `JWT_SECRET`: Chave secreta para JWT
   - `EMAIL_USER`: Email para notificações
   - `EMAIL_PASS`: Senha do email

### Deploy automático:
- Push para `main` = deploy automático
- Branches = preview deployments

## 4. Estrutura Final

```
ss-milhas/
├── client/          # React frontend
├── server/          # Node.js backend
├── vercel.json      # Configuração Vercel
├── .gitignore       # Arquivos ignorados
└── README.md        # Documentação
```

## 5. URLs de Produção

- **Frontend**: https://ss-milhas.vercel.app
- **API**: https://ss-milhas.vercel.app/api
- **Health Check**: https://ss-milhas.vercel.app/api/health

## 6. Credenciais de Teste

- **Email**: admin@ssmilhas.com
- **Senha**: 123456

## 7. Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Deploy manual (se necessário)
vercel --prod
```

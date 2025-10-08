# Documentação Técnica - Sistema de Gestão de Milhas

## 📋 Visão Geral

Este documento contém informações técnicas detalhadas sobre a arquitetura, tecnologias e implementação do Sistema de Gestão de Milhas.

## 🏗️ Arquitetura

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Banco de Dados**: MongoDB com Mongoose
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Express Validator
- **Upload**: Multer
- **Email**: Nodemailer
- **Documentação**: Swagger/OpenAPI (futuro)

### Frontend (React)
- **Framework**: React 18 com Hooks
- **UI Library**: Material-UI (MUI)
- **Roteamento**: React Router v6
- **Estado**: React Query + Context API
- **Formulários**: React Hook Form + Yup
- **Gráficos**: Chart.js + Recharts
- **Notificações**: React Hot Toast

### Banco de Dados
- **Primário**: MongoDB
- **Cache**: Redis (opcional)
- **Índices**: Otimizados para consultas frequentes

## 🔧 Estrutura de Dados

### Modelo User
```javascript
{
  nome: String,
  email: String (único),
  senha: String (criptografada),
  telefone: String,
  role: String (user/admin/manager),
  status: String (ativo/inativo/suspenso),
  configuracoes: {
    moeda: String,
    tema: String,
    idioma: String
  },
  dadosFinanceiros: {
    cpf: String,
    endereco: Object
  },
  estatisticas: {
    totalContas: Number,
    totalMilhas: Number,
    ultimoLogin: Date
  },
  metas: Array,
  conquistas: Array
}
```

### Modelo Account
```javascript
{
  usuario: ObjectId (ref: User),
  nome: String,
  programa: String (latam-pass/smiles/tudoazul/etc),
  numeroConta: String,
  documento: String,
  saldoAtual: Number,
  controleCPFs: {
    cpfPrincipal: String,
    cpfsUtilizados: Array,
    limiteEmissoes: Number
  },
  credenciais: {
    login: String,
    senha: String (criptografada)
  },
  metricas: {
    totalEntradas: Number,
    totalSaidas: Number,
    lucroTotal: Number
  }
}
```

### Modelo Transaction
```javascript
{
  usuario: ObjectId (ref: User),
  conta: ObjectId (ref: Account),
  tipo: String (compra/venda/transferencia/etc),
  descricao: String,
  quantidade: Number,
  valorUnitario: Number,
  valorTotal: Number,
  contraparte: {
    nome: String,
    documento: String
  },
  lucro: {
    valorBruto: Number,
    valorLiquido: Number,
    margemPercentual: Number
  },
  dadosIR: {
    sujeitoIR: Boolean,
    valorIR: Number
  }
}
```

## 🔐 Segurança

### Autenticação
- JWT com expiração configurável
- Refresh tokens para renovação
- Rate limiting por IP e usuário
- Senhas criptografadas com bcrypt

### Validação
- Sanitização de entrada (express-mongo-sanitize)
- Validação de tipos (express-validator)
- Prevenção XSS
- CORS configurado

### Autorização
- Middleware de autenticação
- Controle de acesso baseado em roles
- Verificação de propriedade de recursos

## 📊 Performance

### Otimizações
- Índices MongoDB otimizados
- Cache com React Query
- Compressão de respostas
- Lazy loading de componentes
- Paginação em listas grandes

### Monitoramento
- Health check endpoint
- Logs estruturados
- Métricas de performance (futuro)

## 🚀 Deployment

### Desenvolvimento
```bash
npm run setup    # Configuração inicial
npm run dev      # Inicia desenvolvimento
```

### Produção
```bash
npm run build    # Build para produção
npm start        # Inicia em produção
```

### Docker
```bash
docker-compose up -d
```

## 🔧 Configuração

### Variáveis de Ambiente

#### Backend (server/.env)
```env
# Servidor
PORT=5000
NODE_ENV=production

# Banco de Dados
MONGODB_URI=mongodb://localhost:27017/gestao-milhas

# Autenticação
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRES_IN=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app

# Upload
MAX_FILE_SIZE=10485760
```

#### Frontend (client/.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_VERSION=1.0.0
```

## 📱 APIs

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário

### Contas
- `GET /api/accounts` - Listar contas
- `POST /api/accounts` - Criar conta
- `PUT /api/accounts/:id` - Atualizar conta
- `DELETE /api/accounts/:id` - Deletar conta

### Transações
- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Deletar transação

### Dashboard
- `GET /api/dashboard/overview` - Visão geral
- `GET /api/dashboard/metrics` - Métricas
- `GET /api/dashboard/kpis` - KPIs

### Relatórios
- `GET /api/reports/financial` - Relatório financeiro
- `GET /api/reports/accounts` - Relatório de contas
- `GET /api/reports/tax` - Relatório de IR

## 🧪 Testes

### Backend
```bash
cd server
npm test              # Testes unitários
npm run test:watch    # Testes em modo watch
npm run test:coverage # Cobertura de testes
```

### Frontend
```bash
cd client
npm test              # Testes unitários
npm run test:coverage # Cobertura de testes
```

## 📈 Monitoramento

### Logs
- Logs estruturados em JSON
- Níveis: error, warn, info, debug
- Rotação automática de logs

### Métricas
- Health check: `/api/health`
- Métricas de performance (futuro)
- Alertas automáticos (futuro)

## 🔄 Integrações

### APIs Externas (Futuro)
- APIs de programas de fidelidade
- Serviços de email/SMS
- Gateways de pagamento
- Serviços de geolocalização

### Webhooks (Futuro)
- Notificações de eventos
- Integração com sistemas externos
- Sincronização de dados

## 🛠️ Manutenção

### Backup
- Backup automático do MongoDB
- Backup de uploads
- Rotação de backups

### Atualizações
- Migrações de banco de dados
- Atualizações de dependências
- Versionamento da API

## 🐛 Troubleshooting

### Problemas Comuns

#### MongoDB não conecta
```bash
# Verificar se MongoDB está rodando
mongosh --eval "db.runCommand('ping')"

# Iniciar MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

#### Porta já em uso
```bash
# Verificar processos na porta
lsof -i :5000
lsof -i :3000

# Matar processo
kill -9 <PID>
```

#### Problemas de permissão
```bash
# Dar permissão aos scripts
chmod +x scripts/*.sh

# Corrigir permissões de upload
chmod -R 755 server/uploads/
```

### Logs
```bash
# Logs da aplicação
tail -f server/logs/app.log

# Logs do Docker
docker-compose logs -f

# Logs específicos
docker-compose logs -f app
```

## 📚 Recursos Adicionais

- [Documentação do Express.js](https://expressjs.com/)
- [Documentação do React](https://reactjs.org/)
- [Documentação do MongoDB](https://docs.mongodb.com/)
- [Documentação do Material-UI](https://mui.com/)
- [Documentação do React Query](https://tanstack.com/query/latest)

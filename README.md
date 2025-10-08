# SS Milhas - Sistema de Gestão de Milhas Aéreas

## 🚀 Visão Geral

Sistema completo e moderno para gestão de milhas aéreas, desenvolvido com tecnologias de ponta e funcionalidades avançadas que superam as soluções existentes no mercado.

## 🌐 Deploy e Produção

### 🚀 Deploy no GitHub

Este projeto está configurado para deploy automático:

1. **Clone o repositório:**
```bash
git clone https://github.com/Adjalma/SS-Milhas.git
cd SS-Milhas
```

2. **Configure o ambiente:**
```bash
# Copie os arquivos de exemplo
cp server/env.example server/.env
cp server/ai/.env.example server/ai/.env

# Configure suas variáveis de ambiente
nano server/.env
nano server/ai/.env
```

3. **Instale dependências:**
```bash
npm run install-all
```

4. **Execute em produção:**
```bash
npm run build
npm start
```

### 📱 URLs de Acesso
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Sistema IA**: http://localhost:8000

### 🔧 Configurações de Produção
- **MongoDB**: Configure URI no `.env`
- **JWT Secret**: Defina chave segura
- **OpenAI API**: Configure chave da API
- **Telegram**: Configure credenciais para monitoramento

## ✨ Funcionalidades Principais

### 🎯 MVP - Funcionalidades Essenciais
- **Gestão de Múltiplas Contas**: Cadastro e controle de contas em diversos programas de fidelidade
- **Controle de Saldos**: Monitoramento em tempo real dos saldos de milhas
- **Controle de CPFs**: Sistema inteligente para evitar bloqueios de contas
- **Lançamento de Operações**: Registro completo de compras, vendas e transferências
- **Dashboard Intuitivo**: Visão geral com métricas importantes e alertas

### 🚀 Diferenciais Competitivos
- **Automação Inteligente**: Integração com APIs e extensões para captura automática de dados
- **Oportunidades Inteligentes**: Monitoramento de promoções e alertas personalizados
- **Gamificação**: Sistema de metas e conquistas para engajamento
- **Relatórios Avançados**: Análises financeiras detalhadas e exportação em múltiplos formatos
- **Interface Moderna**: Design responsivo e experiência de usuário superior
- **Dashboard do Cliente**: Portal dedicado para acompanhamento pelos clientes finais

### 🤖 Sistema de IA Integrado
- **Monitoramento Telegram**: Análise automática de 7+ canais em tempo real
- **OpenAI GPT-4**: Análise contextual de oportunidades de milhas
- **Detecção Inteligente**: Identifica compras/vendas com scoring de confiança
- **Alertas Personalizados**: Notificações baseadas em perfil do usuário
- **Análise de Mercado**: Tendências e previsões automáticas
- **Dashboard IA**: Interface dedicada para monitoramento de oportunidades

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com Express.js
- **MongoDB** com Mongoose
- **JWT** para autenticação
- **Bcrypt** para segurança de senhas
- **Multer** para upload de arquivos
- **Node-cron** para automações
- **Axios** para integrações externas

### Sistema de IA
- **Python 3.11** com FastAPI
- **OpenAI GPT-4** para análise inteligente
- **Telethon** para monitoramento Telegram
- **Motor** (MongoDB async)
- **Redis** para cache
- **Uvicorn** como servidor ASGI

### Frontend
- **React 18** com Hooks
- **TypeScript** para tipagem
- **Material-UI** para componentes
- **Chart.js** para gráficos
- **React Router** para navegação
- **Axios** para comunicação com API
- **React Query** para cache de dados

## 📁 Estrutura do Projeto

```
gestao-milhas-completa/
├── server/                 # Backend Node.js
│   ├── controllers/        # Controladores das rotas
│   ├── models/            # Modelos do banco de dados
│   ├── routes/            # Definição das rotas
│   ├── middleware/        # Middlewares customizados
│   ├── services/          # Lógica de negócio
│   ├── utils/             # Utilitários
│   └── config/            # Configurações
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços de API
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utilitários
│   │   └── styles/        # Estilos globais
│   └── public/            # Arquivos públicos
└── docs/                  # Documentação
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- MongoDB rodando localmente ou acesso a uma instância remota
- Git instalado

### Instalação Rápida (Recomendado)

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd gestao-milhas-completa
```

2. **Execute o script de configuração:**
```bash
npm run setup
```

3. **Configure as variáveis de ambiente:**
```bash
# Edite o arquivo server/.env com suas configurações
nano server/.env
```

4. **Inicie a aplicação:**
```bash
npm run dev
```

5. **Acesse a aplicação:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Instalação Manual

1. **Instale as dependências:**
```bash
npm run install-all
```

2. **Configure as variáveis de ambiente:**
```bash
cp server/env.example server/.env
# Edite o arquivo .env com suas configurações
```

3. **Crie os diretórios necessários:**
```bash
mkdir -p server/uploads/{accounts,transactions,users}
mkdir -p server/logs
```

4. **Execute o projeto:**
```bash
npm run dev
```

### Usando Docker

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd gestao-milhas-completa
```

2. **Configure as variáveis de ambiente:**
```bash
cp server/env.example server/.env
# Edite as configurações no arquivo .env
```

3. **Inicie com Docker Compose:**
```bash
docker-compose up -d
```

4. **Acesse a aplicação:**
- Aplicação: http://localhost:80
- MongoDB: localhost:27017
- Redis: localhost:6379

## 📊 Funcionalidades por Módulo

### 1. Autenticação e Usuários
- Login/registro seguro
- Recuperação de senha
- Perfis de usuário
- Controle de acesso baseado em roles

### 2. Gestão de Contas
- Cadastro de programas de fidelidade
- Sincronização automática de saldos
- Histórico de transações
- Alertas de expiração

### 3. Controle Financeiro
- Fluxo de caixa detalhado
- Cálculo de impostos
- Relatórios de lucratividade
- Exportação para Excel/PDF

### 4. Operações e Transações
- Registro de compras e vendas
- Transferências bonificadas
- Cálculo automático de custos
- Histórico completo

### 5. Dashboard e Relatórios
- Métricas em tempo real
- Gráficos interativos
- KPIs personalizados
- Alertas inteligentes

### 6. Automações
- Monitoramento de promoções
- Notificações por email/SMS
- Sincronização automática
- Backup de dados

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```env
# Banco de Dados
MONGODB_URI=mongodb://localhost:27017/gestao-milhas
DB_NAME=gestao_milhas

# Autenticação
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRES_IN=7d

# Servidor
PORT=5000
NODE_ENV=development

# Email (para notificações)
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app

# APIs Externas (opcional)
LATAM_API_KEY=sua_chave_latam
SMILES_API_KEY=sua_chave_smiles
```

## 📋 Scripts Disponíveis

### Desenvolvimento
```bash
npm run setup          # Configuração inicial do projeto
npm run dev            # Inicia em modo desenvolvimento
npm run dev:ai         # Inicia sistema completo + IA
npm run server         # Inicia apenas o backend
npm run client         # Inicia apenas o frontend
```

### Sistema de IA
```bash
npm run ai:install     # Instala dependências Python
npm run ai:start       # Inicia sistema IA completo
npm run ai:dev         # Inicia API IA em modo desenvolvimento
```

### Produção
```bash
npm run build          # Build para produção
npm run start          # Inicia aplicação em produção
```

### Manutenção
```bash
npm run clean          # Remove node_modules e builds
npm run test           # Executa testes
npm run lint           # Verifica código
npm run format         # Formata código
```

### Docker
```bash
docker-compose up -d   # Inicia com Docker
docker-compose down    # Para containers
docker-compose logs    # Visualiza logs
```

## 📈 Roadmap de Desenvolvimento

### Fase 1 - MVP (Concluída)
- ✅ Estrutura base do projeto
- ✅ Sistema de autenticação
- ✅ Gestão básica de contas
- ✅ Dashboard principal
- ✅ Sistema de transações
- ✅ Relatórios financeiros
- ✅ Notificações e alertas
- ✅ Gamificação e metas

### Fase 2 - Funcionalidades Avançadas
- 🔄 Integrações com APIs externas
- 🔄 Sistema de notificações push
- 🔄 Relatórios avançados com gráficos
- 🔄 Mobile app (React Native)
- 🔄 Extensões para navegador

### Fase 3 - Diferenciais Competitivos
- 📋 IA para recomendações
- 📋 API pública para integrações
- 📋 Marketplace de milhas
- 📋 Integração com bancos
- 📋 Análise preditiva

## 🤝 Contribuição

Este é um projeto proprietário, mas sugestões e melhorias são sempre bem-vindas!

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contato através dos canais oficiais.

---

**Desenvolvido com ❤️ para revolucionar a gestão de milhas aéreas**

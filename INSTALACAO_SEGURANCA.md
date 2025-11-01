# 🔒 GUIA DE INSTALAÇÃO - MELHORIAS DE SEGURANÇA

## 📦 Dependências Necessárias

Para implementar todas as melhorias de segurança, você precisa instalar as seguintes dependências:

### Backend (Node.js)

```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências de segurança
npm install joi winston winston-daily-rotate-file
npm install xss-clean express-slow-down hpp
npm install --save-dev jest supertest

# Ou instalar todas de uma vez
npm install joi winston winston-daily-rotate-file xss-clean express-slow-down hpp
npm install --save-dev jest supertest
```

### Frontend (React)

```bash
# Navegar para a pasta do cliente
cd client

# Instalar dependências de segurança
npm install dompurify js-cookie crypto-js
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Ou instalar todas de uma vez
npm install dompurify js-cookie crypto-js
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

---

## 📚 Descrição das Dependências

### Backend

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| **joi** | ^17.11.0 | Validação robusta de esquemas de dados |
| **winston** | ^3.11.0 | Sistema de logs profissional |
| **winston-daily-rotate-file** | ^4.7.1 | Rotação automática de arquivos de log |
| **xss-clean** | ^0.1.4 | Proteção contra ataques XSS |
| **express-slow-down** | ^2.0.1 | Slowdown progressivo para rate limiting |
| **hpp** | ^0.2.3 | Proteção contra HTTP Parameter Pollution |
| **jest** | ^29.7.0 | Framework de testes |
| **supertest** | ^6.3.3 | Testes de API HTTP |

### Frontend

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| **dompurify** | ^3.0.6 | Sanitização de HTML no cliente |
| **js-cookie** | ^3.0.5 | Gerenciamento seguro de cookies |
| **crypto-js** | ^4.2.0 | Criptografia no cliente |
| **@testing-library/react** | ^14.0.0 | Testes de componentes React |
| **@testing-library/jest-dom** | ^6.1.4 | Matchers customizados para Jest |
| **@testing-library/user-event** | ^14.5.1 | Simulação de eventos de usuário |

---

## 🚀 Passos de Instalação

### 1. Backend

```bash
# 1. Navegar para a pasta do servidor
cd server

# 2. Instalar dependências de produção
npm install joi@^17.11.0 winston@^3.11.0 winston-daily-rotate-file@^4.7.1 xss-clean@^0.1.4 express-slow-down@^2.0.1 hpp@^0.2.3

# 3. Instalar dependências de desenvolvimento
npm install --save-dev jest@^29.7.0 supertest@^6.3.3

# 4. Verificar instalação
npm list joi winston xss-clean

# 5. Atualizar package.json com script de testes
# Adicione ao package.json:
# "scripts": {
#   "test": "jest --coverage",
#   "test:watch": "jest --watch",
#   "test:security": "jest --testPathPattern=security"
# }
```

### 2. Frontend

```bash
# 1. Navegar para a pasta do cliente
cd ../client

# 2. Instalar dependências de produção
npm install dompurify@^3.0.6 js-cookie@^3.0.5 crypto-js@^4.2.0

# 3. Instalar dependências de desenvolvimento
npm install --save-dev @testing-library/react@^14.0.0 @testing-library/jest-dom@^6.1.4 @testing-library/user-event@^14.5.1

# 4. Verificar instalação
npm list dompurify js-cookie crypto-js
```

### 3. Voltar para a raiz do projeto

```bash
cd ..
```

---

## 🔧 Configuração Pós-Instalação

### 1. Criar arquivo de configuração do Jest (Backend)

Criar `server/jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**'
  ],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### 2. Criar diretório de logs

```bash
mkdir -p server/logs
echo "*.log" >> server/logs/.gitignore
```

### 3. Atualizar variáveis de ambiente

Adicionar ao arquivo `.env`:

```env
# Configurações de Log
LOG_LEVEL=info
LOG_TO_FILE=true

# Configurações de Segurança
CSRF_ENABLED=true
XSS_PROTECTION=true
RATE_LIMIT_ENABLED=true

# Configurações de Rate Limiting
LOGIN_RATE_LIMIT=5
REGISTER_RATE_LIMIT=3
PASSWORD_RESET_RATE_LIMIT=3

# Configurações de JWT
JWT_SECRET=seu_secret_aqui_muito_seguro_e_complexo_12345
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

---

## ✅ Verificação da Instalação

### Backend

```bash
cd server

# Verificar se todas as dependências foram instaladas
npm list | grep -E "(joi|winston|xss-clean|hpp|jest|supertest)"

# Executar testes (se houver)
npm test

# Iniciar servidor em modo desenvolvimento
npm run dev
```

### Frontend

```bash
cd client

# Verificar se todas as dependências foram instaladas
npm list | grep -E "(dompurify|js-cookie|crypto-js)"

# Executar testes (se houver)
npm test

# Iniciar aplicação em modo desenvolvimento
npm start
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'joi'"

**Solução:**
```bash
cd server
npm install joi
```

### Erro: "Cannot find module 'winston'"

**Solução:**
```bash
cd server
npm install winston winston-daily-rotate-file
```

### Erro: "Peer dependencies not met"

**Solução:**
```bash
npm install --legacy-peer-deps
```

### Erro de permissões ao criar diretório de logs

**Solução:**
```bash
# Linux/Mac
sudo mkdir -p server/logs
sudo chown -R $USER:$USER server/logs

# Windows (executar como administrador)
mkdir server\logs
```

---

## 📊 Estrutura de Arquivos Após Instalação

```
SS_Milhas/
├── server/
│   ├── middleware/
│   │   ├── auth.js ✅ (existente - atualizado)
│   │   ├── errorHandler.js ✅ (existente)
│   │   ├── validation.js 🆕 (novo)
│   │   └── security.js 🆕 (novo)
│   ├── utils/
│   │   └── logger.js 🆕 (novo)
│   ├── logs/ 🆕 (novo diretório)
│   │   ├── .gitignore
│   │   ├── error.log (gerado automaticamente)
│   │   ├── combined.log (gerado automaticamente)
│   │   ├── security.log (gerado automaticamente)
│   │   ├── audit.log (gerado automaticamente)
│   │   └── performance.log (gerado automaticamente)
│   ├── tests/ 🆕 (será criado)
│   ├── jest.config.js 🆕 (será criado)
│   └── package.json ✅ (atualizado)
├── AUDITORIA_SEGURANCA.md 🆕 (novo)
├── INSTALACAO_SEGURANCA.md 🆕 (este arquivo)
└── .env ✅ (atualizado)
```

---

## 🔐 Próximos Passos

Após a instalação:

1. ✅ Verificar se todas as dependências foram instaladas
2. ✅ Criar arquivo de configuração do Jest
3. ✅ Criar diretório de logs
4. ✅ Atualizar variáveis de ambiente
5. ✅ Atualizar server/index.js com novos middlewares
6. ✅ Testar localmente
7. ✅ Fazer commit das alterações
8. ✅ Deploy no Vercel
9. ✅ Monitorar logs de segurança
10. ✅ Configurar alertas de segurança

---

## 📞 Suporte

Em caso de problemas:

1. Verificar versões do Node.js e npm:
   ```bash
   node --version  # Deve ser >= 14.0.0
   npm --version   # Deve ser >= 6.0.0
   ```

2. Limpar cache do npm:
   ```bash
   npm cache clean --force
   ```

3. Reinstalar dependências:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. Verificar logs de erro:
   ```bash
   npm ERR! 
   # Logs aparecem aqui
   ```

---

**Última Atualização:** 01/11/2025  
**Responsável:** Especialista em Segurança


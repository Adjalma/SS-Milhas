# Sistema de Etiquetas - Banco de Dados

## 🗄️ Estrutura do Banco de Dados

### **Modelo: CPFControl**

```javascript
{
  // Identificação
  _id: ObjectId,
  usuario: ObjectId (ref: 'User'),
  
  // Dados do CPF
  nome: String (required),
  cpf: String (required, format: xxx.xxx.xxx-xx),
  
  // Programa
  programa: ObjectId (ref: 'Program'),
  programaNome: String (required),
  categoria: String (enum: Nacional, Internacional, Bancário, Hotel, Varejo, Outros),
  
  // ⭐ ETIQUETA - Campo Principal
  etiqueta: String (max: 500 caracteres),
  
  // Controle de uso
  cpfUsados: Number (default: 0),
  limiteCPF: Number (default: null),
  
  // Milhas e valores
  milhas: Number (default: 0),
  cm: Number (default: 0),
  valor: Number (default: 0),
  
  // Status
  status: String (enum: ativo, bloqueado, suspenso, verificando, inativo),
  favorito: Boolean (default: false),
  
  // Datas
  dataCadastro: Date,
  dataUltimoUso: Date,
  dataVencimento: Date,
  
  // Alertas
  alertas: [{
    tipo: String,
    mensagem: String,
    data: Date
  }],
  
  observacoes: String,
  
  // 📝 Histórico de Etiquetas (Auditoria)
  historicoEtiquetas: [{
    etiqueta: String,
    usuario: ObjectId (ref: 'User'),
    data: Date
  }],
  
  // Metadados
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### **1. Listar CPFs**
```
GET /api/cpf-control
Query params: categoria, status, programa
```

### **2. Listar CPFs com Etiquetas**
```
GET /api/cpf-control/com-etiquetas
```

### **3. Buscar CPF Específico**
```
GET /api/cpf-control/:id
```

### **4. Criar Novo CPF**
```
POST /api/cpf-control
Body: {
  nome, cpf, programa, programaNome, categoria,
  etiqueta, cpfUsados, limiteCPF, milhas, cm, valor
}
```

### **5. Atualizar CPF**
```
PUT /api/cpf-control/:id
Body: { campos a atualizar }
```

### **6. Atualizar Apenas Etiqueta** ⭐
```
PUT /api/cpf-control/:id/etiqueta
Body: { etiqueta: "texto da etiqueta" }
```

### **7. Adicionar Alerta**
```
POST /api/cpf-control/:id/alerta
Body: { tipo, mensagem }
```

### **8. Deletar CPF**
```
DELETE /api/cpf-control/:id
```

### **9. Estatísticas**
```
GET /api/cpf-control/stats/resumo
```

## 💾 Persistência Híbrida

### **Sistema de Dupla Camada:**

```
┌─────────────────────────────────────┐
│         FRONTEND (React)            │
│                                     │
│  1. Usuário edita etiqueta          │
│  2. Salva no Banco de Dados ✅      │
│  3. Salva no localStorage (backup)  │
│  4. Atualiza UI                     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│      API (Express + MongoDB)        │
│                                     │
│  • Valida dados                     │
│  • Salva no MongoDB                 │
│  • Mantém histórico                 │
│  • Retorna confirmação              │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│      BANCO DE DADOS (MongoDB)       │
│                                     │
│  • Armazena permanentemente         │
│  • Índices para busca rápida        │
│  • Histórico de alterações          │
│  • Backup automático                │
└─────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### **Salvar Etiqueta:**
1. Usuário digita etiqueta
2. Clica em "Salvar"
3. **Frontend:**
   - Chama API: `atualizarEtiqueta(id, etiqueta)`
   - Aguarda resposta
4. **Backend:**
   - Valida dados
   - Salva no MongoDB
   - Adiciona ao histórico
   - Retorna sucesso
5. **Frontend:**
   - Atualiza UI
   - Salva no localStorage (backup)
   - Mostra confirmação

### **Carregar Etiquetas:**
1. Usuário abre página
2. **Frontend:**
   - Busca do banco: `listarCPFs()`
   - Se falhar, busca do localStorage
3. **Backend:**
   - Retorna CPFs do usuário
   - Inclui todas as etiquetas
4. **Frontend:**
   - Exibe dados
   - Sincroniza com localStorage

## 🛡️ Segurança

### **Autenticação:**
- Token JWT em todas as requisições
- Middleware `authMiddleware` valida usuário
- Cada usuário vê apenas seus próprios CPFs

### **Validações:**
- CPF no formato correto
- Campos obrigatórios
- Tamanho máximo da etiqueta (500 caracteres)
- Duplicação de CPF por programa

### **Auditoria:**
- Histórico de alterações de etiquetas
- Registro de quem alterou e quando
- Logs de erros e tentativas

## 📊 Índices do Banco

```javascript
// Índices criados automaticamente
cpfControlSchema.index({ usuario: 1, programa: 1 });
cpfControlSchema.index({ usuario: 1, cpf: 1 });
cpfControlSchema.index({ usuario: 1, categoria: 1 });
cpfControlSchema.index({ usuario: 1, status: 1 });
cpfControlSchema.index({ nome: 'text', cpf: 'text', etiqueta: 'text' });
```

## 🚀 Como Usar

### **No Frontend:**

```javascript
import { atualizarEtiqueta } from '../../services/cpfControlAPI';

// Atualizar etiqueta
const handleSalvar = async () => {
  try {
    await atualizarEtiqueta(cpfId, novaEtiqueta);
    console.log('Salvo no banco de dados!');
  } catch (error) {
    console.error('Erro:', error);
    // Fallback para localStorage
  }
};
```

### **No Backend:**

```javascript
// Rota já configurada
PUT /api/cpf-control/:id/etiqueta

// Uso:
const cpf = await CPFControl.findOne({ _id, usuario });
await cpf.atualizarEtiqueta(novaEtiqueta, usuarioId);
```

## 🔧 Configuração

### **1. Variáveis de Ambiente:**
```env
MONGODB_URI=mongodb://localhost:27017/ss_milhas
JWT_SECRET=seu_secret_aqui
```

### **2. Iniciar Servidor:**
```bash
cd server
npm install
npm start
```

### **3. Registrar Rota no Server:**
```javascript
// server/index.js ou server/app.js
const cpfControlRoutes = require('./routes/cpfControl');
app.use('/api/cpf-control', cpfControlRoutes);
```

## 📈 Vantagens

### **✅ Banco de Dados:**
- ✅ Persistência permanente
- ✅ Não perde dados ao limpar cache
- ✅ Sincronização entre dispositivos
- ✅ Backup automático
- ✅ Histórico de alterações
- ✅ Busca avançada
- ✅ Estatísticas em tempo real

### **✅ localStorage (Backup):**
- ✅ Funciona offline
- ✅ Resposta instantânea
- ✅ Fallback em caso de erro
- ✅ Cache local

## 🔄 Migração de Dados

### **Migrar do localStorage para Banco:**
```javascript
import { migrarDadosLocalStorage } from '../../services/cpfControlAPI';

// Executar uma vez
const migrar = async () => {
  const resultado = await migrarDadosLocalStorage();
  console.log(`Migrados: ${resultado.count}/${resultado.total}`);
};
```

## 📝 Histórico de Etiquetas

Cada alteração de etiqueta é registrada:

```javascript
{
  historicoEtiquetas: [
    {
      etiqueta: "Texto antigo",
      usuario: ObjectId("..."),
      data: "2024-01-15T10:30:00Z"
    },
    {
      etiqueta: "Texto novo",
      usuario: ObjectId("..."),
      data: "2024-01-20T14:45:00Z"
    }
  ]
}
```

## 🎯 Próximos Passos

1. ✅ Modelo criado
2. ✅ API implementada
3. ✅ Frontend integrado
4. ⏳ Registrar rota no servidor
5. ⏳ Testar endpoints
6. ⏳ Migrar dados existentes
7. ⏳ Deploy

## 🆘 Troubleshooting

### **Erro: "Cannot connect to MongoDB"**
- Verifique se MongoDB está rodando
- Confira MONGODB_URI no .env

### **Erro: "Token inválido"**
- Faça login novamente
- Verifique JWT_SECRET

### **Erro: "CPF já cadastrado"**
- Cada CPF pode ser cadastrado uma vez por programa
- Use PUT para atualizar

## ✅ Pronto!

Agora todas as etiquetas são salvas permanentemente no banco de dados MongoDB! 🎉

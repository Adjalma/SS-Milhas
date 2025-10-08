# 🧪 Guia de Teste - Sistema de Banco de Dados

## ✅ TUDO ESTÁ CONFIGURADO!

### **O que foi feito:**
1. ✅ Modelo `CPFControl` criado
2. ✅ Rotas da API criadas
3. ✅ Serviço frontend criado
4. ✅ Rota registrada no servidor (`/api/cpf-control`)
5. ✅ Modelo importado no servidor
6. ✅ Integração nas páginas frontend

## 🚀 Como Testar

### **1. Verificar se MongoDB está rodando:**

```bash
# Windows
mongod --version

# Se não estiver instalado, baixe em:
# https://www.mongodb.com/try/download/community
```

### **2. Iniciar o Servidor:**

```bash
cd server
npm install
npm start
```

**Você verá:**
```
✅ MongoDB conectado: localhost
🚀 Servidor iniciado com sucesso!
📍 Porta: 5000
```

### **3. Testar no Frontend:**

1. **Abra o app:** `http://localhost:3000`
2. **Faça login**
3. **Vá para:** `/dashboard/controle-programas` ou `/dashboard/monitoramento-cpf`
4. **Adicione uma etiqueta:**
   - Clique no campo de etiqueta
   - Digite: "Teste de banco de dados"
   - Clique em "Salvar"

5. **Verifique no Console (F12):**
   - Deve aparecer: **"Etiqueta salva no banco de dados com sucesso!"**

6. **Teste de Persistência:**
   - Limpe o cache do navegador (Ctrl+Shift+Del)
   - Recarregue a página
   - ✅ **A etiqueta ainda está lá!**

### **4. Verificar no MongoDB:**

```bash
# Abrir MongoDB Shell
mongosh

# Usar o banco
use gestao-milhas

# Ver os CPFs cadastrados
db.cpfcontrols.find().pretty()

# Ver apenas etiquetas
db.cpfcontrols.find({ etiqueta: { $ne: "" } }, { nome: 1, etiqueta: 1 })

# Contar CPFs com etiquetas
db.cpfcontrols.countDocuments({ etiqueta: { $ne: "" } })
```

### **5. Testar API Diretamente:**

```bash
# 1. Fazer login e pegar o token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","senha":"suasenha"}'

# Copie o token retornado

# 2. Listar CPFs
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  http://localhost:5000/api/cpf-control

# 3. Atualizar etiqueta
curl -X PUT http://localhost:5000/api/cpf-control/ID_DO_CPF/etiqueta \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"etiqueta":"Etiqueta via API"}'

# 4. Ver estatísticas
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  http://localhost:5000/api/cpf-control/stats/resumo
```

## 🔍 Verificações

### **✅ Checklist:**

- [ ] MongoDB está instalado e rodando
- [ ] Servidor backend iniciou sem erros
- [ ] Frontend conecta com backend
- [ ] Login funciona
- [ ] Consegue adicionar etiqueta
- [ ] Console mostra "salvo no banco de dados"
- [ ] Etiqueta persiste após limpar cache
- [ ] MongoDB tem os dados salvos

## 🐛 Troubleshooting

### **Erro: "Cannot connect to MongoDB"**

**Solução:**
```bash
# Iniciar MongoDB
mongod

# Ou no Windows (como serviço)
net start MongoDB
```

### **Erro: "Token inválido"**

**Solução:**
- Faça login novamente
- Verifique se o token está sendo enviado no header

### **Erro: "Rota não encontrada"**

**Solução:**
- Reinicie o servidor
- Verifique se `server/index.js` tem a linha:
  ```javascript
  app.use('/api/cpf-control', authMiddleware, cpfControlRoutes);
  ```

### **Etiqueta não salva**

**Solução:**
1. Abra o Console (F12)
2. Veja se há erros
3. Verifique se o servidor está rodando
4. Se falhar, salva no localStorage como backup

## 📊 Estrutura do Banco

```
MongoDB (localhost:27017)
└── gestao-milhas
    ├── users (usuários)
    ├── accounts (contas)
    ├── programs (programas)
    └── cpfcontrols ⭐ (CPFs com etiquetas)
        ├── _id: ObjectId
        ├── usuario: ObjectId
        ├── nome: String
        ├── cpf: String
        ├── programa: ObjectId
        ├── programaNome: String
        ├── categoria: String
        ├── etiqueta: String ⭐
        ├── historicoEtiquetas: Array
        ├── milhas: Number
        ├── valor: Number
        └── ...
```

## 🎯 Exemplo de Teste Completo

```javascript
// 1. No Console do navegador (F12)

// Ver se a API está respondendo
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log);

// 2. Adicionar etiqueta (após login)
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/cpf-control', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(data => {
    console.log('CPFs cadastrados:', data);
  });

// 3. Atualizar etiqueta
const cpfId = 'ID_DO_CPF_AQUI';
fetch(`http://localhost:5000/api/cpf-control/${cpfId}/etiqueta`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ etiqueta: 'Teste via Console' })
})
  .then(r => r.json())
  .then(console.log);
```

## ✅ Resultado Esperado

Após os testes, você deve ver:

1. ✅ Servidor rodando sem erros
2. ✅ MongoDB conectado
3. ✅ Etiquetas salvando no banco
4. ✅ Console mostrando sucesso
5. ✅ Dados persistindo após limpar cache
6. ✅ MongoDB com os registros salvos

## 🎉 Pronto!

Se todos os testes passarem, **o sistema está 100% funcional** e salvando tudo no banco de dados MongoDB!

**Não vai mais perder dados ao limpar o cache!** 🚀💾

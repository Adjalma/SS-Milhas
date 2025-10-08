# 🚀 COMO INICIAR O SISTEMA COMPLETO

## ⚡ COMANDOS RÁPIDOS

### **1. Parar tudo que está rodando:**
```powershell
Stop-Process -Name node -Force
```

### **2. Iniciar MongoDB:**
```powershell
net start MongoDB
```

### **3. Iniciar Backend:**
```powershell
cd D:\SS_Milhas\server
npm start
```

**Aguarde ver:**
```
✅ MongoDB conectado: localhost
🚀 Servidor iniciado com sucesso!
📍 Porta: 5000
```

### **4. Popular banco de dados (PRIMEIRA VEZ):**
```powershell
# Em outro terminal
cd D:\SS_Milhas\server
npm run seed:cpf
```

### **5. Iniciar Frontend:**
```powershell
# Em outro terminal
cd D:\SS_Milhas\client
npm start
```

## 📝 Login de Teste

Se o seed criou usuário de teste:
- **Email:** `teste@teste.com`
- **Senha:** `teste123`

Ou use seu usuário existente.

## ✅ Pronto!

Agora acesse:
- `http://localhost:3000/dashboard/controle-programas`
- `http://localhost:3000/dashboard/monitoramento-cpf`

E as etiquetas serão salvas no MongoDB! 🎉

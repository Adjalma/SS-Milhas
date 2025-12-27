# 🔑 Credenciais de Acesso - SS Milhas

## 👤 Administrador Principal

**Email:** `admin@ssmilhas.com`  
**Senha:** `admin123`

---

## 👥 Outras Credenciais (se criadas)

### Usuário Admin Alternativo
**Email:** `admin@ssmilhas.com`  
**Senha:** `admin123`

### Usuário de Teste
**Email:** `teste@teste.com`  
**Senha:** `teste123`

---

## 📝 Notas Importantes

1. **Credenciais padrão**: O sistema cria automaticamente o usuário admin ao iniciar pela primeira vez.

2. **Se não conseguir fazer login**:
   - Verifique se o backend está rodando
   - Verifique se o MongoDB está conectado
   - O usuário admin é criado automaticamente ao iniciar o servidor

3. **Criar/Resetar Admin Manualmente**:
   ```bash
   cd server
   node create-admin.js
   ```
   Ou acesse a rota (se backend estiver rodando):
   ```
   POST http://localhost:5000/api/create-admin
   ```

4. **Resetar Senha do Admin**:
   ```
   POST http://localhost:5000/api/reset-admin-password
   ```

---

## 🔒 Segurança

⚠️ **IMPORTANTE**: Estas são credenciais padrão de desenvolvimento.  
Em produção, altere imediatamente as senhas padrão!


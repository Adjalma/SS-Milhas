# 🔓 Acesso sem Login - Modo Desenvolvimento

## ✅ Funcionalidade Implementada

Agora é possível acessar o sistema **sem precisar fazer login** quando estiver em modo de desenvolvimento.

## 🚀 Como Usar

### Opção 1: Botão na Tela de Login

1. Inicie o sistema normalmente
2. Acesse a tela de login
3. Clique no botão **"🔓 Acessar sem Login (Desenvolvimento)"**
4. O sistema será recarregado e você entrará automaticamente

### Opção 2: Ativar Manualmente

1. Abra o Console do navegador (F12)
2. Execute:
   ```javascript
   localStorage.setItem('DEV_NO_AUTH', 'true');
   window.location.reload();
   ```
3. Você entrará automaticamente

### Opção 3: Variável de Ambiente (Para sempre ativo)

No arquivo `.env` do client:
```
REACT_APP_NO_AUTH=true
```

## 👤 Usuário Mock

Quando acessar sem login, será criado um usuário mock com:

- **Nome:** Usuário Desenvolvimento
- **Email:** dev@localhost
- **Role:** admin
- **Permissões:** Todas (financeiro, valores, relatórios, monitoramento, cadastros)

## 🔒 Desativar Modo Sem Login

### Opção 1: Botão na Aplicação

Se implementado no menu, clique em "Desativar Modo Dev"

### Opção 2: Manualmente

1. Abra o Console do navegador (F12)
2. Execute:
   ```javascript
   localStorage.removeItem('DEV_NO_AUTH');
   window.location.reload();
   ```

## ⚠️ Importante

- **Este modo SÓ funciona em desenvolvimento** (`NODE_ENV === 'development'`)
- **NÃO funciona em produção** por segurança
- Todas as requisições para a API podem falhar se o backend não estiver configurado para aceitar requisições sem token
- Use apenas para desenvolvimento e testes locais

## 🔧 Configuração Técnica

O sistema verifica:
1. `REACT_APP_NO_AUTH === 'true'` (variável de ambiente)
2. OU `localStorage.getItem('DEV_NO_AUTH') === 'true'` (modo manual)
3. E `NODE_ENV === 'development'` (apenas em desenvolvimento)

Se todas as condições forem verdadeiras, o sistema:
- Cria um usuário mock automaticamente
- Pula todas as verificações de autenticação
- Permite acesso a todas as rotas protegidas

## 📝 Notas

- As requisições para o backend ainda podem falhar se exigirem autenticação
- Para funcionar completamente, você pode precisar ajustar o backend para aceitar requisições sem token em desenvolvimento
- Este é um recurso de desenvolvimento, NÃO deve ser usado em produção


# Configuração do WhatsApp Business API

## 📱 Configuração para Envio Direto de Mensagens

### 1. Criar Conta WhatsApp Business
1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Crie uma conta ou faça login
3. Vá para "Meus Apps" e clique em "Criar App"
4. Selecione "Negócios" como tipo de app
5. Preencha os dados do seu negócio

### 2. Configurar WhatsApp Business API
1. No painel do seu app, vá para "Produtos"
2. Adicione o produto "WhatsApp Business API"
3. Configure o número de telefone para teste
4. Anote o **Phone Number ID** e **Access Token**

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na pasta `server/` com:

```env
# WhatsApp Business API
WHATSAPP_TOKEN=seu_token_aqui
WHATSAPP_PHONE_ID=seu_phone_id_aqui
WEBHOOK_VERIFY_TOKEN=seu_token_verificacao_aqui

# Servidor
PORT=5000
NODE_ENV=development
USE_MOCK_WHATSAPP=false
```

### 4. Configurar Webhook (Opcional)
Para receber mensagens e status:

1. No painel do WhatsApp Business API
2. Vá para "Configuração"
3. Adicione a URL do webhook: `https://seu-dominio.com/api/whatsapp/webhook`
4. Defina o token de verificação
5. Inscreva-se nos webhooks desejados

### 5. Modo Desenvolvimento
Para testar sem configurar a API real:

```env
USE_MOCK_WHATSAPP=true
```

Isso ativará o modo mock que simula o envio de mensagens.

### 6. Testar a Integração
1. Inicie o servidor: `npm run dev`
2. Acesse a página de WhatsApp no app
3. Digite uma mensagem e clique em "Enviar"
4. A mensagem será enviada diretamente para o WhatsApp

### 7. Estrutura de Arquivos Criada
```
server/
├── api/
│   └── whatsapp.js          # Endpoints da API
├── services/
│   └── whatsapp.service.js  # Serviço de integração
├── config/
│   └── whatsapp.config.js   # Configurações
└── .env                     # Variáveis de ambiente
```

### 8. Endpoints Disponíveis
- `POST /api/whatsapp/send` - Enviar mensagem
- `GET /api/whatsapp/account-info` - Info da conta
- `POST /api/whatsapp/webhook` - Receber webhooks
- `GET /api/whatsapp/webhook` - Verificar webhook

### 9. Limitações da API
- **Teste**: 250 mensagens/mês
- **Produção**: Limites baseados no plano
- **Rate Limit**: 1000 mensagens/dia (gratuito)
- **Formato**: Números devem estar no formato internacional

### 10. Troubleshooting
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o token tem as permissões necessárias
- Use o modo mock para desenvolvimento
- Verifique os logs do servidor para erros

## 🚀 Pronto!
Agora o app envia mensagens diretamente via WhatsApp Business API!

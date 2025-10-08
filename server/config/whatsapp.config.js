// Carregar variáveis de ambiente
require('dotenv').config();

module.exports = {
  // Configurações do WhatsApp Business API
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || 'your_whatsapp_token_here',
    phoneId: process.env.WHATSAPP_PHONE_ID || 'your_phone_id_here',
    apiUrl: 'https://graph.facebook.com/v18.0',
    webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN || 'your_verify_token_here'
  },

  // Configurações do servidor
  server: {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development'
  },

  // Configurações de desenvolvimento
  development: {
    // Para desenvolvimento, você pode usar um mock
    useMock: process.env.USE_MOCK_WHATSAPP === 'true' || true
  }
};

const config = require('../config/whatsapp.config');

class WhatsAppService {
  constructor() {
    this.useMock = config.development.useMock;
  }

  async sendMessage(to, message, type = 'text') {
    if (this.useMock) {
      return this.sendMockMessage(to, message, type);
    }
    
    return this.sendRealMessage(to, message, type);
  }

  async sendMockMessage(to, message, type) {
    console.log(`[MOCK] Enviando mensagem para ${to}: ${message}`);
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular sucesso
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
      message: 'Mensagem enviada com sucesso (MOCK)',
      timestamp: new Date().toISOString()
    };
  }

  async sendRealMessage(to, message, type) {
    try {
      const formattedNumber = to.replace(/\D/g, '');
      
      const payload = {
        messaging_product: 'whatsapp',
        to: formattedNumber,
        type: type,
        text: {
          body: message
        }
      };

      const response = await fetch(`${config.whatsapp.apiUrl}/${config.whatsapp.phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.whatsapp.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Mensagem enviada com sucesso:', result);
        
        return {
          success: true,
          messageId: result.messages[0].id,
          message: 'Mensagem enviada com sucesso',
          timestamp: new Date().toISOString()
        };
      } else {
        const error = await response.text();
        console.error('Erro ao enviar mensagem:', error);
        
        throw new Error(`Erro ao enviar mensagem: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro no serviço WhatsApp:', error);
      throw error;
    }
  }

  async getAccountInfo() {
    if (this.useMock) {
      return {
        id: 'mock_phone_id',
        display_phone_number: '+55 22 97403-2357',
        verified_name: 'SS Milhas Support'
      };
    }

    try {
      const response = await fetch(`${config.whatsapp.apiUrl}/${config.whatsapp.phoneId}`, {
        headers: {
          'Authorization': `Bearer ${config.whatsapp.token}`
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Erro ao obter informações da conta: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao obter informações da conta:', error);
      throw error;
    }
  }

  async verifyWebhook(mode, token, challenge) {
    if (token === config.whatsapp.webhookVerifyToken && mode === 'subscribe') {
      return challenge;
    }
    throw new Error('Token de verificação inválido');
  }

  processWebhook(entry) {
    try {
      if (entry && entry.length > 0) {
        const changes = entry[0].changes;
        
        if (changes && changes.length > 0) {
          const value = changes[0].value;
          
          // Processar mensagens recebidas
          if (value.messages) {
            value.messages.forEach(message => {
              console.log('Mensagem recebida:', message);
              // Aqui você pode processar as mensagens recebidas
            });
          }
          
          // Processar status de mensagens
          if (value.statuses) {
            value.statuses.forEach(status => {
              console.log('Status da mensagem:', status);
              // Aqui você pode atualizar o status das mensagens
            });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();

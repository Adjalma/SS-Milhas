const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsapp.service');

// Endpoint para enviar mensagem via WhatsApp
router.post('/send', async (req, res) => {
  try {
    const { to, message, type = 'text' } = req.body;

    if (!to || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'Número de telefone e mensagem são obrigatórios' 
      });
    }

    const result = await whatsappService.sendMessage(to, message, type);
    res.json(result);

  } catch (error) {
    console.error('Erro interno:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Endpoint para receber webhooks do WhatsApp
router.post('/webhook', (req, res) => {
  try {
    const { entry } = req.body;
    whatsappService.processWebhook(entry);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send('Erro interno');
  }
});

// Endpoint para verificar webhook (verificação do WhatsApp)
router.get('/webhook', (req, res) => {
  try {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const result = whatsappService.verifyWebhook(mode, token, challenge);
    console.log('Webhook verificado com sucesso');
    res.status(200).send(result);
  } catch (error) {
    console.log('Falha na verificação do webhook:', error.message);
    res.status(403).send('Forbidden');
  }
});

// Endpoint para obter informações da conta
router.get('/account-info', async (req, res) => {
  try {
    const accountInfo = await whatsappService.getAccountInfo();
    res.json(accountInfo);
  } catch (error) {
    console.error('Erro ao obter informações da conta:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

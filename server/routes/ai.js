/**
 * Rotas de Integração com Sistema de IA
 * 
 * Proxy para comunicação entre Node.js e API Python (FastAPI)
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');

// URL da API Python (FastAPI)
const AI_API_URL = process.env.AI_API_URL || 'http://localhost:8000';

// Timeout para requests (30 segundos)
const API_TIMEOUT = 30000;

// Cliente axios configurado
const aiClient = axios.create({
  baseURL: AI_API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==================== OPORTUNIDADES ====================

/**
 * GET /api/ai/opportunities
 * Listar oportunidades detectadas pela IA
 */
router.get('/opportunities', async (req, res) => {
  try {
    const { page = 1, limit = 20, confidence_min, program, type } = req.query;

    const params = { page, limit };
    if (confidence_min) params.confidence_min = confidence_min;
    if (program) params.program = program;
    if (type) params.type = type;

    const response = await aiClient.get('/opportunities', { params });

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    console.error('Erro ao buscar oportunidades:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao buscar oportunidades',
      error: error.message,
      aiAvailable: false
    });
  }
});

/**
 * GET /api/ai/opportunities/:id
 * Buscar oportunidade específica
 */
router.get('/opportunities/:id', async (req, res) => {
  try {
    const response = await aiClient.get(`/opportunities/${req.params.id}`);

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao buscar oportunidade',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/analyze
 * Analisar texto com IA (GPT-4)
 */
router.post('/analyze', async (req, res) => {
  try {
    const { text, context } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Texto para análise é obrigatório'
      });
    }

    const response = await aiClient.post('/analyze', { text, context });

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao analisar texto',
      error: error.message
    });
  }
});

// ==================== MERCADO ====================

/**
 * GET /api/ai/market-data/:program
 * Obter dados de mercado de um programa
 */
router.get('/market-data/:program', async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const response = await aiClient.get(`/market-data/${req.params.program}`, {
      params: { days }
    });

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao buscar dados de mercado',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/market-trends
 * Analisar tendências de mercado
 */
router.post('/market-trends', async (req, res) => {
  try {
    const { program, period } = req.body;

    const response = await aiClient.post('/market-trends', { program, period });

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao analisar tendências',
      error: error.message
    });
  }
});

/**
 * GET /api/ai/statistics
 * Estatísticas do sistema de IA
 */
router.get('/statistics', async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    const response = await aiClient.get('/statistics', {
      params: { period }
    });

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    });
  }
});

// ==================== MONITORAMENTO ====================

/**
 * POST /api/ai/monitor/start
 * Iniciar monitoramento Telegram
 */
router.post('/monitor/start', async (req, res) => {
  try {
    const response = await aiClient.post('/monitor/start');

    res.json({
      success: true,
      message: 'Monitor iniciado com sucesso',
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao iniciar monitor',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/monitor/stop
 * Parar monitoramento Telegram
 */
router.post('/monitor/stop', async (req, res) => {
  try {
    const response = await aiClient.post('/monitor/stop');

    res.json({
      success: true,
      message: 'Monitor parado com sucesso',
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao parar monitor',
      error: error.message
    });
  }
});

/**
 * GET /api/ai/monitor/status
 * Status do monitoramento
 */
router.get('/monitor/status', async (req, res) => {
  try {
    const response = await aiClient.get('/monitor/status');

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao buscar status',
      error: error.message,
      status: 'offline'
    });
  }
});

/**
 * GET /api/ai/health
 * Health check da API de IA
 */
router.get('/health', async (req, res) => {
  try {
    const response = await aiClient.get('/health');

    res.json({
      success: true,
      aiAvailable: true,
      ...response.data
    });

  } catch (error) {
    res.json({
      success: false,
      aiAvailable: false,
      message: 'API de IA não disponível',
      error: error.message
    });
  }
});

// ==================== PERFIL DE USUÁRIO ====================

/**
 * GET /api/ai/user-profile/:id
 * Obter perfil de preferências do usuário
 */
router.get('/user-profile/:id', async (req, res) => {
  try {
    const response = await aiClient.get(`/user-profile/${req.params.id}`);

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao buscar perfil',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/user-profile
 * Atualizar perfil de preferências
 */
router.post('/user-profile', async (req, res) => {
  try {
    const { user_id, preferences } = req.body;

    const response = await aiClient.post('/user-profile', { user_id, preferences });

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao atualizar perfil',
      error: error.message
    });
  }
});

/**
 * POST /api/ai/recommendations/:id
 * Obter recomendações personalizadas
 */
router.post('/recommendations/:id', async (req, res) => {
  try {
    const response = await aiClient.post(`/recommendations/${req.params.id}`);

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao buscar recomendações',
      error: error.message
    });
  }
});

// ==================== CONFIGURAÇÃO ====================

/**
 * POST /api/ai/config
 * Atualizar configurações da IA
 */
router.post('/config', async (req, res) => {
  try {
    const response = await aiClient.post('/config', req.body);

    res.json({
      success: true,
      message: 'Configurações atualizadas',
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao atualizar configurações',
      error: error.message
    });
  }
});

/**
 * GET /api/ai/config
 * Obter configurações atuais
 */
router.get('/config', async (req, res) => {
  try {
    const response = await aiClient.get('/config');

    res.json({
      success: true,
      ...response.data
    });

  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Erro ao buscar configurações',
      error: error.message
    });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CPFControl = require('../models/CPFControl');
const Program = require('../models/Program');
const { authMiddleware } = require('../middleware/auth');

// @route   GET /api/cpf-control
// @desc    Listar todos os CPFs do usuário
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { categoria, status, programa } = req.query;
    
    const filtros = {};
    if (categoria && categoria !== 'todos') filtros.categoria = categoria;
    if (status && status !== 'todos') filtros.status = status;
    if (programa && programa !== 'todos') filtros.programa = programa;
    
    const cpfs = await CPFControl.buscarPorUsuario(req.user.id, filtros);
    
    res.json({
      success: true,
      data: cpfs,
      count: cpfs.length
    });
  } catch (error) {
    console.error('Erro ao listar CPFs:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar CPFs',
      error: error.message
    });
  }
});

// @route   GET /api/cpf-control/com-etiquetas
// @desc    Listar CPFs que possuem etiquetas
// @access  Private
router.get('/com-etiquetas', authMiddleware, async (req, res) => {
  try {
    const cpfs = await CPFControl.buscarComEtiquetas(req.user.id);
    
    res.json({
      success: true,
      data: cpfs,
      count: cpfs.length
    });
  } catch (error) {
    console.error('Erro ao listar CPFs com etiquetas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar CPFs com etiquetas',
      error: error.message
    });
  }
});

// @route   GET /api/cpf-control/:id
// @desc    Buscar CPF específico
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const cpf = await CPFControl.findOne({
      _id: req.params.id,
      usuario: req.user.id
    }).populate('programa');
    
    if (!cpf) {
      return res.status(404).json({
        success: false,
        message: 'CPF não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: cpf
    });
  } catch (error) {
    console.error('Erro ao buscar CPF:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar CPF',
      error: error.message
    });
  }
});

// @route   POST /api/cpf-control
// @desc    Criar novo CPF
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      nome,
      cpf,
      programa,
      programaNome,
      categoria,
      etiqueta,
      cpfUsados,
      limiteCPF,
      milhas,
      cm,
      valor,
      status,
      favorito
    } = req.body;
    
    // Validações
    if (!nome || !cpf || !programa || !programaNome || !categoria) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: nome, cpf, programa, programaNome, categoria'
      });
    }
    
    // Verificar se CPF já existe para este usuário e programa
    const cpfExistente = await CPFControl.findOne({
      usuario: req.user.id,
      cpf,
      programa
    });
    
    if (cpfExistente) {
      return res.status(400).json({
        success: false,
        message: 'Este CPF já está cadastrado para este programa'
      });
    }
    
    // Criar novo CPF
    const novoCPF = new CPFControl({
      usuario: req.user.id,
      nome,
      cpf,
      programa,
      programaNome,
      categoria,
      etiqueta: etiqueta || '',
      cpfUsados: cpfUsados || 0,
      limiteCPF: limiteCPF || null,
      milhas: milhas || 0,
      cm: cm || 0,
      valor: valor || 0,
      status: status || 'ativo',
      favorito: favorito || false
    });
    
    await novoCPF.save();
    
    res.status(201).json({
      success: true,
      message: 'CPF cadastrado com sucesso',
      data: novoCPF
    });
  } catch (error) {
    console.error('Erro ao criar CPF:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar CPF',
      error: error.message
    });
  }
});

// @route   PUT /api/cpf-control/:id
// @desc    Atualizar CPF
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const cpf = await CPFControl.findOne({
      _id: req.params.id,
      usuario: req.user.id
    });
    
    if (!cpf) {
      return res.status(404).json({
        success: false,
        message: 'CPF não encontrado'
      });
    }
    
    // Campos que podem ser atualizados
    const camposAtualizaveis = [
      'nome', 'cpfUsados', 'milhas', 'cm', 'valor', 
      'status', 'favorito', 'observacoes', 'dataUltimoUso'
    ];
    
    camposAtualizaveis.forEach(campo => {
      if (req.body[campo] !== undefined) {
        cpf[campo] = req.body[campo];
      }
    });
    
    cpf.updatedAt = new Date();
    await cpf.save();
    
    res.json({
      success: true,
      message: 'CPF atualizado com sucesso',
      data: cpf
    });
  } catch (error) {
    console.error('Erro ao atualizar CPF:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar CPF',
      error: error.message
    });
  }
});

// @route   PUT /api/cpf-control/:id/etiqueta
// @desc    Atualizar apenas a etiqueta do CPF
// @access  Private
router.put('/:id/etiqueta', authMiddleware, async (req, res) => {
  try {
    console.log('🔵 Requisição recebida em /api/cpf-control/:id/etiqueta');
    console.log('📥 Body:', JSON.stringify(req.body, null, 2));
    console.log('👤 Usuário:', req.user ? req.user.id : 'Não autenticado');
    console.log('🆔 ID do CPF:', req.params.id);
    
    const { etiqueta, cpfData } = req.body;
    
    if (etiqueta === undefined) {
      console.log('❌ Etiqueta não fornecida');
      return res.status(400).json({
        success: false,
        message: 'Campo etiqueta é obrigatório'
      });
    }
    
    console.log('📝 Atualizando etiqueta:', { id: req.params.id, etiqueta, temCpfData: !!cpfData });
    
    // Tentar encontrar o CPF por uma combinação única
    // Se o ID não for um ObjectId válido, buscar por usuario + nome + programa
    let cpf = null;
    
    // Verificar se o ID é um ObjectId válido
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id) && 
                           req.params.id.length === 24;
    
    if (isValidObjectId) {
      console.log('🔍 Buscando por ObjectId...');
      cpf = await CPFControl.findOne({
        _id: req.params.id,
        usuario: req.user._id || req.user.id
      });
    }
    
    // Se não encontrou por ID ou ID não é válido, buscar por dados únicos
    if (!cpf && cpfData) {
      console.log('🔍 Buscando por nome + programa...');
      cpf = await CPFControl.findOne({
        usuario: req.user._id || req.user.id,
        nome: cpfData.nome,
        programaNome: cpfData.programaNome
      });
    }
    
    // Se não encontrar e tiver dados, criar automaticamente
    if (!cpf && cpfData) {
      console.log('📦 CPF não encontrado. Criando automaticamente...');
      console.log('📋 Dados recebidos:', cpfData);
      
      // Buscar programa
      let programa = null;
      try {
        programa = await Program.findOne({ nome: cpfData.programaNome });
        console.log('🔍 Programa encontrado:', programa ? programa.nome : 'Não encontrado');
      } catch (err) {
        console.log('⚠️ Erro ao buscar programa:', err.message);
      }
      
      try {
        cpf = new CPFControl({
          usuario: req.user._id || req.user.id,
          nome: cpfData.nome,
          cpf: cpfData.cpf || `${req.params.id}.000.000-00`,
          programa: programa ? programa._id : null,
          programaNome: cpfData.programaNome,
          categoria: cpfData.categoria,
          etiqueta: etiqueta,
          cpfUsados: cpfData.cpfUsados || 0,
          limiteCPF: cpfData.limiteCPF || null,
          milhas: cpfData.milhas || 0,
          cm: cpfData.cm || 0,
          valor: cpfData.valor || 0,
          status: cpfData.status || 'ativo',
          favorito: cpfData.favorito || false
        });
        
        console.log('💾 Tentando salvar CPF:', cpf.nome);
        await cpf.save();
        console.log('✅ CPF criado com sucesso:', cpf._id);
      } catch (saveError) {
        console.error('❌ Erro ao salvar CPF:', saveError);
        console.error('📋 Dados do CPF:', JSON.stringify(cpf, null, 2));
        throw saveError;
      }
      
      return res.json({
        success: true,
        message: 'CPF criado e etiqueta salva com sucesso',
        created: true,
        data: {
          id: cpf._id,
          etiqueta: cpf.etiqueta,
          updatedAt: cpf.updatedAt
        }
      });
    }
    
    if (!cpf) {
      console.log('❌ CPF não encontrado e sem dados para criar');
      return res.status(404).json({
        success: false,
        message: 'CPF não encontrado. Envie cpfData para criar automaticamente.'
      });
    }
    
    console.log('🔄 Atualizando CPF existente:', cpf._id);
    
    // Usar método que salva histórico
    await cpf.atualizarEtiqueta(etiqueta, req.user.id);
    
    console.log('✅ Etiqueta atualizada com sucesso');
    
    res.json({
      success: true,
      message: 'Etiqueta atualizada com sucesso',
      data: {
        id: cpf._id,
        etiqueta: cpf.etiqueta,
        updatedAt: cpf.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ ERRO ao atualizar etiqueta:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar etiqueta',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   POST /api/cpf-control/:id/alerta
// @desc    Adicionar alerta ao CPF
// @access  Private
router.post('/:id/alerta', authMiddleware, async (req, res) => {
  try {
    const { tipo, mensagem } = req.body;
    
    if (!tipo || !mensagem) {
      return res.status(400).json({
        success: false,
        message: 'Campos tipo e mensagem são obrigatórios'
      });
    }
    
    const cpf = await CPFControl.findOne({
      _id: req.params.id,
      usuario: req.user.id
    });
    
    if (!cpf) {
      return res.status(404).json({
        success: false,
        message: 'CPF não encontrado'
      });
    }
    
    await cpf.adicionarAlerta(tipo, mensagem);
    
    res.json({
      success: true,
      message: 'Alerta adicionado com sucesso',
      data: cpf
    });
  } catch (error) {
    console.error('Erro ao adicionar alerta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar alerta',
      error: error.message
    });
  }
});

// @route   DELETE /api/cpf-control/:id
// @desc    Deletar CPF
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const cpf = await CPFControl.findOneAndDelete({
      _id: req.params.id,
      usuario: req.user.id
    });
    
    if (!cpf) {
      return res.status(404).json({
        success: false,
        message: 'CPF não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'CPF deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar CPF:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar CPF',
      error: error.message
    });
  }
});

// @route   GET /api/cpf-control/stats
// @desc    Estatísticas dos CPFs
// @access  Private
router.get('/stats/resumo', authMiddleware, async (req, res) => {
  try {
    const cpfs = await CPFControl.find({ usuario: req.user.id });
    
    const stats = {
      total: cpfs.length,
      ativos: cpfs.filter(c => c.status === 'ativo').length,
      bloqueados: cpfs.filter(c => c.status === 'bloqueado').length,
      comEtiquetas: cpfs.filter(c => c.etiqueta && c.etiqueta.trim() !== '').length,
      favoritos: cpfs.filter(c => c.favorito).length,
      porCategoria: {},
      totalMilhas: cpfs.reduce((sum, c) => sum + (c.milhas || 0), 0),
      totalValor: cpfs.reduce((sum, c) => sum + (c.valor || 0), 0)
    };
    
    // Contar por categoria
    cpfs.forEach(cpf => {
      if (!stats.porCategoria[cpf.categoria]) {
        stats.porCategoria[cpf.categoria] = 0;
      }
      stats.porCategoria[cpf.categoria]++;
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas',
      error: error.message
    });
  }
});

module.exports = router;

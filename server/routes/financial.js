/**
 * Rotas Financeiras
 * 
 * Endpoints para gerenciar o módulo financeiro completo
 * 
 * @author Sistema Sentinela
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const CashFlow = require('../models/CashFlow');
const BankAccount = require('../models/BankAccount');
const Card = require('../models/Card');
const { body, query, validationResult } = require('express-validator');

// ==================== RECEITAS ====================

/**
 * GET /api/financial/income
 * Listar receitas
 */
router.get('/income', async (req, res) => {
  try {
    const { page = 1, limit = 20, categoria, status, dataInicio, dataFim, usuario } = req.query;

    const filtros = {};
    if (categoria) filtros.categoria = categoria;
    if (status) filtros.status = status;
    if (usuario) filtros.usuario = usuario;
    
    if (dataInicio || dataFim) {
      filtros.data = {};
      if (dataInicio) filtros.data.$gte = new Date(dataInicio);
      if (dataFim) filtros.data.$lte = new Date(dataFim);
    }

    const skip = (page - 1) * limit;
    
    const [incomes, total] = await Promise.all([
      Income.find(filtros)
        .sort({ data: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('usuario', 'nome email')
        .populate('contaBancaria', 'nome banco conta')
        .lean(),
      Income.countDocuments(filtros)
    ]);

    res.json({
      success: true,
      incomes,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar receitas', error: error.message });
  }
});

/**
 * POST /api/financial/income
 * Criar receita
 */
router.post('/income', [
  body('descricao').notEmpty(),
  body('categoria').isIn(['venda_milhas', 'servico', 'bonus', 'cashback', 'outra']),
  body('valor').isFloat({ min: 0 }),
  body('formaPagamento').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const income = new Income({
      ...req.body,
      usuario: req.body.usuario || req.user?.id
    });

    await income.save();
    await income.populate('usuario', 'nome email');

    res.status(201).json({ success: true, message: 'Receita criada com sucesso', income });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar receita', error: error.message });
  }
});

/**
 * PUT /api/financial/income/:id
 * Atualizar receita
 */
router.put('/income/:id', async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('usuario', 'nome email');
    
    if (!income) {
      return res.status(404).json({ success: false, message: 'Receita não encontrada' });
    }

    res.json({ success: true, message: 'Receita atualizada com sucesso', income });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar receita', error: error.message });
  }
});

/**
 * DELETE /api/financial/income/:id
 * Deletar receita
 */
router.delete('/income/:id', async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ success: false, message: 'Receita não encontrada' });
    }
    res.json({ success: true, message: 'Receita deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao deletar receita', error: error.message });
  }
});

/**
 * POST /api/financial/income/:id/receive
 * Marcar receita como recebida
 */
router.post('/income/:id/receive', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ success: false, message: 'Receita não encontrada' });
    }

    await income.marcarRecebido();
    res.json({ success: true, message: 'Receita marcada como recebida', income });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao marcar receita', error: error.message });
  }
});

// ==================== DESPESAS ====================

/**
 * GET /api/financial/expense
 * Listar despesas
 */
router.get('/expense', async (req, res) => {
  try {
    const { page = 1, limit = 20, categoria, status, dataInicio, dataFim, usuario } = req.query;

    const filtros = {};
    if (categoria) filtros.categoria = categoria;
    if (status) filtros.status = status;
    if (usuario) filtros.usuario = usuario;
    
    if (dataInicio || dataFim) {
      filtros.data = {};
      if (dataInicio) filtros.data.$gte = new Date(dataInicio);
      if (dataFim) filtros.data.$lte = new Date(dataFim);
    }

    const skip = (page - 1) * limit;
    
    const [expenses, total] = await Promise.all([
      Expense.find(filtros)
        .sort({ data: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('usuario', 'nome email')
        .populate('contaBancaria', 'nome banco conta')
        .lean(),
      Expense.countDocuments(filtros)
    ]);

    res.json({
      success: true,
      expenses,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar despesas', error: error.message });
  }
});

/**
 * POST /api/financial/expense
 * Criar despesa
 */
router.post('/expense', [
  body('descricao').notEmpty(),
  body('categoria').isIn(['compra_milhas', 'taxa', 'salario', 'infraestrutura', 'marketing', 'servico', 'outra']),
  body('valor').isFloat({ min: 0 }),
  body('formaPagamento').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const expense = new Expense({
      ...req.body,
      usuario: req.body.usuario || req.user?.id
    });

    await expense.save();
    await expense.populate('usuario', 'nome email');

    res.status(201).json({ success: true, message: 'Despesa criada com sucesso', expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar despesa', error: error.message });
  }
});

/**
 * PUT /api/financial/expense/:id
 * Atualizar despesa
 */
router.put('/expense/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('usuario', 'nome email');
    
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Despesa não encontrada' });
    }

    res.json({ success: true, message: 'Despesa atualizada com sucesso', expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar despesa', error: error.message });
  }
});

/**
 * DELETE /api/financial/expense/:id
 * Deletar despesa
 */
router.delete('/expense/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Despesa não encontrada' });
    }
    res.json({ success: true, message: 'Despesa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao deletar despesa', error: error.message });
  }
});

/**
 * POST /api/financial/expense/:id/pay
 * Marcar despesa como paga
 */
router.post('/expense/:id/pay', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Despesa não encontrada' });
    }

    await expense.marcarPago();
    res.json({ success: true, message: 'Despesa marcada como paga', expense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao marcar despesa', error: error.message });
  }
});

// ==================== FLUXO DE CAIXA ====================

/**
 * GET /api/financial/cashflow
 * Obter fluxo de caixa por período
 */
router.get('/cashflow', async (req, res) => {
  try {
    const { mes, ano, usuario, meses = 1 } = req.query;

    if (meses > 1) {
      // Retornar série histórica
      const serie = await CashFlow.serieHistorica(usuario || req.user?.id, parseInt(meses));
      return res.json({ success: true, cashflow: serie });
    }

    // Retornar período específico
    const mesAtual = mes ? parseInt(mes) : new Date().getMonth() + 1;
    const anoAtual = ano ? parseInt(ano) : new Date().getFullYear();

    const cashFlow = await CashFlow.buscarOuCriar(mesAtual, anoAtual, usuario || req.user?.id);
    await cashFlow.calcular();

    res.json({ success: true, cashflow: cashFlow });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar fluxo de caixa', error: error.message });
  }
});

/**
 * POST /api/financial/cashflow/calculate
 * Recalcular fluxo de caixa
 */
router.post('/cashflow/calculate', [
  body('mes').isInt({ min: 1, max: 12 }),
  body('ano').isInt({ min: 2000 })
], async (req, res) => {
  try {
    const { mes, ano, usuario } = req.body;
    
    const cashFlow = await CashFlow.buscarOuCriar(mes, ano, usuario || req.user?.id);
    await cashFlow.calcular();

    res.json({ success: true, message: 'Fluxo de caixa calculado com sucesso', cashflow: cashFlow });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao calcular fluxo de caixa', error: error.message });
  }
});

/**
 * POST /api/financial/cashflow/:id/close
 * Fechar período do fluxo de caixa
 */
router.post('/cashflow/:id/close', async (req, res) => {
  try {
    const cashFlow = await CashFlow.findById(req.params.id);
    if (!cashFlow) {
      return res.status(404).json({ success: false, message: 'Fluxo de caixa não encontrado' });
    }

    await cashFlow.fechar();
    res.json({ success: true, message: 'Período fechado com sucesso', cashflow: cashFlow });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao fechar período', error: error.message });
  }
});

// ==================== CONTAS BANCÁRIAS ====================

/**
 * GET /api/financial/bank-accounts
 * Listar contas bancárias
 */
router.get('/bank-accounts', async (req, res) => {
  try {
    const { ativo, usuario } = req.query;
    
    const filtros = { usuario: usuario || req.user?.id };
    if (ativo !== undefined) filtros.ativo = ativo === 'true';

    const accounts = await BankAccount.find(filtros).sort({ principal: -1, nome: 1 });
    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar contas', error: error.message });
  }
});

/**
 * POST /api/financial/bank-accounts
 * Criar conta bancária
 */
router.post('/bank-accounts', [
  body('nome').notEmpty(),
  body('banco').notEmpty(),
  body('agencia').notEmpty(),
  body('conta').notEmpty(),
  body('titular').notEmpty(),
  body('cpfCnpj').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const account = new BankAccount({
      ...req.body,
      usuario: req.body.usuario || req.user?.id
    });

    await account.save();
    res.status(201).json({ success: true, message: 'Conta criada com sucesso', account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar conta', error: error.message });
  }
});

/**
 * PUT /api/financial/bank-accounts/:id
 * Atualizar conta bancária
 */
router.put('/bank-accounts/:id', async (req, res) => {
  try {
    const account = await BankAccount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Conta não encontrada' });
    }
    res.json({ success: true, message: 'Conta atualizada com sucesso', account });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar conta', error: error.message });
  }
});

/**
 * DELETE /api/financial/bank-accounts/:id
 * Deletar conta bancária
 */
router.delete('/bank-accounts/:id', async (req, res) => {
  try {
    const account = await BankAccount.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Conta não encontrada' });
    }
    res.json({ success: true, message: 'Conta deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao deletar conta', error: error.message });
  }
});

// ==================== CARTÕES ====================

/**
 * GET /api/financial/cards
 * Listar cartões
 */
router.get('/cards', async (req, res) => {
  try {
    const { ativo, usuario } = req.query;
    
    const filtros = { usuario: usuario || req.user?.id };
    if (ativo !== undefined) filtros.ativo = ativo === 'true';

    const cards = await Card.find(filtros)
      .populate('programa', 'nome logo')
      .sort({ principal: -1, nome: 1 });
    
    res.json({ success: true, cards });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao listar cartões', error: error.message });
  }
});

/**
 * POST /api/financial/cards
 * Criar cartão
 */
router.post('/cards', [
  body('nome').notEmpty(),
  body('bandeira').isIn(['visa', 'mastercard', 'elo', 'american_express', 'hipercard', 'dinners', 'outra']),
  body('numero').isLength({ min: 4, max: 4 }),
  body('titular').notEmpty(),
  body('validade').matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const card = new Card({
      ...req.body,
      usuario: req.body.usuario || req.user?.id
    });

    await card.save();
    res.status(201).json({ success: true, message: 'Cartão criado com sucesso', card });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar cartão', error: error.message });
  }
});

/**
 * PUT /api/financial/cards/:id
 * Atualizar cartão
 */
router.put('/cards/:id', async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!card) {
      return res.status(404).json({ success: false, message: 'Cartão não encontrado' });
    }
    res.json({ success: true, message: 'Cartão atualizado com sucesso', card });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar cartão', error: error.message });
  }
});

/**
 * DELETE /api/financial/cards/:id
 * Deletar cartão
 */
router.delete('/cards/:id', async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Cartão não encontrado' });
    }
    res.json({ success: true, message: 'Cartão deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao deletar cartão', error: error.message });
  }
});

// ==================== RELATÓRIOS ====================

/**
 * GET /api/financial/reports/summary
 * Resumo financeiro
 */
router.get('/reports/summary', async (req, res) => {
  try {
    const { dataInicio, dataFim, usuario } = req.query;
    
    const filtros = { usuario: usuario || req.user?.id };
    if (dataInicio || dataFim) {
      filtros.data = {};
      if (dataInicio) filtros.data.$gte = new Date(dataInicio);
      if (dataFim) filtros.data.$lte = new Date(dataFim);
    }

    const [totalReceitas, totalDespesas, receitasPendentes, despesasPendentes] = await Promise.all([
      Income.aggregate([
        { $match: { ...filtros, status: 'recebido' } },
        { $group: { _id: null, total: { $sum: '$valor' } } }
      ]),
      Expense.aggregate([
        { $match: { ...filtros, status: 'pago' } },
        { $group: { _id: null, total: { $sum: '$valor' } } }
      ]),
      Income.countDocuments({ ...filtros, status: 'pendente' }),
      Expense.countDocuments({ ...filtros, status: { $in: ['pendente', 'atrasado'] } })
    ]);

    const receitas = totalReceitas[0]?.total || 0;
    const despesas = totalDespesas[0]?.total || 0;
    const lucro = receitas - despesas;

    res.json({
      success: true,
      summary: {
        receitas,
        despesas,
        lucro,
        margemLucro: receitas > 0 ? (lucro / receitas) * 100 : 0,
        receitasPendentes,
        despesasPendentes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao gerar resumo', error: error.message });
  }
});

module.exports = router;


/**
 * Rotas de Relatórios - Sistema de Gestão de Milhas
 * 
 * Define todas as rotas relacionadas à geração de relatórios,
 * exportação de dados e análises avançadas.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { asyncHandler, createError, sanitizeInput } = require('../middleware/errorHandler');

const router = express.Router();

// ==================== VALIDAÇÕES ====================

const reportValidation = [
  body('dataInicio')
    .isISO8601()
    .withMessage('Data de início deve estar no formato ISO8601'),
  
  body('dataFim')
    .isISO8601()
    .withMessage('Data de fim deve estar no formato ISO8601'),
  
  body('formato')
    .optional()
    .isIn(['pdf', 'excel', 'csv'])
    .withMessage('Formato deve ser pdf, excel ou csv')
];

// ==================== ROTAS ====================

/**
 * @route   GET /api/reports/financial
 * @desc    Relatório financeiro completo
 * @access  Private
 */
router.get('/financial',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { 
      dataInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      dataFim = new Date(),
      formato = 'json',
      detalhado = false
    } = req.query;

    const usuarioId = req.user._id;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    // ==================== RESUMO FINANCEIRO ====================
    const resumoFinanceiro = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: inicio, $lte: fim }
        }
      },
      {
        $group: {
          _id: null,
          totalTransacoes: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          quantidadeTotal: { $sum: '$quantidade' },
          lucroTotal: { $sum: '$lucro.valorLiquido' },
          custoTotal: { $sum: '$custos.custoTotal' },
          investimentoTotal: {
            $sum: { $cond: [{ $eq: ['$tipo', 'compra'] }, '$valorTotal', 0] }
          },
          receitaTotal: {
            $sum: { $cond: [{ $eq: ['$tipo', 'venda'] }, '$valorTotal', 0] }
          }
        }
      }
    ]);

    // ==================== BREAKDOWN POR TIPO ====================
    const porTipo = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: inicio, $lte: fim }
        }
      },
      {
        $group: {
          _id: '$tipo',
          count: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          quantidadeTotal: { $sum: '$quantidade' },
          lucroTotal: { $sum: '$lucro.valorLiquido' }
        }
      },
      { $sort: { valorTotal: -1 } }
    ]);

    // ==================== BREAKDOWN POR CONTA ====================
    const porConta = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: inicio, $lte: fim }
        }
      },
      {
        $group: {
          _id: '$conta',
          count: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          quantidadeTotal: { $sum: '$quantidade' },
          lucroTotal: { $sum: '$lucro.valorLiquido' }
        }
      },
      {
        $lookup: {
          from: 'accounts',
          localField: '_id',
          foreignField: '_id',
          as: 'account'
        }
      },
      { $unwind: '$account' },
      {
        $project: {
          nomeConta: '$account.nome',
          programa: '$account.programa',
          count: 1,
          valorTotal: 1,
          quantidadeTotal: 1,
          lucroTotal: 1
        }
      },
      { $sort: { valorTotal: -1 } }
    ]);

    // ==================== EVOLUÇÃO TEMPORAL ====================
    const evolucaoTemporal = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: inicio, $lte: fim }
        }
      },
      {
        $group: {
          _id: {
            ano: { $year: '$dataTransacao' },
            mes: { $month: '$dataTransacao' },
            dia: { $dayOfMonth: '$dataTransacao' }
          },
          valorTotal: { $sum: '$valorTotal' },
          lucroTotal: { $sum: '$lucro.valorLiquido' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.ano': 1, '_id.mes': 1, '_id.dia': 1 } }
    ]);

    // ==================== ANÁLISE DE MARGEM ====================
    const analiseMargem = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: inicio, $lte: fim },
          tipo: 'venda'
        }
      },
      {
        $group: {
          _id: null,
          vendas: { $sum: 1 },
          margemMedia: { $avg: '$lucro.margemPercentual' },
          margemMinima: { $min: '$lucro.margemPercentual' },
          margemMaxima: { $max: '$lucro.margemPercentual' },
          lucroTotal: { $sum: '$lucro.valorLiquido' }
        }
      }
    ]);

    // ==================== DADOS DETALHADOS (SE SOLICITADO) ====================
    let transacoesDetalhadas = [];
    if (detalhado === 'true') {
      transacoesDetalhadas = await Transaction.find({
        usuario: usuarioId,
        dataTransacao: { $gte: inicio, $lte: fim }
      })
      .populate('conta', 'nome programa')
      .sort({ dataTransacao: -1 })
      .select('-__v');
    }

    const relatorio = {
      periodo: { inicio, fim },
      resumo: resumoFinanceiro[0] || {
        totalTransacoes: 0,
        valorTotal: 0,
        quantidadeTotal: 0,
        lucroTotal: 0,
        custoTotal: 0,
        investimentoTotal: 0,
        receitaTotal: 0
      },
      porTipo,
      porConta,
      evolucaoTemporal,
      analiseMargem: analiseMargem[0] || {
        vendas: 0,
        margemMedia: 0,
        margemMinima: 0,
        margemMaxima: 0,
        lucroTotal: 0
      },
      transacoesDetalhadas,
      geradoEm: new Date(),
      geradoPor: req.user.nome
    };

    // ==================== EXPORTAÇÃO ====================
    if (formato === 'pdf') {
      return await gerarRelatorioPDF(relatorio, res);
    } else if (formato === 'excel') {
      return await gerarRelatorioExcel(relatorio, res);
    }

    res.json({
      success: true,
      data: relatorio
    });
  })
);

/**
 * @route   GET /api/reports/accounts
 * @desc    Relatório de contas
 * @access  Private
 */
router.get('/accounts',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { formato = 'json' } = req.query;
    const usuarioId = req.user._id;

    // ==================== ESTATÍSTICAS DAS CONTAS ====================
    const estatisticas = await Account.aggregate([
      { $match: { usuario: usuarioId } },
      {
        $group: {
          _id: null,
          totalContas: { $sum: 1 },
          contasAtivas: {
            $sum: { $cond: [{ $eq: ['$status', 'ativa'] }, 1, 0] }
          },
          saldoTotal: { $sum: '$saldoAtual' },
          mediaSaldo: { $avg: '$saldoAtual' },
          totalCPFs: { $sum: { $size: '$controleCPFs.cpfsUtilizados' } }
        }
      }
    ]);

    // ==================== CONTAS DETALHADAS ====================
    const contas = await Account.find({ usuario: usuarioId })
      .select('-credenciais -__v')
      .sort({ saldoAtual: -1 });

    // ==================== ANÁLISE POR PROGRAMA ====================
    const porPrograma = await Account.aggregate([
      { $match: { usuario: usuarioId } },
      {
        $group: {
          _id: '$programa',
          count: { $sum: 1 },
          contasAtivas: {
            $sum: { $cond: [{ $eq: ['$status', 'ativa'] }, 1, 0] }
          },
          saldoTotal: { $sum: '$saldoAtual' },
          mediaSaldo: { $avg: '$saldoAtual' },
          totalCPFs: { $sum: { $size: '$controleCPFs.cpfsUtilizados' } }
        }
      },
      { $sort: { saldoTotal: -1 } }
    ]);

    // ==================== PONTOS EXPIRANDO ====================
    const pontosExpirando = await Account.find({
      usuario: usuarioId,
      'pontosExpirando.proximaExpiracao': {
        $lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      }
    }).select('nome programa pontosExpirando saldoAtual');

    const relatorio = {
      estatisticas: estatisticas[0] || {
        totalContas: 0,
        contasAtivas: 0,
        saldoTotal: 0,
        mediaSaldo: 0,
        totalCPFs: 0
      },
      contas: contas.map(conta => ({
        ...conta.toObject(),
        estatisticas: conta.obterEstatisticas()
      })),
      porPrograma,
      pontosExpirando,
      geradoEm: new Date(),
      geradoPor: req.user.nome
    };

    if (formato === 'pdf') {
      return await gerarRelatorioContasPDF(relatorio, res);
    } else if (formato === 'excel') {
      return await gerarRelatorioContasExcel(relatorio, res);
    }

    res.json({
      success: true,
      data: relatorio
    });
  })
);

/**
 * @route   GET /api/reports/tax
 * @desc    Relatório para Imposto de Renda
 * @access  Private
 */
router.get('/tax',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { ano = new Date().getFullYear(), formato = 'json' } = req.query;
    const usuarioId = req.user._id;
    
    const inicioAno = new Date(ano, 0, 1);
    const fimAno = new Date(ano, 11, 31, 23, 59, 59);

    // ==================== TRANSAÇÕES SUJEITAS A IR ====================
    const transacoesIR = await Transaction.find({
      usuario: usuarioId,
      dataTransacao: { $gte: inicioAno, $lte: fimAno },
      'dadosIR.sujeitoIR': true
    })
    .populate('conta', 'nome programa')
    .sort({ dataTransacao: 1 });

    // ==================== RESUMO POR MÊS ====================
    const resumoMensal = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: inicioAno, $lte: fimAno },
          'dadosIR.sujeitoIR': true
        }
      },
      {
        $group: {
          _id: {
            ano: { $year: '$dataTransacao' },
            mes: { $month: '$dataTransacao' }
          },
          transacoes: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          valorIR: { $sum: '$dadosIR.valorIR' },
          lucroLiquido: { $sum: '$lucro.valorLiquido' }
        }
      },
      { $sort: { '_id.mes': 1 } }
    ]);

    // ==================== CATEGORIZAÇÃO ====================
    const porCategoria = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: inicioAno, $lte: fimAno },
          'dadosIR.sujeitoIR': true
        }
      },
      {
        $group: {
          _id: '$dadosIR.categoriaIR',
          transacoes: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          valorIR: { $sum: '$dadosIR.valorIR' },
          lucroLiquido: { $sum: '$lucro.valorLiquido' }
        }
      },
      { $sort: { valorTotal: -1 } }
    ]);

    // ==================== CÁLCULO DE IMPOSTO ====================
    const totalRenda = transacoesIR.reduce((sum, t) => sum + (t.lucro.valorLiquido || 0), 0);
    const totalIR = transacoesIR.reduce((sum, t) => sum + (t.dadosIR.valorIR || 0), 0);

    const relatorio = {
      ano,
      usuario: {
        nome: req.user.nome,
        cpf: req.user.dadosFinanceiros?.cpf || 'Não informado'
      },
      resumo: {
        totalTransacoes: transacoesIR.length,
        totalRenda: totalRenda,
        totalIR: totalIR,
        rendaMedia: transacoesIR.length > 0 ? totalRenda / transacoesIR.length : 0
      },
      resumoMensal,
      porCategoria,
      transacoes: transacoesIR.map(t => ({
        data: t.dataTransacao,
        descricao: t.descricao,
        conta: t.conta.nome,
        programa: t.conta.programa,
        valorTotal: t.valorTotal,
        lucroLiquido: t.lucro.valorLiquido,
        valorIR: t.dadosIR.valorIR,
        categoriaIR: t.dadosIR.categoriaIR,
        observacoesIR: t.dadosIR.observacoesIR
      })),
      geradoEm: new Date(),
      observacoes: [
        'Este relatório contém apenas transações marcadas como sujeitas ao Imposto de Renda',
        'Verifique com seu contador a aplicabilidade das informações',
        'Conserve os comprovantes das transações por 5 anos'
      ]
    };

    if (formato === 'pdf') {
      return await gerarRelatorioIRPDF(relatorio, res);
    } else if (formato === 'excel') {
      return await gerarRelatorioIRExcel(relatorio, res);
    }

    res.json({
      success: true,
      data: relatorio
    });
  })
);

/**
 * @route   POST /api/reports/custom
 * @desc    Relatório customizado
 * @access  Private
 */
router.post('/custom',
  authMiddleware,
  sanitizeInput,
  reportValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError('Dados inválidos', 400, 'VALIDATION_ERROR');
    }

    const {
      dataInicio,
      dataFim,
      contas = [],
      tipos = [],
      categorias = [],
      formato = 'json',
      campos = [],
      agrupamento = 'nenhum'
    } = req.body;

    const usuarioId = req.user._id;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    // Construir filtros
    const filtros = {
      usuario: usuarioId,
      dataTransacao: { $gte: inicio, $lte: fim }
    };

    if (contas.length > 0) filtros.conta = { $in: contas };
    if (tipos.length > 0) filtros.tipo = { $in: tipos };
    if (categorias.length > 0) filtros.categoria = { $in: categorias };

    // Executar consulta
    let pipeline = [{ $match: filtros }];

    // Aplicar agrupamento
    if (agrupamento !== 'nenhum') {
      const groupStage = {
        $group: {
          _id: agrupamento === 'conta' ? '$conta' : 
               agrupamento === 'tipo' ? '$tipo' :
               agrupamento === 'categoria' ? '$categoria' : null,
          count: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          quantidadeTotal: { $sum: '$quantidade' },
          lucroTotal: { $sum: '$lucro.valorLiquido' }
        }
      };

      if (agrupamento === 'conta') {
        groupStage.$lookup = {
          from: 'accounts',
          localField: '_id',
          foreignField: '_id',
          as: 'account'
        };
      }

      pipeline.push(groupStage);
    }

    const dados = await Transaction.aggregate(pipeline);

    const relatorio = {
      parametros: {
        dataInicio: inicio,
        dataFim: fim,
        contas,
        tipos,
        categorias,
        campos,
        agrupamento
      },
      dados,
      totalRegistros: dados.length,
      geradoEm: new Date(),
      geradoPor: req.user.nome
    };

    if (formato === 'pdf') {
      return await gerarRelatorioCustomizadoPDF(relatorio, res);
    } else if (formato === 'excel') {
      return await gerarRelatorioCustomizadoExcel(relatorio, res);
    }

    res.json({
      success: true,
      data: relatorio
    });
  })
);

// ==================== FUNÇÕES DE GERAÇÃO DE PDF ====================

async function gerarRelatorioPDF(relatorio, res) {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf"`);
  
  doc.pipe(res);

  // Cabeçalho
  doc.fontSize(20).text('Relatório Financeiro', 50, 50);
  doc.fontSize(12).text(`Período: ${relatorio.periodo.inicio.toLocaleDateString('pt-BR')} a ${relatorio.periodo.fim.toLocaleDateString('pt-BR')}`, 50, 80);
  doc.text(`Gerado em: ${relatorio.geradoEm.toLocaleString('pt-BR')}`, 50, 100);
  doc.text(`Por: ${relatorio.geradoPor}`, 50, 120);

  let y = 150;

  // Resumo
  doc.fontSize(16).text('Resumo Geral', 50, y);
  y += 30;

  const resumo = relatorio.resumo;
  doc.fontSize(12).text(`Total de Transações: ${resumo.totalTransacoes}`, 50, y);
  y += 20;
  doc.text(`Valor Total: R$ ${resumo.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 50, y);
  y += 20;
  doc.text(`Lucro Total: R$ ${resumo.lucroTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 50, y);
  y += 20;
  doc.text(`Investimento Total: R$ ${resumo.investimentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 50, y);
  y += 20;
  doc.text(`Receita Total: R$ ${resumo.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 50, y);
  y += 40;

  // Por Tipo
  doc.fontSize(16).text('Transações por Tipo', 50, y);
  y += 30;

  relatorio.porTipo.forEach(tipo => {
    doc.fontSize(12).text(`${tipo._id}: ${tipo.count} transações - R$ ${tipo.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 70, y);
    y += 20;
  });

  doc.end();
}

async function gerarRelatorioExcel(relatorio, res) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Relatório Financeiro');

  // Cabeçalho
  worksheet.addRow(['Relatório Financeiro']);
  worksheet.addRow([`Período: ${relatorio.periodo.inicio.toLocaleDateString('pt-BR')} a ${relatorio.periodo.fim.toLocaleDateString('pt-BR')}`]);
  worksheet.addRow([`Gerado em: ${relatorio.geradoEm.toLocaleString('pt-BR')}`]);
  worksheet.addRow([`Por: ${relatorio.geradoPor}`]);
  worksheet.addRow([]);

  // Resumo
  worksheet.addRow(['Resumo Geral']);
  const resumo = relatorio.resumo;
  worksheet.addRow(['Total de Transações', resumo.totalTransacoes]);
  worksheet.addRow(['Valor Total', resumo.valorTotal]);
  worksheet.addRow(['Lucro Total', resumo.lucroTotal]);
  worksheet.addRow(['Investimento Total', resumo.investimentoTotal]);
  worksheet.addRow(['Receita Total', resumo.receitaTotal]);
  worksheet.addRow([]);

  // Por Tipo
  worksheet.addRow(['Transações por Tipo']);
  worksheet.addRow(['Tipo', 'Quantidade', 'Valor Total', 'Lucro Total']);
  
  relatorio.porTipo.forEach(tipo => {
    worksheet.addRow([tipo._id, tipo.count, tipo.valorTotal, tipo.lucroTotal]);
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="relatorio-financeiro-${new Date().toISOString().split('T')[0]}.xlsx"`);
  
  await workbook.xlsx.write(res);
  res.end();
}

// Funções similares para outros relatórios...
async function gerarRelatorioContasPDF(relatorio, res) {
  // Implementação similar ao relatório financeiro
  res.json({ success: true, message: 'Relatório PDF de contas em desenvolvimento' });
}

async function gerarRelatorioContasExcel(relatorio, res) {
  // Implementação similar ao relatório financeiro
  res.json({ success: true, message: 'Relatório Excel de contas em desenvolvimento' });
}

async function gerarRelatorioIRPDF(relatorio, res) {
  // Implementação específica para IR
  res.json({ success: true, message: 'Relatório PDF de IR em desenvolvimento' });
}

async function gerarRelatorioIRExcel(relatorio, res) {
  // Implementação específica para IR
  res.json({ success: true, message: 'Relatório Excel de IR em desenvolvimento' });
}

async function gerarRelatorioCustomizadoPDF(relatorio, res) {
  // Implementação para relatório customizado
  res.json({ success: true, message: 'Relatório PDF customizado em desenvolvimento' });
}

async function gerarRelatorioCustomizadoExcel(relatorio, res) {
  // Implementação para relatório customizado
  res.json({ success: true, message: 'Relatório Excel customizado em desenvolvimento' });
}

module.exports = router;

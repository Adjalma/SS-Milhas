/**
 * Rotas do Dashboard - Sistema de Gestão de Milhas
 * 
 * Define todas as rotas relacionadas ao dashboard principal,
 * incluindo métricas, KPIs, gráficos e resumos executivos.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const express = require('express');

const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { asyncHandler, createError } = require('../middleware/errorHandler');

const router = express.Router();

// ==================== ROTAS ====================

/**
 * @route   GET /api/dashboard/overview
 * @desc    Visão geral do dashboard
 * @access  Private
 */
router.get('/overview',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const usuarioId = req.user._id;

    // ==================== ESTATÍSTICAS GERAIS ====================
    
    // Contas
    const contasStats = await Account.aggregate([
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

    // Transações do mês atual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const transacoesStats = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: inicioMes }
        }
      },
      {
        $group: {
          _id: null,
          totalTransacoes: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          quantidadeTotal: { $sum: '$quantidade' },
          lucroTotal: { $sum: '$lucro.valorLiquido' },
          custoTotal: { $sum: '$custos.custoTotal' }
        }
      }
    ]);

    // ==================== SALDO POR PROGRAMA ====================
    const saldoPorPrograma = await Account.aggregate([
      { $match: { usuario: usuarioId, status: 'ativa' } },
      {
        $group: {
          _id: '$programa',
          saldoTotal: { $sum: '$saldoAtual' },
          quantidadeContas: { $sum: 1 },
          mediaSaldo: { $avg: '$saldoAtual' }
        }
      },
      { $sort: { saldoTotal: -1 } }
    ]);

    // ==================== TRANSAÇÕES RECENTES ====================
    const transacoesRecentes = await Transaction.find({ usuario: usuarioId })
      .sort({ dataTransacao: -1 })
      .limit(5)
      .populate('conta', 'nome programa')
      .select('tipo descricao quantidade valorTotal dataTransacao conta');

    // ==================== ALERTAS E NOTIFICAÇÕES ====================
    const alertas = await Account.aggregate([
      { $match: { usuario: usuarioId } },
      { $unwind: '$alertas' },
      { $match: { 'alertas.lido': false } },
      {
        $project: {
          conta: '$nome',
          programa: '$programa',
          tipo: '$alertas.tipo',
          titulo: '$alertas.titulo',
          mensagem: '$alertas.mensagem',
          data: '$alertas.data',
          prioridade: '$alertas.prioridade'
        }
      },
      { $sort: { data: -1 } },
      { $limit: 10 }
    ]);

    // ==================== PONTOS EXPIRANDO ====================
    const pontosExpirando = await Account.find({
      usuario: usuarioId,
      'pontosExpirando.proximaExpiracao': {
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Próximos 30 dias
      }
    }).select('nome programa pontosExpirando');

    // ==================== MÉTRICAS DE PERFORMANCE ====================
    const performance = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } // Últimos 90 dias
        }
      },
      {
        $group: {
          _id: null,
          totalVendas: {
            $sum: { $cond: [{ $eq: ['$tipo', 'venda'] }, 1, 0] }
          },
          totalCompras: {
            $sum: { $cond: [{ $eq: ['$tipo', 'compra'] }, 1, 0] }
          },
          lucroTotal: {
            $sum: { $cond: [{ $eq: ['$tipo', 'venda'] }, '$lucro.valorLiquido', 0] }
          },
          investimentoTotal: {
            $sum: { $cond: [{ $eq: ['$tipo', 'compra'] }, '$valorTotal', 0] }
          },
          roi: {
            $avg: '$lucro.margemPercentual'
          }
        }
      }
    ]);

    // ==================== TENDÊNCIA MENSAL ====================
    const tendenciaMensal = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) } // Últimos 12 meses
        }
      },
      {
        $group: {
          _id: {
            ano: { $year: '$dataTransacao' },
            mes: { $month: '$dataTransacao' }
          },
          totalTransacoes: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          lucroTotal: { $sum: '$lucro.valorLiquido' }
        }
      },
      { $sort: { '_id.ano': 1, '_id.mes': 1 } }
    ]);

    // ==================== METAS E CONQUISTAS ====================
    const usuario = await User.findById(usuarioId).select('metas conquistas pontos nivel');
    
    const metasAtivas = usuario.metas.filter(meta => meta.status === 'ativa');
    const conquistasRecentes = usuario.conquistas
      .sort((a, b) => new Date(b.dataConquista) - new Date(a.dataConquista))
      .slice(0, 5);

    // ==================== RESUMO FINANCEIRO ====================
    const resumoFinanceiro = {
      patrimonio: contasStats[0]?.saldoTotal || 0,
      lucroMes: transacoesStats[0]?.lucroTotal || 0,
      investimentoMes: transacoesStats[0]?.valorTotal || 0,
      roi: performance[0]?.roi || 0,
      margemMedia: performance[0]?.roi || 0
    };

    res.json({
      success: true,
      data: {
        estatisticas: {
          contas: contasStats[0] || {
            totalContas: 0,
            contasAtivas: 0,
            saldoTotal: 0,
            mediaSaldo: 0,
            totalCPFs: 0
          },
          transacoes: transacoesStats[0] || {
            totalTransacoes: 0,
            valorTotal: 0,
            quantidadeTotal: 0,
            lucroTotal: 0,
            custoTotal: 0
          }
        },
        saldoPorPrograma,
        transacoesRecentes,
        alertas,
        pontosExpirando: pontosExpirando.map(conta => ({
          id: conta._id,
          nome: conta.nome,
          programa: conta.programa,
          pontosExpirando: conta.pontosExpirando.quantidadeExpiracao,
          dataExpiracao: conta.pontosExpirando.proximaExpiracao,
          diasParaExpiracao: Math.ceil(
            (conta.pontosExpirando.proximaExpiracao - new Date()) / (1000 * 60 * 60 * 24)
          )
        })),
        performance: performance[0] || {
          totalVendas: 0,
          totalCompras: 0,
          lucroTotal: 0,
          investimentoTotal: 0,
          roi: 0
        },
        tendenciaMensal,
        metas: {
          ativas: metasAtivas,
          total: usuario.metas.length,
          concluidas: usuario.metas.filter(m => m.status === 'concluida').length
        },
        conquistas: {
          recentes: conquistasRecentes,
          total: usuario.conquistas.length,
          pontos: usuario.pontos,
          nivel: usuario.nivel
        },
        resumoFinanceiro
      }
    });
  })
);

/**
 * @route   GET /api/dashboard/metrics
 * @desc    Métricas detalhadas para gráficos
 * @access  Private
 */
router.get('/metrics',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { periodo = 'mes', tipo = 'todos' } = req.query;
    const usuarioId = req.user._id;

    let dataInicio;
    const agora = new Date();
    
    switch (periodo) {
      case 'semana':
        dataInicio = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
        break;
      case 'trimestre':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth() - 2, 1);
        break;
      case 'ano':
        dataInicio = new Date(agora.getFullYear(), 0, 1);
        break;
      default:
        dataInicio = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // ==================== EVOLUÇÃO DO SALDO ====================
    const evolucaoSaldo = await Account.aggregate([
      { $match: { usuario: usuarioId } },
      { $unwind: '$historicoSaldos' },
      {
        $match: {
          'historicoSaldos.data': { $gte: dataInicio }
        }
      },
      {
        $group: {
          _id: {
            ano: { $year: '$historicoSaldos.data' },
            mes: { $month: '$historicoSaldos.data' },
            dia: { $dayOfMonth: '$historicoSaldos.data' }
          },
          saldoTotal: { $sum: '$historicoSaldos.saldoNovo' }
        }
      },
      { $sort: { '_id.ano': 1, '_id.mes': 1, '_id.dia': 1 } }
    ]);

    // ==================== TRANSAÇÕES POR TIPO ====================
    const transacoesPorTipo = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: dataInicio }
        }
      },
      {
        $group: {
          _id: '$tipo',
          count: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          quantidadeTotal: { $sum: '$quantidade' }
        }
      },
      { $sort: { valorTotal: -1 } }
    ]);

    // ==================== DISTRIBUIÇÃO POR CONTA ====================
    const distribuicaoPorConta = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: dataInicio }
        }
      },
      {
        $group: {
          _id: '$conta',
          count: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' }
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
          percentual: { $multiply: [{ $divide: ['$valorTotal', { $sum: '$valorTotal' }] }, 100] }
        }
      },
      { $sort: { valorTotal: -1 } }
    ]);

    // ==================== LUCRO POR PERÍODO ====================
    const lucroPorPeriodo = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: dataInicio },
          tipo: 'venda'
        }
      },
      {
        $group: {
          _id: {
            ano: { $year: '$dataTransacao' },
            mes: { $month: '$dataTransacao' },
            dia: { $dayOfMonth: '$dataTransacao' }
          },
          lucroTotal: { $sum: '$lucro.valorLiquido' },
          margemMedia: { $avg: '$lucro.margemPercentual' },
          totalVendas: { $sum: 1 }
        }
      },
      { $sort: { '_id.ano': 1, '_id.mes': 1, '_id.dia': 1 } }
    ]);

    // ==================== TOP CONTRApartes ====================
    const topContrapartes = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: dataInicio },
          'contraparte.nome': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$contraparte.nome',
          totalTransacoes: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          lucroTotal: { $sum: '$lucro.valorLiquido' }
        }
      },
      { $sort: { valorTotal: -1 } },
      { $limit: 10 }
    ]);

    // ==================== ANÁLISE DE RISCO ====================
    const analiseRisco = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: dataInicio }
        }
      },
      {
        $group: {
          _id: '$analise.risco',
          count: { $sum: 1 },
          valorTotal: { $sum: '$valorTotal' },
          mediaScore: { $avg: '$analise.scoreQualidade' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        periodo: {
          inicio: dataInicio,
          fim: agora,
          tipo: periodo
        },
        evolucaoSaldo,
        transacoesPorTipo,
        distribuicaoPorConta,
        lucroPorPeriodo,
        topContrapartes,
        analiseRisco
      }
    });
  })
);

/**
 * @route   GET /api/dashboard/alerts
 * @desc    Alertas e notificações do dashboard
 * @access  Private
 */
router.get('/alerts',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const usuarioId = req.user._id;

    // ==================== ALERTAS DE CONTAS ====================
    const alertasContas = await Account.aggregate([
      { $match: { usuario: usuarioId } },
      { $unwind: '$alertas' },
      { $match: { 'alertas.lido': false } },
      {
        $project: {
          conta: '$nome',
          programa: '$programa',
          tipo: '$alertas.tipo',
          titulo: '$alertas.titulo',
          mensagem: '$alertas.mensagem',
          data: '$alertas.data',
          prioridade: '$alertas.prioridade',
          contaId: '$_id'
        }
      },
      { $sort: { prioridade: -1, data: -1 } }
    ]);

    // ==================== PONTOS EXPIRANDO ====================
    const pontosExpirando = await Account.find({
      usuario: usuarioId,
      'pontosExpirando.proximaExpiracao': {
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    }).select('nome programa pontosExpirando');

    // ==================== SALDOS BAIXOS ====================
    const saldosBaixos = await Account.find({
      usuario: usuarioId,
      status: 'ativa',
      saldoAtual: { $lt: 1000 } // Menos de 1000 pontos
    }).select('nome programa saldoAtual');

    // ==================== CPFs PRÓXIMOS DO LIMITE ====================
    const cpfsProximoLimite = await Account.find({
      usuario: usuarioId,
      'controleCPFs.cpfsUtilizados': {
        $elemMatch: {
          quantidadeEmissoes: { $gte: { $subtract: ['$controleCPFs.limiteEmissoes', 2] } }
        }
      }
    }).select('nome programa controleCPFs');

    // ==================== TRANSAÇÕES PENDENTES ====================
    const transacoesPendentes = await Transaction.find({
      usuario: usuarioId,
      status: 'pendente'
    }).populate('conta', 'nome programa').select('tipo descricao valorTotal dataTransacao conta');

    // ==================== ATIVIDADE SUSPEITA ====================
    const atividadeSuspeita = await Transaction.find({
      usuario: usuarioId,
      'analise.risco': { $in: ['alto', 'medio'] },
      dataTransacao: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).populate('conta', 'nome programa').select('tipo descricao valorTotal analise dataTransacao conta');

    res.json({
      success: true,
      data: {
        alertasContas,
        pontosExpirando: pontosExpirando.map(conta => ({
          id: conta._id,
          nome: conta.nome,
          programa: conta.programa,
          pontosExpirando: conta.pontosExpirando.quantidadeExpiracao,
          dataExpiracao: conta.pontosExpirando.proximaExpiracao,
          diasParaExpiracao: Math.ceil(
            (conta.pontosExpirando.proximaExpiracao - new Date()) / (1000 * 60 * 60 * 24)
          ),
          urgencia: Math.ceil(
            (conta.pontosExpirando.proximaExpiracao - new Date()) / (1000 * 60 * 60 * 24)
          ) <= 7 ? 'alta' : 'media'
        })),
        saldosBaixos,
        cpfsProximoLimite: cpfsProximoLimite.map(conta => ({
          id: conta._id,
          nome: conta.nome,
          programa: conta.programa,
          cpfs: conta.controleCPFs.cpfsUtilizados.filter(cpf => 
            cpf.quantidadeEmissoes >= conta.controleCPFs.limiteEmissoes - 2
          )
        })),
        transacoesPendentes,
        atividadeSuspeita,
        resumo: {
          totalAlertas: alertasContas.length,
          pontosExpirando: pontosExpirando.length,
          saldosBaixos: saldosBaixos.length,
          cpfsProximoLimite: cpfsProximoLimite.length,
          transacoesPendentes: transacoesPendentes.length,
          atividadeSuspeita: atividadeSuspeita.length
        }
      }
    });
  })
);

/**
 * @route   GET /api/dashboard/kpis
 * @desc    KPIs principais do sistema
 * @access  Private
 */
router.get('/kpis',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const usuarioId = req.user._id;
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const inicioAno = new Date(agora.getFullYear(), 0, 1);

    // ==================== KPI 1: TOTAL DE MILHAS ====================
    const totalMilhas = await Account.aggregate([
      { $match: { usuario: usuarioId, status: 'ativa' } },
      { $group: { _id: null, total: { $sum: '$saldoAtual' } } }
    ]);

    // ==================== KPI 2: LUCRO DO MÊS ====================
    const lucroMes = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          tipo: 'venda',
          dataTransacao: { $gte: inicioMes }
        }
      },
      { $group: { _id: null, total: { $sum: '$lucro.valorLiquido' } } }
    ]);

    // ==================== KPI 3: ROI ANUAL ====================
    const roiAnual = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          dataTransacao: { $gte: inicioAno }
        }
      },
      {
        $group: {
          _id: null,
          investimentoTotal: {
            $sum: { $cond: [{ $eq: ['$tipo', 'compra'] }, '$valorTotal', 0] }
          },
          lucroTotal: {
            $sum: { $cond: [{ $eq: ['$tipo', 'venda'] }, '$lucro.valorLiquido', 0] }
          }
        }
      }
    ]);

    // ==================== KPI 4: TRANSAÇÕES DO MÊS ====================
    const transacoesMes = await Transaction.countDocuments({
      usuario: usuarioId,
      dataTransacao: { $gte: inicioMes }
    });

    // ==================== KPI 5: MARGEM MÉDIA ====================
    const margemMedia = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          tipo: 'venda',
          dataTransacao: { $gte: inicioMes }
        }
      },
      { $group: { _id: null, media: { $avg: '$lucro.margemPercentual' } } }
    ]);

    // ==================== KPI 6: CONTAS ATIVAS ====================
    const contasAtivas = await Account.countDocuments({
      usuario: usuarioId,
      status: 'ativa'
    });

    // ==================== COMPARAÇÃO COM MÊS ANTERIOR ====================
    const mesAnterior = new Date(inicioMes);
    mesAnterior.setMonth(mesAnterior.getMonth() - 1);
    
    const lucroMesAnterior = await Transaction.aggregate([
      {
        $match: {
          usuario: usuarioId,
          tipo: 'venda',
          dataTransacao: { $gte: mesAnterior, $lt: inicioMes }
        }
      },
      { $group: { _id: null, total: { $sum: '$lucro.valorLiquido' } } }
    ]);

    const crescimentoLucro = lucroMesAnterior[0]?.total > 0 ? 
      ((lucroMes[0]?.total || 0) - lucroMesAnterior[0].total) / lucroMesAnterior[0].total * 100 : 0;

    res.json({
      success: true,
      data: {
        kpis: {
          totalMilhas: {
            valor: totalMilhas[0]?.total || 0,
            formatado: (totalMilhas[0]?.total || 0).toLocaleString('pt-BR'),
            unidade: 'milhas',
            icone: 'airplane'
          },
          lucroMes: {
            valor: lucroMes[0]?.total || 0,
            formatado: (lucroMes[0]?.total || 0).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }),
            unidade: 'BRL',
            icone: 'trending-up',
            crescimento: crescimentoLucro
          },
          roiAnual: {
            valor: roiAnual[0]?.investimentoTotal > 0 ? 
              (roiAnual[0].lucroTotal / roiAnual[0].investimentoTotal) * 100 : 0,
            formatado: roiAnual[0]?.investimentoTotal > 0 ? 
              `${((roiAnual[0].lucroTotal / roiAnual[0].investimentoTotal) * 100).toFixed(1)}%` : '0%',
            unidade: '%',
            icone: 'percent'
          },
          transacoesMes: {
            valor: transacoesMes,
            formatado: transacoesMes.toString(),
            unidade: 'transações',
            icone: 'receipt'
          },
          margemMedia: {
            valor: margemMedia[0]?.media || 0,
            formatado: `${(margemMedia[0]?.media || 0).toFixed(1)}%`,
            unidade: '%',
            icone: 'target'
          },
          contasAtivas: {
            valor: contasAtivas,
            formatado: contasAtivas.toString(),
            unidade: 'contas',
            icone: 'account'
          }
        },
        comparacao: {
          crescimentoLucro,
          tendencia: crescimentoLucro > 0 ? 'positiva' : crescimentoLucro < 0 ? 'negativa' : 'neutra'
        }
      }
    });
  })
);

module.exports = router;

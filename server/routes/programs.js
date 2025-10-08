const express = require('express');
const router = express.Router();
const Program = require('../models/Program');

// @route   GET /api/programs
// @desc    Buscar todos os programas
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { categoria, tipo, search, ativo } = req.query;
    
    let query = {};
    
    // Filtrar por categoria
    if (categoria && categoria !== 'todos') {
      query.categoria = categoria;
    }
    
    // Filtrar por tipo
    if (tipo && tipo !== 'todos') {
      query.tipo = tipo;
    }
    
    // Filtrar por status ativo
    if (ativo !== undefined) {
      query.ativo = ativo === 'true';
    }
    
    // Busca por texto (nome ou descrição)
    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { descricao: { $regex: search, $options: 'i' } }
      ];
    }
    
    const programs = await Program.find(query).sort({ nome: 1 });
    
    res.json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    console.error('Erro ao buscar programas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar programas',
      error: error.message
    });
  }
});

// @route   GET /api/programs/stats
// @desc    Estatísticas dos programas
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Program.aggregate([
      {
        $group: {
          _id: '$categoria',
          total: { $sum: 1 },
          comLimite: {
            $sum: { $cond: [{ $ne: ['$limiteCPF', null] }, 1, 0] }
          },
          semLimite: {
            $sum: { $cond: [{ $eq: ['$limiteCPF', null] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    const totalProgramas = await Program.countDocuments();
    
    res.json({
      success: true,
      data: {
        total: totalProgramas,
        porCategoria: stats
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    });
  }
});

// @route   GET /api/programs/:id
// @desc    Buscar programa por ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Programa não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Erro ao buscar programa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar programa',
      error: error.message
    });
  }
});

// @route   POST /api/programs
// @desc    Criar novo programa
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    
    res.status(201).json({
      success: true,
      message: 'Programa criado com sucesso',
      data: program
    });
  } catch (error) {
    console.error('Erro ao criar programa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar programa',
      error: error.message
    });
  }
});

// @route   PUT /api/programs/:id
// @desc    Atualizar programa
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Programa não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Programa atualizado com sucesso',
      data: program
    });
  } catch (error) {
    console.error('Erro ao atualizar programa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar programa',
      error: error.message
    });
  }
});

// @route   DELETE /api/programs/:id
// @desc    Deletar programa
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Programa não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Programa deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar programa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar programa',
      error: error.message
    });
  }
});

module.exports = router;


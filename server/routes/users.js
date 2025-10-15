/**
 * Rotas de Gerenciamento de Usuários
 * 
 * Endpoints para gerenciar usuários da conta,
 * incluindo criação, edição e controle de permissões.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { requireAdmin, requireOwner, checkPermission, filterDataByRole, logActivity } = require('../middleware/permissions');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Account = require('../models/Account');

// Validação para criação de usuário
const createUserValidation = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role').isIn(['admin', 'auxiliar']).withMessage('Role inválido')
];

// Validação para edição de usuário
const updateUserValidation = [
  body('nome').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('role').optional().isIn(['admin', 'auxiliar']).withMessage('Role inválido')
];

// Listar usuários da conta
router.get('/',
  authMiddleware,
  async (req, res) => {
    try {
      // Buscar usuários sem autenticação por enquanto
      const usuarios = await User.find({})
        .select('-senha')
        .limit(10);
      
      res.json({
        success: true,
        data: {
          usuarios,
          contagem: usuarios.length,
          limite: 3,
          podeAdicionar: true
        }
      });
      
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor: ' + error.message
      });
    }
  }
);

// Criar novo usuário
router.post('/',
  authMiddleware,
  requireAdmin,
  createUserValidation,
  logActivity('CRIAR_USUARIO'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }
      
      const { nome, email, senha, role, permissions: permissionsFromBody } = req.body;
      const currentUserId = req.user.id;
      
      // Buscar usuário atual e conta
      const currentUser = await User.findById(currentUserId).populate('accountId');
      
      if (!currentUser.accountId) {
        return res.status(404).json({
          success: false,
          message: 'Conta não encontrada'
        });
      }
      
      // Verificar se pode adicionar usuário
      if (!currentUser.accountId.podeAdicionarUsuario) {
        return res.status(400).json({
          success: false,
          message: 'Limite de usuários atingido'
        });
      }
      
      // Verificar se email já existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email já está em uso'
        });
      }
      
      // Definir permissões: se vier no body, usar; senão, aplicar padrão por role
      const defaultByRole = role === 'admin'
        ? { financeiro: true, valores: true, relatorios: true, monitoramento: true, cadastros: true }
        : { financeiro: false, valores: false, relatorios: false, monitoramento: true, cadastros: false };

      const permissions = {
        financeiro: Boolean(permissionsFromBody?.financeiro ?? defaultByRole.financeiro),
        valores: Boolean(permissionsFromBody?.valores ?? defaultByRole.valores),
        relatorios: Boolean(permissionsFromBody?.relatorios ?? defaultByRole.relatorios),
        monitoramento: Boolean(permissionsFromBody?.monitoramento ?? defaultByRole.monitoramento),
        cadastros: Boolean(permissionsFromBody?.cadastros ?? defaultByRole.cadastros)
      };
      
      // Criar usuário
      const hashedPassword = await bcrypt.hash(senha, 12);
      const newUser = new User({
        nome,
        email,
        senha: hashedPassword,
        role,
        accountId: currentUser.accountId._id,
        permissions
      });
      
      await newUser.save();
      
      // Adicionar usuário à conta
      await currentUser.accountId.adicionarUsuario(newUser._id, role, currentUserId);
      
      // Remover senha da resposta
      const userResponse = newUser.toObject();
      delete userResponse.senha;
      
      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: userResponse
      });
      
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// Editar usuário
router.put('/:id',
  authMiddleware,
  requireAdmin,
  updateUserValidation,
  logActivity('EDITAR_USUARIO'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }
      
      const { id } = req.params;
      const { nome, email, role, permissions: permissionsFromBody } = req.body;
      const currentUserId = req.user.id;
      
      // Buscar usuário atual e conta
      const currentUser = await User.findById(currentUserId).populate('accountId');
      
      // Buscar usuário a ser editado
      const userToEdit = await User.findById(id);
      
      if (!userToEdit) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
      // Verificar se pertence à mesma conta
      if (userToEdit.accountId.toString() !== currentUser.accountId._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }
      
      // Não permitir editar o próprio usuário
      if (id === currentUserId) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível editar seu próprio usuário'
        });
      }
      
      // Atualizar dados
      if (nome !== undefined) userToEdit.nome = nome;
      if (email !== undefined) userToEdit.email = email;
      if (role) {
        userToEdit.role = role;
        
        // Atualizar permissões baseadas no novo role
        if (role === 'admin') {
          userToEdit.permissions = {
            financeiro: true,
            valores: true,
            relatorios: true,
            monitoramento: true,
            cadastros: true
          };
        } else if (role === 'auxiliar') {
          userToEdit.permissions = {
            financeiro: false,
            valores: false,
            relatorios: false,
            monitoramento: true,
            cadastros: false
          };
        }
      }

      // Se veio permissions no body, aplicar granularmente
      if (permissionsFromBody) {
        userToEdit.permissions = {
          financeiro: Boolean(permissionsFromBody.financeiro ?? userToEdit.permissions.financeiro),
          valores: Boolean(permissionsFromBody.valores ?? userToEdit.permissions.valores),
          relatorios: Boolean(permissionsFromBody.relatorios ?? userToEdit.permissions.relatorios),
          monitoramento: Boolean(permissionsFromBody.monitoramento ?? userToEdit.permissions.monitoramento),
          cadastros: Boolean(permissionsFromBody.cadastros ?? userToEdit.permissions.cadastros)
        };
      }
      
      await userToEdit.save();
      
      // Remover senha da resposta
      const userResponse = userToEdit.toObject();
      delete userResponse.senha;
      
      res.json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: userResponse
      });
      
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// Remover usuário
router.delete('/:id',
  authMiddleware,
  requireOwner,
  logActivity('REMOVER_USUARIO'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const currentUserId = req.user.id;
      
      // Buscar usuário atual e conta
      const currentUser = await User.findById(currentUserId).populate('accountId');
      
      // Buscar usuário a ser removido
      const userToRemove = await User.findById(id);
      
      if (!userToRemove) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
      // Verificar se pertence à mesma conta
      if (userToRemove.accountId.toString() !== currentUser.accountId._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }
      
      // Não permitir remover o próprio usuário
      if (id === currentUserId) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível remover seu próprio usuário'
        });
      }
      
      // Remover usuário da conta
      await currentUser.accountId.removerUsuario(id);
      
      // Remover usuário
      await User.findByIdAndDelete(id);
      
      res.json({
        success: true,
        message: 'Usuário removido com sucesso'
      });
      
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

// Obter informações da conta
router.get('/account/info',
  authMiddleware,
  async (req, res) => {
    try {
      // Buscar conta sem autenticação por enquanto
      const account = await Account.findOne({});
      const usuarios = await User.find({}).select('nome email role status');
      
      res.json({
        success: true,
        data: {
          conta: account || {
            id: '1',
            nome: 'Conta Principal',
            plano: 'premium',
            status: 'ativo',
            dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            limiteUsuarios: 3,
            usuariosAtivos: usuarios.length,
            podeAdicionar: true
          },
          usuarios,
          estatisticas: {
            totalMilhas: 50000,
            totalContas: 10,
            totalTransacoes: 150,
            ultimaAtividade: new Date()
          }
        }
      });
      
    } catch (error) {
      console.error('Erro ao obter informações da conta:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor: ' + error.message
      });
    }
  }
);

// Endpoint para obter perfil do usuário
router.get('/profile',
  authMiddleware,
  async (req, res) => {
    try {
      // Mock data para teste
      const profileData = {
        _id: '1',
        nome: 'Admin',
        email: 'admin@ssmilhas.com',
        telefone: '(11) 99999-9999',
        empresa: 'SS Milhas',
        role: 'admin',
        avatar: null,
        idioma: 'pt-BR',
        tema: 'light',
        notificacoes: true,
        status: 'ativo',
        criadoEm: new Date(),
        ultimoLogin: new Date()
      };
      
      res.json({
        success: true,
        data: profileData
      });
      
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor: ' + error.message
      });
    }
  }
);


module.exports = router;
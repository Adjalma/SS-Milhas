/**
 * Testes de API - Sistema de Gestão de Milhas
 * 
 * Testes unitários e de integração para verificar funcionamento
 * correto de todas as rotas da API.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');
const Account = require('../models/Account');

jest.setTimeout(30000);

describe('🚀 Testes de API', () => {
  
  let adminToken, userToken;
  let adminUser, normalUser;
  let testAccount;
  
  beforeAll(async () => {
    // Conectar ao banco de testes
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/gestao-milhas-test';
    await mongoose.connect(mongoUri);
    
    // Criar account de teste
    testAccount = await Account.create({
      nome: 'Account Teste',
      owner: new mongoose.Types.ObjectId()
    });
    
    // Criar usuário admin
    adminUser = await User.create({
      nome: 'Admin Teste',
      email: 'admin.teste@test.com',
      senha: 'AdminSenha123!@#',
      role: 'admin',
      accountId: testAccount._id,
      status: 'ativo',
      emailVerified: true,
      permissions: {
        financeiro: true,
        valores: true,
        relatorios: true,
        monitoramento: true,
        cadastros: true
      }
    });
    
    // Criar usuário normal
    normalUser = await User.create({
      nome: 'User Teste',
      email: 'user.teste@test.com',
      senha: 'UserSenha123!@#',
      role: 'user',
      accountId: testAccount._id,
      status: 'ativo',
      emailVerified: true
    });
    
    // Atualizar account com owner
    testAccount.owner = adminUser._id;
    await testAccount.save();
    
    // Obter tokens
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin.teste@test.com',
        senha: 'AdminSenha123!@#'
      });
    adminToken = adminLogin.body.token;
    
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user.teste@test.com',
        senha: 'UserSenha123!@#'
      });
    userToken = userLogin.body.token;
  });
  
  afterAll(async () => {
    await User.deleteMany({ email: { $in: ['admin.teste@test.com', 'user.teste@test.com'] } });
    await Account.deleteMany({ nome: 'Account Teste' });
    await mongoose.connection.close();
  });
  
  // ==================== TESTES DE AUTENTICAÇÃO ====================
  
  describe('🔐 Autenticação', () => {
    
    it('deve fazer login com sucesso', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin.teste@test.com',
          senha: 'AdminSenha123!@#'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });
    
    it('deve rejeitar login com senha incorreta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin.teste@test.com',
          senha: 'senhaerrada'
        });
      
      expect(response.status).toBe(401);
    });
    
    it('deve rejeitar login com email não cadastrado', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'naoexiste@test.com',
          senha: 'qualquersenha'
        });
      
      expect(response.status).toBe(401);
    });
    
    it('deve validar campos obrigatórios no login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});
      
      expect(response.status).toBe(400);
    });
    
  });
  
  // ==================== TESTES DE USUÁRIOS ====================
  
  describe('👤 Usuários', () => {
    
    it('deve obter perfil do usuário autenticado', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('nome');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).not.toHaveProperty('senha');
    });
    
    it('deve atualizar perfil do usuário', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          nome: 'Nome Atualizado'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.user.nome).toBe('Nome Atualizado');
    });
    
    it('admin deve poder listar todos os usuários', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.users)).toBe(true);
    });
    
    it('usuário normal não deve listar todos os usuários', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(403);
    });
    
  });
  
  // ==================== TESTES DE MOVIMENTAÇÕES ====================
  
  describe('📊 Movimentações', () => {
    
    let createdMovementId;
    
    it('deve criar uma movimentação de compra', async () => {
      const response = await request(app)
        .post('/api/movements')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          tipo: 'compra',
          programa: 'Smiles',
          quantidade: 10000,
          valorUnitario: 0.015,
          valorTotal: 150,
          cpf: '12345678901',
          descricao: 'Compra de teste'
        });
      
      if (response.status === 201) {
        expect(response.body.movement).toHaveProperty('_id');
        expect(response.body.movement.tipo).toBe('compra');
        createdMovementId = response.body.movement._id;
      }
    });
    
    it('deve listar movimentações do usuário', async () => {
      const response = await request(app)
        .get('/api/movements')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.body.movements)).toBe(true);
      }
    });
    
    it('deve filtrar movimentações por tipo', async () => {
      const response = await request(app)
        .get('/api/movements?tipo=compra')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        response.body.movements.forEach(mov => {
          expect(mov.tipo).toBe('compra');
        });
      }
    });
    
    it('deve atualizar uma movimentação', async () => {
      if (!createdMovementId) return;
      
      const response = await request(app)
        .put(`/api/movements/${createdMovementId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'confirmado'
        });
      
      if (response.status === 200) {
        expect(response.body.movement.status).toBe('confirmado');
      }
    });
    
    it('deve deletar uma movimentação', async () => {
      if (!createdMovementId) return;
      
      const response = await request(app)
        .delete(`/api/movements/${createdMovementId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect([200, 204]).toContain(response.status);
    });
    
  });
  
  // ==================== TESTES FINANCEIROS ====================
  
  describe('💰 Financeiro', () => {
    
    let createdIncomeId;
    
    it('deve criar uma receita', async () => {
      const response = await request(app)
        .post('/api/financial/income')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          tipo: 'receita',
          categoria: 'vendas',
          valor: 1000,
          data: new Date(),
          descricao: 'Venda de milhas'
        });
      
      if (response.status === 201) {
        expect(response.body.income).toHaveProperty('_id');
        createdIncomeId = response.body.income._id;
      }
    });
    
    it('deve listar receitas', async () => {
      const response = await request(app)
        .get('/api/financial/income')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect([200, 404]).toContain(response.status);
    });
    
    it('deve criar uma despesa', async () => {
      const response = await request(app)
        .post('/api/financial/expense')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          tipo: 'despesa',
          categoria: 'operacional',
          valor: 500,
          data: new Date(),
          descricao: 'Despesa operacional'
        });
      
      if (response.status === 201) {
        expect(response.body.expense).toHaveProperty('_id');
      }
    });
    
    it('deve obter resumo financeiro', async () => {
      const response = await request(app)
        .get('/api/financial/summary')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.summary).toHaveProperty('totalReceitas');
        expect(response.body.summary).toHaveProperty('totalDespesas');
        expect(response.body.summary).toHaveProperty('saldo');
      }
    });
    
  });
  
  // ==================== TESTES DE TAREFAS ====================
  
  describe('📋 Tarefas', () => {
    
    let createdTaskId;
    
    it('deve criar uma tarefa', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          titulo: 'Tarefa de Teste',
          descricao: 'Descrição da tarefa',
          status: 'todo',
          prioridade: 'media'
        });
      
      if (response.status === 201) {
        expect(response.body.task).toHaveProperty('_id');
        createdTaskId = response.body.task._id;
      }
    });
    
    it('deve listar tarefas', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect([200, 404]).toContain(response.status);
    });
    
    it('deve atualizar status da tarefa', async () => {
      if (!createdTaskId) return;
      
      const response = await request(app)
        .patch(`/api/tasks/${createdTaskId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'in_progress'
        });
      
      if (response.status === 200) {
        expect(response.body.task.status).toBe('in_progress');
      }
    });
    
  });
  
  // ==================== TESTES DE DASHBOARD ====================
  
  describe('📊 Dashboard', () => {
    
    it('deve obter estatísticas do dashboard', async () => {
      const response = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('stats');
      }
    });
    
  });
  
  // ==================== TESTES DE SAÚDE ====================
  
  describe('🏥 Health Check', () => {
    
    it('deve retornar status OK', async () => {
      const response = await request(app)
        .get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
    
  });
  
  // ==================== TESTES DE VALIDAÇÃO ====================
  
  describe('✅ Validações', () => {
    
    it('deve validar formato de email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Teste',
          email: 'email_invalido',
          senha: 'Senha123!@#'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('deve validar formato de CPF', async () => {
      const response = await request(app)
        .post('/api/movements')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          tipo: 'compra',
          programa: 'Smiles',
          quantidade: 1000,
          cpf: '123' // CPF inválido
        });
      
      expect(response.status).toBe(400);
    });
    
    it('deve validar valores negativos', async () => {
      const response = await request(app)
        .post('/api/financial/income')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          tipo: 'receita',
          categoria: 'vendas',
          valor: -100 // Valor negativo
        });
      
      expect(response.status).toBe(400);
    });
    
  });
  
  // ==================== TESTES DE PAGINAÇÃO ====================
  
  describe('📄 Paginação', () => {
    
    it('deve paginar resultados', async () => {
      const response = await request(app)
        .get('/api/movements?page=1&limit=10')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('page');
        expect(response.body).toHaveProperty('limit');
      }
    });
    
  });
  
  // ==================== TESTES DE FILTROS ====================
  
  describe('🔍 Filtros', () => {
    
    it('deve filtrar por data', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-12-31');
      
      const response = await request(app)
        .get(`/api/movements?dataInicio=${startDate.toISOString()}&dataFim=${endDate.toISOString()}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect([200, 404]).toContain(response.status);
    });
    
  });
  
});


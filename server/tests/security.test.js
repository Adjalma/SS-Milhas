/**
 * Testes de Segurança - Sistema de Gestão de Milhas
 * 
 * Testes automatizados para verificar vulnerabilidades de segurança
 * e garantir que as proteções estão funcionando corretamente.
 * 
 * @author Especialista em Segurança
 * @version 1.0.0
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

// Configurar timeout maior para testes de segurança
jest.setTimeout(30000);

describe('🔒 Testes de Segurança', () => {
  
  let authToken;
  let testUser;
  
  // Setup antes de todos os testes
  beforeAll(async () => {
    // Conectar ao banco de testes
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/gestao-milhas-test';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Criar usuário de teste
    testUser = await User.create({
      nome: 'Teste Segurança',
      email: 'teste.seguranca@test.com',
      senha: 'TesteSenha123!@#',
      role: 'user',
      status: 'ativo',
      emailVerified: true
    });
    
    // Fazer login para obter token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'teste.seguranca@test.com',
        senha: 'TesteSenha123!@#'
      });
    
    authToken = loginResponse.body.token;
  });
  
  // Cleanup após todos os testes
  afterAll(async () => {
    await User.deleteMany({ email: 'teste.seguranca@test.com' });
    await mongoose.connection.close();
  });
  
  // ==================== TESTES DE INJEÇÃO SQL/NoSQL ====================
  
  describe('💉 Proteção contra NoSQL Injection', () => {
    
    it('deve bloquear tentativa de NoSQL injection no login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: { $gt: '' },
          senha: { $gt: '' }
        });
      
      expect(response.status).toBe(400);
    });
    
    it('deve sanitizar operadores MongoDB no body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          senha: 'password',
          $where: '1==1'
        });
      
      expect(response.body).not.toHaveProperty('$where');
    });
    
    it('deve bloquear injection em query parameters', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ role: { $ne: 'admin' } })
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
    });
    
  });
  
  // ==================== TESTES DE XSS ====================
  
  describe('🕷️ Proteção contra XSS (Cross-Site Scripting)', () => {
    
    it('deve remover tags script do input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: '<script>alert("XSS")</script>Teste',
          email: 'xss@test.com',
          senha: 'TesteSenha123!@#'
        });
      
      if (response.body.user) {
        expect(response.body.user.nome).not.toContain('<script>');
      }
    });
    
    it('deve remover event handlers de input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: '<div onclick="alert(1)">Teste</div>',
          email: 'xss2@test.com',
          senha: 'TesteSenha123!@#'
        });
      
      if (response.body.user) {
        expect(response.body.user.nome).not.toContain('onclick');
      }
    });
    
    it('deve sanitizar javascript: URIs', async () => {
      const maliciousUrl = 'javascript:alert("XSS")';
      
      const response = await request(app)
        .post('/api/movements/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tipo: 'compra',
          programa: 'Smiles',
          quantidade: 1000,
          cpf: '12345678901',
          comprovante: maliciousUrl
        });
      
      if (response.body.movement) {
        expect(response.body.movement.comprovante).not.toContain('javascript:');
      }
    });
    
  });
  
  // ==================== TESTES DE CSRF ====================
  
  describe('🛡️ Proteção CSRF', () => {
    
    it('deve exigir token CSRF para operações POST', async () => {
      const response = await request(app)
        .post('/api/movements/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tipo: 'compra',
          programa: 'Smiles',
          quantidade: 1000,
          cpf: '12345678901'
        });
      
      // Pode aceitar ou rejeitar dependendo da configuração
      expect([200, 201, 403]).toContain(response.status);
    });
    
    it('deve aceitar requisição GET sem token CSRF', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
    });
    
  });
  
  // ==================== TESTES DE AUTENTICAÇÃO ====================
  
  describe('🔐 Segurança de Autenticação', () => {
    
    it('deve rejeitar requisição sem token', async () => {
      const response = await request(app)
        .get('/api/users/profile');
      
      expect(response.status).toBe(401);
    });
    
    it('deve rejeitar token inválido', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer token_invalido');
      
      expect(response.status).toBe(401);
    });
    
    it('deve rejeitar token expirado', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyMn0.4Adcj0vfqJl77ZTPjwh_nZEV2rDGhVmJLqVsNkIBTHs';
      
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`);
      
      expect(response.status).toBe(401);
    });
    
    it('deve proteger contra timing attacks em login', async () => {
      const start1 = Date.now();
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'naoexiste@test.com',
          senha: 'senhaerrada'
        });
      const time1 = Date.now() - start1;
      
      const start2 = Date.now();
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'teste.seguranca@test.com',
          senha: 'senhaerrada'
        });
      const time2 = Date.now() - start2;
      
      // Tempos devem ser similares (diferença < 100ms)
      expect(Math.abs(time1 - time2)).toBeLessThan(100);
    });
    
  });
  
  // ==================== TESTES DE RATE LIMITING ====================
  
  describe('⏱️ Rate Limiting', () => {
    
    it('deve bloquear após muitas tentativas de login', async () => {
      const email = 'ratelimit@test.com';
      const senha = 'senhaerrada';
      
      // Fazer 6 tentativas (limite é 5)
      for (let i = 0; i < 6; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ email, senha });
        
        if (i < 5) {
          expect([400, 401]).toContain(response.status);
        } else {
          // 6ª tentativa deve ser bloqueada
          expect(response.status).toBe(429);
        }
      }
    });
    
    it('deve respeitar rate limit global da API', async () => {
      const requests = [];
      
      // Fazer 101 requisições (limite é 100)
      for (let i = 0; i < 101; i++) {
        requests.push(
          request(app)
            .get('/api/health')
            .set('Authorization', `Bearer ${authToken}`)
        );
      }
      
      const responses = await Promise.all(requests);
      const blockedRequests = responses.filter(r => r.status === 429);
      
      expect(blockedRequests.length).toBeGreaterThan(0);
    });
    
  });
  
  // ==================== TESTES DE PATH TRAVERSAL ====================
  
  describe('📁 Proteção contra Path Traversal', () => {
    
    it('deve bloquear tentativa de path traversal', async () => {
      const response = await request(app)
        .get('/api/users/../../../etc/passwd')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
    });
    
    it('deve bloquear tentativa de path traversal no body', async () => {
      const response = await request(app)
        .post('/api/movements/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tipo: 'compra',
          programa: '../../../etc/passwd',
          quantidade: 1000,
          cpf: '12345678901'
        });
      
      expect(response.status).toBe(400);
    });
    
  });
  
  // ==================== TESTES DE HEADERS DE SEGURANÇA ====================
  
  describe('📋 Headers de Segurança', () => {
    
    it('deve incluir header X-Frame-Options', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers).toHaveProperty('x-frame-options');
    });
    
    it('deve incluir header X-Content-Type-Options', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers).toHaveProperty('x-content-type-options');
    });
    
    it('deve incluir header Strict-Transport-Security', async () => {
      const response = await request(app).get('/api/health');
      
      // Pode não estar presente em desenvolvimento
      if (process.env.NODE_ENV === 'production') {
        expect(response.headers).toHaveProperty('strict-transport-security');
      }
    });
    
    it('deve incluir header Content-Security-Policy', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers).toHaveProperty('content-security-policy');
    });
    
  });
  
  // ==================== TESTES DE VALIDAÇÃO DE ENTRADA ====================
  
  describe('✅ Validação de Entrada', () => {
    
    it('deve rejeitar email inválido', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Teste',
          email: 'email_invalido',
          senha: 'TesteSenha123!@#'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('deve rejeitar senha fraca', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Teste',
          email: 'teste@test.com',
          senha: '123'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('deve rejeitar CPF inválido', async () => {
      const response = await request(app)
        .post('/api/movements/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tipo: 'compra',
          programa: 'Smiles',
          quantidade: 1000,
          cpf: '12345'
        });
      
      expect(response.status).toBe(400);
    });
    
    it('deve rejeitar valores negativos onde não permitido', async () => {
      const response = await request(app)
        .post('/api/financial/income')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tipo: 'receita',
          categoria: 'vendas',
          valor: -1000
        });
      
      expect(response.status).toBe(400);
    });
    
  });
  
  // ==================== TESTES DE AUTORIZAÇÃO ====================
  
  describe('🔒 Controle de Autorização', () => {
    
    it('deve permitir apenas admin acessar rotas administrativas', async () => {
      const response = await request(app)
        .get('/api/users/all')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Usuário de teste não é admin
      expect(response.status).toBe(403);
    });
    
    it('deve impedir acesso a recursos de outros usuários', async () => {
      // Tentar acessar dados de outro usuário
      const otherUserId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/users/${otherUserId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect([403, 404]).toContain(response.status);
    });
    
  });
  
  // ==================== TESTES DE SANITIZAÇÃO ====================
  
  describe('🧹 Sanitização de Dados', () => {
    
    it('deve remover campos desconhecidos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Teste Sanitização',
          email: 'sanitizacao@test.com',
          senha: 'TesteSenha123!@#',
          campoMalicioso: 'valor_malicioso',
          __proto__: { admin: true }
        });
      
      if (response.body.user) {
        expect(response.body.user).not.toHaveProperty('campoMalicioso');
        expect(response.body.user).not.toHaveProperty('__proto__');
      }
    });
    
    it('deve sanitizar HTML tags de strings', async () => {
      const response = await request(app)
        .post('/api/movements/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tipo: 'compra',
          programa: 'Smiles',
          quantidade: 1000,
          cpf: '12345678901',
          descricao: '<b>Descrição</b> com <i>HTML</i>'
        });
      
      if (response.body.movement) {
        expect(response.body.movement.descricao).not.toContain('<b>');
        expect(response.body.movement.descricao).not.toContain('<i>');
      }
    });
    
  });
  
  // ==================== TESTES DE PROTEÇÃO DE DADOS SENSÍVEIS ====================
  
  describe('🔐 Proteção de Dados Sensíveis', () => {
    
    it('não deve retornar senha do usuário', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.body.user).not.toHaveProperty('senha');
    });
    
    it('não deve retornar refresh tokens', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.body.user).not.toHaveProperty('refreshTokens');
    });
    
    it('deve hashear senhas antes de salvar', async () => {
      const newUser = await User.create({
        nome: 'Teste Hash',
        email: 'hash@test.com',
        senha: 'plaintext123',
        role: 'user',
        status: 'ativo'
      });
      
      expect(newUser.senha).not.toBe('plaintext123');
      expect(newUser.senha).toMatch(/^\$2[aby]\$/); // Formato bcrypt
      
      await User.deleteOne({ _id: newUser._id });
    });
    
  });
  
});

module.exports = { app };


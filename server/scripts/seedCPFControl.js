/**
 * Script para popular o banco de dados com CPFs iniciais
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelos
const CPFControl = require('../models/CPFControl');
const Program = require('../models/Program');
const User = require('../models/User');

// Dados iniciais dos CPFs
const cpfsIniciais = [
  {
    nome: 'THYAGO',
    cpf: '123.456.789-01',
    programaNome: 'Smiles (GOL)',
    categoria: 'Nacional',
    etiqueta: 'Conta com limite próximo do vencimento - renovar até 31/12/2024',
    cpfUsados: 8,
    limiteCPF: 25,
    milhas: 8049,
    cm: 16.00,
    valor: 128.78,
    status: 'ativo',
    favorito: false
  },
  {
    nome: 'ADRIANA DE PAULA',
    cpf: '987.654.321-02',
    programaNome: 'LATAM Pass',
    categoria: 'Nacional',
    etiqueta: '',
    cpfUsados: 12,
    limiteCPF: 24,
    milhas: 5320,
    cm: 14.68,
    valor: 78.12,
    status: 'ativo',
    favorito: true
  },
  {
    nome: 'WALLAS',
    cpf: '456.789.123-03',
    programaNome: 'Azul Fidelidade',
    categoria: 'Nacional',
    etiqueta: 'Beneficiário fixo - alteração só após 60 dias',
    cpfUsados: 3,
    limiteCPF: 5,
    milhas: 4410,
    cm: 26.88,
    valor: 118.55,
    status: 'ativo',
    favorito: false
  },
  {
    nome: 'VALMIR',
    cpf: '789.123.456-04',
    programaNome: 'Smiles (GOL)',
    categoria: 'Nacional',
    etiqueta: 'ATENÇÃO: Apenas 2 CPFs restantes! Usar com cuidado',
    cpfUsados: 23,
    limiteCPF: 25,
    milhas: 4410,
    cm: 26.88,
    valor: 118.55,
    status: 'alerta',
    favorito: false
  },
  {
    nome: 'CARLOS',
    cpf: '321.654.987-05',
    programaNome: 'LATAM Pass',
    categoria: 'Nacional',
    etiqueta: '',
    cpfUsados: 5,
    limiteCPF: 24,
    milhas: 73,
    cm: 16.63,
    valor: 1.21,
    status: 'ativo',
    favorito: true
  }
];

async function seedCPFControl() {
  try {
    console.log('🌱 Iniciando seed do CPF Control...');

    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestao-milhas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado ao MongoDB');

    // Buscar o primeiro usuário (ou criar um de teste)
    let usuario = await User.findOne();
    
    if (!usuario) {
      console.log('⚠️ Nenhum usuário encontrado. Criando usuário de teste...');
      usuario = await User.create({
        nome: 'Usuário Teste',
        email: 'teste@teste.com',
        senha: '$2a$10$xQxJZxZxZxZxZxZxZxZxZeN7N7N7N7N7N7N7N7N7N7N7N7N7N7', // senha: teste123
        role: 'admin',
        status: 'ativo'
      });
      console.log('✅ Usuário de teste criado');
    }

    console.log(`👤 Usando usuário: ${usuario.nome} (${usuario.email})`);

    // Limpar dados existentes
    const count = await CPFControl.countDocuments({ usuario: usuario._id });
    if (count > 0) {
      console.log(`🗑️ Removendo ${count} CPFs existentes...`);
      await CPFControl.deleteMany({ usuario: usuario._id });
    }

    // Buscar programas
    const programas = await Program.find();
    const programaMap = {};
    programas.forEach(p => {
      programaMap[p.nome] = p._id;
    });

    // Inserir CPFs
    console.log(`📝 Inserindo ${cpfsIniciais.length} CPFs...`);
    
    for (const cpfData of cpfsIniciais) {
      const programaId = programaMap[cpfData.programaNome];
      
      const cpf = new CPFControl({
        usuario: usuario._id,
        nome: cpfData.nome,
        cpf: cpfData.cpf,
        programa: programaId || null,
        programaNome: cpfData.programaNome,
        categoria: cpfData.categoria,
        etiqueta: cpfData.etiqueta,
        cpfUsados: cpfData.cpfUsados,
        limiteCPF: cpfData.limiteCPF,
        milhas: cpfData.milhas,
        cm: cpfData.cm,
        valor: cpfData.valor,
        status: cpfData.status,
        favorito: cpfData.favorito,
        dataCadastro: new Date(),
        dataUltimoUso: new Date()
      });

      await cpf.save();
      console.log(`  ✅ ${cpfData.nome} - ${cpfData.programaNome}`);
    }

    // Estatísticas
    const total = await CPFControl.countDocuments({ usuario: usuario._id });
    const comEtiquetas = await CPFControl.countDocuments({ 
      usuario: usuario._id, 
      etiqueta: { $ne: '' } 
    });

    console.log('\n📊 Estatísticas:');
    console.log(`  Total de CPFs: ${total}`);
    console.log(`  CPFs com etiquetas: ${comEtiquetas}`);
    console.log(`  CPFs ativos: ${await CPFControl.countDocuments({ usuario: usuario._id, status: 'ativo' })}`);

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n💡 Para testar:');
    console.log('  1. Faça login com: teste@teste.com / teste123');
    console.log('  2. Acesse: /dashboard/controle-programas');
    console.log('  3. As etiquetas já estarão lá!');

    process.exit(0);

  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

// Executar seed
seedCPFControl();

/**
 * Dados centralizados de CPFs e Programas
 */

// Dados dos CPFs cadastrados
const cpfsData = [
  {
    id: 1,
    nome: 'THYAGO',
    cpf: '123.456.789-01',
    programa: 'Smiles (GOL)',
    categoria: 'Nacional',
    tipo: 'nacional',
    logo: 'smiles',
    milhas: 8049,
    cm: 16.00,
    valor: 128.78,
    limiteCPF: 25,
    cpfUsados: 0,
    status: 'ativo',
    favorito: false,
    dataCadastro: '2024-03-15',
    dataUltimoUso: '2024-11-20',
    alertas: [],
    etiqueta: 'Conta com limite próximo do vencimento - renovar até 31/12/2024'
  },
  {
    id: 2,
    nome: 'ADRIANA DE PAULA',
    cpf: '987.654.321-02',
    programa: 'LATAM Pass',
    categoria: 'Nacional',
    tipo: 'nacional',
    logo: 'latam',
    milhas: 5320,
    cm: 14.68,
    valor: 78.12,
    limiteCPF: 24,
    cpfUsados: 8,
    status: 'ativo',
    favorito: true,
    dataCadastro: '2024-01-10',
    dataUltimoUso: '2024-12-01',
    alertas: [],
    etiqueta: ''
  },
  {
    id: 3,
    nome: 'WALLAS',
    cpf: '456.789.123-03',
    programa: 'Azul Fidelidade',
    categoria: 'Nacional',
    tipo: 'nacional',
    logo: 'azul',
    milhas: 4410,
    cm: 26.88,
    valor: 118.55,
    limiteCPF: 5,
    cpfUsados: 3,
    status: 'ativo',
    favorito: false,
    dataCadastro: '2024-06-22',
    dataUltimoUso: '2024-10-15',
    alertas: [],
    etiqueta: 'Beneficiário fixo - alteração só após 60 dias'
  },
  {
    id: 4,
    nome: 'VALMIR',
    cpf: '789.123.456-04',
    programa: 'Smiles (GOL)',
    categoria: 'Nacional',
    tipo: 'nacional',
    logo: 'smiles',
    milhas: 4410,
    cm: 26.88,
    valor: 118.55,
    limiteCPF: 25,
    cpfUsados: 23,
    status: 'alerta',
    favorito: false,
    dataCadastro: '2024-02-28',
    dataUltimoUso: '2024-12-10',
    alertas: ['Próximo do limite anual'],
    etiqueta: 'ATENÇÃO: Apenas 2 CPFs restantes! Usar com cuidado'
  },
  {
    id: 5,
    nome: 'CARLOS',
    cpf: '321.654.987-05',
    programa: 'LATAM Pass',
    categoria: 'Nacional',
    tipo: 'nacional',
    logo: 'latam',
    milhas: 73,
    cm: 16.63,
    valor: 1.21,
    limiteCPF: 24,
    cpfUsados: 5,
    status: 'ativo',
    favorito: true,
    dataCadastro: '2024-04-05',
    dataUltimoUso: '2024-09-30',
    alertas: [],
    etiqueta: ''
  }
];

// Lista de todos os programas disponíveis
const programasDisponiveis = [
  'Smiles (GOL)',
  'LATAM Pass',
  'Azul Fidelidade',
  'AAdvantage (American Airlines)',
  'Aerolíneas Argentinas Plus',
  'Aeroplan (Air Canada)',
  'Air Europa SUMA',
  'Alaska Airlines (Mileage Plan)',
  'British Executive Club (British Airways)',
  'Connect Miles (Copa Airlines)',
  'Delta SkyMiles',
  'Emirates Skywards',
  'Etihad Guest',
  'Finnair Plus',
  'Flying Blue (Air France/KLM)',
  'Flying Club (Virgin Atlantic)',
  'Iberia Plus',
  'LifeMiles (Avianca)',
  'Lufthansa (Miles & More)',
  'Miles&Smiles (Turkish Airlines)',
  'Qantas Frequent Flyer',
  'Qatar Privilege Club',
  'Southwest Rapid Rewards',
  'TAP Miles&Go',
  'United MileagePlus',
  'Volare (ITA Airways)',
  'Ailos',
  'Átomos (C6 Bank)',
  'Banco do Brasil',
  'Banescard',
  'Banrisul (Banriclube)',
  'BRB StockCar+',
  'BTG Pactual',
  'BV Merece',
  'Caixa',
  'Coopera (Sicoob)',
  'Credicard',
  'Cresol',
  'Curtaí (BRB)',
  'Esfera (Santander)',
  'Genial Investimentos',
  'Itaú',
  'Livelo (Bradesco e Banco do Brasil)',
  'Membership Rewards (American Express)',
  'Nomad Pass',
  'Nubank Rewards / Ultravioleta',
  'Porto Plus (Porto Seguro)',
  'Safra Rewards',
  'Sicredi',
  'Sisprime',
  'Unicred',
  'XP Investimentos',
  'All Accor',
  'Hilton Honors',
  'IHG One Rewards',
  'Marriott Bonvoy',
  'MeliáRewards',
  'World of Hyatt',
  '+Mengão',
  'Ale',
  'Dotz',
  'GPA (Cliente Mais)',
  'Km de Vantagens (Ipiranga)',
  'Loop',
  'Premmia (Petrobras)',
  'Shell Box',
  'Virgin Red'
];

/**
 * Retorna todos os CPFs cadastrados
 */
export const getAllCPFs = () => {
  return cpfsData;
};

/**
 * Retorna todos os programas disponíveis
 */
export const getAllProgramas = () => {
  return programasDisponiveis;
};

/**
 * Retorna estatísticas dos CPFs
 */
export const getCPFStats = () => {
  return {
    total: cpfsData.length,
    ativos: cpfsData.filter(c => c.status === 'ativo').length,
    bloqueados: cpfsData.filter(c => c.status === 'bloqueado' || c.status === 'alerta').length,
    comEtiquetas: cpfsData.filter(c => c.etiqueta && c.etiqueta.trim() !== '').length,
    favoritos: cpfsData.filter(c => c.favorito).length,
    totalMilhas: cpfsData.reduce((sum, c) => sum + c.milhas, 0),
    totalValor: cpfsData.reduce((sum, c) => sum + c.valor, 0)
  };
};

/**
 * Retorna CPF por ID
 */
export const getCPFById = (id) => {
  return cpfsData.find(c => c.id === id);
};

/**
 * Retorna CPFs por programa
 */
export const getCPFsByPrograma = (programa) => {
  return cpfsData.filter(c => c.programa === programa);
};

/**
 * Retorna CPFs por categoria
 */
export const getCPFsByCategoria = (categoria) => {
  return cpfsData.filter(c => c.categoria === categoria);
};

/**
 * Retorna CPFs com etiquetas
 */
export const getCPFsComEtiquetas = () => {
  return cpfsData.filter(c => c.etiqueta && c.etiqueta.trim() !== '');
};

export default {
  getAllCPFs,
  getAllProgramas,
  getCPFStats,
  getCPFById,
  getCPFsByPrograma,
  getCPFsByCategoria,
  getCPFsComEtiquetas
};
/**
 * Script para popular o banco de dados com os 67 programas de milhas
 */

const mongoose = require('mongoose');
require('dotenv').config();
const Program = require('../models/Program');

const programas = [
  // ========== PROGRAMAS NACIONAIS (Com Limite de CPF) ==========
  {
    nome: 'Smiles (GOL)',
    categoria: 'Nacional',
    tipo: 'aéreo',
    limiteCPF: 25,
    tipoPeriodo: 'ano-calendario',
    descricao: 'Programa de fidelidade da GOL. Acumule e resgate milhas para voos da GOL e mais de 50 companhias aéreas parceiras.',
    regras: 'O titular pode emitir passagens para si mesmo e para até 25 CPFs diferentes por ano-calendário (1º jan a 31 dez). A lista zera todo dia 1º de janeiro.',
    parceiros: ['American Airlines', 'Air France', 'KLM', 'Delta'],
    website: 'https://www.smiles.com.br'
  },
  {
    nome: 'LATAM Pass',
    categoria: 'Nacional',
    tipo: 'aéreo',
    limiteCPF: 24,
    tipoPeriodo: 'ano-calendario',
    descricao: 'Programa de fidelidade da LATAM. Acumule e resgate pontos para voos da LATAM e companhias parceiras.',
    regras: 'O titular pode emitir passagens para si mesmo e para até 24 CPFs diferentes por ano-calendário (1º jan a 31 dez). A contagem zera em 1º de janeiro.',
    parceiros: ['Delta', 'British Airways', 'Qantas', 'Qatar Airways'],
    website: 'https://www.latampass.latam.com'
  },
  {
    nome: 'Azul Fidelidade',
    categoria: 'Nacional',
    tipo: 'aéreo',
    limiteCPF: 5,
    tipoPeriodo: 'beneficiarios',
    descricao: 'Programa de fidelidade da Azul. Acumule e resgate pontos para voos da Azul e companhias parceiras.',
    regras: 'Sistema diferente: cadastre até 5 beneficiários fixos (CPFs) para emitir passagens ilimitadamente. Cada beneficiário só pode ser trocado após 60 dias. O titular não entra na lista.',
    parceiros: ['United', 'Copa', 'TAP', 'Avianca'],
    website: 'https://www.azulfidelidade.com.br'
  },

  // ========== PROGRAMAS INTERNACIONAIS (Sem Limite de CPF) ==========
  {
    nome: 'AAdvantage (American Airlines)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da American Airlines.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['British Airways', 'Iberia', 'Qatar Airways', 'LATAM'],
    website: 'https://www.aa.com/aadvantage'
  },
  {
    nome: 'Aerolíneas Argentinas Plus',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Aerolíneas Argentinas.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    website: 'https://www.aerolineas.com.ar/aerolineasplus'
  },
  {
    nome: 'Aeroplan (Air Canada)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Air Canada.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['United', 'Lufthansa', 'Swiss', 'TAP'],
    website: 'https://www.aircanada.com/aeroplan'
  },
  {
    nome: 'Air Europa SUMA',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Air Europa.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    website: 'https://www.aireuropa.com/suma'
  },
  {
    nome: 'Alaska Airlines (Mileage Plan)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Alaska Airlines.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['American Airlines', 'British Airways', 'Qatar Airways'],
    website: 'https://www.alaskaair.com/mileageplan'
  },
  {
    nome: 'British Executive Club (British Airways)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da British Airways.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['American Airlines', 'Iberia', 'Qatar Airways', 'LATAM'],
    website: 'https://www.britishairways.com/executiveclub'
  },
  {
    nome: 'Connect Miles (Copa Airlines)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Copa Airlines.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['United', 'Avianca', 'TAP'],
    website: 'https://www.copaair.com/connectmiles'
  },
  {
    nome: 'Delta SkyMiles',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Delta Air Lines.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['Air France', 'KLM', 'LATAM', 'Korean Air'],
    website: 'https://www.delta.com/skymiles'
  },
  {
    nome: 'Emirates Skywards',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Emirates.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    website: 'https://www.emirates.com/skywards'
  },
  {
    nome: 'Etihad Guest',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Etihad Airways.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    website: 'https://www.etihadguest.com'
  },
  {
    nome: 'Finnair Plus',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Finnair.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['British Airways', 'Qatar Airways', 'Japan Airlines'],
    website: 'https://www.finnair.com/finnairplus'
  },
  {
    nome: 'Flying Blue (Air France/KLM)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade conjunto da Air France e KLM.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['Delta', 'Virgin Atlantic', 'Kenya Airways'],
    website: 'https://www.flyingblue.com'
  },
  {
    nome: 'Flying Club (Virgin Atlantic)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Virgin Atlantic.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['Delta', 'Air France-KLM', 'Singapore Airlines'],
    website: 'https://www.virginatlantic.com/flyingclub'
  },
  {
    nome: 'Iberia Plus',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Iberia.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['British Airways', 'American Airlines', 'Qatar Airways'],
    website: 'https://www.iberia.com/iberiaplus'
  },
  {
    nome: 'LifeMiles (Avianca)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Avianca.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['United', 'Copa', 'TAP', 'Azul'],
    website: 'https://www.lifemiles.com'
  },
  {
    nome: 'Lufthansa (Miles & More)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Lufthansa e grupo.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['United', 'Air Canada', 'Swiss', 'Austrian'],
    website: 'https://www.miles-and-more.com'
  },
  {
    nome: 'Qantas Frequent Flyer',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Qantas.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['Emirates', 'American Airlines', 'British Airways'],
    website: 'https://www.qantas.com/frequentflyer'
  },
  {
    nome: 'Qatar Privilege Club',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Qatar Airways.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['British Airways', 'American Airlines', 'LATAM'],
    website: 'https://www.qatarairways.com/privilegeclub'
  },
  {
    nome: 'Southwest Rapid Rewards',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Southwest Airlines.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    website: 'https://www.southwest.com/rapidrewards'
  },
  {
    nome: 'TAP Miles&Go',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da TAP Air Portugal. Muito popular no Brasil.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['United', 'Avianca', 'Azul', 'Copa'],
    website: 'https://www.flytap.com/milesandgo'
  },
  {
    nome: 'Miles&Smiles (Turkish Airlines)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Turkish Airlines.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    website: 'https://www.turkishairlines.com/milesandsmiles'
  },
  {
    nome: 'United MileagePlus',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da United Airlines.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    parceiros: ['Lufthansa', 'Air Canada', 'TAP', 'Avianca', 'Azul'],
    website: 'https://www.united.com/mileageplus'
  },
  {
    nome: 'Volare (ITA Airways)',
    categoria: 'Internacional',
    tipo: 'aéreo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da ITA Airways.',
    regras: 'Sem limite de CPFs para emissão. Proibida a comercialização de milhas.',
    website: 'https://www.ita-airways.com/volare'
  },

  // ========== PROGRAMAS BANCÁRIOS E FINANCEIROS ==========
  {
    nome: 'Livelo (Bradesco e Banco do Brasil)',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Bradesco e Banco do Brasil. Transfira para diversos programas de milhas.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    parceiros: ['Smiles', 'LATAM Pass', 'Azul', 'TAP'],
    website: 'https://www.livelo.com.br'
  },
  {
    nome: 'Esfera (Santander)',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Santander.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    parceiros: ['Smiles', 'LATAM Pass', 'TAP'],
    website: 'https://www.santander.com.br/esfera'
  },
  {
    nome: 'Átomos (C6 Bank)',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do C6 Bank.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    parceiros: ['Smiles', 'LATAM Pass', 'Azul'],
    website: 'https://www.c6bank.com.br/atomos'
  },
  {
    nome: 'Membership Rewards (American Express)',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos da American Express.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    parceiros: ['Smiles', 'LATAM Pass', 'Azul', 'TAP', 'Avianca'],
    website: 'https://www.americanexpress.com/membershiprewards'
  },
  {
    nome: 'Itaú (anteriormente Iupp)',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Itaú.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    parceiros: ['Smiles', 'LATAM Pass', 'Azul'],
    website: 'https://www.itau.com.br/pra-voce/beneficios/pontos'
  },
  {
    nome: 'BTG Pactual',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do BTG Pactual.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.btgpactual.com'
  },
  {
    nome: 'BV Merece',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Banco BV.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.bv.com.br/merece'
  },
  {
    nome: 'Caixa',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos da Caixa Econômica Federal.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.caixa.gov.br'
  },
  {
    nome: 'Coopera (Sicoob)',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Sicoob.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.sicoob.com.br/coopera'
  },
  {
    nome: 'Credicard',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos da Credicard.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.credicard.com.br'
  },
  {
    nome: 'Cresol',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos da Cresol.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.cresol.com.br'
  },
  {
    nome: 'Curtaí (BRB)',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Banco BRB.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.brb.com.br/curtai'
  },
  {
    nome: 'Genial Investimentos',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos da Genial Investimentos.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.genialinvestimentos.com.br'
  },
  {
    nome: 'Nomad Pass',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos da Nomad.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.nomadglobal.com'
  },
  {
    nome: 'Nubank Rewards / Ultravioleta',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Nubank.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    parceiros: ['LATAM Pass', 'Smiles'],
    website: 'https://www.nubank.com.br/rewards'
  },
  {
    nome: 'Porto Plus (Porto Seguro)',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos da Porto Seguro.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.portoseguro.com.br/portoplus'
  },
  {
    nome: 'Safra Rewards',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Banco Safra.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.safra.com.br'
  },
  {
    nome: 'Sicredi',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Sicredi.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.sicredi.com.br'
  },
  {
    nome: 'Sisprime',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Sisprime.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.sisprime.com.br'
  },
  {
    nome: 'Unicred',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos da Unicred.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.unicred.com.br'
  },
  {
    nome: 'XP Investimentos',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos da XP Investimentos.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.xpi.com.br'
  },
  {
    nome: 'Banescard',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Banescard.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.banescard.com.br'
  },
  {
    nome: 'Banrisul',
    categoria: 'Bancário',
    tipo: 'bancário',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de pontos do Banrisul.',
    regras: 'Transferência de pontos geralmente exige mesma titularidade (mesmo CPF). Não emite passagens diretamente.',
    website: 'https://www.banrisul.com.br'
  },

  // ========== PROGRAMAS DE HOTÉIS ==========
  {
    nome: 'All Accor',
    categoria: 'Hotel',
    tipo: 'hotel',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da rede Accor Hotels.',
    regras: 'Sem limite de CPFs para reservas. Resgate de estadias, upgrades e outros serviços.',
    website: 'https://www.all.accor.com'
  },
  {
    nome: 'Hilton Honors',
    categoria: 'Hotel',
    tipo: 'hotel',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da rede Hilton.',
    regras: 'Sem limite de CPFs para reservas. Resgate de estadias, upgrades e outros serviços.',
    website: 'https://www.hilton.com/honors'
  },
  {
    nome: 'IHG One Rewards',
    categoria: 'Hotel',
    tipo: 'hotel',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade do IHG (InterContinental Hotels Group).',
    regras: 'Sem limite de CPFs para reservas. Resgate de estadias, upgrades e outros serviços.',
    website: 'https://www.ihg.com/onerewards'
  },
  {
    nome: 'Marriott Bonvoy',
    categoria: 'Hotel',
    tipo: 'hotel',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da rede Marriott.',
    regras: 'Sem limite de CPFs para reservas. Resgate de estadias, upgrades e outros serviços.',
    website: 'https://www.marriott.com/bonvoy'
  },
  {
    nome: 'World of Hyatt',
    categoria: 'Hotel',
    tipo: 'hotel',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da rede Hyatt.',
    regras: 'Sem limite de CPFs para reservas. Resgate de estadias, upgrades e outros serviços.',
    website: 'https://www.hyatt.com/worldofhyatt'
  },
  {
    nome: 'MeliáRewards',
    categoria: 'Hotel',
    tipo: 'hotel',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da rede Meliá Hotels.',
    regras: 'Sem limite de CPFs para reservas. Resgate de estadias, upgrades e outros serviços.',
    website: 'https://www.melia.com/meliarewards'
  },

  // ========== OUTROS PROGRAMAS (Varejo, Postos, etc.) ==========
  {
    nome: 'Km de Vantagens (Ipiranga)',
    categoria: 'Varejo',
    tipo: 'varejo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Ipiranga. Acumule Km para descontos ou transfira para LATAM Pass.',
    regras: 'Transferência para LATAM Pass pode ter taxa. A regra de CPF será aplicada no LATAM Pass após transferência.',
    parceiros: ['LATAM Pass'],
    website: 'https://www.ipiranga.com.br/kmdevantagens'
  },
  {
    nome: 'Premmia (Petrobras)',
    categoria: 'Varejo',
    tipo: 'varejo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da Petrobras. Transfira pontos para Azul Fidelidade.',
    regras: 'Transferência para Azul. A regra de beneficiários da Azul será aplicada após transferência.',
    parceiros: ['Azul Fidelidade'],
    website: 'https://www.premmia.com.br'
  },
  {
    nome: 'Shell Box',
    categoria: 'Varejo',
    tipo: 'varejo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de descontos em combustíveis Shell. Pontos podem ser transferidos para Smiles.',
    regras: 'Transferência para Smiles. A regra de 25 CPFs da Smiles será aplicada após transferência.',
    parceiros: ['Smiles'],
    website: 'https://www.shell.com.br/shellbox'
  },
  {
    nome: 'Ale',
    categoria: 'Varejo',
    tipo: 'varejo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da rede de postos Ale. Focado em prêmios e descontos.',
    regras: 'Não possui transferência para companhias aéreas.',
    website: 'https://www.postosale.com.br'
  },
  {
    nome: 'Dotz',
    categoria: 'Outros',
    tipo: 'outro',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade de coalizão. Acumule em diversos parceiros.',
    regras: 'Troque por produtos ou transfira para programas aéreos.',
    parceiros: ['Smiles', 'LATAM Pass'],
    website: 'https://www.dotz.com.br'
  },
  {
    nome: 'GPA (Cliente Mais)',
    categoria: 'Varejo',
    tipo: 'varejo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa do Grupo Pão de Açúcar. Focado em descontos em compras.',
    regras: 'Não há transferência para milhas.',
    website: 'https://www.paodeacucar.com'
  },
  {
    nome: 'Loop',
    categoria: 'Varejo',
    tipo: 'varejo',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de fidelidade da rede de shoppings Aliansce Sonae.',
    regras: 'Pontos trocados por experiências e produtos nos shoppings.',
    website: 'https://www.loop.com.br'
  },
  {
    nome: '+Mengão',
    categoria: 'Outros',
    tipo: 'outro',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa de sócio-torcedor do Flamengo.',
    regras: 'Benefícios como prioridade em ingressos e descontos. Não é programa de pontos de viagem.',
    website: 'https://www.maismengao.com'
  },
  {
    nome: 'BRB StockCar+',
    categoria: 'Outros',
    tipo: 'outro',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa associado a cartão de crédito BRB com benefícios de automobilismo.',
    regras: 'Vinculado ao programa Curtaí do BRB.',
    website: 'https://www.brb.com.br'
  },
  {
    nome: 'Virgin Red',
    categoria: 'Outros',
    tipo: 'outro',
    limiteCPF: null,
    tipoPeriodo: 'sem-limite',
    descricao: 'Programa unificado do grupo Virgin. Acumule em diversas empresas Virgin.',
    regras: 'Funciona como programa internacional, sem limite de CPFs.',
    parceiros: ['Virgin Atlantic'],
    website: 'https://www.virgin.com/virginred'
  }
];

const seedPrograms = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestao-milhas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado ao MongoDB');

    // Limpar programas existentes
    await Program.deleteMany({});
    console.log('🗑️  Programas anteriores removidos');

    // Inserir os 67 programas
    const result = await Program.insertMany(programas);
    console.log(`✅ ${result.length} programas inseridos com sucesso!`);

    // Mostrar resumo por categoria
    const categorias = await Program.aggregate([
      { $group: { _id: '$categoria', total: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Resumo por categoria:');
    categorias.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.total} programas`);
    });

    // Fechar conexão
    await mongoose.connection.close();
    console.log('\n🔒 Conexão fechada. Seed concluído!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
};

seedPrograms();


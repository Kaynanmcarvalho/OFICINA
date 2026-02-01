import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiCheck } from 'react-icons/fi';

// Dados do NCM baseados no arquivo ncm.md
const ncmData = [
  // Balas e doces
  { codigo: '533', nome: 'DORI BALAS TRINK S.FRUTAS', cstIcms: '', cfop: '', classificacao: '17049020', keywords: ['bala', 'doce', 'frutas', 'trink', 'dori'] },
  
  // MTS Stick
  { codigo: '777', nome: 'MTS STICK TUTTI FRUTTI', cstIcms: '', cfop: '', classificacao: '17049020', keywords: ['mts', 'stick', 'tutti', 'frutti'] },
  { codigo: '776', nome: 'MTS STICK RAINBOW', cstIcms: '', cfop: '', classificacao: '17049020', keywords: ['mts', 'stick', 'rainbow', 'arco', 'iris'] },
  { codigo: '775', nome: 'MTS STICK F.VERMELHAS', cstIcms: '', cfop: '', classificacao: '17049020', keywords: ['mts', 'stick', 'frutas', 'vermelhas'] },
  { codigo: '771', nome: 'MTS STICK MINT', cstIcms: '', cfop: '', classificacao: '17049020', keywords: ['mts', 'stick', 'mint', 'menta', 'hortelã'] },
  { codigo: '770', nome: 'MTS STICK FRUIT', cstIcms: '', cfop: '', classificacao: '17049020', keywords: ['mts', 'stick', 'fruit', 'frutas'] },
  { codigo: '769', nome: 'MTS STICK MORANGO IOG', cstIcms: '', cfop: '', classificacao: '17049020', keywords: ['mts', 'stick', 'morango', 'iogurte'] },
  
  // Bermudas e Shorts
  { codigo: '101', nome: 'BERMUDA MASCULINA PRETA', cstIcms: '', cfop: '', classificacao: '62034300', keywords: ['bermuda', 'masculina', 'preta', 'shorts'] },
  { codigo: '102', nome: 'BERMUDA FEMININA AZUL', cstIcms: '', cfop: '', classificacao: '62046300', keywords: ['bermuda', 'feminina', 'azul', 'shorts'] },
  { codigo: '103', nome: 'SHORTS ESPORTIVO MASCULINO', cstIcms: '', cfop: '', classificacao: '62034300', keywords: ['shorts', 'esportivo', 'masculino'] },
  { codigo: '104', nome: 'SHORTS FEMININO ROSA', cstIcms: '', cfop: '', classificacao: '62046300', keywords: ['shorts', 'feminino', 'rosa'] },
  
  // Blusas e Tops
  { codigo: '201', nome: 'BLUSA FEMININA MANGA LONGA', cstIcms: '', cfop: '', classificacao: '61061000', keywords: ['blusa', 'feminina', 'manga', 'longa'] },
  { codigo: '202', nome: 'BLUSA REGATA FEMININA', cstIcms: '', cfop: '', classificacao: '61061000', keywords: ['blusa', 'regata', 'feminina'] },
  { codigo: '203', nome: 'TOP ESPORTIVO FEMININO', cstIcms: '', cfop: '', classificacao: '62121000', keywords: ['top', 'esportivo', 'feminino', 'sutiã'] },
  { codigo: '204', nome: 'BLUSA CROPPED FEMININA', cstIcms: '', cfop: '', classificacao: '61061000', keywords: ['blusa', 'cropped', 'feminina'] },
  
  // Camisetas
  { codigo: '301', nome: 'CAMISETA MASCULINA BÁSICA', cstIcms: '', cfop: '', classificacao: '61091000', keywords: ['camiseta', 'masculina', 'basica'] },
  { codigo: '302', nome: 'CAMISETA FEMININA ESTAMPADA', cstIcms: '', cfop: '', classificacao: '61091000', keywords: ['camiseta', 'feminina', 'estampada'] },
  { codigo: '303', nome: 'CAMISETA POLO MASCULINA', cstIcms: '', cfop: '', classificacao: '61051000', keywords: ['camiseta', 'polo', 'masculina'] },
  { codigo: '304', nome: 'CAMISETA REGATA MASCULINA', cstIcms: '', cfop: '', classificacao: '61091000', keywords: ['camiseta', 'regata', 'masculina'] },
  
  // Conjuntos
  { codigo: '401', nome: 'CONJUNTO MOLETOM MASCULINO', cstIcms: '', cfop: '', classificacao: '61121100', keywords: ['conjunto', 'moletom', 'masculino', 'agasalho'] },
  { codigo: '402', nome: 'CONJUNTO ESPORTIVO FEMININO', cstIcms: '', cfop: '', classificacao: '61121100', keywords: ['conjunto', 'esportivo', 'feminino'] },
  { codigo: '403', nome: 'CONJUNTO PIJAMA FEMININO', cstIcms: '', cfop: '', classificacao: '62089100', keywords: ['conjunto', 'pijama', 'feminino'] },
  
  // Calças
  { codigo: '501', nome: 'CALÇA JEANS MASCULINA', cstIcms: '', cfop: '', classificacao: '62034290', keywords: ['calça', 'jeans', 'masculina'] },
  { codigo: '502', nome: 'CALÇA LEGGING FEMININA', cstIcms: '', cfop: '', classificacao: '62046200', keywords: ['calça', 'legging', 'feminina'] },
  { codigo: '503', nome: 'CALÇA SOCIAL MASCULINA', cstIcms: '', cfop: '', classificacao: '62034100', keywords: ['calça', 'social', 'masculina'] },
  { codigo: '504', nome: 'CALÇA ESPORTIVA FEMININA', cstIcms: '', cfop: '', classificacao: '62046100', keywords: ['calça', 'esportiva', 'feminina'] },
  
  // Tênis e Calçados
  { codigo: '601', nome: 'TÊNIS ESPORTIVO MASCULINO', cstIcms: '', cfop: '', classificacao: '64041100', keywords: ['tenis', 'esportivo', 'masculino', 'calçado'] },
  { codigo: '602', nome: 'TÊNIS FEMININO CASUAL', cstIcms: '', cfop: '', classificacao: '64041100', keywords: ['tenis', 'feminino', 'casual', 'calçado'] },
  { codigo: '603', nome: 'SANDÁLIA FEMININA', cstIcms: '', cfop: '', classificacao: '64041900', keywords: ['sandalia', 'feminina', 'calçado'] },
  { codigo: '604', nome: 'CHINELO MASCULINO', cstIcms: '', cfop: '', classificacao: '64041900', keywords: ['chinelo', 'masculino', 'calçado'] },
  
  // Águas e Bebidas
  { codigo: '701', nome: 'ÁGUA MINERAL NATURAL', cstIcms: '', cfop: '', classificacao: '22011000', keywords: ['agua', 'mineral', 'natural', 'bebida'] },
  { codigo: '702', nome: 'ÁGUA COM GÁS', cstIcms: '', cfop: '', classificacao: '22019000', keywords: ['agua', 'gas', 'gaseificada', 'bebida'] },
  { codigo: '703', nome: 'ÁGUA SABORIZADA', cstIcms: '', cfop: '', classificacao: '22021000', keywords: ['agua', 'saborizada', 'sabor', 'bebida'] },
  
  // Energéticos
  { codigo: '801', nome: 'ENERGÉTICO RED BULL', cstIcms: '', cfop: '', classificacao: '22029000', cest: '0301300', keywords: ['energetico', 'red', 'bull', 'bebida', 'energia'] },
  { codigo: '802', nome: 'ENERGÉTICO MONSTER', cstIcms: '', cfop: '', classificacao: '22029000', cest: '0301300', keywords: ['energetico', 'monster', 'bebida', 'energia'] },
  { codigo: '803', nome: 'ENERGÉTICO TNT', cstIcms: '', cfop: '', classificacao: '22029000', cest: '0301300', keywords: ['energetico', 'tnt', 'bebida', 'energia'] },
  
  // Bonés e Acessórios
  { codigo: '901', nome: 'BONÉ MASCULINO PRETO', cstIcms: '', cfop: '', classificacao: '65050090', keywords: ['bone', 'masculino', 'preto', 'acessorio'] },
  { codigo: '902', nome: 'BONÉ FEMININO ROSA', cstIcms: '', cfop: '', classificacao: '65050090', keywords: ['bone', 'feminino', 'rosa', 'acessorio'] },
  { codigo: '903', nome: 'VISEIRA ESPORTIVA', cstIcms: '', cfop: '', classificacao: '65050090', keywords: ['viseira', 'esportiva', 'acessorio'] },
  
  // Meias
  { codigo: '1001', nome: 'MEIA MASCULINA ALGODÃO', cstIcms: '', cfop: '', classificacao: '61159500', keywords: ['meia', 'masculina', 'algodao'] },
  { codigo: '1002', nome: 'MEIA FEMININA ESPORTIVA', cstIcms: '', cfop: '', classificacao: '61159500', keywords: ['meia', 'feminina', 'esportiva'] },
  { codigo: '1003', nome: 'MEIA SOQUETE BRANCA', cstIcms: '', cfop: '', classificacao: '61159500', keywords: ['meia', 'soquete', 'branca'] },
  
  // Moda Praia
  { codigo: '1101', nome: 'SUNGA MASCULINA PRETA', cstIcms: '', cfop: '', classificacao: '61124100', keywords: ['sunga', 'masculina', 'preta', 'praia'] },
  { codigo: '1102', nome: 'BIQUÍNI FEMININO AZUL', cstIcms: '', cfop: '', classificacao: '61124100', keywords: ['biquini', 'feminino', 'azul', 'praia'] },
  { codigo: '1103', nome: 'MAIÔ FEMININO PRETO', cstIcms: '', cfop: '', classificacao: '61124100', keywords: ['maio', 'feminino', 'preto', 'praia'] },
  
  // Vestidos
  { codigo: '1201', nome: 'VESTIDO FEMININO CASUAL', cstIcms: '', cfop: '', classificacao: '62044400', keywords: ['vestido', 'feminino', 'casual'] },
  { codigo: '1202', nome: 'VESTIDO LONGO FEMININO', cstIcms: '', cfop: '', classificacao: '62044400', keywords: ['vestido', 'longo', 'feminino'] },
  { codigo: '1203', nome: 'VESTIDO ESPORTIVO FEMININO', cstIcms: '', cfop: '', classificacao: '62044400', keywords: ['vestido', 'esportivo', 'feminino'] },
  
  // Coqueteleiras e Acessórios
  { codigo: '212', nome: 'COQUETELEIRA TRANSPARENTE SIMPLES', cstIcms: '', cfop: '', classificacao: '39233000', keywords: ['coqueteleira', 'transparente', 'simples', 'shaker'] },
  { codigo: '211', nome: 'COQUETELEIRA PINK SIMPLES', cstIcms: '', cfop: '', classificacao: '39233010', keywords: ['coqueteleira', 'pink', 'rosa', 'simples', 'shaker'] },
  { codigo: '210', nome: 'COQUETELEIRA AMARELA SIMPLES', cstIcms: '', cfop: '', classificacao: '39233010', keywords: ['coqueteleira', 'amarela', 'simples', 'shaker'] },
  { codigo: '833', nome: 'COQUETELEIRA PRETA SIMPLES', cstIcms: '', cfop: '', classificacao: '39233010', keywords: ['coqueteleira', 'preta', 'simples', 'shaker'] },
  { codigo: '834', nome: 'COQUETELEIRA TRANSPARENTE SIMPLES', cstIcms: '', cfop: '', classificacao: '76151000', keywords: ['coqueteleira', 'transparente', 'simples', 'shaker'] },
  
  // Barras Proteicas Havanna
  { codigo: '17', nome: 'PROTOBAR DOCE DE LEITE HAVANNA', cstIcms: '', cfop: '', classificacao: '21069090', cest: '1703300', keywords: ['protobar', 'doce', 'leite', 'havanna', 'barra'] },
  { codigo: '11', nome: 'BARRA PROTEINA GREGO HAVANNA DOCE LEITE', cstIcms: '', cfop: '', classificacao: '21069090', cest: '1703300', keywords: ['barra', 'proteina', 'grego', 'havanna', 'doce', 'leite'] },
  
  // Whey Especiais
  { codigo: '913', nome: 'WHEY 100% DR PEANUT BOMBOM ITALIANO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', 'dr', 'peanut', 'bombom', 'italiano', 'proteina'] },
  { codigo: '905', nome: 'WHEY NPRO 100% CHOCOLATE REFIL', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', 'npro', 'chocolate', 'refil', 'proteina'] },
  
  // Nutry Barras de Frutas
  { codigo: '762', nome: 'NUTRY BARRA DE FRUTAS COCO/CHOC', cstIcms: '', cfop: '', classificacao: '18063120', keywords: ['nutry', 'barra', 'frutas', 'coco', 'chocolate'] },
  { codigo: '766', nome: 'NUTRY BARRA DE FRUTAS MORANGO', cstIcms: '', cfop: '', classificacao: '18063120', keywords: ['nutry', 'barra', 'frutas', 'morango'] },
  { codigo: '765', nome: 'NUTRY BARRA DE FRUTAS BANAN/CHOC', cstIcms: '', cfop: '', classificacao: '18063120', keywords: ['nutry', 'barra', 'frutas', 'banana', 'chocolate'] },
  { codigo: '764', nome: 'NUTRY BARRA DE FRUTAS AMEIX/CHOC', cstIcms: '', cfop: '', classificacao: '18063120', keywords: ['nutry', 'barra', 'frutas', 'ameixa', 'chocolate'] },
  
  // Nutry Barras Crispy
  { codigo: '894', nome: 'NUTRY BARRA CRISPY AVELA', cstIcms: '', cfop: '', classificacao: '18063120', keywords: ['nutry', 'barra', 'crispy', 'avela', 'crocante'] },
  { codigo: '893', nome: 'NUTRY BARRA CRISPY CHOCOLATE', cstIcms: '', cfop: '', classificacao: '18063120', keywords: ['nutry', 'barra', 'crispy', 'chocolate', 'crocante'] },
  
  // Nutry Barras de Nuts
  { codigo: '389', nome: 'NUTRY BARRA DE NUTS CACAU', cstIcms: '', cfop: '', classificacao: '18063220', keywords: ['nutry', 'barra', 'nuts', 'cacau'] },
  { codigo: '385', nome: 'NUTRY BARRA DE NUTS CRANBERRY', cstIcms: '', cfop: '', classificacao: '20081900', keywords: ['nutry', 'barra', 'nuts', 'cranberry'] },
  { codigo: '386', nome: 'NUTRY BARRA DE NUTS COCO', cstIcms: '', cfop: '', classificacao: '20081900', keywords: ['nutry', 'barra', 'nuts', 'coco'] },
  { codigo: '388', nome: 'NUTRY BARRA DE NUTS CLASSICA', cstIcms: '', cfop: '', classificacao: '20081900', keywords: ['nutry', 'barra', 'nuts', 'classica', 'tradicional'] },
  { codigo: '532', nome: 'NUTRY BARRA DE NUTS SEMENTES', cstIcms: '', cfop: '', classificacao: '20081900', keywords: ['nutry', 'barra', 'nuts', 'sementes'] },
  
  // Nutry Tube Whey
  { codigo: '758', nome: 'NUTRY TUBE WHEY COOKIES', cstIcms: '', cfop: '', classificacao: '19053200', keywords: ['nutry', 'tube', 'whey', 'cookies', 'biscoito'] },
  { codigo: '757', nome: 'NUTRY TUBE WHEY CHOCOLATE', cstIcms: '', cfop: '', classificacao: '19053200', keywords: ['nutry', 'tube', 'whey', 'chocolate'] },
  { codigo: '892', nome: 'NUTRY TUBE WHEY MORANGO', cstIcms: '', cfop: '', classificacao: '19053200', keywords: ['nutry', 'tube', 'whey', 'morango'] },
  
  // Paçoca e Pé de Moleque
  { codigo: '14', nome: 'PE DE MOLEQUE ZERO', cstIcms: '', cfop: '', classificacao: '20079990', keywords: ['pe', 'moleque', 'zero', 'amendoim'] },
  { codigo: '13', nome: 'PACOCA DP ZERO TRAD', cstIcms: '', cfop: '', classificacao: '20079990', keywords: ['pacoca', 'zero', 'tradicional', 'amendoim'] },
  
  // Pasta de Amendoim
  { codigo: '224', nome: 'PASTA DE AM. BROWNIE', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['pasta', 'amendoim', 'brownie'] },
  { codigo: '223', nome: 'PASTA DE AM. BOMBOM ITALIANO', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['pasta', 'amendoim', 'bombom', 'italiano'] },
  { codigo: '222', nome: 'PASTA DE AM. AVELA', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['pasta', 'amendoim', 'avela'] },
  { codigo: '463', nome: 'PASTA DE AM. LEITE EM PO', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['pasta', 'amendoim', 'leite', 'po'] },
  { codigo: '462', nome: 'PASTA DE AM. CHOCOTINE', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['pasta', 'amendoim', 'chocotine'] },
  { codigo: '739', nome: 'PASTA DE AM. COOKIES AND CREAM', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['pasta', 'amendoim', 'cookies', 'cream'] },
  { codigo: '738', nome: 'PASTA DE AM. BUENISSIMO', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['pasta', 'amendoim', 'buenissimo'] },
  { codigo: '737', nome: 'PASTA DE AM. BRIGADEIRO DE COLHER', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['pasta', 'amendoim', 'brigadeiro', 'colher'] },
  { codigo: '736', nome: 'PASTA DE AM. BANOFFEE', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['pasta', 'amendoim', 'banoffee'] },
  { codigo: '937', nome: 'DR.PASTA DE AMEND.BRIGADEIRO', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['dr', 'pasta', 'amendoim', 'brigadeiro'] },
  { codigo: '936', nome: 'DR.PASTA DE AMEND.BANOFFEE', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['dr', 'pasta', 'amendoim', 'banoffee'] },
  { codigo: '935', nome: 'DR.PASTA DE AMEND.COOKIE/CRE', cstIcms: '', cfop: '', classificacao: '20081100', keywords: ['dr', 'pasta', 'amendoim', 'cookie', 'cream'] },
  
  // Whey Protein
  { codigo: '245', nome: 'WHEY BAR CREAMY COOKIES', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', 'bar', 'creamy', 'cookies', 'barra'] },
  { codigo: '244', nome: 'WHEY BAR CREAMY COCO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', 'bar', 'creamy', 'coco', 'barra'] },
  { codigo: '243', nome: 'WHEY BAR CREAMY CHOCO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', 'bar', 'creamy', 'chocolate', 'barra'] },
  { codigo: '332', nome: 'WHEY BAR CREAMY MORANGO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', 'bar', 'creamy', 'morango', 'barra'] },
  { codigo: '242', nome: 'WHEY 100% PURE - MORANGO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'pure', 'morango', 'proteina'] },
  { codigo: '241', nome: 'WHEY 100% PURE - COOKIES', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'pure', 'cookies', 'proteina'] },
  { codigo: '240', nome: 'WHEY 100% PURE - CHOCOLATE', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'pure', 'chocolate', 'proteina'] },
  { codigo: '239', nome: 'WHEY 100% PURE - BAUNILHA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'pure', 'baunilha', 'proteina'] },
  { codigo: '742', nome: 'WHEY 100% PURE - DOCE DE LEITE', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'pure', 'doce', 'leite', 'proteina'] },
  { codigo: '741', nome: 'WHEY 100% PURE - COOKIES', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'pure', 'cookies', 'proteina'] },
  { codigo: '740', nome: 'WHEY 100% PURE - BAUNILHA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'pure', 'baunilha', 'proteina'] },
  { codigo: '238', nome: 'WHEY 100% MORANGO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'morango', 'proteina'] },
  { codigo: '237', nome: 'WHEY 100% COOKIES E CREAM', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'cookies', 'cream', 'proteina'] },
  { codigo: '235', nome: 'WHEY 100% CHOCOLATE', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'chocolate', 'proteina'] },
  { codigo: '234', nome: 'WHEY 100% BAUNILHA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'baunilha', 'proteina'] },
  { codigo: '337', nome: 'WHEY 100% CHOCOLATE MALTADO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'chocolate', 'maltado', 'proteina'] },
  { codigo: '338', nome: 'WHEY 100% PISTACHE C/ CHOCOLATE', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'pistache', 'chocolate', 'proteina'] },
  { codigo: '465', nome: 'WHEY 100% CREME DE COCO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'creme', 'coco', 'proteina'] },
  { codigo: '464', nome: 'WHEY 100% BAUNILHA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['whey', '100%', 'baunilha', 'proteina'] },
  { codigo: '460', nome: 'ISO WHEY BAUNILHA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['iso', 'whey', 'baunilha', 'proteina', 'isolada'] },
  { codigo: '459', nome: 'ISO PRO WHEY CHOCOLATE', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['iso', 'pro', 'whey', 'chocolate', 'proteina'] },
  
  // Termogênicos e Suplementos
  { codigo: '233', nome: 'THERMO X SLIM C/120 CAPS', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['thermo', 'slim', 'caps', 'termogenico', 'queimador'] },
  { codigo: '232', nome: 'THERMO X BLACK C/60', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['thermo', 'black', 'termogenico', 'queimador'] },
  { codigo: '214', nome: 'CREATINE 300G PURA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['creatine', 'creatina', 'pura'] },
  { codigo: '213', nome: 'CREATINA 300G PURA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['creatina', 'pura'] },
  { codigo: '458', nome: 'CREATINA 300G PURA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['creatina', 'pura'] },
  { codigo: '745', nome: 'CREATINA 300G PURA MES 9', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['creatina', 'pura', 'mes'] },
  { codigo: '209', nome: 'CAFEINA 200MG 60 CAPS', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['cafeina', 'caps', 'capsulas'] },
  
  // Atlas Creatina Juicy
  { codigo: '734', nome: 'ATLAS CREATINA JUICY TANGERINA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['atlas', 'creatina', 'juicy', 'tangerina'] },
  { codigo: '733', nome: 'ATLAS CREATINA JUICY MELANCIA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['atlas', 'creatina', 'juicy', 'melancia'] },
  { codigo: '732', nome: 'ATLAS CREATINA JUICY LIMAO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['atlas', 'creatina', 'juicy', 'limao'] },
  { codigo: '731', nome: 'ATLAS CREATINA JUICY LICHIA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['atlas', 'creatina', 'juicy', 'lichia'] },
  
  // C4 Pre-Workout
  { codigo: '208', nome: 'C4 WOMAN TANGERINA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'woman', 'tangerina', 'pre', 'workout'] },
  { codigo: '207', nome: 'C4 WOMAN F.VERMELHAS', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'woman', 'frutas', 'vermelhas', 'pre', 'workout'] },
  { codigo: '206', nome: 'C4 WOMAN LARANJA E AMORA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'woman', 'laranja', 'amora', 'pre', 'workout'] },
  { codigo: '205', nome: 'C4 BLACK EXPLOSION FUSION PUNCH', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'black', 'explosion', 'fusion', 'punch', 'pre', 'workout'] },
  { codigo: '204', nome: 'C4 BLACK EXPLOSION BLOODY MARY', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'black', 'explosion', 'bloody', 'mary', 'pre', 'workout'] },
  { codigo: '746', nome: 'C4 BLACK EXPLO.CRAZY MANGO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'black', 'explosion', 'crazy', 'mango', 'pre', 'workout'] },
  { codigo: '203', nome: 'C4 BETA PUMP ACAI/GUARANA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'beta', 'pump', 'acai', 'guarana', 'pre', 'workout'] },
  { codigo: '335', nome: 'C4 BETA PUMP MELANCIA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'beta', 'pump', 'melancia', 'pre', 'workout'] },
  { codigo: '399', nome: 'C4 BETA PUMP LIMAO PRE WORKOUT', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'beta', 'pump', 'limao', 'pre', 'workout'] },
  { codigo: '400', nome: 'C4 BETA PUMP MACA VERDE PRE WORKOUT', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'beta', 'pump', 'maca', 'verde', 'pre', 'workout'] },
  { codigo: '744', nome: 'C4 BETA PUMP TANGERINA PRE WORKOUT', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'beta', 'pump', 'tangerina', 'pre', 'workout'] },
  { codigo: '743', nome: 'C4 BETA PUMP FRUTAS AMARELAS', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['c4', 'beta', 'pump', 'frutas', 'amarelas', 'pre', 'workout'] },
  
  // Electro Pre-Workout
  { codigo: '217', nome: 'ELECTRO PRE WORKOUT LIMAO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['electro', 'pre', 'workout', 'limao'] },
  { codigo: '216', nome: 'ELECTRO PRE WORKOUT FRUTAS AMAR', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['electro', 'pre', 'workout', 'frutas', 'amarelas'] },
  { codigo: '215', nome: 'ELECTRO PRE WORKOUT ENERG', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['electro', 'pre', 'workout', 'energy', 'energetico'] },
  
  // Power Protein Bar
  { codigo: '226', nome: 'POWER PROTEIN BAR COOKIES', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['power', 'protein', 'bar', 'cookies', 'barra'] },
  { codigo: '225', nome: 'POWER PROTEIN BAR CHOCO C/ COCO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['power', 'protein', 'bar', 'chocolate', 'coco', 'barra'] },
  { codigo: '328', nome: 'POWER PROTEIN BAR NAPOLITANO', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['power', 'protein', 'bar', 'napolitano', 'barra'] },
  { codigo: '329', nome: 'POWER PROTEIN CRISP DARK CHOCOLATE', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['power', 'protein', 'crisp', 'dark', 'chocolate', 'barra'] },
  
  // Colágeno
  { codigo: '401', nome: 'COLAGENO+ AC HIALURON.ABACAXI C/ GENG', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['colageno', 'acido', 'hialuronico', 'abacaxi', 'gengibre'] },
  { codigo: '402', nome: 'COLAGENO+ AC HIALURON.FR.VERMELHAS', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['colageno', 'acido', 'hialuronico', 'frutas', 'vermelhas'] },
  { codigo: '403', nome: 'COLAGENO+ AC HIALURON.LARANJA', cstIcms: '', cfop: '', classificacao: '21069030', cest: '1703300', keywords: ['colageno', 'acido', 'hialuronico', 'laranja'] },
  
  // Camisetas
  { codigo: '336', nome: 'CAMISETA REG FEM NEWMIX M', cstIcms: '', cfop: '', classificacao: '21069030', keywords: ['camiseta', 'regata', 'feminina', 'newmix'] },
  { codigo: '592', nome: 'CAMISETA PRETA NEWMIX G', cstIcms: '', cfop: '', classificacao: '21069030', keywords: ['camiseta', 'preta', 'newmix'] }
];

const NCMSuggestions = ({ productName, onSelect, currentValue }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(currentValue || '');
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setInputValue(currentValue || '');
  }, [currentValue]);

  useEffect(() => {
    if (productName && productName.length > 2) {
      const filtered = ncmData.filter(item => {
        const productWords = productName.toLowerCase().split(' ');
        return item.keywords.some(keyword => 
          productWords.some(word => 
            word.includes(keyword) || keyword.includes(word)
          )

      }).slice(0, 5); // Limitar a 5 sugestões
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [productName]);

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.classificacao);
    setShowSuggestions(false);
    const dataToSelect = {
      ncm: suggestion.classificacao,
      // cstIcms: suggestion.cstIcms, // Removido - manter configuração geral
      // cfop: suggestion.cfop, // Removido - manter configuração geral
      classificacao: suggestion.classificacao,
      codigo: suggestion.codigo,
      codigoProduto: suggestion.codigo // Adicionar código do produto para preencher campo Código *
    };
    
    // Adicionar CEST se disponível
    if (suggestion.cest) {
      dataToSelect.cest = suggestion.cest;
    }
    
    onSelect(dataToSelect);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSelect({ ncm: value });
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleClickOutside = (e) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Ex: 1704.90.20"
          required
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
        />
        {suggestions.length > 0 && (
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          <div className="p-2 text-xs text-gray-500 border-b">
            💡 Sugestões baseadas no nome do produto:
          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">
                    {suggestion.nome}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="inline-block mr-3">
                      <strong>Código:</strong> {suggestion.codigo}
                    </span>
                    <span className="inline-block mr-3">
                      <strong>NCM:</strong> {suggestion.classificacao}
                    </span>
                    {suggestion.cest && (
                      <span className="inline-block mr-3">
                        <strong>CEST:</strong> {suggestion.cest}
                      </span>
                    )}
                    <span className="inline-block mr-3">
                      <strong>CST:</strong> {suggestion.cstIcms || 'Configuração geral'}
                    </span>
                    <span className="inline-block">
                      <strong>CFOP:</strong> {suggestion.cfop || 'Configuração geral'}
                    </span>
                  </div>
                </div>
                <FiCheck className="w-4 h-4 text-blue-500 mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NCMSuggestions;
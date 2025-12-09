/**
 * Vehicle Search Service
 * Serviço de busca de veículos com autocomplete
 * @version 1.0.0
 */

import { BRAZILIAN_VEHICLES_DATABASE, VEHICLES_BY_BRAND } from '../data/brazilianVehicles';
import type { NormalizedVehicle, VehicleSuggestion, VehicleType } from '../types';

// Normaliza texto para busca
const normalize = (text: string): string =>
  text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

// Calcula score de relevância
const calculateRelevance = (vehicle: NormalizedVehicle, query: string, tokens: string[]): number => {
  let score = 0;
  const normalizedQuery = normalize(query);
  
  // Match exato na marca
  if (vehicle.brandNormalized === normalizedQuery) score += 100;
  else if (vehicle.brandNormalized.startsWith(normalizedQuery)) score += 50;
  else if (vehicle.brandNormalized.includes(normalizedQuery)) score += 25;
  
  // Match exato no modelo
  if (vehicle.modelNormalized === normalizedQuery) score += 100;
  else if (vehicle.modelNormalized.startsWith(normalizedQuery)) score += 50;
  else if (vehicle.modelNormalized.includes(normalizedQuery)) score += 25;
  
  // Match em marca + modelo
  const fullName = `${vehicle.brandNormalized} ${vehicle.modelNormalized}`;
  if (fullName.startsWith(normalizedQuery)) score += 75;
  else if (fullName.includes(normalizedQuery)) score += 35;
  
  // Match em tokens individuais
  tokens.forEach(token => {
    if (vehicle.searchTokens.includes(token)) score += 15;
    if (vehicle.brandNormalized.includes(token)) score += 10;
    if (vehicle.modelNormalized.includes(token)) score += 10;
  });
  
  // Bonus para veículos mais recentes
  const currentYear = new Date().getFullYear();
  if (vehicle.yearTo >= currentYear) score += 10;
  if (vehicle.yearTo >= currentYear - 5) score += 5;
  
  return score;
};

// Busca veículos por query
export const searchVehicles = (
  query: string,
  options: {
    limit?: number;
    bodyTypes?: VehicleType[];
    yearFrom?: number;
    yearTo?: number;
  } = {}
): VehicleSuggestion[] => {
  const { limit = 15, bodyTypes, yearFrom, yearTo } = options;
  
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(/\s+/).filter(t => t.length >= 2);
  
  // Filtra e pontua veículos
  const results = BRAZILIAN_VEHICLES_DATABASE
    .filter(vehicle => {
      // Filtro por tipo de carroceria
      if (bodyTypes?.length && !bodyTypes.includes(vehicle.bodyType)) return false;
      
      // Filtro por ano
      if (yearFrom && vehicle.yearTo < yearFrom) return false;
      if (yearTo && vehicle.yearFrom > yearTo) return false;
      
      // Verifica se algum token corresponde
      const fullText = `${vehicle.brandNormalized} ${vehicle.modelNormalized}`;
      return tokens.some(token => fullText.includes(token)) || 
             fullText.includes(normalizedQuery);
    })
    .map(vehicle => ({
      vehicle,
      score: calculateRelevance(vehicle, query, tokens),
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  // Converte para sugestões
  return results.map(({ vehicle }) => ({
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    yearRange: vehicle.yearFrom === vehicle.yearTo 
      ? String(vehicle.yearFrom) 
      : `${vehicle.yearFrom}–${vehicle.yearTo}`,
    bodyType: vehicle.bodyType,
    displayText: `${vehicle.brand} ${vehicle.model} — ${vehicle.yearFrom === vehicle.yearTo ? vehicle.yearFrom : `${vehicle.yearFrom}–${vehicle.yearTo}`}`,
    highlight: query,
  }));
};

// Busca veículo por ID
export const getVehicleById = (id: string): NormalizedVehicle | null => {
  return BRAZILIAN_VEHICLES_DATABASE.find(v => v.id === id) || null;
};

// Lista marcas disponíveis
export const getAvailableBrands = (): string[] => {
  return Object.keys(VEHICLES_BY_BRAND).sort();
};

// Lista modelos por marca
export const getModelsByBrand = (brand: string): string[] => {
  const normalizedBrand = normalize(brand);
  const vehicles = VEHICLES_BY_BRAND[normalizedBrand] || [];
  return [...new Set(vehicles.map(v => v.model))].sort();
};

// Busca veículos por marca e modelo
export const findVehicle = (brand: string, model: string, year?: number): NormalizedVehicle | null => {
  const normalizedBrand = normalize(brand);
  const normalizedModel = normalize(model);
  
  return BRAZILIAN_VEHICLES_DATABASE.find(v => {
    if (v.brandNormalized !== normalizedBrand) return false;
    if (v.modelNormalized !== normalizedModel) return false;
    if (year && (year < v.yearFrom || year > v.yearTo)) return false;
    return true;
  }) || null;
};

// Agrupa sugestões por marca
export const groupSuggestionsByBrand = (suggestions: VehicleSuggestion[]): Record<string, VehicleSuggestion[]> => {
  return suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.brand]) acc[suggestion.brand] = [];
    acc[suggestion.brand].push(suggestion);
    return acc;
  }, {} as Record<string, VehicleSuggestion[]>);
};

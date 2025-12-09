/**
 * Gerador de Código TypeScript
 * Gera código para adicionar veículos faltantes à base de dados
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gera ID único para variante
 */
function generateId(brand, model, year, engine, trim) {
  const parts = [brand, model, year.toString()];
  if (engine) parts.push(engine.replace(/[^a-zA-Z0-9]/g, ''));
  if (trim) parts.push(trim.replace(/[^a-zA-Z0-9]/g, ''));
  return parts.join('_').toLowerCase();
}

/**
 * Escapa string para uso em código
 */
function escapeString(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'");
}

/**
 * Gera código para uma variante de veículo
 */
function generateVariantCode(vehicle, startYear, endYear) {
  const {
    brand,
    model,
    trim,
    engineCode,
    engineName,
    displacementCc,
    fuel,
    transmission,
    bodyType,
    vehicleType,
    power,
  } = vehicle;
  
  const parts = [
    `brand: '${escapeString(brand)}'`,
    `model: '${escapeString(model)}'`,
  ];
  
  if (trim) parts.push(`trim: '${escapeString(trim)}'`);
  if (engineCode) parts.push(`engineCode: '${escapeString(engineCode)}'`);
  if (engineName) parts.push(`engineName: '${escapeString(engineName)}'`);
  if (displacementCc) parts.push(`displacementCc: ${displacementCc}`);
  if (fuel) parts.push(`fuel: '${fuel}'`);
  if (transmission) parts.push(`transmission: '${transmission}'`);
  if (bodyType) parts.push(`bodyType: '${bodyType}'`);
  if (vehicleType) parts.push(`vehicleType: '${vehicleType}'`);
  if (power) parts.push(`power: '${escapeString(power)}'`);
  
  parts.push(`sources: ['fipe']`);
  
  return `  ...generateYearVariants({ ${parts.join(', ')} }, ${startYear}, ${endYear}),`;
}

/**
 * Agrupa veículos por modelo para gerar ranges de anos
 */
function groupByModelVariant(vehicles) {
  const groups = new Map();
  
  for (const vehicle of vehicles) {
    // Cria chave única para a variante (sem ano)
    const key = [
      vehicle.brand,
      vehicle.model,
      vehicle.trim || '',
      vehicle.engineCode || '',
      vehicle.engineName || '',
      vehicle.fuel || '',
    ].join('|');
    
    if (!groups.has(key)) {
      groups.set(key, {
        ...vehicle,
        years: [],
      });
    }
    
    groups.get(key).years.push(vehicle.year);
  }
  
  return Array.from(groups.values());
}

/**
 * Encontra ranges contínuos de anos
 */
function findYearRanges(years) {
  if (!years || years.length === 0) return [];
  
  const sorted = [...new Set(years)].sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0];
  let end = sorted[0];
  
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push({ start, end });
      start = sorted[i];
      end = sorted[i];
    }
  }
  
  ranges.push({ start, end });
  return ranges;
}

/**
 * Gera código TypeScript para veículos faltantes
 */
export function generateMissingVehiclesCode(missingVehicles, brandName) {
  if (!missingVehicles || missingVehicles.length === 0) {
    return '';
  }
  
  const grouped = groupByModelVariant(missingVehicles);
  const lines = [];
  
  // Agrupa por modelo para comentários
  const byModel = new Map();
  for (const variant of grouped) {
    const model = variant.model;
    if (!byModel.has(model)) {
      byModel.set(model, []);
    }
    byModel.get(model).push(variant);
  }
  
  for (const [model, variants] of byModel) {
    lines.push(`  // ${model}`);
    
    for (const variant of variants) {
      const ranges = findYearRanges(variant.years);
      
      for (const range of ranges) {
        lines.push(generateVariantCode(variant, range.start, range.end));
      }
    }
  }
  
  return lines.join('\n');
}

/**
 * Gera arquivo completo com veículos faltantes
 */
export function generateMissingVehiclesFile(groupedMissing) {
  const sections = [];
  
  sections.push(`/**
 * Veículos Faltantes - Gerado Automaticamente
 * Data: ${new Date().toISOString()}
 * 
 * Este arquivo contém veículos identificados na FIPE que não estão
 * na base de dados principal. Revise e adicione ao brazilianVehicles.ts
 */

import type { VehicleVariant } from '../types';

// Helper para gerar variantes por range de anos
const generateYearVariants = (
  base: Omit<VehicleVariant, 'id' | 'year' | 'lastUpdated'>,
  startYear: number,
  endYear: number
): VehicleVariant[] => {
  const variants: VehicleVariant[] = [];
  for (let year = startYear; year <= endYear; year++) {
    const parts = [base.brand, base.model, year.toString()];
    if (base.engineCode) parts.push(base.engineCode.replace(/[^a-zA-Z0-9]/g, ''));
    if (base.trim) parts.push(base.trim.replace(/[^a-zA-Z0-9]/g, ''));
    const id = parts.join('_').toLowerCase();
    
    variants.push({
      ...base,
      id,
      year,
      lastUpdated: new Date().toISOString(),
    });
  }
  return variants;
};
`);

  // Gera seções por marca
  for (const [brand, models] of Object.entries(groupedMissing)) {
    const brandVarName = brand.toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_MISSING';
    
    sections.push(`
// ============================================================================
// ${brand.toUpperCase()} - VEÍCULOS FALTANTES
// ============================================================================
export const ${brandVarName}: VehicleVariant[] = [`);
    
    // Converte grouped para array de veículos
    const vehicles = [];
    for (const [model, data] of Object.entries(models)) {
      for (const year of data.years) {
        for (const trim of data.trims.length > 0 ? data.trims : [null]) {
          for (const engine of data.engines.length > 0 ? data.engines : [null]) {
            for (const fuel of data.fuels.length > 0 ? data.fuels : ['flex']) {
              vehicles.push({
                brand,
                model,
                year,
                trim,
                engineName: engine,
                fuel,
                vehicleType: 'car',
                bodyType: 'hatch',
              });
            }
          }
        }
      }
    }
    
    const code = generateMissingVehiclesCode(vehicles, brand);
    sections.push(code);
    sections.push(`];`);
  }
  
  // Exporta consolidação
  const brandVarNames = Object.keys(groupedMissing).map(
    brand => brand.toUpperCase().replace(/[^A-Z0-9]/g, '_') + '_MISSING'
  );
  
  sections.push(`

// ============================================================================
// CONSOLIDAÇÃO
// ============================================================================
export const ALL_MISSING_VEHICLES: VehicleVariant[] = [
${brandVarNames.map(name => `  ...${name},`).join('\n')}
];

export const MISSING_STATS = {
  totalVariants: ALL_MISSING_VEHICLES.length,
  brands: ${brandVarNames.length},
  generatedAt: '${new Date().toISOString()}',
};
`);

  return sections.join('\n');
}

/**
 * Salva arquivo de veículos faltantes
 */
export function saveMissingVehiclesFile(content, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`✅ Arquivo salvo: ${outputPath}`);
}

/**
 * Gera patch para adicionar ao arquivo principal
 */
export function generatePatchCode(missingVehicles, targetBrand) {
  const filtered = missingVehicles.filter(v => v.brand === targetBrand);
  if (filtered.length === 0) return null;
  
  return generateMissingVehiclesCode(filtered, targetBrand);
}

export default {
  generateMissingVehiclesCode,
  generateMissingVehiclesFile,
  saveMissingVehiclesFile,
  generatePatchCode,
};

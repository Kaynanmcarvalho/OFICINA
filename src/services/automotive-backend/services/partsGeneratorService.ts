/**
 * TORQ Automotive - Parts Generator Service
 * 
 * Gera peças para veículos que não têm cobertura na base de dados atual
 * usando templates baseados em motores similares e validação via Google Scraper
 * 
 * @version 1.0.0
 */

import { PartCategory, PartOrigin } from '../types';
import type { RealPart, VehicleCompatibility, PartEquivalent } from '../data/realPartsDatabase';
import { validatePartWithScraper, type PartValidationRequest } from './googleScraperValidation';

// ============================================================================
// INTERFACES
// ============================================================================

export interface PartTemplate {
  name: string;
  category: PartCategory;
  searchTerms: string[];
  commonBrands: string[];
  specs?: Record<string, string>;
}

export interface GeneratedPart {
  part: RealPart;
  validationResult: {
    isValid: boolean;
    confidence: number;
    sources: string[];
  };
}

export interface GenerationProgress {
  phase: 'searching' | 'validating' | 'completed';
  currentPart: string;
  partsGenerated: number;
  partsValidated: number;
  totalTemplates: number;
}

// ============================================================================
// PART TEMPLATES - Templates para cada categoria de peça
// ============================================================================

const PART_TEMPLATES: PartTemplate[] = [
  // FILTRAÇÃO
  { name: 'Filtro de Óleo', category: PartCategory.FILTRATION, searchTerms: ['filtro óleo', 'oil filter'], commonBrands: ['MANN', 'MAHLE', 'FRAM', 'TECFIL', 'WIX'] },
  { name: 'Filtro de Ar do Motor', category: PartCategory.FILTRATION, searchTerms: ['filtro ar motor', 'air filter'], commonBrands: ['MANN', 'MAHLE', 'FRAM', 'TECFIL', 'K&N'] },
  { name: 'Filtro de Combustível', category: PartCategory.FILTRATION, searchTerms: ['filtro combustível', 'fuel filter'], commonBrands: ['MANN', 'MAHLE', 'BOSCH', 'TECFIL'] },
  { name: 'Filtro de Cabine', category: PartCategory.FILTRATION, searchTerms: ['filtro cabine', 'cabin filter', 'filtro ar condicionado'], commonBrands: ['MANN', 'MAHLE', 'FRAM', 'BOSCH'] },
  
  // ARREFECIMENTO
  { name: "Bomba d'Água", category: PartCategory.COOLING, searchTerms: ['bomba água', 'water pump'], commonBrands: ['SKF', 'SCHADEK', 'INDISA', 'GATES'] },
  { name: 'Válvula Termostática', category: PartCategory.COOLING, searchTerms: ['válvula termostática', 'thermostat'], commonBrands: ['MTE-THOMSON', 'WAHLER', 'GATES'] },
  { name: 'Radiador', category: PartCategory.COOLING, searchTerms: ['radiador', 'radiator'], commonBrands: ['VALEO', 'DENSO', 'BEHR'] },
  { name: 'Ventoinha do Radiador', category: PartCategory.COOLING, searchTerms: ['ventoinha radiador', 'cooling fan'], commonBrands: ['VALEO', 'DENSO', 'BOSCH'] },
  
  // IGNIÇÃO
  { name: 'Vela de Ignição', category: PartCategory.IGNITION, searchTerms: ['vela ignição', 'spark plug'], commonBrands: ['NGK', 'DENSO', 'BOSCH', 'CHAMPION'] },
  { name: 'Bobina de Ignição', category: PartCategory.IGNITION, searchTerms: ['bobina ignição', 'ignition coil'], commonBrands: ['NGK', 'BOSCH', 'DENSO', 'DELPHI'] },
  
  // MOTOR
  { name: 'Correia Dentada', category: PartCategory.ENGINE, searchTerms: ['correia dentada', 'timing belt'], commonBrands: ['GATES', 'CONTINENTAL', 'DAYCO'] },
  { name: 'Tensor da Correia Dentada', category: PartCategory.ENGINE, searchTerms: ['tensor correia dentada', 'timing tensioner'], commonBrands: ['SKF', 'INA', 'GATES'] },
  { name: 'Correia Poly-V', category: PartCategory.ENGINE, searchTerms: ['correia poly-v', 'serpentine belt'], commonBrands: ['GATES', 'CONTINENTAL', 'DAYCO'] },
  { name: 'Tensor da Correia Poly-V', category: PartCategory.ENGINE, searchTerms: ['tensor poly-v', 'belt tensioner'], commonBrands: ['SKF', 'INA', 'GATES'] },
  { name: 'Junta do Cabeçote', category: PartCategory.ENGINE, searchTerms: ['junta cabeçote', 'head gasket'], commonBrands: ['VICTOR REINZ', 'ELRING', 'AJUSA'] },
  { name: 'Junta da Tampa de Válvulas', category: PartCategory.ENGINE, searchTerms: ['junta tampa válvulas', 'valve cover gasket'], commonBrands: ['VICTOR REINZ', 'ELRING'] },
  
  // FREIOS
  { name: 'Pastilha de Freio Dianteira', category: PartCategory.BRAKES, searchTerms: ['pastilha freio dianteira', 'front brake pad'], commonBrands: ['TRW', 'FERODO', 'COBREQ', 'FRAS-LE'] },
  { name: 'Pastilha de Freio Traseira', category: PartCategory.BRAKES, searchTerms: ['pastilha freio traseira', 'rear brake pad'], commonBrands: ['TRW', 'FERODO', 'COBREQ', 'FRAS-LE'] },
  { name: 'Disco de Freio Dianteiro', category: PartCategory.BRAKES, searchTerms: ['disco freio dianteiro', 'front brake disc'], commonBrands: ['TRW', 'FREMAX', 'HIPPER FREIOS'] },
  { name: 'Disco de Freio Traseiro', category: PartCategory.BRAKES, searchTerms: ['disco freio traseiro', 'rear brake disc'], commonBrands: ['TRW', 'FREMAX', 'HIPPER FREIOS'] },
  { name: 'Tambor de Freio Traseiro', category: PartCategory.BRAKES, searchTerms: ['tambor freio traseiro', 'rear brake drum'], commonBrands: ['TRW', 'FREMAX'] },
  { name: 'Sapata de Freio Traseira', category: PartCategory.BRAKES, searchTerms: ['sapata freio traseira', 'rear brake shoe'], commonBrands: ['TRW', 'COBREQ', 'FRAS-LE'] },
  { name: 'Cilindro Mestre de Freio', category: PartCategory.BRAKES, searchTerms: ['cilindro mestre freio', 'brake master cylinder'], commonBrands: ['TRW', 'ATE', 'BOSCH'] },
  { name: 'Flexível de Freio', category: PartCategory.BRAKES, searchTerms: ['flexível freio', 'brake hose'], commonBrands: ['TRW', 'FRAS-LE'] },
  
  // SUSPENSÃO
  { name: 'Amortecedor Dianteiro', category: PartCategory.SUSPENSION, searchTerms: ['amortecedor dianteiro', 'front shock absorber'], commonBrands: ['MONROE', 'COFAP', 'KAYABA'] },
  { name: 'Amortecedor Traseiro', category: PartCategory.SUSPENSION, searchTerms: ['amortecedor traseiro', 'rear shock absorber'], commonBrands: ['MONROE', 'COFAP', 'KAYABA'] },
  { name: 'Mola Helicoidal Dianteira', category: PartCategory.SUSPENSION, searchTerms: ['mola dianteira', 'front coil spring'], commonBrands: ['COFAP', 'FABRINI'] },
  { name: 'Mola Helicoidal Traseira', category: PartCategory.SUSPENSION, searchTerms: ['mola traseira', 'rear coil spring'], commonBrands: ['COFAP', 'FABRINI'] },
  { name: 'Coxim do Amortecedor', category: PartCategory.SUSPENSION, searchTerms: ['coxim amortecedor', 'strut mount'], commonBrands: ['MONROE', 'SAMPEL'] },
  { name: 'Bandeja de Suspensão', category: PartCategory.SUSPENSION, searchTerms: ['bandeja suspensão', 'control arm'], commonBrands: ['TRW', 'NAKATA'] },
  { name: 'Pivô de Suspensão', category: PartCategory.SUSPENSION, searchTerms: ['pivô suspensão', 'ball joint'], commonBrands: ['TRW', 'NAKATA', 'VIEMAR'] },
  { name: 'Bieleta da Barra Estabilizadora', category: PartCategory.SUSPENSION, searchTerms: ['bieleta estabilizadora', 'stabilizer link'], commonBrands: ['TRW', 'NAKATA'] },
  
  // DIREÇÃO
  { name: 'Terminal de Direção', category: PartCategory.STEERING, searchTerms: ['terminal direção', 'tie rod end'], commonBrands: ['TRW', 'NAKATA', 'VIEMAR'] },
  { name: 'Braço Axial de Direção', category: PartCategory.STEERING, searchTerms: ['braço axial', 'inner tie rod'], commonBrands: ['TRW', 'NAKATA'] },
  { name: 'Coifa da Caixa de Direção', category: PartCategory.STEERING, searchTerms: ['coifa direção', 'steering rack boot'], commonBrands: ['TRW', 'SAMPEL'] },
  
  // EMBREAGEM
  { name: 'Kit de Embreagem Completo', category: PartCategory.CLUTCH, searchTerms: ['kit embreagem', 'clutch kit'], commonBrands: ['SACHS', 'LUK', 'VALEO'] },
  { name: 'Atuador Hidráulico da Embreagem', category: PartCategory.CLUTCH, searchTerms: ['atuador embreagem', 'clutch slave cylinder'], commonBrands: ['SACHS', 'LUK'] },
  
  // ELÉTRICA
  { name: 'Alternador', category: PartCategory.ELECTRICAL, searchTerms: ['alternador', 'alternator'], commonBrands: ['BOSCH', 'VALEO', 'DENSO'] },
  { name: 'Motor de Partida', category: PartCategory.ELECTRICAL, searchTerms: ['motor partida', 'starter motor'], commonBrands: ['BOSCH', 'VALEO', 'DENSO'] },
  { name: 'Sonda Lambda', category: PartCategory.ELECTRICAL, searchTerms: ['sonda lambda', 'oxygen sensor'], commonBrands: ['BOSCH', 'NGK', 'DENSO'] },
  { name: 'Sensor de Rotação', category: PartCategory.ELECTRICAL, searchTerms: ['sensor rotação', 'crankshaft sensor'], commonBrands: ['BOSCH', 'DENSO'] },
  { name: 'Sensor de Fase', category: PartCategory.ELECTRICAL, searchTerms: ['sensor fase', 'camshaft sensor'], commonBrands: ['BOSCH', 'DENSO'] },
  { name: 'Sensor de Temperatura', category: PartCategory.ELECTRICAL, searchTerms: ['sensor temperatura motor', 'coolant temp sensor'], commonBrands: ['BOSCH', 'MTE-THOMSON'] },
  
  // COMBUSTÍVEL
  { name: 'Corpo de Borboleta', category: PartCategory.FUEL_SYSTEM, searchTerms: ['corpo borboleta', 'throttle body'], commonBrands: ['BOSCH', 'MAGNETI MARELLI'] },
  { name: 'Bico Injetor', category: PartCategory.FUEL_SYSTEM, searchTerms: ['bico injetor', 'fuel injector'], commonBrands: ['BOSCH', 'DENSO', 'MAGNETI MARELLI'] },
  { name: 'Bomba de Combustível', category: PartCategory.FUEL_SYSTEM, searchTerms: ['bomba combustível', 'fuel pump'], commonBrands: ['BOSCH', 'DELPHI'] },
  
  // ESCAPAMENTO
  { name: 'Catalisador', category: PartCategory.EXHAUST, searchTerms: ['catalisador', 'catalytic converter'], commonBrands: ['WALKER', 'BOSAL'] },
  { name: 'Silencioso Traseiro', category: PartCategory.EXHAUST, searchTerms: ['silencioso traseiro', 'rear muffler'], commonBrands: ['WALKER', 'BOSAL'] },
  
  // BATERIA
  { name: 'Bateria', category: PartCategory.BATTERY, searchTerms: ['bateria automotiva', 'car battery'], commonBrands: ['MOURA', 'HELIAR', 'BOSCH', 'ACDelco'] },
];

// ============================================================================
// GENERATION FUNCTIONS
// ============================================================================

/**
 * Gera um ID único para a peça
 */
function generatePartId(brand: string, model: string, partName: string): string {
  const brandCode = brand.substring(0, 3).toUpperCase();
  const modelCode = model.substring(0, 4).toUpperCase().replace(/\s+/g, '');
  const partCode = partName.substring(0, 10).toUpperCase().replace(/\s+/g, '_');
  return `${brandCode}_${modelCode}_${partCode}`;
}

/**
 * Busca código OEM via Google Scraper
 */
async function searchOemCode(
  vehicleBrand: string,
  vehicleModel: string,
  vehicleYear: number,
  partName: string
): Promise<{ oemCode: string; source: string } | null> {
  // @ts-ignore - Vite env
  const apiUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3001';
  
  try {
    const query = `"${vehicleBrand}" "${vehicleModel}" ${vehicleYear} "${partName}" código OEM peça original`;
    
    const response = await fetch(`${apiUrl}/api/parts/search?code=${encodeURIComponent(query)}&vehicle=${encodeURIComponent(`${vehicleBrand} ${vehicleModel}`)}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // Tentar extrair código OEM dos resultados
    for (const result of data.results || []) {
      const content = `${result.title} ${result.snippet}`;
      
      // Padrões comuns de códigos OEM
      const patterns = [
        /\b(\d{5,10})\b/,  // Números de 5-10 dígitos
        /\b([A-Z]{2,3}[\s-]?\d{3,6}[\s-]?[A-Z0-9]{0,4})\b/i,  // Códigos alfanuméricos
        /\b(\d{2,3}[\s-]?\d{3}[\s-]?\d{3}[\s-]?[A-Z]?)\b/,  // Padrão VW/Audi
      ];
      
      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match) {
          return {
            oemCode: match[1].replace(/\s+/g, ' ').trim(),
            source: result.url,
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('[PartsGenerator] Erro ao buscar código OEM:', error);
    return null;
  }
}

/**
 * Busca códigos equivalentes via Google Scraper
 */
async function searchEquivalentCodes(
  oemCode: string,
  partName: string,
  brands: string[]
): Promise<PartEquivalent[]> {
  const equivalents: PartEquivalent[] = [];
  
  // @ts-ignore - Vite env
  const apiUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3001';
  
  for (const brand of brands.slice(0, 3)) { // Limitar a 3 marcas para não sobrecarregar
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limiting
      
      const query = `"${oemCode}" equivalente ${brand} ${partName}`;
      
      const response = await fetch(`${apiUrl}/api/parts/search?code=${encodeURIComponent(query)}&brand=${encodeURIComponent(brand)}`);
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      // Tentar extrair código equivalente dos resultados
      for (const result of data.results || []) {
        const content = `${result.title} ${result.snippet}`;
        
        // Padrões específicos por marca
        const brandPatterns: Record<string, RegExp> = {
          'MANN': /\b([A-Z]{1,2}\s?\d{2,5}(?:\s?\/\s?\d+)?)\b/i,
          'MAHLE': /\b([A-Z]{2,3}\s?\d{3,4}[A-Z]?)\b/i,
          'BOSCH': /\b(0\s?\d{3}\s?\d{3}\s?\d{3})\b/,
          'FRAM': /\b((?:PH|CA|CF|CH)\d{4,5}[A-Z]?)\b/i,
          'TECFIL': /\b((?:PSL|ARL|GI|ACP)\s?\d{2,4}(?:\/\d)?)\b/i,
          'NGK': /\b([A-Z]{2,8}\d{1,2}[A-Z]{0,4}\d?)\b/i,
          'TRW': /\b((?:GDB|DF|JBJ|JTE)\d{4})\b/i,
          'GATES': /\b(\d{4}XS|\dPK\d{4})\b/i,
          'SKF': /\b(VK[A-Z]{2}\s?\d{5})\b/i,
          'MONROE': /\b([A-Z]\d{4})\b/i,
        };
        
        const pattern = brandPatterns[brand.toUpperCase()] || /\b([A-Z0-9]{4,12})\b/;
        const match = content.match(pattern);
        
        if (match && !equivalents.some(e => e.code === match[1])) {
          equivalents.push({
            brand,
            code: match[1].replace(/\s+/g, ' ').trim(),
            quality: brand === 'MANN' || brand === 'MAHLE' || brand === 'BOSCH' ? 'premium' : 'standard',
          });
          break;
        }
      }
    } catch (error) {
      console.error(`[PartsGenerator] Erro ao buscar equivalente ${brand}:`, error);
    }
  }
  
  return equivalents;
}

/**
 * Gera peças para um veículo específico usando templates e validação via scraper
 */
export async function generatePartsForVehicle(
  vehicleBrand: string,
  vehicleModel: string,
  vehicleYear: number,
  vehicleEngine?: string,
  onProgress?: (progress: GenerationProgress) => void
): Promise<GeneratedPart[]> {
  const generatedParts: GeneratedPart[] = [];
  
  for (let i = 0; i < PART_TEMPLATES.length; i++) {
    const template = PART_TEMPLATES[i];
    
    onProgress?.({
      phase: 'searching',
      currentPart: template.name,
      partsGenerated: generatedParts.length,
      partsValidated: 0,
      totalTemplates: PART_TEMPLATES.length,
    });
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Buscar código OEM
    const oemResult = await searchOemCode(vehicleBrand, vehicleModel, vehicleYear, template.name);
    
    if (!oemResult) {
      continue;
    }
    
    onProgress?.({
      phase: 'validating',
      currentPart: template.name,
      partsGenerated: generatedParts.length,
      partsValidated: i,
      totalTemplates: PART_TEMPLATES.length,
    });
    
    // Buscar equivalentes
    const equivalents = await searchEquivalentCodes(
      oemResult.oemCode,
      template.name,
      template.commonBrands

    // Validar a peça encontrada
    const validationRequest: PartValidationRequest = {
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehicleEngine,
      partName: template.name,
      oemCode: oemResult.oemCode,
      equivalents: equivalents.map(eq => ({ brand: eq.brand, code: eq.code })),
    };
    
    const validationResult = await validatePartWithScraper(validationRequest);
    
    // Só adicionar se a validação for positiva
    if (validationResult.isValid && validationResult.confidence >= 0.7) {
      const part: RealPart = {
        id: generatePartId(vehicleBrand, vehicleModel, template.name),
        name: template.name,
        category: template.category,
        oemCode: oemResult.oemCode,
        manufacturer: vehicleBrand.toUpperCase(),
        origin: PartOrigin.OEM,
        equivalents: equivalents.filter(eq => 
          validationResult.validEquivalents.some(v => v.code === eq.code)
        ),
        compatibility: [{
          brand: vehicleBrand,
          model: vehicleModel,
          yearStart: vehicleYear,
          yearEnd: vehicleYear,
          engineCode: vehicleEngine,
        }],
        specs: template.specs,
        validationSources: [oemResult.source, ...validationResult.oemCodeSources],
        confidenceScore: Math.round(validationResult.confidence * 100),
      };
      
      generatedParts.push({
        part,
        validationResult: {
          isValid: true,
          confidence: validationResult.confidence,
          sources: validationResult.oemCodeSources,
        },
      });
      
      } else {
      }
  }
  
  onProgress?.({
    phase: 'completed',
    currentPart: '',
    partsGenerated: generatedParts.length,
    partsValidated: PART_TEMPLATES.length,
    totalTemplates: PART_TEMPLATES.length,
  });
  
  return generatedParts;
}

/**
 * Retorna os templates de peças disponíveis
 */
export function getPartTemplates(): PartTemplate[] {
  return PART_TEMPLATES;
}

/**
 * Retorna o número total de templates
 */
export function getTotalTemplates(): number {
  return PART_TEMPLATES.length;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  generatePartsForVehicle,
  getPartTemplates,
  getTotalTemplates,
  PART_TEMPLATES,
};

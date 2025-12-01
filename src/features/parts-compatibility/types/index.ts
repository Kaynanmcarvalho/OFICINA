/**
 * TORQ Parts Compatibility - Types
 * Tipos para compatibilidade de peças entre veículos
 */

export interface Part {
  id: string;
  name: string;
  partNumber: string;
  brand: string;
  category: PartCategory;
  description?: string;
  
  // Preços
  price: number;
  costPrice?: number;
  
  // Estoque
  stockQuantity?: number;
  minStock?: number;
  
  // Compatibilidade
  compatibleVehicles: VehicleCompatibility[];
  alternativeParts?: string[]; // IDs de peças alternativas
  
  // Metadados
  empresaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PartCategory =
  | 'engine'           // Motor
  | 'transmission'     // Transmissão
  | 'brakes'           // Freios
  | 'suspension'       // Suspensão
  | 'electrical'       // Elétrica
  | 'cooling'          // Arrefecimento
  | 'fuel'             // Combustível
  | 'exhaust'          // Escape
  | 'body'             // Carroceria
  | 'interior'         // Interior
  | 'filters'          // Filtros
  | 'oils'             // Óleos e fluidos
  | 'tires'            // Pneus
  | 'accessories'      // Acessórios
  | 'other';           // Outros

export interface VehicleCompatibility {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  engine?: string;
  transmission?: 'manual' | 'automatic' | 'cvt' | 'all';
  notes?: string;
}

export interface CompatibilitySearchRequest {
  // Busca por veículo
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleEngine?: string;
  
  // Busca por peça
  partNumber?: string;
  partName?: string;
  partCategory?: PartCategory;
  partBrand?: string;
  
  // Filtros
  inStockOnly?: boolean;
  priceMin?: number;
  priceMax?: number;
}

export interface CompatibilitySearchResult {
  parts: PartWithCompatibility[];
  totalResults: number;
  searchedVehicle?: {
    make: string;
    model: string;
    year: number;
  };
  suggestions?: PartSuggestion[];
}

export interface PartWithCompatibility extends Part {
  compatibilityScore: number; // 0-100
  compatibilityNotes?: string;
  isExactMatch: boolean;
  alternativeFor?: string; // ID da peça original
}

export interface PartSuggestion {
  partId: string;
  partName: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface VehiclePartsProfile {
  vehicleId: string;
  vehiclePlate: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    engine?: string;
  };
  
  // Peças compatíveis por categoria
  compatiblePartsByCategory: Record<PartCategory, number>;
  
  // Peças recomendadas
  recommendedParts: PartSuggestion[];
  
  // Histórico de peças usadas
  partsHistory: PartUsageRecord[];
  
  // Estatísticas
  totalPartsUsed: number;
  totalSpentOnParts: number;
  mostUsedCategory: PartCategory;
}

export interface PartUsageRecord {
  partId: string;
  partName: string;
  partNumber: string;
  usedAt: Date;
  quantity: number;
  price: number;
  serviceId?: string;
  mileageAtUse?: number;
}

export interface PartAlternative {
  originalPartId: string;
  alternativePartId: string;
  compatibilityLevel: 'exact' | 'equivalent' | 'similar';
  priceDifference: number;
  qualityComparison: 'better' | 'same' | 'lower';
  notes?: string;
}

// Labels em português
export const PART_CATEGORY_LABELS: Record<PartCategory, string> = {
  engine: 'Motor',
  transmission: 'Transmissão',
  brakes: 'Freios',
  suspension: 'Suspensão',
  electrical: 'Elétrica',
  cooling: 'Arrefecimento',
  fuel: 'Combustível',
  exhaust: 'Escape',
  body: 'Carroceria',
  interior: 'Interior',
  filters: 'Filtros',
  oils: 'Óleos e Fluidos',
  tires: 'Pneus',
  accessories: 'Acessórios',
  other: 'Outros',
};

export const COMPATIBILITY_LEVEL_LABELS: Record<PartAlternative['compatibilityLevel'], string> = {
  exact: 'Exata',
  equivalent: 'Equivalente',
  similar: 'Similar',
};

export const QUALITY_COMPARISON_LABELS: Record<PartAlternative['qualityComparison'], string> = {
  better: 'Superior',
  same: 'Igual',
  lower: 'Inferior',
};

// Cores por categoria
export const CATEGORY_COLORS: Record<PartCategory, { bg: string; text: string; icon: string }> = {
  engine: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: 'text-red-500' },
  transmission: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', icon: 'text-purple-500' },
  brakes: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', icon: 'text-orange-500' },
  suspension: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', icon: 'text-amber-500' },
  electrical: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', icon: 'text-yellow-500' },
  cooling: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-400', icon: 'text-cyan-500' },
  fuel: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', icon: 'text-green-500' },
  exhaust: { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-700 dark:text-gray-400', icon: 'text-gray-500' },
  body: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: 'text-blue-500' },
  interior: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-400', icon: 'text-indigo-500' },
  filters: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-400', icon: 'text-teal-500' },
  oils: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', icon: 'text-emerald-500' },
  tires: { bg: 'bg-slate-50 dark:bg-slate-900/20', text: 'text-slate-700 dark:text-slate-400', icon: 'text-slate-500' },
  accessories: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-700 dark:text-pink-400', icon: 'text-pink-500' },
  other: { bg: 'bg-neutral-50 dark:bg-neutral-900/20', text: 'text-neutral-700 dark:text-neutral-400', icon: 'text-neutral-500' },
};

// Ícones por categoria (nomes do Lucide)
export const CATEGORY_ICONS: Record<PartCategory, string> = {
  engine: 'Cog',
  transmission: 'Settings2',
  brakes: 'CircleDot',
  suspension: 'ArrowUpDown',
  electrical: 'Zap',
  cooling: 'Thermometer',
  fuel: 'Fuel',
  exhaust: 'Wind',
  body: 'Car',
  interior: 'Armchair',
  filters: 'Filter',
  oils: 'Droplet',
  tires: 'Circle',
  accessories: 'Sparkles',
  other: 'Package',
};

// Marcas populares de veículos
export const POPULAR_MAKES = [
  'Audi',
  'BMW',
  'Chevrolet',
  'Citroën',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Jeep',
  'Kia',
  'Land Rover',
  'Mercedes-Benz',
  'Mitsubishi',
  'Nissan',
  'Peugeot',
  'Renault',
  'Suzuki',
  'Toyota',
  'Volkswagen',
  'Volvo',
];

// Modelos por marca (base de dados expandida)
export const MODELS_BY_MAKE: Record<string, string[]> = {
  'Audi': ['A3', 'A4', 'A5', 'A6', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'RS3', 'RS4', 'RS5', 'RS6', 'e-tron'],
  'BMW': ['116i', '118i', '120i', '320i', '320iA', '325i', '328i', '330i', '335i', '520i', '530i', '540i', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'M3', 'M4', 'M5', '310GS', '320GS', 'F800GS', 'R1200GS', 'R1250GS', 'S1000RR'],
  'Chevrolet': ['Agile', 'Astra', 'Blazer', 'Camaro', 'Captiva', 'Celta', 'Classic', 'Cobalt', 'Corsa', 'Cruze', 'Equinox', 'Joy', 'Montana', 'Onix', 'Onix Plus', 'Prisma', 'S10', 'Spin', 'Tracker', 'Trailblazer', 'Vectra'],
  'Citroën': ['Aircross', 'C3', 'C4', 'C4 Cactus', 'C4 Lounge', 'C5', 'DS3', 'DS4', 'DS5', 'Jumper'],
  'Fiat': ['500', 'Argo', 'Bravo', 'Cronos', 'Doblo', 'Ducato', 'Fastback', 'Fiorino', 'Grand Siena', 'Idea', 'Linea', 'Mobi', 'Palio', 'Punto', 'Pulse', 'Siena', 'Strada', 'Toro', 'Uno'],
  'Ford': ['Bronco', 'EcoSport', 'Edge', 'F-150', 'F-250', 'Fiesta', 'Focus', 'Fusion', 'Ka', 'Ka+', 'Maverick', 'Mustang', 'Ranger', 'Territory', 'Transit'],
  'Honda': ['Accord', 'CB 300', 'CB 500', 'CB 650', 'CBR 600', 'CBR 1000', 'City', 'Civic', 'CR-V', 'Fit', 'HR-V', 'WR-V', 'XRE 300', 'CG 160', 'Biz 125', 'PCX 150'],
  'Hyundai': ['Azera', 'Creta', 'Elantra', 'HB20', 'HB20S', 'HB20X', 'i30', 'ix35', 'Kona', 'Santa Fe', 'Sonata', 'Tucson', 'Veloster'],
  'Jeep': ['Cherokee', 'Commander', 'Compass', 'Gladiator', 'Grand Cherokee', 'Renegade', 'Wrangler'],
  'Kia': ['Bongo', 'Cadenza', 'Carnival', 'Cerato', 'Mohave', 'Niro', 'Optima', 'Picanto', 'Seltos', 'Sorento', 'Soul', 'Sportage', 'Stinger'],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Evoque', 'Range Rover', 'Range Rover Sport', 'Range Rover Velar'],
  'Mercedes-Benz': ['A 200', 'A 250', 'B 200', 'C 180', 'C 200', 'C 250', 'C 300', 'CLA 200', 'CLA 250', 'E 250', 'E 300', 'E 350', 'GLA 200', 'GLA 250', 'GLC 250', 'GLC 300', 'GLE 350', 'GLE 400', 'S 500', 'Sprinter'],
  'Mitsubishi': ['ASX', 'Eclipse Cross', 'L200', 'Lancer', 'Outlander', 'Pajero', 'Pajero Dakar', 'Pajero Full', 'Pajero Sport'],
  'Nissan': ['Altima', 'Frontier', 'Kicks', 'Leaf', 'Livina', 'March', 'Murano', 'Pathfinder', 'Sentra', 'Tiida', 'Versa', 'X-Trail'],
  'Peugeot': ['2008', '206', '207', '208', '3008', '307', '308', '408', '5008', '508', 'Boxer', 'Expert', 'Partner'],
  'Renault': ['Captur', 'Clio', 'Duster', 'Fluence', 'Kangoo', 'Kwid', 'Logan', 'Master', 'Megane', 'Oroch', 'Sandero', 'Stepway', 'Symbol'],
  'Suzuki': ['Grand Vitara', 'Ignis', 'Jimny', 'S-Cross', 'Swift', 'Vitara', 'GSX-R 750', 'GSX-R 1000', 'V-Strom 650', 'V-Strom 1000'],
  'Toyota': ['Camry', 'Corolla', 'Corolla Cross', 'Etios', 'Hilux', 'Hilux SW4', 'Land Cruiser', 'Prius', 'RAV4', 'Yaris'],
  'Volkswagen': ['Amarok', 'Arteon', 'Bora', 'Fox', 'Fusca', 'Gol', 'Golf', 'Jetta', 'Nivus', 'Passat', 'Polo', 'Saveiro', 'T-Cross', 'Taos', 'Tiguan', 'Touareg', 'Up', 'Virtus', 'Voyage'],
  'Volvo': ['C30', 'C40', 'S60', 'S90', 'V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
};

// Marcas populares de peças
export const POPULAR_PART_BRANDS = [
  'Bosch',
  'Continental',
  'Delphi',
  'Denso',
  'Fram',
  'Gates',
  'Hella',
  'K&N',
  'Mahle',
  'Mann',
  'Mobil',
  'Monroe',
  'Motul',
  'NGK',
  'Philips',
  'Shell',
  'SKF',
  'Tecfil',
  'Valeo',
  'Wega',
];

// Tipos de peças comuns para busca
export const COMMON_PART_TYPES = [
  { name: 'Filtro de Óleo', category: 'filters' as PartCategory },
  { name: 'Filtro de Ar', category: 'filters' as PartCategory },
  { name: 'Filtro de Combustível', category: 'filters' as PartCategory },
  { name: 'Filtro de Cabine', category: 'filters' as PartCategory },
  { name: 'Pastilha de Freio', category: 'brakes' as PartCategory },
  { name: 'Disco de Freio', category: 'brakes' as PartCategory },
  { name: 'Amortecedor', category: 'suspension' as PartCategory },
  { name: 'Mola', category: 'suspension' as PartCategory },
  { name: 'Vela de Ignição', category: 'electrical' as PartCategory },
  { name: 'Bobina de Ignição', category: 'electrical' as PartCategory },
  { name: 'Bateria', category: 'electrical' as PartCategory },
  { name: 'Correia Dentada', category: 'engine' as PartCategory },
  { name: 'Correia Poly-V', category: 'engine' as PartCategory },
  { name: 'Bomba d\'Água', category: 'cooling' as PartCategory },
  { name: 'Radiador', category: 'cooling' as PartCategory },
  { name: 'Óleo de Motor', category: 'oils' as PartCategory },
  { name: 'Óleo de Câmbio', category: 'oils' as PartCategory },
  { name: 'Fluido de Freio', category: 'oils' as PartCategory },
  { name: 'Pneu', category: 'tires' as PartCategory },
  { name: 'Embreagem', category: 'transmission' as PartCategory },
];

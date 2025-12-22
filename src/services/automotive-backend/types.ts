/**
 * TORQ Automotive Backend - Type Definitions
 * Tipos e interfaces para o sistema de catálogo automotivo
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum VehicleType {
  MOTORCYCLE = 'motorcycle',
  CAR = 'car',
  SUV = 'suv',
  VAN = 'van',
  TRUCK = 'truck',
  BUS = 'bus',
}

export enum FuelType {
  GASOLINE = 'gasoline',
  ETHANOL = 'ethanol',
  FLEX = 'flex',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  GAS = 'gas', // GNV
}

export enum PartCategory {
  // Motor
  ENGINE = 'engine',
  FILTRATION = 'filtration',
  IGNITION = 'ignition',
  FUEL_SYSTEM = 'fuel_system',
  COOLING = 'cooling',
  LUBRICATION = 'lubrication',
  
  // Transmissão
  TRANSMISSION = 'transmission',
  CLUTCH = 'clutch',
  DRIVETRAIN = 'drivetrain',
  
  // Suspensão e Direção
  SUSPENSION = 'suspension',
  STEERING = 'steering',
  
  // Freios
  BRAKES = 'brakes',
  
  // Elétrica
  ELECTRICAL = 'electrical',
  LIGHTING = 'lighting',
  BATTERY = 'battery',
  
  // Escapamento
  EXHAUST = 'exhaust',
  
  // Carroceria
  BODY = 'body',
  
  // Rodas e Pneus
  WHEELS = 'wheels',
}

export enum PartOrigin {
  OEM = 'oem',           // Original Equipment Manufacturer
  AFTERMARKET = 'aftermarket',
  PARALLEL = 'parallel', // Peça paralela/genérica
}

export enum CompatibilitySource {
  OEM_CATALOG = 'oem_catalog',
  AFTERMARKET_CATALOG = 'aftermarket_catalog',
  TECHNICAL_MANUAL = 'technical_manual',
  CROSS_REFERENCE = 'cross_reference',
  COMMUNITY_VALIDATED = 'community_validated',
  DIMENSION_MATCH = 'dimension_match',
}

// ============================================================================
// VEHICLE INTERFACES
// ============================================================================

export interface VehicleBrand {
  id: string;
  name: string;
  country: string;
  logo?: string;
  vehicleTypes: VehicleType[];
  isActive: boolean;
}

export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  vehicleType: VehicleType;
  generations: VehicleGeneration[];
  startYear: number;
  endYear?: number; // null = ainda em produção
}

export interface VehicleGeneration {
  id: string;
  modelId: string;
  name: string; // Ex: "1ª Geração", "W205", "E90"
  internalCode?: string;
  startYear: number;
  endYear?: number;
  platform?: string; // Plataforma compartilhada
}

export interface VehicleVariant {
  id: string;
  generationId: string;
  modelId: string;
  brandId: string;
  
  // Identificação
  fullName: string; // Ex: "Honda CB 300R 2019 ABS"
  trim?: string;    // Ex: "Sport", "Limited", "ABS"
  
  // Anos
  yearStart: number;
  yearEnd?: number;
  
  // Motor
  engine: EngineSpec;
  
  // Combustível
  fuelType: FuelType;
  
  // Especificações técnicas
  specs: VehicleSpecs;
  
  // Metadados
  checklistVersion: string;
  lastValidatedAt: string;
  confidenceScore: number;
  
  // Relacionamentos
  sharedPlatformWith?: string[]; // IDs de outros veículos na mesma plataforma
}

export interface EngineSpec {
  code: string;        // Ex: "EA211", "K20A", "NC51E"
  name: string;        // Ex: "1.0 TSI", "2.0 VTEC"
  displacement: number; // Em cc
  cylinders: number;
  valves?: number;
  power: number;       // Em cv
  torque: number;      // Em kgfm
  aspiration: 'natural' | 'turbo' | 'supercharged' | 'twin-turbo';
}

export interface VehicleSpecs {
  // Dimensões
  length?: number;
  width?: number;
  height?: number;
  wheelbase?: number;
  weight?: number;
  
  // Capacidades
  fuelTankCapacity?: number;
  oilCapacity?: number;
  coolantCapacity?: number;
  
  // Transmissão
  transmissionType: 'manual' | 'automatic' | 'cvt' | 'dct' | 'amt';
  gears: number;
  
  // Freios
  frontBrakeType: 'disc' | 'drum';
  rearBrakeType: 'disc' | 'drum';
  hasABS: boolean;
  
  // Suspensão
  frontSuspension: string;
  rearSuspension: string;
  
  // Rodas
  wheelSize: string; // Ex: "17x7"
  tireSize: string;  // Ex: "205/55R16"
}

// ============================================================================
// PARTS INTERFACES
// ============================================================================

export interface Part {
  id: string;
  
  // Identificação
  name: string;
  description?: string;
  category: PartCategory;
  subcategory?: string;
  
  // Part Numbers
  oemPartNumber: string;
  alternativePartNumbers: string[];
  
  // Fabricante
  manufacturer: string;
  origin: PartOrigin;
  
  // Especificações técnicas
  specs: PartSpecs;
  
  // Compatibilidade
  compatibleVehicles: VehicleCompatibility[];
  sharedWith: SharedPartInfo[];
  
  // Metadados
  confidenceScore: number;
  validationSources: ValidationSource[];
  lastValidatedAt: string;
  
  // Imagens
  images?: string[];
}

export interface PartSpecs {
  // Dimensões físicas
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    diameter?: number;
    weight?: number;
  };
  
  // Especificações técnicas (variam por categoria)
  technicalSpecs: Record<string, string | number | boolean>;
  
  // Roscas e encaixes
  threadSpec?: string;      // Ex: "M20x1.5"
  connectionType?: string;  // Ex: "Spin-on", "Cartridge"
  
  // Material
  material?: string;
}

export interface VehicleCompatibility {
  vehicleVariantId: string;
  vehicleFullName: string;
  yearStart: number;
  yearEnd?: number;
  
  // Posição/Aplicação
  position?: 'front' | 'rear' | 'left' | 'right' | 'all';
  application?: string; // Ex: "Motor 1.0 TSI apenas"
  
  // Validação
  confidenceScore: number;
  validationSources: CompatibilitySource[];
  technicalReason?: string;
}

export interface SharedPartInfo {
  partId: string;
  partNumber: string;
  vehicleIds: string[];
  vehicleNames: string[];
  technicalReason: string; // Ex: "Mesmo diâmetro de rosca M20x1.5 e altura 65mm"
  confidenceScore: number;
}

export interface ValidationSource {
  source: CompatibilitySource;
  reference: string;
  validatedAt: string;
  notes?: string;
}

// ============================================================================
// CHECKLIST INTERFACES
// ============================================================================

export interface PartChecklist {
  vehicleType: VehicleType;
  version: string;
  lastUpdated: string;
  categories: ChecklistCategory[];
}

export interface ChecklistCategory {
  category: PartCategory;
  name: string;
  items: ChecklistItem[];
  isRequired: boolean;
}

export interface ChecklistItem {
  id: string;
  name: string;
  description?: string;
  isRequired: boolean;
  quantity: number; // Quantidade necessária (ex: 4 velas)
  interval?: string; // Intervalo de troca (ex: "10.000 km")
  
  // Variações por especificação
  variations?: {
    condition: string; // Ex: "Motor 1.0", "Com ABS"
    quantity?: number;
    specs?: Record<string, string>;
  }[];
}

// ============================================================================
// FIREBASE SYNC INTERFACES
// ============================================================================

export interface FirebaseVehicleDoc {
  id: string;
  data: VehicleVariant;
  partsChecklist: VehiclePartsChecklist;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface VehiclePartsChecklist {
  vehicleId: string;
  checklistVersion: string;
  completionPercentage: number;
  items: ChecklistItemStatus[];
  lastValidatedAt: string;
}

export interface ChecklistItemStatus {
  itemId: string;
  itemName: string;
  category: PartCategory;
  status: 'found' | 'not_found' | 'partial' | 'pending';
  foundParts: FoundPart[];
  confidenceScore: number;
}

export interface FoundPart {
  partId: string;
  partNumber: string;
  manufacturer: string;
  origin: PartOrigin;
  confidenceScore: number;
  price?: {
    min: number;
    max: number;
    average: number;
    currency: 'BRL';
  };
}

// ============================================================================
// SEARCH & QUERY INTERFACES
// ============================================================================

export interface VehicleSearchQuery {
  brand?: string;
  model?: string;
  year?: number;
  yearRange?: { start: number; end: number };
  vehicleType?: VehicleType;
  fuelType?: FuelType;
  engineCode?: string;
  query?: string; // Busca textual livre
}

export interface PartSearchQuery {
  vehicleId?: string;
  category?: PartCategory;
  partNumber?: string;
  name?: string;
  origin?: PartOrigin;
  inStockOnly?: boolean;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// VALIDATION INTERFACES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  confidenceScore: number;
  sources: ValidationSource[];
  warnings: string[];
  errors: string[];
}

export interface CompatibilityValidation {
  partId: string;
  vehicleId: string;
  isCompatible: boolean;
  confidenceScore: number;
  technicalReasons: string[];
  dimensionMatch: boolean;
  specMatch: boolean;
  partNumberMatch: boolean;
  sources: CompatibilitySource[];
}

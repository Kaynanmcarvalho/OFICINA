import * as BrandIcons from '@cardog-icons/react';
import { Car } from 'lucide-react';

// Mapeamento de marcas para os ícones corretos (usando Icon para ícone simples)
const brandMapping = {
  // Carros
  'HONDA': 'HondaIcon',
  'TOYOTA': 'ToyotaIcon',
  'FORD': 'FordIcon',
  'CHEVROLET': 'ChevroletIcon',
  'VOLKSWAGEN': 'VolkswagenIcon',
  'FIAT': 'FiatIcon',
  'HYUNDAI': 'HyundaiIcon',
  'NISSAN': 'NissanIcon',
  'BMW': 'BMWIcon',
  'MERCEDES': 'MBIcon',
  'MERCEDES-BENZ': 'MBIcon',
  'AUDI': 'AudiIcon',
  'KIA': 'KiaIcon',
  'MAZDA': 'MazdaIcon',
  'MITSUBISHI': 'MitsubishiIcon',
  'SUBARU': 'SubaruIcon',
  'JEEP': 'JeepIcon',
  'DODGE': 'DodgeIcon',
  'RAM': 'RAMIcon',
  'CHRYSLER': 'ChryslerIcon',
  'CADILLAC': 'CadillacIcon',
  'GMC': 'GMCIcon',
  'LINCOLN': 'LincolnIcon',
  'LEXUS': 'LexusIcon',
  'INFINITI': 'InfinitiIcon',
  'ACURA': 'AcuraIcon',
  'GENESIS': 'GenesisIcon',
  'TESLA': 'TeslaIcon',
  'PORSCHE': 'PorscheIcon',
  'FERRARI': 'FerrariIcon',
  'LAMBORGHINI': 'LamborghiniIcon',
  'MASERATI': 'MaseratiIcon',
  'BENTLEY': 'BentleyIcon',
  'ROLLS-ROYCE': 'RollsRoyceIcon',
  'ROLLS ROYCE': 'RollsRoyceIcon',
  'ASTON MARTIN': 'AstonMartinIcon',
  'ASTON-MARTIN': 'AstonMartinIcon',
  'JAGUAR': 'JaguarIcon',
  'LAND ROVER': 'LandroverIcon',
  'LAND-ROVER': 'LandroverIcon',
  'LANDROVER': 'LandroverIcon',
  'MINI': 'MiniIcon',
  'VOLVO': 'VolvoIcon',
  'ALFA ROMEO': 'AlfaRomeoIcon',
  'ALFA-ROMEO': 'AlfaRomeoIcon',
  'MCLAREN': 'MclarenIcon',
  'LOTUS': 'LotusIcon',
  'BYD': 'BYDIcon',
  'POLESTAR': 'PolestarIcon',
  'LUCID': 'LucidIcon',
  'VINFAST': 'VinfastIcon',
  'HUMMER': 'HummerIcon',
  // Motos (Honda também faz motos, então vai usar o mesmo ícone)
  'YAMAHA': null, // Não tem na biblioteca
  'SUZUKI': null,
  'KAWASAKI': null,
};

// Função para extrair a marca do modelo do veículo
export const extractBrand = (vehicleModel) => {
  if (!vehicleModel) return null;
  
  const modelUpper = vehicleModel.toUpperCase();
  
  // Procura por correspondência exata primeiro
  for (const [key, value] of Object.entries(brandMapping)) {
    if (modelUpper.startsWith(key)) {
      return value;
    }
  }
  
  // Se não encontrar, tenta pegar a primeira palavra
  const firstWord = vehicleModel.split(' ')[0].toUpperCase();
  return brandMapping[firstWord] || null;
};

// Componente que retorna o ícone correto da marca
export const BrandIcon = ({ vehicleModel, className = "w-7 h-7", fallback = true }) => {
  const brandName = extractBrand(vehicleModel);
  
  if (brandName && BrandIcons[brandName]) {
    const IconComponent = BrandIcons[brandName];
    return <IconComponent className={className} />;
  }
  
  // Fallback para ícone genérico de carro/moto
  if (fallback) {
    return <Car className={className} />;
  }
  
  return null;
};

export default BrandIcon;

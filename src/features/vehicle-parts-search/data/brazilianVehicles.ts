/**
 * Brazilian Vehicles Database
 * Re-exports from the complete database
 * @version 5.0.0
 */

import type { VehicleVariant } from '../types';
import { BRAZILIAN_VEHICLES_COMPLETE, DATABASE_STATS } from './brazilianVehiclesComplete';

// Re-export everything from the complete database
export { BRAZILIAN_VEHICLES_COMPLETE, DATABASE_STATS };

// Main export for backward compatibility
export const BRAZILIAN_VEHICLES: VehicleVariant[] = BRAZILIAN_VEHICLES_COMPLETE;

// Alias for compatibility
export const BRAZILIAN_VEHICLES_DATABASE = BRAZILIAN_VEHICLES_COMPLETE;

// Vehicles grouped by brand
export const VEHICLES_BY_BRAND: Record<string, VehicleVariant[]> = BRAZILIAN_VEHICLES_COMPLETE.reduce((acc, vehicle) => {
  if (!acc[vehicle.brand]) {
    acc[vehicle.brand] = [];
  }
  acc[vehicle.brand].push(vehicle);
  return acc;
}, {} as Record<string, VehicleVariant[]>);

// Available brands
export const AVAILABLE_BRANDS = [...new Set(BRAZILIAN_VEHICLES_COMPLETE.map(v => v.brand))].sort();

// Total variants count
export const TOTAL_VARIANTS = BRAZILIAN_VEHICLES_COMPLETE.length;

// Brand logos mapping
export const BRAND_LOGOS: Record<string, string> = {
  'Volkswagen': '/logos/vw.svg',
  'Chevrolet': '/logos/chevrolet.svg',
  'Fiat': '/logos/fiat.svg',
  'Ford': '/logos/ford.svg',
  'Toyota': '/logos/toyota.svg',
  'Honda': '/logos/honda.svg',
  'Hyundai': '/logos/hyundai.svg',
  'Renault': '/logos/renault.svg',
  'Nissan': '/logos/nissan.svg',
  'Peugeot': '/logos/peugeot.svg',
  'Citroën': '/logos/citroen.svg',
  'Mitsubishi': '/logos/mitsubishi.svg',
  'Jeep': '/logos/jeep.svg',
  'Kia': '/logos/kia.svg',
  'BMW': '/logos/bmw.svg',
  'Mercedes-Benz': '/logos/mercedes.svg',
  'Audi': '/logos/audi.svg',
  'Volvo': '/logos/volvo.svg',
  'Land Rover': '/logos/landrover.svg',
  'Porsche': '/logos/porsche.svg',
  'RAM': '/logos/ram.svg',
  'BYD': '/logos/byd.svg',
  'GWM': '/logos/gwm.svg',
  'Caoa Chery': '/logos/chery.svg',
  'JAC': '/logos/jac.svg',
  'Yamaha': '/logos/yamaha.svg',
  'Suzuki': '/logos/suzuki.svg',
  'Kawasaki': '/logos/kawasaki.svg',
  'Ducati': '/logos/ducati.svg',
  'Harley-Davidson': '/logos/harley.svg',
  'Triumph': '/logos/triumph.svg',
  'Royal Enfield': '/logos/royalenfield.svg',
  'Dafra': '/logos/dafra.svg',
  'Shineray': '/logos/shineray.svg',
  'Haojue': '/logos/haojue.svg',
  'Scania': '/logos/scania.svg',
  'MAN': '/logos/man.svg',
  'Iveco': '/logos/iveco.svg',
  'DAF': '/logos/daf.svg',
};

// Export default
export default BRAZILIAN_VEHICLES;

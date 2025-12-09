#!/usr/bin/env node
/**
 * Quick Add - Adiciona veículos específicos rapidamente
 * Para veículos conhecidos que estão faltando
 */

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAIN_DB_PATH = path.resolve(__dirname, '../../../src/features/vehicle-parts-search/data/brazilianVehicles.ts');

// Veículos conhecidos que estão faltando
const MISSING_VEHICLES = {
  // MOTOS HONDA
  'Honda': {
    'Hornet': [
      { trim: '600', engineName: '599cc', cc: 599, years: [2005, 2014], bodyType: 'naked', power: '102cv' },
      { trim: 'CB 600F', engineName: '599cc', cc: 599, years: [2008, 2014], bodyType: 'naked', power: '102cv' },
    ],
  },
};

console.log(chalk.cyan.bold('\n⚡ Quick Add - Veículos Faltantes\n'));

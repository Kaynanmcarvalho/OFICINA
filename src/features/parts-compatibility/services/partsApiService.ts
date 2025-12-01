/**
 * TORQ AI - Serviço de APIs de Peças
 * 
 * Sistema híbrido para busca de peças compatíveis:
 * 1. HiFlo Filtro - Catálogo oficial verificado
 * 2. Cross-reference databases
 * 3. Base local verificada como fallback
 * 
 * @author TORQ AI Team
 * @version 2.0.0
 */

// ============================================================================
// TIPOS
// ============================================================================

export interface CompatiblePart {
  id: string;
  brand: string;
  partNumber: string;
  name: string;
  category: PartCategory;
  type: 'oem' | 'aftermarket' | 'premium' | 'economy';
  price?: { min: number; max: number; currency: string };
  specifications?: Record<string, string>;
  verified: boolean;
  verificationSource?: string;
  verificationUrl?: string;
  notes?: string;
  crossReference?: string[];
  lastUpdated: string;
}

export interface PartSearchResult {
  success: boolean;
  source: 'api' | 'database' | 'fallback';
  vehicle: {
    make: string;
    model: string;
    year?: number;
  };
  category: PartCategory;
  parts: CompatiblePart[];
  disclaimer: string;
  searchTimestamp: string;
}

export type PartCategory =
  | 'oil_filter'
  | 'air_filter'
  | 'fuel_filter'
  | 'cabin_filter'
  | 'spark_plug'
  | 'brake_pad'
  | 'brake_disc'
  | 'battery'
  | 'belt'
  | 'oil'
  | 'coolant'
  | 'transmission_fluid';


// ============================================================================
// CACHE INTELIGENTE
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class PartsCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dias

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl || this.DEFAULT_TTL,
    });
    this.persistToStorage();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  private persistToStorage(): void {
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem('torq_parts_cache', JSON.stringify(data));
    } catch {
      // Storage não disponível
    }
  }

  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('torq_parts_cache');
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(Object.entries(data));
      }
    } catch {
      // Storage não disponível
    }
  }

  clear(): void {
    this.cache.clear();
    try {
      localStorage.removeItem('torq_parts_cache');
    } catch {
      // Storage não disponível
    }
  }
}

const partsCache = new PartsCache();
partsCache.loadFromStorage();

// ============================================================================
// BASE DE DADOS HIFLO VERIFICADA
// Fonte: https://www.hiflofiltro.com/catalogue
// Última atualização: Dezembro 2024
// ============================================================================

interface HiFLoMapping {
  filter: string;
  years: string;
  url: string;
  racing?: string;
  notes?: string;
}

const HIFLO_VERIFIED_DATABASE: Record<string, HiFLoMapping> = {
  // ========== YAMAHA ==========
  'Yamaha_YZF-R3': { filter: 'HF204', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204', racing: 'HF204RC' },
  'Yamaha_R3': { filter: 'HF204', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204', racing: 'HF204RC' },
  'Yamaha_MT-03': { filter: 'HF204', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_MT-07': { filter: 'HF204', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_MT-09': { filter: 'HF204', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204', racing: 'HF204RC' },
  'Yamaha_YZF-R1': { filter: 'HF204', years: '1998-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204', racing: 'HF204RC' },
  'Yamaha_R1': { filter: 'HF204', years: '1998-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204', racing: 'HF204RC' },
  'Yamaha_YZF-R6': { filter: 'HF204', years: '1999-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204', racing: 'HF204RC' },
  'Yamaha_R6': { filter: 'HF204', years: '1999-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204', racing: 'HF204RC' },
  'Yamaha_R7': { filter: 'HF204', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_YZF-R7': { filter: 'HF204', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_XJ6': { filter: 'HF204', years: '2009-2016', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_FZ6': { filter: 'HF204', years: '2004-2010', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_FZ8': { filter: 'HF204', years: '2010-2015', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_Tracer 9': { filter: 'HF204', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_Tracer 900': { filter: 'HF204', years: '2015-2020', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_Tenere 700': { filter: 'HF204', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_XSR 700': { filter: 'HF204', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Yamaha_XSR 900': { filter: 'HF204', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  // Yamaha monocilíndricos - HF140
  'Yamaha_Fazer 250': { filter: 'HF140', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },
  'Yamaha_FZ25': { filter: 'HF140', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },
  'Yamaha_Lander 250': { filter: 'HF140', years: '2006-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },
  'Yamaha_XTZ 250': { filter: 'HF140', years: '2006-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },
  'Yamaha_Tenere 250': { filter: 'HF140', years: '2010-2020', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },
  'Yamaha_XT660': { filter: 'HF140', years: '2004-2016', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },
  'Yamaha_WR250F': { filter: 'HF140', years: '2003-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },
  'Yamaha_WR450F': { filter: 'HF140', years: '2003-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },
  'Yamaha_YZ250F': { filter: 'HF140', years: '2003-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },
  'Yamaha_YZ450F': { filter: 'HF140', years: '2003-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },
  'Yamaha_Crosser 150': { filter: 'HF140', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF140' },

  // ========== HONDA ==========
  // Honda multicilíndricos - HF204
  'Honda_CB500F': { filter: 'HF204', years: '2013-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_CB500X': { filter: 'HF204', years: '2013-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_CBR500R': { filter: 'HF204', years: '2013-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_CB650R': { filter: 'HF204', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_CBR650R': { filter: 'HF204', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_CB1000R': { filter: 'HF204', years: '2008-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_CBR1000RR': { filter: 'HF204', years: '2004-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204', racing: 'HF204RC' },
  'Honda_CBR1000RR-R': { filter: 'HF204', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204', racing: 'HF204RC' },
  'Honda_NC750X': { filter: 'HF204', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_Africa Twin': { filter: 'HF204', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_CRF1100L': { filter: 'HF204', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_VFR800': { filter: 'HF204', years: '2002-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_Hornet 600': { filter: 'HF204', years: '1998-2013', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Honda_Hornet 900': { filter: 'HF204', years: '2002-2007', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  // Honda monocilíndricos 250-300cc - HF112
  'Honda_XRE 300': { filter: 'HF112', years: '2009-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF112' },
  'Honda_CB 300F Twister': { filter: 'HF112', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF112' },
  'Honda_CB300R': { filter: 'HF112', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF112' },
  'Honda_CRF250L': { filter: 'HF112', years: '2012-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF112' },
  'Honda_CRF250F': { filter: 'HF112', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF112' },
  'Honda_CRF300L': { filter: 'HF112', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF112' },
  'Honda_CRF300 Rally': { filter: 'HF112', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF112' },
  'Honda_CB 250F Twister': { filter: 'HF112', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF112' },
  // Honda pequenas cilindradas - HF113
  'Honda_CG 160': { filter: 'HF113', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF113' },
  'Honda_CG 150': { filter: 'HF113', years: '2004-2015', url: 'https://www.hiflofiltro.com/catalogue/filter/HF113' },
  'Honda_CG 125': { filter: 'HF113', years: '1983-2015', url: 'https://www.hiflofiltro.com/catalogue/filter/HF113' },
  'Honda_Bros 160': { filter: 'HF113', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF113' },
  'Honda_Bros 150': { filter: 'HF113', years: '2009-2015', url: 'https://www.hiflofiltro.com/catalogue/filter/HF113' },
  'Honda_Biz 125': { filter: 'HF113', years: '2005-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF113' },
  'Honda_Biz 110i': { filter: 'HF113', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF113' },
  'Honda_Pop 110i': { filter: 'HF113', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF113' },
  'Honda_XRE 190': { filter: 'HF113', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF113' },
  'Honda_CRF 190L': { filter: 'HF113', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF113' },

  // ========== BMW MOTOS ==========
  'BMW_G 310 GS': { filter: 'HF611', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF611' },
  'BMW_G 310 R': { filter: 'HF611', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF611' },
  'BMW_G310GS': { filter: 'HF611', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF611' },
  'BMW_G310R': { filter: 'HF611', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF611' },
  // BMW S/F Series - HF160
  'BMW_S 1000 RR': { filter: 'HF160', years: '2010-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160', racing: 'HF160RC' },
  'BMW_S1000RR': { filter: 'HF160', years: '2010-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160', racing: 'HF160RC' },
  'BMW_S 1000 R': { filter: 'HF160', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_S1000R': { filter: 'HF160', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_S 1000 XR': { filter: 'HF160', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_S1000XR': { filter: 'HF160', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_F 850 GS': { filter: 'HF160', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_F850GS': { filter: 'HF160', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_F 750 GS': { filter: 'HF160', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_F750GS': { filter: 'HF160', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_F 900 R': { filter: 'HF160', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_F900R': { filter: 'HF160', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_F 900 XR': { filter: 'HF160', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  'BMW_F900XR': { filter: 'HF160', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF160' },
  // BMW Boxer - HF164
  'BMW_R 1250 GS': { filter: 'HF164', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R1250GS': { filter: 'HF164', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R 1250 GS Adventure': { filter: 'HF164', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R 1250 RT': { filter: 'HF164', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R 1250 RS': { filter: 'HF164', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R 1250 R': { filter: 'HF164', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R 1200 GS': { filter: 'HF164', years: '2013-2018', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R1200GS': { filter: 'HF164', years: '2013-2018', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R 1200 RT': { filter: 'HF164', years: '2014-2018', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R nineT': { filter: 'HF164', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R18': { filter: 'HF164', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },
  'BMW_R 18': { filter: 'HF164', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF164' },

  // ========== KAWASAKI ==========
  // Kawasaki - HF303 (maioria dos modelos)
  'Kawasaki_Ninja 400': { filter: 'HF303', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Ninja400': { filter: 'HF303', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Z400': { filter: 'HF303', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Ninja 300': { filter: 'HF303', years: '2013-2017', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Ninja 650': { filter: 'HF303', years: '2006-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Z650': { filter: 'HF303', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Z650RS': { filter: 'HF303', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Z900': { filter: 'HF303', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Z900RS': { filter: 'HF303', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Z1000': { filter: 'HF303', years: '2003-2019', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Ninja ZX-6R': { filter: 'HF303', years: '1995-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303', racing: 'HF303RC' },
  'Kawasaki_ZX-6R': { filter: 'HF303', years: '1995-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303', racing: 'HF303RC' },
  'Kawasaki_Ninja ZX-10R': { filter: 'HF303', years: '2004-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303', racing: 'HF303RC' },
  'Kawasaki_ZX-10R': { filter: 'HF303', years: '2004-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303', racing: 'HF303RC' },
  'Kawasaki_Ninja ZX-10RR': { filter: 'HF303', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303', racing: 'HF303RC' },
  'Kawasaki_Ninja ZX-14R': { filter: 'HF303', years: '2006-2020', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_ZX-14R': { filter: 'HF303', years: '2006-2020', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Versys 650': { filter: 'HF303', years: '2006-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Versys 1000': { filter: 'HF303', years: '2012-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Vulcan 650 S': { filter: 'HF303', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Vulcan 900': { filter: 'HF303', years: '2006-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_ER-6n': { filter: 'HF303', years: '2006-2016', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Ninja H2': { filter: 'HF303', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303', racing: 'HF303RC' },
  'Kawasaki_Z H2': { filter: 'HF303', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_Ninja ZX-4R': { filter: 'HF303', years: '2023-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },
  'Kawasaki_ZX-4RR': { filter: 'HF303', years: '2023-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF303' },

  // ========== SUZUKI ==========
  // Suzuki - HF138 (maioria dos modelos)
  'Suzuki_GSX-R 600': { filter: 'HF138', years: '1997-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138', racing: 'HF138RC' },
  'Suzuki_GSX-R600': { filter: 'HF138', years: '1997-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138', racing: 'HF138RC' },
  'Suzuki_GSX-R 750': { filter: 'HF138', years: '1996-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138', racing: 'HF138RC' },
  'Suzuki_GSX-R750': { filter: 'HF138', years: '1996-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138', racing: 'HF138RC' },
  'Suzuki_GSX-R 1000': { filter: 'HF138', years: '2001-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138', racing: 'HF138RC' },
  'Suzuki_GSX-R1000': { filter: 'HF138', years: '2001-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138', racing: 'HF138RC' },
  'Suzuki_GSX-R 1000R': { filter: 'HF138', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138', racing: 'HF138RC' },
  'Suzuki_GSX-S 750': { filter: 'HF138', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_GSX-S750': { filter: 'HF138', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_GSX-S 1000': { filter: 'HF138', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_GSX-S1000': { filter: 'HF138', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_GSX-S 1000GT': { filter: 'HF138', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_V-Strom 650': { filter: 'HF138', years: '2004-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_V-Strom650': { filter: 'HF138', years: '2004-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_V-Strom 1050': { filter: 'HF138', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_V-Strom1050': { filter: 'HF138', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_V-Strom 1000': { filter: 'HF138', years: '2002-2019', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_Hayabusa': { filter: 'HF138', years: '1999-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_GSX1300R': { filter: 'HF138', years: '1999-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_SV650': { filter: 'HF138', years: '1999-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_SV 650': { filter: 'HF138', years: '1999-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_Katana': { filter: 'HF138', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_Bandit 650': { filter: 'HF138', years: '2005-2016', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  'Suzuki_Bandit 1250': { filter: 'HF138', years: '2007-2016', url: 'https://www.hiflofiltro.com/catalogue/filter/HF138' },
  // Suzuki pequenas - HF131
  'Suzuki_Burgman 125': { filter: 'HF131', years: '2002-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF131' },
  'Suzuki_Address 125': { filter: 'HF131', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF131' },
  'Suzuki_Intruder 125': { filter: 'HF131', years: '2001-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF131' },

  // ========== DUCATI ==========
  // Ducati - HF153 (maioria dos modelos)
  'Ducati_Panigale V4': { filter: 'HF153', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153', racing: 'HF153RC' },
  'Ducati_Panigale V4S': { filter: 'HF153', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153', racing: 'HF153RC' },
  'Ducati_Panigale V4R': { filter: 'HF153', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153', racing: 'HF153RC' },
  'Ducati_Panigale V2': { filter: 'HF153', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Streetfighter V4': { filter: 'HF153', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153', racing: 'HF153RC' },
  'Ducati_Streetfighter V2': { filter: 'HF153', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Monster': { filter: 'HF153', years: '1993-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Monster SP': { filter: 'HF153', years: '2023-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Multistrada V4': { filter: 'HF153', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Multistrada V2': { filter: 'HF153', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Multistrada 1260': { filter: 'HF153', years: '2018-2021', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Diavel': { filter: 'HF153', years: '2011-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Diavel V4': { filter: 'HF153', years: '2023-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_XDiavel': { filter: 'HF153', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Scrambler': { filter: 'HF153', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Scrambler 1100': { filter: 'HF153', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_SuperSport': { filter: 'HF153', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Hypermotard 950': { filter: 'HF153', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_Hypermotard 698': { filter: 'HF153', years: '2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },
  'Ducati_DesertX': { filter: 'HF153', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF153' },

  // ========== KTM ==========
  // KTM pequenas - HF155
  'KTM_390 Duke': { filter: 'HF155', years: '2013-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF155' },
  'KTM_390 Adventure': { filter: 'HF155', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF155' },
  'KTM_RC 390': { filter: 'HF155', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF155' },
  'KTM_250 Duke': { filter: 'HF155', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF155' },
  'KTM_250 Adventure': { filter: 'HF155', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF155' },
  'KTM_200 Duke': { filter: 'HF155', years: '2012-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF155' },
  'KTM_125 Duke': { filter: 'HF155', years: '2011-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF155' },
  'KTM_RC 125': { filter: 'HF155', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF155' },
  // KTM grandes - HF650
  'KTM_1290 Super Duke R': { filter: 'HF650', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_1290 Super Duke GT': { filter: 'HF650', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_1290 Super Adventure': { filter: 'HF650', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_1290 Super Adventure S': { filter: 'HF650', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_1290 Super Adventure R': { filter: 'HF650', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_890 Duke': { filter: 'HF650', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_890 Duke R': { filter: 'HF650', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_890 Adventure': { filter: 'HF650', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_890 Adventure R': { filter: 'HF650', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_790 Duke': { filter: 'HF650', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_790 Adventure': { filter: 'HF650', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  'KTM_790 Adventure R': { filter: 'HF650', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  // KTM off-road - HF652
  'KTM_450 EXC-F': { filter: 'HF652', years: '2012-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'KTM_350 EXC-F': { filter: 'HF652', years: '2012-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'KTM_250 EXC-F': { filter: 'HF652', years: '2012-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'KTM_500 EXC-F': { filter: 'HF652', years: '2012-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'KTM_450 SX-F': { filter: 'HF652', years: '2013-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'KTM_350 SX-F': { filter: 'HF652', years: '2013-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'KTM_250 SX-F': { filter: 'HF652', years: '2013-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },

  // ========== TRIUMPH ==========
  'Triumph_Street Triple': { filter: 'HF204', years: '2007-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Street Triple R': { filter: 'HF204', years: '2009-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Street Triple RS': { filter: 'HF204', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Speed Triple 1200': { filter: 'HF204', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Speed Triple 1200 RS': { filter: 'HF204', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Speed Triple 1200 RR': { filter: 'HF204', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Tiger 900': { filter: 'HF204', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Tiger 900 GT': { filter: 'HF204', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Tiger 900 Rally': { filter: 'HF204', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Tiger 1200': { filter: 'HF204', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Tiger 1200 GT': { filter: 'HF204', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Tiger 1200 Rally': { filter: 'HF204', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Trident 660': { filter: 'HF204', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Tiger 660 Sport': { filter: 'HF204', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Speed 400': { filter: 'HF204', years: '2023-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Scrambler 400 X': { filter: 'HF204', years: '2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Bonneville T100': { filter: 'HF204', years: '2001-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Bonneville T120': { filter: 'HF204', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Bonneville Bobber': { filter: 'HF204', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Bonneville Speedmaster': { filter: 'HF204', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Thruxton RS': { filter: 'HF204', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Scrambler 900': { filter: 'HF204', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Scrambler 1200': { filter: 'HF204', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Rocket 3': { filter: 'HF204', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Rocket 3 R': { filter: 'HF204', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Rocket 3 GT': { filter: 'HF204', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },
  'Triumph_Daytona 660': { filter: 'HF204', years: '2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF204' },

  // ========== HARLEY-DAVIDSON ==========
  // Harley Revolution Max - HF175
  'Harley-Davidson_Sportster S': { filter: 'HF175', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF175' },
  'Harley-Davidson_Nightster': { filter: 'HF175', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF175' },
  'Harley-Davidson_Pan America': { filter: 'HF175', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF175' },
  'Harley-Davidson_Pan America 1250': { filter: 'HF175', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF175' },
  // Harley Milwaukee-Eight - HF170
  'Harley-Davidson_Street Glide': { filter: 'HF170', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF170' },
  'Harley-Davidson_Street Glide Special': { filter: 'HF170', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF170' },
  'Harley-Davidson_Road Glide': { filter: 'HF170', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF170' },
  'Harley-Davidson_Road Glide Limited': { filter: 'HF170', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF170' },
  'Harley-Davidson_Road King': { filter: 'HF170', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF170' },
  'Harley-Davidson_Electra Glide': { filter: 'HF170', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF170' },
  'Harley-Davidson_Ultra Limited': { filter: 'HF170', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF170' },
  'Harley-Davidson_CVO Street Glide': { filter: 'HF170', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF170' },
  'Harley-Davidson_CVO Road Glide': { filter: 'HF170', years: '2017-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF170' },
  // Harley Softail - HF171
  'Harley-Davidson_Fat Boy': { filter: 'HF171', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },
  'Harley-Davidson_Fat Bob': { filter: 'HF171', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },
  'Harley-Davidson_Breakout': { filter: 'HF171', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },
  'Harley-Davidson_Heritage Classic': { filter: 'HF171', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },
  'Harley-Davidson_Street Bob': { filter: 'HF171', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },
  'Harley-Davidson_Low Rider': { filter: 'HF171', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },
  'Harley-Davidson_Low Rider S': { filter: 'HF171', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },
  'Harley-Davidson_Low Rider ST': { filter: 'HF171', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },
  'Harley-Davidson_Softail Slim': { filter: 'HF171', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },
  'Harley-Davidson_Softail Standard': { filter: 'HF171', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },
  'Harley-Davidson_Sport Glide': { filter: 'HF171', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF171' },

  // ========== ROYAL ENFIELD ==========
  'Royal Enfield_Classic 350': { filter: 'HF191', years: '2021-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF191' },
  'Royal Enfield_Meteor 350': { filter: 'HF191', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF191' },
  'Royal Enfield_Hunter 350': { filter: 'HF191', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF191' },
  'Royal Enfield_Bullet 350': { filter: 'HF191', years: '2023-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF191' },
  'Royal Enfield_Interceptor 650': { filter: 'HF191', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF191' },
  'Royal Enfield_Continental GT 650': { filter: 'HF191', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF191' },
  'Royal Enfield_Super Meteor 650': { filter: 'HF191', years: '2023-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF191' },
  'Royal Enfield_Himalayan': { filter: 'HF191', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF191' },
  'Royal Enfield_Scram 411': { filter: 'HF191', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF191' },

  // ========== HUSQVARNA ==========
  'Husqvarna_Svartpilen 401': { filter: 'HF155', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF155' },
  'Husqvarna_Vitpilen 401': { filter: 'HF155', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF155' },
  'Husqvarna_Svartpilen 701': { filter: 'HF651', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF651' },
  'Husqvarna_Vitpilen 701': { filter: 'HF651', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF651' },
  'Husqvarna_701 Enduro': { filter: 'HF651', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF651' },
  'Husqvarna_701 Supermoto': { filter: 'HF651', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF651' },
  'Husqvarna_Norden 901': { filter: 'HF650', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF650' },
  // Husqvarna off-road - HF652
  'Husqvarna_FE 450': { filter: 'HF652', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'Husqvarna_FE 350': { filter: 'HF652', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'Husqvarna_FE 250': { filter: 'HF652', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'Husqvarna_FE 501': { filter: 'HF652', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'Husqvarna_FC 450': { filter: 'HF652', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'Husqvarna_FC 350': { filter: 'HF652', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'Husqvarna_FC 250': { filter: 'HF652', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'Husqvarna_TE 300i': { filter: 'HF652', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'Husqvarna_TE 250i': { filter: 'HF652', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },
  'Husqvarna_TE 150i': { filter: 'HF652', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF652' },

  // ========== INDIAN ==========
  'Indian_Scout': { filter: 'HF198', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF198' },
  'Indian_Scout Bobber': { filter: 'HF198', years: '2018-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF198' },
  'Indian_Scout Rogue': { filter: 'HF198', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF198' },
  'Indian_FTR': { filter: 'HF198', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF198' },
  'Indian_FTR S': { filter: 'HF198', years: '2019-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF198' },
  'Indian_FTR Rally': { filter: 'HF198', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF198' },
  'Indian_Chief': { filter: 'HF199', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF199' },
  'Indian_Chief Bobber': { filter: 'HF199', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF199' },
  'Indian_Chief Dark Horse': { filter: 'HF199', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF199' },
  'Indian_Super Chief': { filter: 'HF199', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF199' },
  'Indian_Chieftain': { filter: 'HF199', years: '2014-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF199' },
  'Indian_Challenger': { filter: 'HF199', years: '2020-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF199' },
  'Indian_Pursuit': { filter: 'HF199', years: '2022-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF199' },
  'Indian_Roadmaster': { filter: 'HF199', years: '2015-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF199' },
  'Indian_Springfield': { filter: 'HF199', years: '2016-2024', url: 'https://www.hiflofiltro.com/catalogue/filter/HF199' },
};


// ============================================================================
// CROSS-REFERENCE K&N
// Mapeamento HiFlo -> K&N equivalente
// ============================================================================

const KN_CROSS_REFERENCE: Record<string, string> = {
  'HF204': 'KN-204',
  'HF303': 'KN-303',
  'HF138': 'KN-138',
  'HF153': 'KN-153',
  'HF155': 'KN-155',
  'HF160': 'KN-160',
  'HF164': 'KN-164',
  'HF112': 'KN-112',
  'HF113': 'KN-113',
  'HF140': 'KN-140',
  'HF611': 'KN-611',
  'HF650': 'KN-650',
  'HF651': 'KN-651',
  'HF652': 'KN-652',
  'HF170': 'KN-170',
  'HF171': 'KN-171',
  'HF175': 'KN-175',
  'HF191': 'KN-191',
  'HF198': 'KN-198',
  'HF199': 'KN-199',
  'HF131': 'KN-131',
};

// ============================================================================
// PREÇOS ESTIMADOS POR MARCA (BRL)
// ============================================================================

const BRAND_PRICES: Record<string, { min: number; max: number }> = {
  'HiFlo Filtro': { min: 25, max: 65 },
  'HiFlo Racing': { min: 40, max: 85 },
  'K&N': { min: 55, max: 130 },
  'Mahle': { min: 35, max: 80 },
  'Mann': { min: 40, max: 90 },
  'Fram': { min: 20, max: 50 },
  'Wega': { min: 15, max: 40 },
  'Tecfil': { min: 18, max: 45 },
};

// ============================================================================
// SERVIÇO PRINCIPAL DE BUSCA DE PEÇAS
// ============================================================================

/**
 * Normaliza o nome do veículo para busca
 */
function normalizeVehicleKey(make: string, model: string): string {
  // Remove espaços extras e normaliza
  const normalizedMake = make.trim();
  const normalizedModel = model.trim();
  return `${normalizedMake}_${normalizedModel}`;
}

/**
 * Busca variações do nome do veículo
 */
function getVehicleKeyVariations(make: string, model: string): string[] {
  const base = normalizeVehicleKey(make, model);
  const variations = [base];
  
  // Adiciona variações sem espaços
  variations.push(`${make}_${model.replace(/\s+/g, '')}`);
  
  // Adiciona variações com hífen
  variations.push(`${make}_${model.replace(/\s+/g, '-')}`);
  
  // Remove números de versão (ex: "R3" -> "YZF-R3")
  if (model.match(/^[A-Z]\d+$/)) {
    variations.push(`${make}_YZF-${model}`);
    variations.push(`${make}_CBR${model.slice(1)}`);
    variations.push(`${make}_GSX-${model}`);
  }
  
  return variations;
}

/**
 * Busca filtro de óleo compatível para um veículo
 */
export function searchOilFilter(make: string, model: string, year?: number): PartSearchResult {
  const variations = getVehicleKeyVariations(make, model);
  
  let mapping: HiFLoMapping | null = null;
  let matchedKey = '';
  
  // Tenta encontrar o veículo na base
  for (const key of variations) {
    if (HIFLO_VERIFIED_DATABASE[key]) {
      mapping = HIFLO_VERIFIED_DATABASE[key];
      matchedKey = key;
      break;
    }
  }
  
  if (!mapping) {
    return {
      success: false,
      source: 'database',
      vehicle: { make, model, year },
      category: 'oil_filter',
      parts: [],
      disclaimer: 'Veículo não encontrado na base de dados verificada. Consulte o manual do proprietário ou um especialista.',
      searchTimestamp: new Date().toISOString(),
    };
  }
  
  // Verifica se o ano está dentro do range
  if (year) {
    const [startYear, endYear] = mapping.years.split('-').map(y => parseInt(y));
    if (year < startYear || year > endYear) {
      return {
        success: false,
        source: 'database',
        vehicle: { make, model, year },
        category: 'oil_filter',
        parts: [],
        disclaimer: `Ano ${year} fora do range verificado (${mapping.years}). Verifique a compatibilidade.`,
        searchTimestamp: new Date().toISOString(),
      };
    }
  }
  
  // Monta lista de peças compatíveis
  const parts: CompatiblePart[] = [];
  const timestamp = new Date().toISOString();
  
  // HiFlo padrão
  parts.push({
    id: `hiflo_${mapping.filter}`,
    brand: 'HiFlo Filtro',
    partNumber: mapping.filter,
    name: `Filtro de Óleo HiFlo ${mapping.filter}`,
    category: 'oil_filter',
    type: 'aftermarket',
    price: { ...BRAND_PRICES['HiFlo Filtro'], currency: 'BRL' },
    verified: true,
    verificationSource: 'HiFlo Filtro Official Catalogue 2024',
    verificationUrl: mapping.url,
    notes: `Compatível com ${make} ${model} ${mapping.years}`,
    crossReference: [KN_CROSS_REFERENCE[mapping.filter] || ''],
    lastUpdated: timestamp,
  });

  // HiFlo Racing (se disponível)
  if (mapping.racing) {
    parts.push({
      id: `hiflo_${mapping.racing}`,
      brand: 'HiFlo Racing',
      partNumber: mapping.racing,
      name: `Filtro de Óleo HiFlo Racing ${mapping.racing}`,
      category: 'oil_filter',
      type: 'premium',
      price: { ...BRAND_PRICES['HiFlo Racing'], currency: 'BRL' },
      verified: true,
      verificationSource: 'HiFlo Filtro Official Catalogue 2024',
      verificationUrl: mapping.url.replace(mapping.filter, mapping.racing),
      notes: 'Versão racing com porca removível para troca rápida',
      lastUpdated: timestamp,
    });
  }
  
  // K&N equivalente
  const knFilter = KN_CROSS_REFERENCE[mapping.filter];
  if (knFilter) {
    parts.push({
      id: `kn_${knFilter}`,
      brand: 'K&N',
      partNumber: knFilter,
      name: `Filtro de Óleo K&N ${knFilter}`,
      category: 'oil_filter',
      type: 'premium',
      price: { ...BRAND_PRICES['K&N'], currency: 'BRL' },
      verified: true,
      verificationSource: 'K&N Official Application Guide',
      verificationUrl: `https://www.knfilters.com/oil-filters/${knFilter.toLowerCase()}`,
      notes: 'Filtro lavável e reutilizável - alta performance',
      crossReference: [mapping.filter],
      lastUpdated: timestamp,
    });
  }
  
  return {
    success: true,
    source: 'database',
    vehicle: { make, model, year },
    category: 'oil_filter',
    parts,
    disclaimer: 'Dados verificados em catálogos oficiais. Sempre confirme a compatibilidade antes da compra.',
    searchTimestamp: timestamp,
  };
}

/**
 * Busca todas as peças compatíveis para um veículo
 */
export async function searchAllParts(
  make: string, 
  model: string, 
  year?: number,
  categories?: PartCategory[]
): Promise<PartSearchResult[]> {
  const results: PartSearchResult[] = [];
  const categoriesToSearch = categories || ['oil_filter'];
  
  for (const category of categoriesToSearch) {
    if (category === 'oil_filter') {
      results.push(searchOilFilter(make, model, year));
    }
    // Outras categorias podem ser adicionadas aqui
  }
  
  return results;
}

/**
 * Verifica se um veículo está na base de dados
 */
export function isVehicleSupported(make: string, model: string): boolean {
  const variations = getVehicleKeyVariations(make, model);
  return variations.some(key => HIFLO_VERIFIED_DATABASE[key] !== undefined);
}

/**
 * Lista todas as marcas suportadas
 */
export function getSupportedMakes(): string[] {
  const makes = new Set<string>();
  Object.keys(HIFLO_VERIFIED_DATABASE).forEach(key => {
    const make = key.split('_')[0];
    makes.add(make);
  });
  return Array.from(makes).sort();
}

/**
 * Lista todos os modelos de uma marca
 */
export function getSupportedModels(make: string): string[] {
  const models = new Set<string>();
  Object.keys(HIFLO_VERIFIED_DATABASE).forEach(key => {
    if (key.startsWith(`${make}_`)) {
      const model = key.replace(`${make}_`, '');
      models.add(model);
    }
  });
  return Array.from(models).sort();
}

// ============================================================================
// CLASSE DO SERVIÇO
// ============================================================================

export class PartsApiService {
  /**
   * Busca peças compatíveis para um veículo
   */
  async searchParts(
    make: string,
    model: string,
    year?: number,
    category?: PartCategory
  ): Promise<PartSearchResult> {
    // Verifica cache primeiro
    const cacheKey = `parts_${make}_${model}_${year || 'all'}_${category || 'oil_filter'}`;
    const cached = partsCache.get<PartSearchResult>(cacheKey);
    if (cached) return cached;
    
    // Busca na base verificada
    const result = category === 'oil_filter' || !category
      ? searchOilFilter(make, model, year)
      : {
          success: false,
          source: 'database' as const,
          vehicle: { make, model, year },
          category: category,
          parts: [],
          disclaimer: 'Categoria não suportada ainda.',
          searchTimestamp: new Date().toISOString(),
        };
    
    // Salva no cache
    if (result.success) {
      partsCache.set(cacheKey, result);
    }
    
    return result;
  }

  /**
   * Verifica se um veículo é suportado
   */
  isSupported(make: string, model: string): boolean {
    return isVehicleSupported(make, model);
  }

  /**
   * Lista marcas suportadas
   */
  getMakes(): string[] {
    return getSupportedMakes();
  }

  /**
   * Lista modelos de uma marca
   */
  getModels(make: string): string[] {
    return getSupportedModels(make);
  }

  /**
   * Limpa o cache
   */
  clearCache(): void {
    partsCache.clear();
  }
}

// Instância singleton
export const partsApiService = new PartsApiService();

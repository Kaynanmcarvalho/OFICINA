/**
 * TORQ Damage Detection Service
 * Serviço para análise de danos em fotos usando IA
 */

import type {
  DamageDetectionResult,
  DetectedDamage,
  DamageAnalysisRequest,
  DamageType,
  DamageSeverity,
  VehicleCondition,
  VehicleArea,
} from '../types';

// Configuração da API (OpenAI Vision ou similar)
const API_CONFIG = {
  // Usar variável de ambiente para a chave
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiKey: (import.meta as any).env?.VITE_OPENAI_API_KEY || '',
  model: 'gpt-4o', // Modelo com visão
  maxTokens: 1000,
};

/**
 * Analisa uma imagem para detectar danos no veículo
 */
export async function analyzeImage(
  request: DamageAnalysisRequest
): Promise<DamageDetectionResult> {
  const startTime = Date.now();

  try {
    // Se não tiver API key, usar análise simulada para desenvolvimento
    if (!API_CONFIG.apiKey) {
      console.warn('[DamageDetection] API key não configurada, usando análise simulada');
      return simulateAnalysis(request, startTime);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(),
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: getUserPrompt(request),
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${request.imageBase64}`,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: API_CONFIG.maxTokens,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices[0].message.content);

    return formatAnalysisResult(analysisResult, request, startTime);
  } catch (error) {
    console.error('[DamageDetection] Erro na análise:', error);
    // Retornar resultado vazio em caso de erro
    return {
      id: generateId(),
      imageUrl: `data:image/jpeg;base64,${request.imageBase64.substring(0, 50)}...`,
      analyzedAt: new Date(),
      damages: [],
      overallCondition: 'good',
      confidence: 0,
      processingTime: Date.now() - startTime,
    };
  }
}

/**
 * Prompt do sistema para a IA
 */
function getSystemPrompt(): string {
  return `Você é um especialista em inspeção veicular. Analise a imagem do veículo e identifique TODOS os danos visíveis.

Para cada dano encontrado, forneça:
- type: tipo do dano (scratch, dent, crack, worn_tire, misalignment, leak, rust, broken_glass, paint_damage, bumper_damage, light_damage, mirror_damage, other)
- severity: severidade (minor, moderate, severe)
- confidence: confiança de 0 a 1
- area: área do veículo (front, rear, left_side, right_side, roof, hood, trunk, wheel, windshield, interior)
- position: descrição da posição em português
- description: descrição detalhada do dano em português
- boundingBox: coordenadas aproximadas em porcentagem (x, y, width, height)

Responda APENAS em JSON válido com a estrutura:
{
  "damages": [...],
  "overallCondition": "excellent" | "good" | "fair" | "poor",
  "confidence": 0.0-1.0,
  "notes": "observações gerais"
}

Se não encontrar danos, retorne damages como array vazio e overallCondition como "excellent".`;
}

/**
 * Prompt do usuário com contexto do veículo
 */
function getUserPrompt(request: DamageAnalysisRequest): string {
  let prompt = 'Analise esta foto do veículo e identifique todos os danos visíveis.';

  if (request.vehicleInfo) {
    const { brand, model, year, plate } = request.vehicleInfo;
    const parts: string[] = [];
    if (brand) parts.push(`Marca: ${brand}`);
    if (model) parts.push(`Modelo: ${model}`);
    if (year) parts.push(`Ano: ${year}`);
    if (plate) parts.push(`Placa: ${plate}`);

    if (parts.length > 0) {
      prompt += `\n\nInformações do veículo:\n${parts.join('\n')}`;
    }
  }

  return prompt;
}

/**
 * Formata o resultado da análise
 */
function formatAnalysisResult(
  rawResult: {
    damages?: Array<{
      type: string;
      severity: string;
      confidence: number;
      area: string;
      position: string;
      description: string;
      boundingBox?: { x: number; y: number; width: number; height: number };
    }>;
    overallCondition?: string;
    confidence?: number;
  },
  request: DamageAnalysisRequest,
  startTime: number
): DamageDetectionResult {
  const damages: DetectedDamage[] = (rawResult.damages || []).map((d, index) => ({
    id: `damage-${index}-${Date.now()}`,
    type: (d.type as DamageType) || 'other',
    severity: (d.severity as DamageSeverity) || 'minor',
    confidence: d.confidence || 0.5,
    location: {
      area: (d.area as VehicleArea) || 'front',
      position: d.position || 'Não especificado',
    },
    boundingBox: d.boundingBox || { x: 0, y: 0, width: 0, height: 0 },
    description: d.description || 'Dano detectado',
  }));

  return {
    id: generateId(),
    imageUrl: `data:image/jpeg;base64,${request.imageBase64.substring(0, 100)}...`,
    analyzedAt: new Date(),
    damages,
    overallCondition: (rawResult.overallCondition as VehicleCondition) || 'good',
    confidence: rawResult.confidence || 0.8,
    processingTime: Date.now() - startTime,
  };
}

/**
 * Análise simulada para desenvolvimento (quando não há API key)
 */
function simulateAnalysis(
  request: DamageAnalysisRequest,
  startTime: number
): DamageDetectionResult {
  // Simular delay de processamento
  const processingTime = 800 + Math.random() * 400;

  // Gerar danos aleatórios para demonstração
  const possibleDamages: Array<{
    type: DamageType;
    severity: DamageSeverity;
    area: VehicleArea;
    description: string;
  }> = [
    { type: 'scratch', severity: 'minor', area: 'left_side', description: 'Risco superficial na lateral esquerda' },
    { type: 'dent', severity: 'moderate', area: 'front', description: 'Amassado no para-choque dianteiro' },
    { type: 'worn_tire', severity: 'moderate', area: 'wheel', description: 'Pneu com desgaste irregular' },
    { type: 'paint_damage', severity: 'minor', area: 'hood', description: 'Descascamento de pintura no capô' },
  ];

  // Selecionar 0-2 danos aleatórios
  const numDamages = Math.floor(Math.random() * 3);
  const selectedDamages = possibleDamages
    .sort(() => Math.random() - 0.5)
    .slice(0, numDamages);

  const damages: DetectedDamage[] = selectedDamages.map((d, index) => ({
    id: `damage-${index}-${Date.now()}`,
    type: d.type,
    severity: d.severity,
    confidence: 0.75 + Math.random() * 0.2,
    location: {
      area: d.area,
      position: getPositionDescription(d.area),
    },
    boundingBox: {
      x: 20 + Math.random() * 40,
      y: 20 + Math.random() * 40,
      width: 15 + Math.random() * 20,
      height: 15 + Math.random() * 20,
    },
    description: d.description,
  }));

  const overallCondition: VehicleCondition =
    damages.length === 0
      ? 'excellent'
      : damages.some((d) => d.severity === 'severe')
        ? 'poor'
        : damages.some((d) => d.severity === 'moderate')
          ? 'fair'
          : 'good';

  return {
    id: generateId(),
    imageUrl: request.imageBase64 ? `data:image/jpeg;base64,${request.imageBase64.substring(0, 100)}...` : '',
    analyzedAt: new Date(),
    damages,
    overallCondition,
    confidence: 0.85,
    processingTime: Date.now() - startTime + processingTime,
  };
}

function getPositionDescription(area: VehicleArea): string {
  const positions: Record<VehicleArea, string[]> = {
    front: ['central', 'lado esquerdo', 'lado direito'],
    rear: ['central', 'lado esquerdo', 'lado direito'],
    left_side: ['parte dianteira', 'parte central', 'parte traseira'],
    right_side: ['parte dianteira', 'parte central', 'parte traseira'],
    roof: ['parte frontal', 'parte central', 'parte traseira'],
    hood: ['lado esquerdo', 'central', 'lado direito'],
    trunk: ['lado esquerdo', 'central', 'lado direito'],
    wheel: ['dianteiro esquerdo', 'dianteiro direito', 'traseiro esquerdo', 'traseiro direito'],
    windshield: ['parte superior', 'parte central', 'parte inferior'],
    interior: ['painel', 'bancos', 'console'],
  };

  const options = positions[area] || ['não especificado'];
  return options[Math.floor(Math.random() * options.length)];
}

function generateId(): string {
  return `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Verifica se o serviço está configurado com API key
 */
export function isConfigured(): boolean {
  return !!API_CONFIG.apiKey;
}

// Objeto de serviço para compatibilidade
export const damageDetectionService = {
  analyzeImage,
  analyzeMultipleImages,
  calculateDamageSummary,
  isConfigured,
};

/**
 * Analisa múltiplas imagens em paralelo
 */
export async function analyzeMultipleImages(
  requests: DamageAnalysisRequest[]
): Promise<DamageDetectionResult[]> {
  const results = await Promise.all(requests.map((req) => analyzeImage(req)));
  return results;
}

/**
 * Calcula resumo dos danos de múltiplas análises
 */
export function calculateDamageSummary(results: DamageDetectionResult[]): {
  totalDamages: number;
  bySeverity: Record<DamageSeverity, number>;
  byType: Record<string, number>;
  overallCondition: VehicleCondition;
} {
  const allDamages = results.flatMap((r) => r.damages);

  const bySeverity: Record<DamageSeverity, number> = {
    minor: 0,
    moderate: 0,
    severe: 0,
  };

  const byType: Record<string, number> = {};

  allDamages.forEach((damage) => {
    const severity = damage.severity as DamageSeverity;
    const type = damage.type as string;
    bySeverity[severity] = (bySeverity[severity] || 0) + 1;
    byType[type] = (byType[type] || 0) + 1;
  });

  // Determinar condição geral
  let overallCondition: VehicleCondition = 'excellent';
  if (bySeverity.severe > 0) {
    overallCondition = 'poor';
  } else if (bySeverity.moderate > 1) {
    overallCondition = 'fair';
  } else if (bySeverity.moderate > 0 || bySeverity.minor > 2) {
    overallCondition = 'good';
  }

  return {
    totalDamages: allDamages.length,
    bySeverity,
    byType,
    overallCondition,
  };
}

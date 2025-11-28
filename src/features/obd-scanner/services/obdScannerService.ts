/**
 * TORQ OBD Scanner Service
 * Serviço para comunicação com dispositivos OBD-II
 */

import type {
  OBDScanResult,
  OBDScanRequest,
  OBDConnectionState,
  DiagnosticTroubleCode,
  LiveDataReading,
  DTCSeverity,
  VehicleSystem,
  VehicleHealth,
  OBDDeviceInfo,
} from '../types';

class OBDScannerService {
  private connectionState: OBDConnectionState = {
    isConnected: false,
    isScanning: false,
    device: null,
    error: null,
    progress: 0,
    currentStep: '',
  };

  private listeners: Array<(state: OBDConnectionState) => void> = [];
  private bluetoothDevice: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  isBluetoothSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  async connectDevice(): Promise<OBDDeviceInfo | null> {
    if (!this.isBluetoothSupported()) {
      throw new Error('Web Bluetooth não é suportado neste navegador');
    }

    try {
      this.updateState({ currentStep: 'Procurando dispositivos...', progress: 10 });

      this.bluetoothDevice = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'OBD' },
          { namePrefix: 'ELM327' },
          { namePrefix: 'OBDII' },
        ],
        optionalServices: [
          '0000fff0-0000-1000-8000-00805f9b34fb',
          '0000ffe0-0000-1000-8000-00805f9b34fb',
        ],
      });

      this.updateState({ currentStep: 'Conectando...', progress: 30 });

      const server = await this.bluetoothDevice.gatt!.connect();
      
      this.updateState({ currentStep: 'Configurando serviços...', progress: 50 });

      const service = await server.getPrimaryService('0000fff0-0000-1000-8000-00805f9b34fb');
      this.characteristic = await service.getCharacteristic('0000fff2-0000-1000-8000-00805f9b34fb');

      this.updateState({ currentStep: 'Inicializando dispositivo...', progress: 70 });

      await this.initializeOBD();

      const deviceInfo: OBDDeviceInfo = {
        deviceId: this.bluetoothDevice.id,
        deviceName: this.bluetoothDevice.name || 'Dispositivo OBD',
        protocol: 'AUTO',
        version: '2.1',
        isConnected: true,
        signalStrength: 85,
      };

      this.updateState({
        isConnected: true,
        device: deviceInfo,
        currentStep: 'Conectado',
        progress: 100,
        error: null,
      });

      return deviceInfo;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar dispositivo';
      this.updateState({
        error: errorMessage,
        currentStep: 'Erro na conexão',
        progress: 0,
      });
      throw error;
    }
  }

  private async initializeOBD(): Promise<void> {
    if (!this.characteristic) throw new Error('Dispositivo não conectado');

    const initCommands = ['ATZ', 'ATE0', 'ATL0', 'ATS0', 'ATH1', 'ATSP0'];

    for (const command of initCommands) {
      await this.sendCommand(command);
      await this.delay(100);
    }
  }

  async performScan(request: OBDScanRequest): Promise<OBDScanResult> {
    if (!this.connectionState.isConnected) {
      return this.simulateScan(request);
    }

    this.updateState({ isScanning: true, progress: 0, currentStep: 'Iniciando scan...' });

    try {
      const startTime = Date.now();

      this.updateState({ currentStep: 'Lendo códigos de falha...', progress: 20 });
      const diagnosticCodes = await this.readDiagnosticCodes();

      let liveData: LiveDataReading[] = [];
      if (request.includeLiveData) {
        this.updateState({ currentStep: 'Coletando dados ao vivo...', progress: 60 });
        liveData = await this.readLiveData();
      }

      this.updateState({ currentStep: 'Identificando veículo...', progress: 80 });
      const vehicleInfo = await this.getVehicleInfo();

      const summary = this.generateSummary(diagnosticCodes);

      const result: OBDScanResult = {
        id: `scan-${Date.now()}`,
        vehicleId: request.vehicleInfo?.plate,
        checkinId: request.checkinId,
        budgetId: request.budgetId,
        scannedAt: new Date(),
        deviceInfo: this.connectionState.device!,
        diagnosticCodes,
        liveData,
        vehicleInfo,
        summary,
        scanDuration: Date.now() - startTime,
      };

      this.updateState({ 
        isScanning: false, 
        progress: 100, 
        currentStep: 'Scan concluído' 
      });

      return result;
    } catch (error) {
      this.updateState({
        isScanning: false,
        error: error instanceof Error ? error.message : 'Erro durante o scan',
        progress: 0,
      });
      throw error;
    }
  }

  private async readDiagnosticCodes(): Promise<DiagnosticTroubleCode[]> {
    return [];
  }

  private async readLiveData(): Promise<LiveDataReading[]> {
    return [];
  }

  private async getVehicleInfo() {
    return {
      ecuCount: 1,
      supportedProtocols: ['AUTO' as const],
    };
  }

  private async sendCommand(command: string): Promise<string> {
    if (!this.characteristic) {
      throw new Error('Dispositivo não conectado');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(command + '\r');
    
    await this.characteristic.writeValue(data);
    
    return '';
  }

  private async simulateScan(request: OBDScanRequest): Promise<OBDScanResult> {
    this.updateState({ isScanning: true, progress: 0, currentStep: 'Simulando scan...' });

    for (let i = 0; i <= 100; i += 20) {
      await this.delay(200);
      this.updateState({ progress: i, currentStep: `Processando... ${i}%` });
    }

    const diagnosticCodes = this.generateSimulatedCodes();
    const liveData = this.generateSimulatedLiveData();
    const summary = this.generateSummary(diagnosticCodes);

    const result: OBDScanResult = {
      id: `sim-scan-${Date.now()}`,
      vehicleId: request.vehicleInfo?.plate,
      checkinId: request.checkinId,
      budgetId: request.budgetId,
      scannedAt: new Date(),
      deviceInfo: {
        deviceId: 'simulator',
        deviceName: 'Simulador OBD',
        protocol: 'AUTO',
        version: '2.1',
        isConnected: true,
        signalStrength: 95,
      },
      diagnosticCodes,
      liveData,
      vehicleInfo: {
        vin: 'SIM123456789ABCDEF',
        make: request.vehicleInfo?.make,
        model: request.vehicleInfo?.model,
        year: request.vehicleInfo?.year,
        ecuCount: 3,
        supportedProtocols: ['ISO15765-4'],
      },
      summary,
      scanDuration: 2000,
    };

    this.updateState({ 
      isScanning: false, 
      progress: 100, 
      currentStep: 'Scan simulado concluído' 
    });

    return result;
  }

  private generateSimulatedCodes(): DiagnosticTroubleCode[] {
    const possibleCodes = [
      {
        code: 'P0171',
        description: 'Sistema muito pobre (Banco 1)',
        severity: 'warning' as DTCSeverity,
        system: 'fuel_system' as VehicleSystem,
        possibleCauses: ['Filtro de ar sujo', 'Vazamento de vácuo', 'Sensor MAF defeituoso'],
        recommendedActions: ['Verificar filtro de ar', 'Inspecionar mangueiras de vácuo'],
      },
      {
        code: 'P0420',
        description: 'Eficiência do catalisador abaixo do limite',
        severity: 'critical' as DTCSeverity,
        system: 'emission' as VehicleSystem,
        possibleCauses: ['Catalisador danificado', 'Sensor de oxigênio defeituoso'],
        recommendedActions: ['Substituir catalisador', 'Verificar sensores de oxigênio'],
      },
    ];

    const numCodes = Math.floor(Math.random() * 3);
    return possibleCodes.slice(0, numCodes).map(code => ({
      ...code,
      category: 'powertrain' as const,
      status: 'active' as const,
      estimatedRepairCost: {
        min: 150,
        max: 800,
        currency: 'BRL',
      },
    }));
  }

  private generateSimulatedLiveData(): LiveDataReading[] {
    return [
      {
        parameter: 'RPM',
        value: 800 + Math.random() * 200,
        unit: 'rpm',
        description: 'Rotação do motor',
        normalRange: { min: 600, max: 1000 },
        status: 'normal',
      },
      {
        parameter: 'Velocidade',
        value: 0,
        unit: 'km/h',
        description: 'Velocidade do veículo',
        status: 'normal',
      },
      {
        parameter: 'Temperatura do Motor',
        value: 85 + Math.random() * 10,
        unit: '°C',
        description: 'Temperatura do líquido de arrefecimento',
        normalRange: { min: 80, max: 95 },
        status: 'normal',
      },
    ];
  }

  private generateSummary(codes: DiagnosticTroubleCode[]) {
    const bySeverity = { info: 0, warning: 0, critical: 0 };
    const bySystem: Record<string, number> = {};
    const criticalIssues: string[] = [];

    codes.forEach(code => {
      bySeverity[code.severity]++;
      bySystem[code.system] = (bySystem[code.system] || 0) + 1;
      if (code.severity === 'critical') {
        criticalIssues.push(code.description);
      }
    });

    let overallHealth: VehicleHealth = 'excellent';
    if (bySeverity.critical > 0) overallHealth = 'critical';
    else if (bySeverity.warning > 1) overallHealth = 'poor';
    else if (bySeverity.warning > 0) overallHealth = 'fair';
    else if (codes.length > 0) overallHealth = 'good';

    return {
      totalCodes: codes.length,
      bySeverity,
      bySystem: bySystem as Record<VehicleSystem, number>,
      overallHealth,
      criticalIssues,
      recommendedActions: codes.flatMap(c => c.recommendedActions).slice(0, 3),
    };
  }

  private updateState(updates: Partial<OBDConnectionState>) {
    this.connectionState = { ...this.connectionState, ...updates };
    this.listeners.forEach(listener => listener(this.connectionState));
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getConnectionState(): OBDConnectionState {
    return { ...this.connectionState };
  }

  subscribe(listener: (state: OBDConnectionState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  async disconnect(): Promise<void> {
    if (this.bluetoothDevice?.gatt?.connected) {
      await this.bluetoothDevice.gatt.disconnect();
    }
    this.updateState({
      isConnected: false,
      device: null,
      error: null,
      progress: 0,
      currentStep: '',
    });
  }
}

export const obdScannerService = new OBDScannerService();
export default obdScannerService;

/**
 * TORQ OBD Scanner Service
 * Serviço para comunicação com dispositivos OBD-II via ELM327
 * Implementação real usando comandos OBD-II padrão (SAE J1979)
 */

// Declarações de tipos para Web Bluetooth API
declare global {
  interface Navigator {
    bluetooth: Bluetooth;
  }

  interface Bluetooth {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
  }

  interface RequestDeviceOptions {
    filters?: BluetoothLEScanFilter[];
    optionalServices?: BluetoothServiceUUID[];
    acceptAllDevices?: boolean;
  }

  interface BluetoothLEScanFilter {
    services?: BluetoothServiceUUID[];
    name?: string;
    namePrefix?: string;
  }

  type BluetoothServiceUUID = string | number;

  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
  }

  interface BluetoothRemoteGATTServer {
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: BluetoothServiceUUID): Promise<BluetoothRemoteGATTCharacteristic>;
    getCharacteristics(): Promise<BluetoothRemoteGATTCharacteristic[]>;
  }

  interface BluetoothRemoteGATTCharacteristic extends EventTarget {
    properties: BluetoothCharacteristicProperties;
    value?: DataView;
    writeValue(value: BufferSource): Promise<void>;
    writeValueWithoutResponse(value: BufferSource): Promise<void>;
    readValue(): Promise<DataView>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothCharacteristicProperties {
    broadcast: boolean;
    read: boolean;
    writeWithoutResponse: boolean;
    write: boolean;
    notify: boolean;
    indicate: boolean;
    authenticatedSignedWrites: boolean;
    reliableWrite: boolean;
    writableAuxiliaries: boolean;
  }
}

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
  DTCCategory,
  OBDProtocol,
} from '../types';

// Banco de dados de códigos DTC conhecidos
const DTC_DATABASE: Record<string, { description: string; severity: DTCSeverity; system: VehicleSystem; causes: string[]; actions: string[] }> = {
  'P0100': { description: 'Circuito do sensor MAF', severity: 'warning', system: 'air_intake', causes: ['Sensor MAF defeituoso', 'Fiação danificada'], actions: ['Verificar conexões', 'Testar sensor MAF'] },
  'P0101': { description: 'Faixa/desempenho do sensor MAF', severity: 'warning', system: 'air_intake', causes: ['Filtro de ar sujo', 'Vazamento de ar'], actions: ['Trocar filtro de ar', 'Verificar vazamentos'] },
  'P0102': { description: 'Entrada baixa do circuito MAF', severity: 'warning', system: 'air_intake', causes: ['Curto-circuito', 'Sensor defeituoso'], actions: ['Verificar fiação', 'Substituir sensor'] },
  'P0103': { description: 'Entrada alta do circuito MAF', severity: 'warning', system: 'air_intake', causes: ['Curto-circuito', 'Sensor defeituoso'], actions: ['Verificar fiação', 'Substituir sensor'] },
  'P0110': { description: 'Circuito do sensor IAT', severity: 'info', system: 'air_intake', causes: ['Sensor IAT defeituoso'], actions: ['Verificar sensor IAT'] },
  'P0115': { description: 'Circuito do sensor de temperatura do motor', severity: 'warning', system: 'cooling', causes: ['Sensor ECT defeituoso'], actions: ['Verificar sensor ECT'] },
  'P0120': { description: 'Circuito do sensor TPS', severity: 'warning', system: 'fuel_system', causes: ['Sensor TPS defeituoso'], actions: ['Verificar sensor TPS'] },
  'P0130': { description: 'Circuito do sensor O2 (Banco 1, Sensor 1)', severity: 'warning', system: 'emission', causes: ['Sensor O2 defeituoso'], actions: ['Verificar sensor O2'] },
  'P0131': { description: 'Tensão baixa do sensor O2 (B1S1)', severity: 'warning', system: 'emission', causes: ['Mistura pobre', 'Sensor defeituoso'], actions: ['Verificar vazamentos', 'Testar sensor'] },
  'P0132': { description: 'Tensão alta do sensor O2 (B1S1)', severity: 'warning', system: 'emission', causes: ['Mistura rica', 'Sensor defeituoso'], actions: ['Verificar injetores', 'Testar sensor'] },
  'P0133': { description: 'Resposta lenta do sensor O2 (B1S1)', severity: 'warning', system: 'emission', causes: ['Sensor envelhecido'], actions: ['Substituir sensor O2'] },
  'P0171': { description: 'Sistema muito pobre (Banco 1)', severity: 'warning', system: 'fuel_system', causes: ['Filtro de ar sujo', 'Vazamento de vácuo', 'Sensor MAF defeituoso'], actions: ['Verificar filtro de ar', 'Inspecionar mangueiras de vácuo'] },
  'P0172': { description: 'Sistema muito rico (Banco 1)', severity: 'warning', system: 'fuel_system', causes: ['Injetores com vazamento', 'Regulador de pressão defeituoso'], actions: ['Verificar injetores', 'Testar pressão de combustível'] },
  'P0174': { description: 'Sistema muito pobre (Banco 2)', severity: 'warning', system: 'fuel_system', causes: ['Filtro de ar sujo', 'Vazamento de vácuo'], actions: ['Verificar filtro de ar', 'Inspecionar mangueiras'] },
  'P0175': { description: 'Sistema muito rico (Banco 2)', severity: 'warning', system: 'fuel_system', causes: ['Injetores com vazamento'], actions: ['Verificar injetores'] },
  'P0300': { description: 'Falha de ignição aleatória detectada', severity: 'critical', system: 'ignition', causes: ['Velas desgastadas', 'Cabos de ignição', 'Bobina defeituosa'], actions: ['Verificar velas', 'Testar bobinas', 'Verificar compressão'] },
  'P0301': { description: 'Falha de ignição cilindro 1', severity: 'critical', system: 'ignition', causes: ['Vela defeituosa', 'Bobina defeituosa', 'Injetor entupido'], actions: ['Trocar vela cil. 1', 'Testar bobina', 'Limpar injetor'] },
  'P0302': { description: 'Falha de ignição cilindro 2', severity: 'critical', system: 'ignition', causes: ['Vela defeituosa', 'Bobina defeituosa'], actions: ['Trocar vela cil. 2', 'Testar bobina'] },
  'P0303': { description: 'Falha de ignição cilindro 3', severity: 'critical', system: 'ignition', causes: ['Vela defeituosa', 'Bobina defeituosa'], actions: ['Trocar vela cil. 3', 'Testar bobina'] },
  'P0304': { description: 'Falha de ignição cilindro 4', severity: 'critical', system: 'ignition', causes: ['Vela defeituosa', 'Bobina defeituosa'], actions: ['Trocar vela cil. 4', 'Testar bobina'] },
  'P0325': { description: 'Circuito do sensor de detonação', severity: 'warning', system: 'ignition', causes: ['Sensor de detonação defeituoso'], actions: ['Verificar sensor de detonação'] },
  'P0335': { description: 'Circuito do sensor de posição do virabrequim', severity: 'critical', system: 'ignition', causes: ['Sensor CKP defeituoso', 'Roda fônica danificada'], actions: ['Verificar sensor CKP', 'Inspecionar roda fônica'] },
  'P0340': { description: 'Circuito do sensor de posição do comando', severity: 'critical', system: 'ignition', causes: ['Sensor CMP defeituoso'], actions: ['Verificar sensor CMP'] },
  'P0400': { description: 'Fluxo de recirculação de gases de escape', severity: 'warning', system: 'emission', causes: ['Válvula EGR entupida'], actions: ['Limpar válvula EGR'] },
  'P0401': { description: 'Fluxo insuficiente de EGR', severity: 'warning', system: 'emission', causes: ['Válvula EGR entupida', 'Passagens bloqueadas'], actions: ['Limpar sistema EGR'] },
  'P0420': { description: 'Eficiência do catalisador abaixo do limite (Banco 1)', severity: 'critical', system: 'emission', causes: ['Catalisador danificado', 'Sensor O2 defeituoso'], actions: ['Substituir catalisador', 'Verificar sensores O2'] },
  'P0430': { description: 'Eficiência do catalisador abaixo do limite (Banco 2)', severity: 'critical', system: 'emission', causes: ['Catalisador danificado'], actions: ['Substituir catalisador'] },
  'P0440': { description: 'Sistema de controle de emissão evaporativa', severity: 'info', system: 'emission', causes: ['Tampa do tanque solta'], actions: ['Verificar tampa do tanque'] },
  'P0442': { description: 'Vazamento pequeno no sistema EVAP', severity: 'info', system: 'emission', causes: ['Tampa do tanque', 'Mangueira com vazamento'], actions: ['Verificar tampa', 'Inspecionar mangueiras'] },
  'P0446': { description: 'Circuito de controle de ventilação EVAP', severity: 'info', system: 'emission', causes: ['Válvula de ventilação defeituosa'], actions: ['Verificar válvula de ventilação'] },
  'P0455': { description: 'Vazamento grande no sistema EVAP', severity: 'warning', system: 'emission', causes: ['Tampa do tanque ausente', 'Mangueira desconectada'], actions: ['Verificar tampa', 'Inspecionar conexões'] },
  'P0500': { description: 'Sensor de velocidade do veículo', severity: 'warning', system: 'transmission', causes: ['Sensor VSS defeituoso'], actions: ['Verificar sensor VSS'] },
  'P0505': { description: 'Sistema de controle de marcha lenta', severity: 'warning', system: 'fuel_system', causes: ['Válvula IAC suja', 'Corpo de borboleta sujo'], actions: ['Limpar válvula IAC', 'Limpar corpo de borboleta'] },
  'P0507': { description: 'RPM de marcha lenta acima do esperado', severity: 'info', system: 'fuel_system', causes: ['Vazamento de vácuo', 'Válvula IAC defeituosa'], actions: ['Verificar vazamentos', 'Limpar IAC'] },
  'P0562': { description: 'Tensão baixa do sistema', severity: 'warning', system: 'electrical', causes: ['Bateria fraca', 'Alternador defeituoso'], actions: ['Testar bateria', 'Verificar alternador'] },
  'P0563': { description: 'Tensão alta do sistema', severity: 'warning', system: 'electrical', causes: ['Regulador de tensão defeituoso'], actions: ['Verificar alternador'] },
  'P0600': { description: 'Falha de comunicação serial', severity: 'critical', system: 'communication', causes: ['Problema na ECU'], actions: ['Verificar conexões da ECU'] },
  'P0700': { description: 'Sistema de controle da transmissão', severity: 'warning', system: 'transmission', causes: ['Problema na transmissão'], actions: ['Verificar códigos da transmissão'] },
  'P0715': { description: 'Circuito do sensor de entrada da transmissão', severity: 'warning', system: 'transmission', causes: ['Sensor de turbina defeituoso'], actions: ['Verificar sensor'] },
  'P0720': { description: 'Circuito do sensor de saída da transmissão', severity: 'warning', system: 'transmission', causes: ['Sensor de saída defeituoso'], actions: ['Verificar sensor'] },
  'P0730': { description: 'Relação de marcha incorreta', severity: 'critical', system: 'transmission', causes: ['Problema interno da transmissão'], actions: ['Diagnóstico da transmissão'] },
  'P0741': { description: 'Desempenho do conversor de torque', severity: 'warning', system: 'transmission', causes: ['Solenóide TCC defeituoso'], actions: ['Verificar solenóide TCC'] },
  'P1000': { description: 'Monitores OBD não completos', severity: 'info', system: 'other', causes: ['Bateria desconectada recentemente'], actions: ['Dirigir para completar monitores'] },
};

// PIDs OBD-II padrão (Mode 01)
const OBD_PIDS = {
  SUPPORTED_PIDS_01_20: '00',
  MONITOR_STATUS: '01',
  FREEZE_DTC: '02',
  FUEL_SYSTEM_STATUS: '03',
  ENGINE_LOAD: '04',
  COOLANT_TEMP: '05',
  SHORT_FUEL_TRIM_1: '06',
  LONG_FUEL_TRIM_1: '07',
  SHORT_FUEL_TRIM_2: '08',
  LONG_FUEL_TRIM_2: '09',
  FUEL_PRESSURE: '0A',
  INTAKE_PRESSURE: '0B',
  RPM: '0C',
  SPEED: '0D',
  TIMING_ADVANCE: '0E',
  INTAKE_TEMP: '0F',
  MAF_RATE: '10',
  THROTTLE_POS: '11',
  O2_SENSORS: '13',
  O2_B1S1: '14',
  O2_B1S2: '15',
  OBD_STANDARD: '1C',
  RUN_TIME: '1F',
  SUPPORTED_PIDS_21_40: '20',
  DISTANCE_WITH_MIL: '21',
  FUEL_RAIL_PRESSURE: '22',
  FUEL_RAIL_GAUGE: '23',
  COMMANDED_EGR: '2C',
  EGR_ERROR: '2D',
  FUEL_LEVEL: '2F',
  WARMUPS_SINCE_CLEAR: '30',
  DISTANCE_SINCE_CLEAR: '31',
  BAROMETRIC_PRESSURE: '33',
  CATALYST_TEMP_B1S1: '3C',
  SUPPORTED_PIDS_41_60: '40',
  CONTROL_MODULE_VOLTAGE: '42',
  ABSOLUTE_LOAD: '43',
  COMMANDED_EQUIV_RATIO: '44',
  AMBIENT_TEMP: '46',
  ETHANOL_PERCENT: '52',
  OIL_TEMP: '5C',
  FUEL_INJECTION_TIMING: '5D',
  FUEL_RATE: '5E',
};

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
  private notifyCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private responseBuffer: string = '';
  private responsePromise: { resolve: (value: string) => void; reject: (reason: Error) => void } | null = null;

  isBluetoothSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  async connectDevice(): Promise<OBDDeviceInfo | null> {
    if (!this.isBluetoothSupported()) {
      throw new Error('Web Bluetooth não é suportado neste navegador');
    }

    try {
      this.updateState({ currentStep: 'Procurando dispositivos...', progress: 10 });

      // Filtros para dispositivos OBD-II comuns
      this.bluetoothDevice = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'OBD' },
          { namePrefix: 'ELM327' },
          { namePrefix: 'OBDII' },
          { namePrefix: 'Vgate' },
          { namePrefix: 'V-LINK' },
          { namePrefix: 'KONNWEI' },
          { namePrefix: 'Veepeak' },
        ],
        optionalServices: [
          '0000fff0-0000-1000-8000-00805f9b34fb', // Serviço comum ELM327
          '0000ffe0-0000-1000-8000-00805f9b34fb', // Serviço alternativo
          '00001101-0000-1000-8000-00805f9b34fb', // SPP UUID
        ],
      });

      this.updateState({ currentStep: 'Conectando...', progress: 30 });

      const server = await this.bluetoothDevice.gatt!.connect();
      
      this.updateState({ currentStep: 'Configurando serviços...', progress: 50 });

      // Tentar diferentes serviços comuns em dispositivos ELM327
      let service;
      const serviceUUIDs = [
        '0000fff0-0000-1000-8000-00805f9b34fb',
        '0000ffe0-0000-1000-8000-00805f9b34fb',
      ];

      for (const uuid of serviceUUIDs) {
        try {
          service = await server.getPrimaryService(uuid);
          break;
        } catch {
          continue;
        }
      }

      if (!service) {
        throw new Error('Serviço OBD não encontrado no dispositivo');
      }

      // Obter características para escrita e notificação
      const characteristics = await service.getCharacteristics();
      
      for (const char of characteristics) {
        const props = char.properties;
        if (props.write || props.writeWithoutResponse) {
          this.characteristic = char;
        }
        if (props.notify || props.indicate) {
          this.notifyCharacteristic = char;
        }
      }

      if (!this.characteristic) {
        // Fallback para características conhecidas
        try {
          this.characteristic = await service.getCharacteristic('0000fff2-0000-1000-8000-00805f9b34fb');
        } catch {
          this.characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
        }
      }

      // Configurar notificações para receber respostas
      if (this.notifyCharacteristic) {
        await this.notifyCharacteristic.startNotifications();
        this.notifyCharacteristic.addEventListener('characteristicvaluechanged', this.handleNotification.bind(this));
      }

      this.updateState({ currentStep: 'Inicializando ELM327...', progress: 70 });

      const protocol = await this.initializeOBD();

      const deviceInfo: OBDDeviceInfo = {
        deviceId: this.bluetoothDevice.id,
        deviceName: this.bluetoothDevice.name || 'Dispositivo OBD',
        protocol: protocol,
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

  private handleNotification(event: Event): void {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    if (value) {
      const decoder = new TextDecoder();
      const text = decoder.decode(value);
      this.responseBuffer += text;
      
      // Verificar se a resposta está completa (termina com > ou contém erro)
      if (this.responseBuffer.includes('>') || 
          this.responseBuffer.includes('ERROR') ||
          this.responseBuffer.includes('UNABLE TO CONNECT') ||
          this.responseBuffer.includes('NO DATA')) {
        if (this.responsePromise) {
          this.responsePromise.resolve(this.responseBuffer);
          this.responsePromise = null;
        }
      }
    }
  }

  private async initializeOBD(): Promise<'AUTO' | 'ISO15765-4' | 'ISO9141-2' | 'ISO14230-4'> {
    if (!this.characteristic) throw new Error('Dispositivo não conectado');

    // Comandos de inicialização ELM327
    const initCommands = [
      'ATZ',      // Reset
      'ATE0',     // Echo off
      'ATL0',     // Linefeeds off
      'ATS0',     // Spaces off
      'ATH0',     // Headers off (simplifica parsing)
      'ATSP0',    // Auto protocol
    ];

    for (const command of initCommands) {
      await this.sendCommand(command);
      await this.delay(200);
    }

    // Detectar protocolo
    const protocolResponse = await this.sendCommand('ATDPN');
    let protocol: 'AUTO' | 'ISO15765-4' | 'ISO9141-2' | 'ISO14230-4' = 'AUTO';
    
    if (protocolResponse.includes('6') || protocolResponse.includes('7') || 
        protocolResponse.includes('8') || protocolResponse.includes('9')) {
      protocol = 'ISO15765-4'; // CAN
    } else if (protocolResponse.includes('3') || protocolResponse.includes('4')) {
      protocol = 'ISO9141-2';
    } else if (protocolResponse.includes('5')) {
      protocol = 'ISO14230-4'; // KWP2000
    }

    return protocol;
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
    const codes: DiagnosticTroubleCode[] = [];
    
    try {
      // Mode 03 - Ler códigos de falha armazenados
      const response = await this.sendCommand('03');
      const parsedCodes = this.parseDTCResponse(response);
      
      for (const code of parsedCodes) {
        const dtcInfo = DTC_DATABASE[code] || {
          description: `Código de falha ${code}`,
          severity: 'warning' as DTCSeverity,
          system: 'other' as VehicleSystem,
          causes: ['Causa desconhecida'],
          actions: ['Consultar manual do veículo'],
        };

        codes.push({
          code,
          description: dtcInfo.description,
          severity: dtcInfo.severity,
          category: this.getDTCCategory(code),
          system: dtcInfo.system,
          status: 'active',
          possibleCauses: dtcInfo.causes,
          recommendedActions: dtcInfo.actions,
          estimatedRepairCost: this.estimateRepairCost(dtcInfo.severity),
        });
      }

      // Mode 07 - Ler códigos pendentes
      const pendingResponse = await this.sendCommand('07');
      const pendingCodes = this.parseDTCResponse(pendingResponse);
      
      for (const code of pendingCodes) {
        // Evitar duplicatas
        if (codes.find(c => c.code === code)) continue;
        
        const dtcInfo = DTC_DATABASE[code] || {
          description: `Código de falha ${code}`,
          severity: 'info' as DTCSeverity,
          system: 'other' as VehicleSystem,
          causes: ['Causa desconhecida'],
          actions: ['Monitorar veículo'],
        };

        codes.push({
          code,
          description: dtcInfo.description,
          severity: dtcInfo.severity,
          category: this.getDTCCategory(code),
          system: dtcInfo.system,
          status: 'pending',
          possibleCauses: dtcInfo.causes,
          recommendedActions: dtcInfo.actions,
          estimatedRepairCost: this.estimateRepairCost(dtcInfo.severity),
        });
      }
    } catch (error) {
      console.error('Erro ao ler códigos de falha:', error);
    }

    return codes;
  }

  private parseDTCResponse(response: string): string[] {
    const codes: string[] = [];
    
    // Limpar resposta
    const cleanResponse = response
      .replace(/[\r\n>]/g, '')
      .replace(/43|47/g, '') // Remover headers de resposta Mode 03/07
      .replace(/NO DATA/gi, '')
      .replace(/SEARCHING/gi, '')
      .trim();

    if (!cleanResponse || cleanResponse.length < 4) return codes;

    // Cada DTC são 2 bytes (4 caracteres hex)
    const hexPairs = cleanResponse.match(/[0-9A-Fa-f]{4}/g) || [];
    
    for (const hex of hexPairs) {
      if (hex === '0000') continue; // Código vazio
      
      const dtc = this.decodeDTC(hex);
      if (dtc) codes.push(dtc);
    }

    return codes;
  }

  private decodeDTC(hex: string): string | null {
    if (hex.length !== 4) return null;
    
    const firstChar = parseInt(hex[0], 16);
    const prefix = ['P', 'C', 'B', 'U'][Math.floor(firstChar / 4)];
    const secondDigit = (firstChar % 4).toString();
    const rest = hex.substring(1);
    
    return `${prefix}${secondDigit}${rest}`.toUpperCase();
  }

  private getDTCCategory(code: string): DTCCategory {
    const prefix = code[0].toUpperCase();
    switch (prefix) {
      case 'P': return 'powertrain';
      case 'C': return 'chassis';
      case 'B': return 'body';
      case 'U': return 'network';
      default: return 'manufacturer';
    }
  }

  private estimateRepairCost(severity: DTCSeverity): { min: number; max: number; currency: string } {
    switch (severity) {
      case 'critical':
        return { min: 500, max: 3000, currency: 'BRL' };
      case 'warning':
        return { min: 150, max: 800, currency: 'BRL' };
      default:
        return { min: 50, max: 200, currency: 'BRL' };
    }
  }

  private async readLiveData(): Promise<LiveDataReading[]> {
    const readings: LiveDataReading[] = [];

    // Lista de PIDs para ler com suas configurações
    const pidsToRead = [
      { pid: OBD_PIDS.RPM, name: 'RPM', unit: 'rpm', desc: 'Rotação do motor', range: { min: 600, max: 7000 }, formula: (a: number, b: number) => ((a * 256) + b) / 4 },
      { pid: OBD_PIDS.SPEED, name: 'Velocidade', unit: 'km/h', desc: 'Velocidade do veículo', range: { min: 0, max: 200 }, formula: (a: number) => a },
      { pid: OBD_PIDS.COOLANT_TEMP, name: 'Temp. Motor', unit: '°C', desc: 'Temperatura do líquido de arrefecimento', range: { min: 80, max: 105 }, formula: (a: number) => a - 40 },
      { pid: OBD_PIDS.ENGINE_LOAD, name: 'Carga Motor', unit: '%', desc: 'Carga calculada do motor', range: { min: 0, max: 100 }, formula: (a: number) => (a * 100) / 255 },
      { pid: OBD_PIDS.THROTTLE_POS, name: 'Acelerador', unit: '%', desc: 'Posição do acelerador', range: { min: 0, max: 100 }, formula: (a: number) => (a * 100) / 255 },
      { pid: OBD_PIDS.INTAKE_TEMP, name: 'Temp. Admissão', unit: '°C', desc: 'Temperatura do ar de admissão', range: { min: -20, max: 60 }, formula: (a: number) => a - 40 },
      { pid: OBD_PIDS.MAF_RATE, name: 'Fluxo MAF', unit: 'g/s', desc: 'Taxa de fluxo de ar', range: { min: 0, max: 200 }, formula: (a: number, b: number) => ((a * 256) + b) / 100 },
      { pid: OBD_PIDS.FUEL_LEVEL, name: 'Combustível', unit: '%', desc: 'Nível de combustível', range: { min: 10, max: 100 }, formula: (a: number) => (a * 100) / 255 },
      { pid: OBD_PIDS.INTAKE_PRESSURE, name: 'Pressão MAP', unit: 'kPa', desc: 'Pressão absoluta do coletor', range: { min: 20, max: 105 }, formula: (a: number) => a },
      { pid: OBD_PIDS.TIMING_ADVANCE, name: 'Avanço Ignição', unit: '°', desc: 'Avanço de ignição', range: { min: -10, max: 40 }, formula: (a: number) => (a / 2) - 64 },
      { pid: OBD_PIDS.SHORT_FUEL_TRIM_1, name: 'Trim Curto B1', unit: '%', desc: 'Correção de combustível curto prazo', range: { min: -25, max: 25 }, formula: (a: number) => ((a - 128) * 100) / 128 },
      { pid: OBD_PIDS.LONG_FUEL_TRIM_1, name: 'Trim Longo B1', unit: '%', desc: 'Correção de combustível longo prazo', range: { min: -25, max: 25 }, formula: (a: number) => ((a - 128) * 100) / 128 },
      { pid: OBD_PIDS.CONTROL_MODULE_VOLTAGE, name: 'Tensão ECU', unit: 'V', desc: 'Tensão do módulo de controle', range: { min: 12, max: 15 }, formula: (a: number, b: number) => ((a * 256) + b) / 1000 },
      { pid: OBD_PIDS.AMBIENT_TEMP, name: 'Temp. Ambiente', unit: '°C', desc: 'Temperatura ambiente', range: { min: -20, max: 50 }, formula: (a: number) => a - 40 },
      { pid: OBD_PIDS.OIL_TEMP, name: 'Temp. Óleo', unit: '°C', desc: 'Temperatura do óleo do motor', range: { min: 60, max: 120 }, formula: (a: number) => a - 40 },
    ];

    for (const pidConfig of pidsToRead) {
      try {
        const response = await this.sendCommand(`01${pidConfig.pid}`);
        const value = this.parsePIDResponse(response, pidConfig.formula);
        
        if (value !== null) {
          const status = this.getReadingStatus(value, pidConfig.range);
          readings.push({
            parameter: pidConfig.name,
            value: Math.round(value * 10) / 10,
            unit: pidConfig.unit,
            description: pidConfig.desc,
            normalRange: pidConfig.range,
            status,
          });
        }
      } catch {
        // PID não suportado, continuar para o próximo
        continue;
      }
    }

    return readings;
  }

  private parsePIDResponse(response: string, formula: (...args: number[]) => number): number | null {
    // Limpar resposta
    const cleanResponse = response
      .replace(/[\r\n>]/g, '')
      .replace(/SEARCHING/gi, '')
      .replace(/NO DATA/gi, '')
      .trim();

    if (!cleanResponse || cleanResponse.includes('NO DATA') || cleanResponse.includes('ERROR')) {
      return null;
    }

    // Extrair bytes de dados (ignorar header 41 XX)
    const match = cleanResponse.match(/41[0-9A-Fa-f]{2}([0-9A-Fa-f]+)/);
    if (!match) return null;

    const dataHex = match[1];
    const bytes: number[] = [];
    
    for (let i = 0; i < dataHex.length; i += 2) {
      bytes.push(parseInt(dataHex.substring(i, i + 2), 16));
    }

    if (bytes.length === 0) return null;

    return formula(...bytes);
  }

  private getReadingStatus(value: number, range?: { min: number; max: number }): 'normal' | 'warning' | 'critical' {
    if (!range) return 'normal';
    
    const margin = (range.max - range.min) * 0.1;
    
    if (value < range.min - margin || value > range.max + margin) {
      return 'critical';
    }
    if (value < range.min || value > range.max) {
      return 'warning';
    }
    return 'normal';
  }

  private async getVehicleInfo() {
    let vin: string | undefined;
    let ecuCount = 1;

    try {
      // Mode 09 PID 02 - VIN
      const vinResponse = await this.sendCommand('0902');
      vin = this.parseVINResponse(vinResponse);
    } catch {
      // VIN não disponível
    }

    // Verificar quantas ECUs respondem
    try {
      const ecuResponse = await this.sendCommand('0100');
      // Contar respostas diferentes
      const responses = ecuResponse.split('41').length - 1;
      if (responses > 0) ecuCount = responses;
    } catch {
      // Usar padrão
    }

    const protocol: OBDProtocol = this.connectionState.device?.protocol || 'AUTO';
    
    return {
      vin,
      ecuCount,
      supportedProtocols: [protocol] as OBDProtocol[],
    };
  }

  private parseVINResponse(response: string): string | undefined {
    // Limpar resposta
    const cleanResponse = response
      .replace(/[\r\n>]/g, '')
      .replace(/49 02 01/gi, '')
      .replace(/49 02/gi, '')
      .replace(/SEARCHING/gi, '')
      .trim();

    if (!cleanResponse || cleanResponse.includes('NO DATA')) {
      return undefined;
    }

    // Converter hex para ASCII
    const hexPairs = cleanResponse.match(/[0-9A-Fa-f]{2}/g) || [];
    let vin = '';
    
    for (const hex of hexPairs) {
      const charCode = parseInt(hex, 16);
      if (charCode >= 32 && charCode <= 126) {
        vin += String.fromCharCode(charCode);
      }
    }

    // VIN deve ter 17 caracteres
    if (vin.length >= 17) {
      return vin.substring(0, 17);
    }

    return undefined;
  }

  private async sendCommand(command: string): Promise<string> {
    if (!this.characteristic) {
      throw new Error('Dispositivo não conectado');
    }

    // Limpar buffer de resposta
    this.responseBuffer = '';

    const encoder = new TextEncoder();
    const data = encoder.encode(command + '\r');
    
    // Criar promise para aguardar resposta
    const responsePromise = new Promise<string>((resolve, reject) => {
      this.responsePromise = { resolve, reject };
      
      // Timeout de 5 segundos
      setTimeout(() => {
        if (this.responsePromise) {
          // Se temos alguma resposta no buffer, retornar ela
          if (this.responseBuffer.length > 0) {
            resolve(this.responseBuffer);
          } else {
            reject(new Error('Timeout aguardando resposta'));
          }
          this.responsePromise = null;
        }
      }, 5000);
    });

    // Enviar comando
    try {
      if (this.characteristic.properties.writeWithoutResponse) {
        await this.characteristic.writeValueWithoutResponse(data);
      } else {
        await this.characteristic.writeValue(data);
      }
    } catch (error) {
      throw new Error(`Erro ao enviar comando: ${error}`);
    }

    // Se não temos característica de notificação, fazer polling
    if (!this.notifyCharacteristic) {
      await this.delay(300);
      try {
        const value = await this.characteristic.readValue();
        const decoder = new TextDecoder();
        return decoder.decode(value);
      } catch {
        return '';
      }
    }

    return responsePromise;
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
    // Remover listener de notificações
    if (this.notifyCharacteristic) {
      try {
        await this.notifyCharacteristic.stopNotifications();
        this.notifyCharacteristic.removeEventListener('characteristicvaluechanged', this.handleNotification.bind(this));
      } catch {
        // Ignorar erros ao desconectar
      }
      this.notifyCharacteristic = null;
    }

    if (this.bluetoothDevice?.gatt?.connected) {
      await this.bluetoothDevice.gatt.disconnect();
    }
    
    this.characteristic = null;
    this.bluetoothDevice = null;
    this.responseBuffer = '';
    this.responsePromise = null;

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

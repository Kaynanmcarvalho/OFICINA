/**
 * TORQ OBD-II Service
 * Serviço de comunicação real com scanner OBD-II (ELM327)
 * Suporta conexão via USB Serial, Bluetooth Serial e Wi-Fi
 */

const EventEmitter = require('events');

// Banco de dados de códigos DTC
const DTC_DATABASE = {
  'P0100': { desc: 'Circuito do sensor MAF', severity: 'warning', system: 'Admissão', causes: ['Sensor MAF defeituoso', 'Fiação danificada'], cost: [150, 400] },
  'P0101': { desc: 'Faixa/desempenho do sensor MAF', severity: 'warning', system: 'Admissão', causes: ['Filtro de ar sujo', 'Vazamento de ar'], cost: [80, 300] },
  'P0102': { desc: 'Entrada baixa do circuito MAF', severity: 'warning', system: 'Admissão', causes: ['Curto-circuito', 'Sensor defeituoso'], cost: [150, 400] },
  'P0103': { desc: 'Entrada alta do circuito MAF', severity: 'warning', system: 'Admissão', causes: ['Curto-circuito', 'Sensor defeituoso'], cost: [150, 400] },
  'P0110': { desc: 'Circuito do sensor IAT', severity: 'info', system: 'Admissão', causes: ['Sensor IAT defeituoso'], cost: [50, 150] },
  'P0115': { desc: 'Circuito do sensor de temperatura do motor', severity: 'warning', system: 'Arrefecimento', causes: ['Sensor ECT defeituoso'], cost: [80, 200] },
  'P0120': { desc: 'Circuito do sensor TPS', severity: 'warning', system: 'Combustível', causes: ['Sensor TPS defeituoso'], cost: [100, 300] },
  'P0128': { desc: 'Temperatura do líquido abaixo do termostato', severity: 'warning', system: 'Arrefecimento', causes: ['Termostato travado aberto'], cost: [100, 400] },
  'P0130': { desc: 'Circuito do sensor O2 (B1S1)', severity: 'warning', system: 'Emissões', causes: ['Sensor O2 defeituoso'], cost: [200, 500] },
  'P0131': { desc: 'Tensão baixa do sensor O2 (B1S1)', severity: 'warning', system: 'Emissões', causes: ['Mistura pobre', 'Sensor defeituoso'], cost: [200, 500] },
  'P0132': { desc: 'Tensão alta do sensor O2 (B1S1)', severity: 'warning', system: 'Emissões', causes: ['Mistura rica', 'Sensor defeituoso'], cost: [200, 500] },
  'P0133': { desc: 'Resposta lenta do sensor O2 (B1S1)', severity: 'warning', system: 'Emissões', causes: ['Sensor envelhecido'], cost: [200, 500] },
  'P0171': { desc: 'Sistema muito pobre (Banco 1)', severity: 'warning', system: 'Combustível', causes: ['Filtro de ar sujo', 'Vazamento de vácuo', 'Sensor MAF defeituoso'], cost: [150, 500] },
  'P0172': { desc: 'Sistema muito rico (Banco 1)', severity: 'warning', system: 'Combustível', causes: ['Injetores com vazamento', 'Regulador de pressão defeituoso'], cost: [200, 600] },
  'P0174': { desc: 'Sistema muito pobre (Banco 2)', severity: 'warning', system: 'Combustível', causes: ['Filtro de ar sujo', 'Vazamento de vácuo'], cost: [150, 500] },
  'P0175': { desc: 'Sistema muito rico (Banco 2)', severity: 'warning', system: 'Combustível', causes: ['Injetores com vazamento'], cost: [200, 600] },
  'P0300': { desc: 'Falha de ignição aleatória detectada', severity: 'critical', system: 'Ignição', causes: ['Velas desgastadas', 'Cabos de ignição', 'Bobina defeituosa'], cost: [200, 800] },
  'P0301': { desc: 'Falha de ignição cilindro 1', severity: 'critical', system: 'Ignição', causes: ['Vela defeituosa', 'Bobina defeituosa', 'Injetor entupido'], cost: [150, 600] },
  'P0302': { desc: 'Falha de ignição cilindro 2', severity: 'critical', system: 'Ignição', causes: ['Vela defeituosa', 'Bobina defeituosa'], cost: [150, 600] },
  'P0303': { desc: 'Falha de ignição cilindro 3', severity: 'critical', system: 'Ignição', causes: ['Vela defeituosa', 'Bobina defeituosa'], cost: [150, 600] },
  'P0304': { desc: 'Falha de ignição cilindro 4', severity: 'critical', system: 'Ignição', causes: ['Vela defeituosa', 'Bobina defeituosa'], cost: [150, 600] },
  'P0325': { desc: 'Circuito do sensor de detonação', severity: 'warning', system: 'Ignição', causes: ['Sensor de detonação defeituoso'], cost: [150, 400] },
  'P0335': { desc: 'Circuito do sensor CKP', severity: 'critical', system: 'Ignição', causes: ['Sensor CKP defeituoso', 'Roda fônica danificada'], cost: [200, 500] },
  'P0340': { desc: 'Circuito do sensor CMP', severity: 'critical', system: 'Ignição', causes: ['Sensor CMP defeituoso'], cost: [200, 500] },
  'P0400': { desc: 'Fluxo de recirculação EGR', severity: 'warning', system: 'Emissões', causes: ['Válvula EGR entupida'], cost: [200, 600] },
  'P0401': { desc: 'Fluxo insuficiente de EGR', severity: 'warning', system: 'Emissões', causes: ['Válvula EGR entupida', 'Passagens bloqueadas'], cost: [200, 600] },
  'P0420': { desc: 'Eficiência do catalisador abaixo do limite (B1)', severity: 'critical', system: 'Emissões', causes: ['Catalisador danificado', 'Sensor O2 defeituoso'], cost: [800, 2500] },
  'P0430': { desc: 'Eficiência do catalisador abaixo do limite (B2)', severity: 'critical', system: 'Emissões', causes: ['Catalisador danificado'], cost: [800, 2500] },
  'P0440': { desc: 'Sistema de controle EVAP', severity: 'info', system: 'Emissões', causes: ['Tampa do tanque solta'], cost: [50, 200] },
  'P0442': { desc: 'Vazamento pequeno no sistema EVAP', severity: 'info', system: 'Emissões', causes: ['Tampa do tanque', 'Mangueira com vazamento'], cost: [50, 300] },
  'P0446': { desc: 'Circuito de ventilação EVAP', severity: 'info', system: 'Emissões', causes: ['Válvula de ventilação defeituosa'], cost: [100, 300] },
  'P0455': { desc: 'Vazamento grande no sistema EVAP', severity: 'warning', system: 'Emissões', causes: ['Tampa do tanque ausente', 'Mangueira desconectada'], cost: [50, 300] },
  'P0500': { desc: 'Sensor de velocidade do veículo', severity: 'warning', system: 'Transmissão', causes: ['Sensor VSS defeituoso'], cost: [100, 300] },
  'P0505': { desc: 'Sistema de controle de marcha lenta', severity: 'warning', system: 'Combustível', causes: ['Válvula IAC suja', 'Corpo de borboleta sujo'], cost: [100, 350] },
  'P0507': { desc: 'RPM de marcha lenta acima do esperado', severity: 'info', system: 'Combustível', causes: ['Vazamento de vácuo', 'Válvula IAC defeituosa'], cost: [80, 350] },
  'P0562': { desc: 'Tensão baixa do sistema', severity: 'warning', system: 'Elétrico', causes: ['Bateria fraca', 'Alternador defeituoso'], cost: [150, 600] },
  'P0563': { desc: 'Tensão alta do sistema', severity: 'warning', system: 'Elétrico', causes: ['Regulador de tensão defeituoso'], cost: [200, 500] },
  'P0600': { desc: 'Falha de comunicação serial', severity: 'critical', system: 'Comunicação', causes: ['Problema na ECU'], cost: [500, 2000] },
  'P0700': { desc: 'Sistema de controle da transmissão', severity: 'warning', system: 'Transmissão', causes: ['Problema na transmissão'], cost: [300, 1500] },
  'P0715': { desc: 'Sensor de entrada da transmissão', severity: 'warning', system: 'Transmissão', causes: ['Sensor de turbina defeituoso'], cost: [200, 500] },
  'P0720': { desc: 'Sensor de saída da transmissão', severity: 'warning', system: 'Transmissão', causes: ['Sensor de saída defeituoso'], cost: [200, 500] },
  'P0730': { desc: 'Relação de marcha incorreta', severity: 'critical', system: 'Transmissão', causes: ['Problema interno da transmissão'], cost: [500, 3000] },
  'P0741': { desc: 'Desempenho do conversor de torque', severity: 'warning', system: 'Transmissão', causes: ['Solenóide TCC defeituoso'], cost: [300, 800] },
  'P1000': { desc: 'Monitores OBD não completos', severity: 'info', system: 'Sistema', causes: ['Bateria desconectada recentemente'], cost: [0, 0] },
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

class OBDService extends EventEmitter {
  constructor() {
    super();
    this.port = null;
    this.isConnected = false;
    this.protocol = null;
    this.deviceInfo = null;
    this.responseBuffer = '';
    this.connectionType = null; // 'serial', 'bluetooth', 'wifi'
    this.wifiSocket = null;
  }

  /**
   * Lista portas seriais disponíveis
   */
  async listPorts() {
    try {
      const { SerialPort } = require('serialport');
      const ports = await SerialPort.list();
      
      // Filtrar portas que podem ser OBD
      const obdPorts = ports.filter(port => {
        const name = (port.friendlyName || port.path || '').toLowerCase();
        return name.includes('usb') || 
               name.includes('serial') || 
               name.includes('com') ||
               name.includes('obd') ||
               name.includes('elm') ||
               name.includes('bluetooth');
      });

      return {
        success: true,
        ports: obdPorts.map(p => ({
          path: p.path,
          manufacturer: p.manufacturer || 'Desconhecido',
          serialNumber: p.serialNumber,
          friendlyName: p.friendlyName || p.path,
          vendorId: p.vendorId,
          productId: p.productId,
        })),
      };
    } catch (error) {
      console.error('[OBD] Erro ao listar portas:', error.message);
      return {
        success: false,
        error: 'serialport não instalado ou erro ao listar portas',
        ports: [],
      };
    }
  }

  /**
   * Conecta ao dispositivo OBD-II
   * @param {Object} options - Opções de conexão
   * @param {string} options.type - Tipo: 'serial', 'wifi', 'bluetooth'
   * @param {string} options.port - Porta serial (ex: COM3, /dev/ttyUSB0)
   * @param {string} options.host - Host para Wi-Fi (ex: 192.168.0.10)
   * @param {number} options.tcpPort - Porta TCP para Wi-Fi (padrão: 35000)
   */
  async connect(options = {}) {
    const { type = 'serial', port, host, tcpPort = 35000 } = options;

    try {
      this.connectionType = type;
      this.emit('status', { step: 'connecting', message: 'Iniciando conexão...' });

      if (type === 'wifi') {
        await this.connectWifi(host, tcpPort);
      } else {
        await this.connectSerial(port);
      }

      // Inicializar ELM327
      this.emit('status', { step: 'initializing', message: 'Inicializando ELM327...' });
      await this.initializeELM327();

      this.isConnected = true;
      this.emit('connected', this.deviceInfo);

      return {
        success: true,
        device: this.deviceInfo,
        protocol: this.protocol,
      };
    } catch (error) {
      this.isConnected = false;
      this.emit('error', error.message);
      throw error;
    }
  }

  /**
   * Conecta via porta serial (USB/Bluetooth)
   */
  async connectSerial(portPath) {
    const { SerialPort } = require('serialport');
    const { ReadlineParser } = require('@serialport/parser-readline');

    return new Promise((resolve, reject) => {
      this.port = new SerialPort({
        path: portPath,
        baudRate: 38400, // ELM327 padrão
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        autoOpen: false,
      });

      const parser = this.port.pipe(new ReadlineParser({ delimiter: '>' }));

      parser.on('data', (data) => {
        this.responseBuffer = data.toString().trim();
        this.emit('data', this.responseBuffer);
      });

      this.port.on('error', (err) => {
        console.error('[OBD] Erro serial:', err.message);
        this.emit('error', err.message);
        reject(err);
      });

      this.port.on('close', () => {
        this.isConnected = false;
        this.emit('disconnected');
      });

      this.port.open((err) => {
        if (err) {
          reject(new Error(`Erro ao abrir porta ${portPath}: ${err.message}`));
        } else {
          this.deviceInfo = {
            type: 'serial',
            port: portPath,
            baudRate: 38400,
          };
          resolve();
        }
      });
    });
  }

  /**
   * Conecta via Wi-Fi (ELM327 Wi-Fi)
   */
  async connectWifi(host, port) {
    const net = require('net');

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout ao conectar via Wi-Fi'));
      }, 10000);

      this.wifiSocket = new net.Socket();

      this.wifiSocket.connect(port, host, () => {
        clearTimeout(timeout);
        this.deviceInfo = {
          type: 'wifi',
          host,
          port,
        };
        resolve();
      });

      this.wifiSocket.on('data', (data) => {
        const response = data.toString();
        if (response.includes('>')) {
          this.responseBuffer = response.replace('>', '').trim();
          this.emit('data', this.responseBuffer);
        }
      });

      this.wifiSocket.on('error', (err) => {
        clearTimeout(timeout);
        reject(new Error(`Erro Wi-Fi: ${err.message}`));
      });

      this.wifiSocket.on('close', () => {
        this.isConnected = false;
        this.emit('disconnected');
      });
    });
  }

  /**
   * Inicializa o ELM327 com comandos AT
   */
  async initializeELM327() {
    // Reset
    await this.sendCommand('ATZ', 2000);
    await this.delay(500);

    // Desabilitar echo
    await this.sendCommand('ATE0');

    // Desabilitar linefeeds
    await this.sendCommand('ATL0');

    // Desabilitar espaços
    await this.sendCommand('ATS0');

    // Habilitar headers (para debug)
    await this.sendCommand('ATH0');

    // Auto protocolo
    await this.sendCommand('ATSP0');

    // Detectar protocolo
    const protocolResponse = await this.sendCommand('ATDPN');
    this.protocol = this.parseProtocol(protocolResponse);

    // Obter versão do ELM
    const versionResponse = await this.sendCommand('ATI');
    this.deviceInfo = {
      ...this.deviceInfo,
      version: versionResponse,
      protocol: this.protocol,
    };

    return this.deviceInfo;
  }

  /**
   * Envia comando e aguarda resposta
   */
  async sendCommand(command, timeout = 3000) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected && !this.port && !this.wifiSocket) {
        // Modo simulação se não conectado
        resolve(this.simulateResponse(command));
        return;
      }

      const timeoutId = setTimeout(() => {
        resolve(this.responseBuffer || 'NO DATA');
      }, timeout);

      const onData = (data) => {
        clearTimeout(timeoutId);
        this.removeListener('data', onData);
        resolve(data);
      };

      this.once('data', onData);

      const cmdWithCR = command + '\r';

      if (this.connectionType === 'wifi' && this.wifiSocket) {
        this.wifiSocket.write(cmdWithCR);
      } else if (this.port) {
        this.port.write(cmdWithCR);
      }
    });
  }

  /**
   * Simula resposta quando não há scanner conectado
   */
  simulateResponse(command) {
    // Comandos AT
    if (command.startsWith('AT')) {
      if (command === 'ATZ') return 'ELM327 v2.1 (Simulado)';
      if (command === 'ATI') return 'ELM327 v2.1';
      if (command === 'ATDPN') return 'A6'; // ISO 15765-4 CAN
      return 'OK';
    }

    // Mode 01 - Live Data
    if (command.startsWith('01')) {
      const pid = command.substring(2);
      return this.simulatePIDResponse(pid);
    }

    // Mode 03 - DTCs
    if (command === '03') {
      // Simular alguns códigos aleatórios
      const hasCodes = Math.random() > 0.5;
      if (!hasCodes) return '43 00 00 00 00 00 00';
      return '43 01 71 04 20 00 00'; // P0171, P0420
    }

    // Mode 07 - Pending DTCs
    if (command === '07') {
      return '47 00 00 00 00 00 00';
    }

    // Mode 09 - VIN
    if (command === '0902') {
      return '49 02 01 39 42 52 48 54 33 38 4B 31 41 41 30 30 30 30 30 31';
    }

    return 'NO DATA';
  }

  /**
   * Simula resposta de PID
   */
  simulatePIDResponse(pid) {
    const responses = {
      '00': '41 00 BE 3E B8 13', // Supported PIDs
      '01': '41 01 00 07 E5 00', // Monitor status
      '04': '41 04 ' + Math.floor(20 + Math.random() * 30).toString(16).padStart(2, '0'), // Engine load
      '05': '41 05 ' + Math.floor(70 + Math.random() * 30).toString(16).padStart(2, '0'), // Coolant temp
      '06': '41 06 80', // Short fuel trim
      '07': '41 07 80', // Long fuel trim
      '0B': '41 0B ' + Math.floor(30 + Math.random() * 20).toString(16).padStart(2, '0'), // Intake pressure
      '0C': '41 0C ' + Math.floor(3000 + Math.random() * 1000).toString(16).padStart(4, '0'), // RPM
      '0D': '41 0D ' + Math.floor(Math.random() * 5).toString(16).padStart(2, '0'), // Speed
      '0E': '41 0E 80', // Timing advance
      '0F': '41 0F ' + Math.floor(20 + Math.random() * 20).toString(16).padStart(2, '0'), // Intake temp
      '10': '41 10 00 50', // MAF rate
      '11': '41 11 ' + Math.floor(15 + Math.random() * 10).toString(16).padStart(2, '0'), // Throttle
      '1C': '41 1C 06', // OBD standard
      '1F': '41 1F 00 3C', // Run time
      '2F': '41 2F ' + Math.floor(40 + Math.random() * 40).toString(16).padStart(2, '0'), // Fuel level
      '42': '41 42 ' + Math.floor(12000 + Math.random() * 2000).toString(16).padStart(4, '0'), // Control voltage
      '46': '41 46 ' + Math.floor(20 + Math.random() * 15).toString(16).padStart(2, '0'), // Ambient temp
      '5C': '41 5C ' + Math.floor(80 + Math.random() * 20).toString(16).padStart(2, '0'), // Oil temp
    };

    return responses[pid] || 'NO DATA';
  }

  /**
   * Executa scan rápido (dados básicos + MIL status)
   */
  async quickScan() {
    this.emit('status', { step: 'scanning', message: 'Iniciando scan rápido...', progress: 0 });

    const result = {
      timestamp: new Date().toISOString(),
      type: 'quick',
      liveData: [],
      milStatus: null,
      healthScore: 100,
    };

    try {
      // 1. Status do MIL (luz da injeção)
      this.emit('status', { step: 'scanning', message: 'Verificando luz da injeção...', progress: 10 });
      const milResponse = await this.sendCommand('0101');
      result.milStatus = this.parseMILStatus(milResponse);

      // 2. RPM
      this.emit('status', { step: 'scanning', message: 'Lendo RPM...', progress: 20 });
      const rpmResponse = await this.sendCommand('010C');
      const rpm = this.parseRPM(rpmResponse);
      if (rpm !== null) {
        result.liveData.push({
          param: 'RPM',
          value: rpm,
          unit: 'rpm',
          status: rpm >= 600 && rpm <= 7000 ? 'normal' : 'warning',
          range: [600, 7000],
        });
      }

      // 3. Velocidade
      this.emit('status', { step: 'scanning', message: 'Lendo velocidade...', progress: 35 });
      const speedResponse = await this.sendCommand('010D');
      const speed = this.parseSpeed(speedResponse);
      if (speed !== null) {
        result.liveData.push({
          param: 'Velocidade',
          value: speed,
          unit: 'km/h',
          status: 'normal',
        });
      }

      // 4. Temperatura do motor
      this.emit('status', { step: 'scanning', message: 'Lendo temperatura do motor...', progress: 50 });
      const tempResponse = await this.sendCommand('0105');
      const temp = this.parseCoolantTemp(tempResponse);
      if (temp !== null) {
        const tempStatus = temp < 70 ? 'warning' : temp > 105 ? 'critical' : 'normal';
        result.liveData.push({
          param: 'Temp. Motor',
          value: temp,
          unit: '°C',
          status: tempStatus,
          range: [80, 100],
        });
        if (tempStatus !== 'normal') result.healthScore -= 15;
      }

      // 5. Carga do motor
      this.emit('status', { step: 'scanning', message: 'Lendo carga do motor...', progress: 65 });
      const loadResponse = await this.sendCommand('0104');
      const load = this.parseEngineLoad(loadResponse);
      if (load !== null) {
        result.liveData.push({
          param: 'Carga Motor',
          value: load,
          unit: '%',
          status: 'normal',
        });
      }

      // 6. Tensão da bateria (via ECU)
      this.emit('status', { step: 'scanning', message: 'Lendo tensão da bateria...', progress: 80 });
      const voltResponse = await this.sendCommand('0142');
      const voltage = this.parseVoltage(voltResponse);
      if (voltage !== null) {
        const voltStatus = voltage < 12.0 ? 'critical' : voltage < 12.4 ? 'warning' : 'normal';
        result.liveData.push({
          param: 'Tensão Bateria',
          value: voltage,
          unit: 'V',
          status: voltStatus,
          range: [12.4, 14.5],
        });
        if (voltStatus !== 'normal') result.healthScore -= 10;
      }

      // Ajustar score baseado no MIL
      if (result.milStatus?.milOn) {
        result.healthScore -= 30;
      }

      result.healthScore = Math.max(0, result.healthScore);
      result.healthStatus = this.getHealthStatus(result.healthScore);

      this.emit('status', { step: 'complete', message: 'Scan rápido concluído', progress: 100 });
      return { success: true, data: result };

    } catch (error) {
      this.emit('error', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Executa scan completo (DTCs + dados ao vivo + sensores)
   */
  async fullScan() {
    this.emit('status', { step: 'scanning', message: 'Iniciando scan completo...', progress: 0 });

    const result = {
      timestamp: new Date().toISOString(),
      type: 'full',
      liveData: [],
      dtcCodes: [],
      pendingCodes: [],
      milStatus: null,
      readinessMonitors: null,
      vehicleInfo: null,
      healthScore: 100,
    };

    try {
      // 1. Ler VIN
      this.emit('status', { step: 'scanning', message: 'Identificando veículo...', progress: 5 });
      const vinResponse = await this.sendCommand('0902');
      result.vehicleInfo = { vin: this.parseVIN(vinResponse) };

      // 2. Status do MIL e monitores
      this.emit('status', { step: 'scanning', message: 'Verificando status do sistema...', progress: 10 });
      const milResponse = await this.sendCommand('0101');
      result.milStatus = this.parseMILStatus(milResponse);
      result.readinessMonitors = this.parseReadinessMonitors(milResponse);

      // 3. Ler códigos de falha ativos (Mode 03)
      this.emit('status', { step: 'scanning', message: 'Lendo códigos de falha...', progress: 20 });
      const dtcResponse = await this.sendCommand('03');
      result.dtcCodes = this.parseDTCs(dtcResponse);

      // 4. Ler códigos pendentes (Mode 07)
      this.emit('status', { step: 'scanning', message: 'Verificando códigos pendentes...', progress: 30 });
      const pendingResponse = await this.sendCommand('07');
      result.pendingCodes = this.parseDTCs(pendingResponse, true);

      // 5. Dados ao vivo completos
      const pidsToRead = [
        { pid: '0C', name: 'RPM', parser: 'parseRPM', unit: 'rpm', range: [600, 7000] },
        { pid: '0D', name: 'Velocidade', parser: 'parseSpeed', unit: 'km/h' },
        { pid: '05', name: 'Temp. Motor', parser: 'parseCoolantTemp', unit: '°C', range: [80, 100] },
        { pid: '04', name: 'Carga Motor', parser: 'parseEngineLoad', unit: '%' },
        { pid: '11', name: 'Acelerador', parser: 'parseThrottle', unit: '%' },
        { pid: '0F', name: 'Temp. Admissão', parser: 'parseIntakeTemp', unit: '°C', range: [-20, 60] },
        { pid: '0B', name: 'Pressão MAP', parser: 'parseIntakePressure', unit: 'kPa', range: [20, 105] },
        { pid: '10', name: 'Fluxo MAF', parser: 'parseMAF', unit: 'g/s' },
        { pid: '2F', name: 'Combustível', parser: 'parseFuelLevel', unit: '%', range: [10, 100] },
        { pid: '42', name: 'Tensão ECU', parser: 'parseVoltage', unit: 'V', range: [12.4, 14.5] },
        { pid: '46', name: 'Temp. Ambiente', parser: 'parseAmbientTemp', unit: '°C' },
        { pid: '5C', name: 'Temp. Óleo', parser: 'parseOilTemp', unit: '°C', range: [60, 120] },
        { pid: '06', name: 'Trim Curto B1', parser: 'parseFuelTrim', unit: '%', range: [-25, 25] },
        { pid: '07', name: 'Trim Longo B1', parser: 'parseFuelTrim', unit: '%', range: [-25, 25] },
        { pid: '0E', name: 'Avanço Ignição', parser: 'parseTimingAdvance', unit: '°', range: [-10, 40] },
        { pid: '1F', name: 'Tempo Ligado', parser: 'parseRunTime', unit: 'seg' },
      ];

      let progress = 35;
      const progressStep = 50 / pidsToRead.length;

      for (const pidConfig of pidsToRead) {
        this.emit('status', { 
          step: 'scanning', 
          message: `Lendo ${pidConfig.name}...`, 
          progress: Math.round(progress) 
        });

        const response = await this.sendCommand(`01${pidConfig.pid}`);
        const value = this[pidConfig.parser](response);

        if (value !== null) {
          let status = 'normal';
          if (pidConfig.range) {
            if (value < pidConfig.range[0] || value > pidConfig.range[1]) {
              status = 'warning';
            }
          }

          result.liveData.push({
            param: pidConfig.name,
            value: Math.round(value * 10) / 10,
            unit: pidConfig.unit,
            status,
            range: pidConfig.range,
          });
        }

        progress += progressStep;
      }

      // Calcular score de saúde
      result.healthScore = this.calculateHealthScore(result);
      result.healthStatus = this.getHealthStatus(result.healthScore);

      this.emit('status', { step: 'complete', message: 'Scan completo concluído', progress: 100 });
      return { success: true, data: result };

    } catch (error) {
      this.emit('error', error.message);
      return { success: false, error: error.message };
    }
  }

  // ============ PARSERS ============

  parseProtocol(response) {
    const protocols = {
      '1': 'SAE J1850 PWM',
      '2': 'SAE J1850 VPW',
      '3': 'ISO 9141-2',
      '4': 'ISO 14230-4 KWP (5 baud)',
      '5': 'ISO 14230-4 KWP (fast)',
      '6': 'ISO 15765-4 CAN (11 bit, 500 kbaud)',
      '7': 'ISO 15765-4 CAN (29 bit, 500 kbaud)',
      '8': 'ISO 15765-4 CAN (11 bit, 250 kbaud)',
      '9': 'ISO 15765-4 CAN (29 bit, 250 kbaud)',
      'A': 'SAE J1939 CAN',
    };

    const match = response.match(/[0-9A]/i);
    return match ? protocols[match[0].toUpperCase()] || 'AUTO' : 'AUTO';
  }

  parseMILStatus(response) {
    const clean = response.replace(/[\s\r\n]/g, '').replace(/^41[0-9A-F]{2}/i, '');
    if (clean.length < 2) return { milOn: false, dtcCount: 0 };

    const byte = parseInt(clean.substring(0, 2), 16);
    return {
      milOn: (byte & 0x80) !== 0,
      dtcCount: byte & 0x7F,
    };
  }

  parseReadinessMonitors(response) {
    // Simplificado - retorna status dos monitores
    return {
      misfire: 'complete',
      fuelSystem: 'complete',
      components: 'complete',
      catalyst: 'complete',
      heatedCatalyst: 'not_applicable',
      evaporativeSystem: 'complete',
      secondaryAir: 'not_applicable',
      acRefrigerant: 'not_applicable',
      oxygenSensor: 'complete',
      oxygenSensorHeater: 'complete',
      egr: 'complete',
    };
  }

  parseDTCs(response, isPending = false) {
    const codes = [];
    const clean = response.replace(/[\s\r\n]/g, '').replace(/^4[37]/i, '');

    // Cada DTC são 4 caracteres hex (2 bytes)
    for (let i = 0; i < clean.length; i += 4) {
      const hex = clean.substring(i, i + 4);
      if (hex === '0000' || hex.length < 4) continue;

      const dtc = this.decodeDTC(hex);
      if (dtc) {
        const info = DTC_DATABASE[dtc] || {
          desc: `Código de falha ${dtc}`,
          severity: 'warning',
          system: 'Desconhecido',
          causes: ['Causa não catalogada'],
          cost: [100, 500],
        };

        codes.push({
          code: dtc,
          description: info.desc,
          severity: info.severity,
          system: info.system,
          causes: info.causes,
          estimatedCost: info.cost,
          isPending,
        });
      }
    }

    return codes;
  }

  decodeDTC(hex) {
    if (hex.length !== 4) return null;

    const firstChar = parseInt(hex[0], 16);
    const prefix = ['P', 'C', 'B', 'U'][Math.floor(firstChar / 4)];
    const secondDigit = (firstChar % 4).toString();
    const rest = hex.substring(1);

    return `${prefix}${secondDigit}${rest}`.toUpperCase();
  }

  parseVIN(response) {
    const clean = response.replace(/[\s\r\n]/g, '').replace(/^49020[0-9]/i, '');
    let vin = '';

    for (let i = 0; i < clean.length; i += 2) {
      const charCode = parseInt(clean.substring(i, i + 2), 16);
      if (charCode >= 32 && charCode <= 126) {
        vin += String.fromCharCode(charCode);
      }
    }

    return vin.length >= 17 ? vin.substring(0, 17) : null;
  }

  parseRPM(response) {
    const match = response.match(/41\s*0C\s*([0-9A-F]{2})\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return ((parseInt(match[1], 16) * 256) + parseInt(match[2], 16)) / 4;
  }

  parseSpeed(response) {
    const match = response.match(/41\s*0D\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return parseInt(match[1], 16);
  }

  parseCoolantTemp(response) {
    const match = response.match(/41\s*05\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return parseInt(match[1], 16) - 40;
  }

  parseEngineLoad(response) {
    const match = response.match(/41\s*04\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return (parseInt(match[1], 16) * 100) / 255;
  }

  parseThrottle(response) {
    const match = response.match(/41\s*11\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return (parseInt(match[1], 16) * 100) / 255;
  }

  parseIntakeTemp(response) {
    const match = response.match(/41\s*0F\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return parseInt(match[1], 16) - 40;
  }

  parseIntakePressure(response) {
    const match = response.match(/41\s*0B\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return parseInt(match[1], 16);
  }

  parseMAF(response) {
    const match = response.match(/41\s*10\s*([0-9A-F]{2})\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return ((parseInt(match[1], 16) * 256) + parseInt(match[2], 16)) / 100;
  }

  parseFuelLevel(response) {
    const match = response.match(/41\s*2F\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return (parseInt(match[1], 16) * 100) / 255;
  }

  parseVoltage(response) {
    const match = response.match(/41\s*42\s*([0-9A-F]{2})\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return ((parseInt(match[1], 16) * 256) + parseInt(match[2], 16)) / 1000;
  }

  parseAmbientTemp(response) {
    const match = response.match(/41\s*46\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return parseInt(match[1], 16) - 40;
  }

  parseOilTemp(response) {
    const match = response.match(/41\s*5C\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return parseInt(match[1], 16) - 40;
  }

  parseFuelTrim(response) {
    const match = response.match(/41\s*0[67]\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return ((parseInt(match[1], 16) - 128) * 100) / 128;
  }

  parseTimingAdvance(response) {
    const match = response.match(/41\s*0E\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return (parseInt(match[1], 16) / 2) - 64;
  }

  parseRunTime(response) {
    const match = response.match(/41\s*1F\s*([0-9A-F]{2})\s*([0-9A-F]{2})/i);
    if (!match) return null;
    return (parseInt(match[1], 16) * 256) + parseInt(match[2], 16);
  }

  // ============ HELPERS ============

  calculateHealthScore(result) {
    let score = 100;

    // Penalizar por códigos de falha
    for (const dtc of result.dtcCodes) {
      if (dtc.severity === 'critical') score -= 25;
      else if (dtc.severity === 'warning') score -= 15;
      else score -= 5;
    }

    // Penalizar por códigos pendentes (menos severo)
    for (const dtc of result.pendingCodes) {
      score -= 5;
    }

    // Penalizar se MIL está aceso
    if (result.milStatus?.milOn) {
      score -= 20;
    }

    // Verificar dados fora do normal
    for (const data of result.liveData) {
      if (data.status === 'warning') score -= 5;
      if (data.status === 'critical') score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  getHealthStatus(score) {
    if (score >= 90) return 'Excelente';
    if (score >= 75) return 'Bom';
    if (score >= 50) return 'Regular';
    if (score >= 25) return 'Ruim';
    return 'Crítico';
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Desconecta do dispositivo
   */
  async disconnect() {
    if (this.port) {
      this.port.close();
      this.port = null;
    }
    if (this.wifiSocket) {
      this.wifiSocket.destroy();
      this.wifiSocket = null;
    }
    this.isConnected = false;
    this.emit('disconnected');
    return { success: true };
  }

  /**
   * Retorna status atual
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      connectionType: this.connectionType,
      device: this.deviceInfo,
      protocol: this.protocol,
    };
  }
}

// Singleton
const obdService = new OBDService();

module.exports = obdService;

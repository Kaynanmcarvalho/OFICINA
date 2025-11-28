/**
 * TORQ OBD Scanner - Hook
 * Hook para usar o scanner OBD-II
 */

import { useState, useEffect, useCallback } from 'react';
import { obdScannerService } from '../services/obdScannerService';
import type {
  OBDScanResult,
  OBDScanRequest,
  OBDConnectionState,
  OBDDeviceInfo,
} from '../types';

interface UseOBDScannerReturn {
  connectionState: OBDConnectionState;
  scanResults: OBDScanResult[];
  currentScan: OBDScanResult | null;
  connectDevice: () => Promise<OBDDeviceInfo | null>;
  performScan: (request: OBDScanRequest) => Promise<OBDScanResult | null>;
  disconnect: () => Promise<void>;
  clearResults: () => void;
  isSupported: boolean;
  error: string | null;
}

export function useOBDScanner(): UseOBDScannerReturn {
  const [connectionState, setConnectionState] = useState<OBDConnectionState>(
    obdScannerService.getConnectionState()
  );
  const [scanResults, setScanResults] = useState<OBDScanResult[]>([]);
  const [currentScan, setCurrentScan] = useState<OBDScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSupported = obdScannerService.isBluetoothSupported();

  useEffect(() => {
    const unsubscribe = obdScannerService.subscribe((state) => {
      setConnectionState(state);
      if (state.error) {
        setError(state.error);
      }
    });

    return unsubscribe;
  }, []);

  const connectDevice = useCallback(async (): Promise<OBDDeviceInfo | null> => {
    try {
      setError(null);
      const device = await obdScannerService.connectDevice();
      return device;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao conectar dispositivo';
      setError(errorMessage);
      return null;
    }
  }, []);

  const performScan = useCallback(async (
    request: OBDScanRequest
  ): Promise<OBDScanResult | null> => {
    try {
      setError(null);
      const result = await obdScannerService.performScan(request);
      setScanResults(prev => [result, ...prev]);
      setCurrentScan(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro durante o scan';
      setError(errorMessage);
      return null;
    }
  }, []);

  const disconnect = useCallback(async (): Promise<void> => {
    try {
      await obdScannerService.disconnect();
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao desconectar';
      setError(errorMessage);
    }
  }, []);

  const clearResults = useCallback(() => {
    setScanResults([]);
    setCurrentScan(null);
    setError(null);
  }, []);

  return {
    connectionState,
    scanResults,
    currentScan,
    connectDevice,
    performScan,
    disconnect,
    clearResults,
    isSupported,
    error,
  };
}

export default useOBDScanner;

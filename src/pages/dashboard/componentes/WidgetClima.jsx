import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets } from 'lucide-react';

const WidgetClima = () => {
  const [clima, setClima] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    buscarClima();
  }, []);

  const buscarClima = async () => {
    try {
      // Coordenadas de São Paulo (padrão)
      // Em produção, usar geolocalização do navegador
      const latitude = -23.5505;
      const longitude = -46.6333;

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=America/Sao_Paulo`
      );

      const data = await response.json();
      
      setClima({
        temperatura: Math.round(data.current.temperature_2m),
        umidade: data.current.relative_humidity_2m,
        vento: data.current.wind_speed_10m,
        codigo: data.current.weather_code
      });
    } catch (error) {
      console.error('[WidgetClima] Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconeClima = (codigo) => {
    // Códigos WMO Weather interpretation
    if (codigo === 0) return Sun;
    if (codigo >= 1 && codigo <= 3) return Cloud;
    if (codigo >= 51 && codigo <= 67) return CloudRain;
    if (codigo >= 71 && codigo <= 77) return CloudSnow;
    return Cloud;
  };

  const getDescricaoClima = (codigo) => {
    if (codigo === 0) return 'Céu limpo';
    if (codigo >= 1 && codigo <= 3) return 'Parcialmente nublado';
    if (codigo >= 51 && codigo <= 67) return 'Chuva';
    if (codigo >= 71 && codigo <= 77) return 'Neve';
    return 'Nublado';
  };

  if (isLoading || !clima) {
    return (
      <div className="w-48 h-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl animate-pulse" />
    );
  }

  const IconeClima = getIconeClima(clima.codigo);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20"
    >
      <div className="flex items-center gap-4">
        {/* Ícone e Temperatura */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <IconeClima className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {clima.temperatura}°
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {getDescricaoClima(clima.codigo)}
            </p>
          </div>
        </div>

        {/* Detalhes */}
        <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            <span>{clima.umidade}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            <span>{clima.vento} km/h</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WidgetClima;

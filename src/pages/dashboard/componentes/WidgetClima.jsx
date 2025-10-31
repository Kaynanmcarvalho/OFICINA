import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets } from 'lucide-react';

const WidgetClima = () => {
  const [clima, setClima] = useState(null);
  const [previsao, setPrevisao] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    buscarClima();
    // Atualizar a cada 30 minutos
    const interval = setInterval(buscarClima, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const buscarClima = async () => {
    try {
      setErro(false);
      // Coordenadas de São Paulo (padrão)
      // Em produção, usar geolocalização do navegador
      const latitude = -23.5505;
      const longitude = -46.6333;

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&timezone=America/Sao_Paulo&forecast_days=1`
      );

      if (!response.ok) throw new Error('Falha ao buscar clima');

      const data = await response.json();
      
      setClima({
        temperatura: Math.round(data.current.temperature_2m),
        umidade: data.current.relative_humidity_2m,
        vento: data.current.wind_speed_10m,
        codigo: data.current.weather_code
      });

      // Pegar próximas 3 horas
      const horaAtual = new Date().getHours();
      const proximasHoras = data.hourly.time
        .map((time, index) => ({
          hora: new Date(time).getHours(),
          temperatura: Math.round(data.hourly.temperature_2m[index]),
          codigo: data.hourly.weather_code[index]
        }))
        .filter(h => h.hora > horaAtual && h.hora <= horaAtual + 3)
        .slice(0, 3);

      setPrevisao(proximasHoras);
    } catch (error) {
      console.error('[WidgetClima] Erro:', error);
      setErro(true);
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

  if (isLoading) {
    return (
      <div className="w-64 h-24 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
    );
  }

  if (erro || !clima) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Clima indisponível
        </p>
      </motion.div>
    );
  }

  const IconeClima = getIconeClima(clima.codigo);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Ícone e Temperatura Principal */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex items-center gap-3"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
            <IconeClima className="w-7 h-7 text-white" />
          </div>
          <div>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              {clima.temperatura}°
            </motion.p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {getDescricaoClima(clima.codigo)}
            </p>
          </div>
        </motion.div>

        {/* Detalhes */}
        <div className="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5" />
            <span>{clima.umidade}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5" />
            <span>{clima.vento} km/h</span>
          </div>
        </div>

        {/* Previsão Próximas Horas */}
        {previsao.length > 0 && (
          <div className="flex gap-2 ml-auto">
            {previsao.map((prev, index) => {
              const IconePrev = getIconeClima(prev.codigo);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex flex-col items-center gap-1 px-2 py-1 bg-white/50 dark:bg-gray-700/50 rounded-lg"
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {prev.hora}h
                  </span>
                  <IconePrev className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {prev.temperatura}°
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WidgetClima;

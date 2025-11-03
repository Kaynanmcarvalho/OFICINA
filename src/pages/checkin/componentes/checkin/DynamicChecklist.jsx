/**
 * DynamicChecklist Component
 * Checklist adaptativo baseado no tipo de veículo
 * Design Apple-level com três estados e categorização
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  ChevronDown,
  ChevronRight,
  Car,
  Bike,
  Truck
} from 'lucide-react';

const DynamicChecklist = ({ 
  vehicleType = 'car', 
  checklist = [], 
  onChecklistChange 
}) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['motor', 'freios']));
  const [notes, setNotes] = useState({});

  // Definir itens por tipo de veículo
  const checklistItems = useMemo(() => {
    const common = {
      motor: [
        { id: 'oleo_motor', label: 'Óleo do motor', priority: 'high' },
        { id: 'filtro_oleo', label: 'Filtro de óleo', priority: 'medium' },
        { id: 'filtro_ar', label: 'Filtro de ar', priority: 'medium' },
        { id: 'correia', label: 'Correia dentada', priority: 'low' },
      ],
      freios: [
        { id: 'pastilhas_dianteiras', label: 'Pastilhas dianteiras', priority: 'high' },
        { id: 'pastilhas_traseiras', label: 'Pastilhas traseiras', priority: 'high' },
        { id: 'fluido_freio', label: 'Fluido de freio', priority: 'medium' },
        { id: 'discos', label: 'Discos de freio', priority: 'medium' },
      ],
      eletrica: [
        { id: 'bateria', label: 'Bateria', priority: 'high' },
        { id: 'alternador', label: 'Alternador', priority: 'medium' },
        { id: 'farois', label: 'Faróis', priority: 'low' },
        { id: 'lanternas', label: 'Lanternas', priority: 'low' },
      ],
      pneus: [
        { id: 'pneu_dianteiro_esq', label: 'Pneu dianteiro esquerdo', priority: 'high' },
        { id: 'pneu_dianteiro_dir', label: 'Pneu dianteiro direito', priority: 'high' },
        { id: 'pneu_traseiro_esq', label: 'Pneu traseiro esquerdo', priority: 'high' },
        { id: 'pneu_traseiro_dir', label: 'Pneu traseiro direito', priority: 'high' },
        { id: 'estepe', label: 'Estepe', priority: 'low' },
      ],
    };

    if (vehicleType === 'motorcycle') {
      return {
        motor: common.motor,
        freios: [
          { id: 'freio_dianteiro', label: 'Freio dianteiro', priority: 'high' },
          { id: 'freio_traseiro', label: 'Freio traseiro', priority: 'high' },
          { id: 'fluido_freio', label: 'Fluido de freio', priority: 'medium' },
        ],
        transmissao: [
          { id: 'corrente', label: 'Corrente', priority: 'high' },
          { id: 'coroa', label: 'Coroa', priority: 'medium' },
          { id: 'pinhao', label: 'Pinhão', priority: 'medium' },
        ],
        suspensao: [
          { id: 'suspensao_dianteira', label: 'Suspensão dianteira', priority: 'medium' },
          { id: 'suspensao_traseira', label: 'Suspensão traseira', priority: 'medium' },
        ],
        eletrica: common.eletrica.slice(0, 3),
        pneus: [
          { id: 'pneu_dianteiro', label: 'Pneu dianteiro', priority: 'high' },
          { id: 'pneu_traseiro', label: 'Pneu traseiro', priority: 'high' },
        ],
      };
    }

    if (vehicleType === 'truck') {
      return {
        motor: [
          ...common.motor,
          { id: 'turbo', label: 'Turbo', priority: 'medium' },
          { id: 'intercooler', label: 'Intercooler', priority: 'low' },
        ],
        freios: [
          ...common.freios,
          { id: 'freio_motor', label: 'Freio motor', priority: 'high' },
          { id: 'abs', label: 'Sistema ABS', priority: 'high' },
        ],
        suspensao: [
          { id: 'suspensao_dianteira', label: 'Suspensão dianteira', priority: 'high' },
          { id: 'suspensao_traseira', label: 'Suspensão traseira', priority: 'high' },
          { id: 'molas', label: 'Molas/Feixes', priority: 'medium' },
        ],
        eletrica: common.eletrica,
        pneus: [
          { id: 'pneus_eixo_dianteiro', label: 'Pneus eixo dianteiro', priority: 'high' },
          { id: 'pneus_eixo_traseiro', label: 'Pneus eixo traseiro', priority: 'high' },
          { id: 'pneus_eixo_adicional', label: 'Pneus eixo adicional', priority: 'medium' },
          { id: 'estepe', label: 'Estepe', priority: 'low' },
        ],
      };
    }

    // Default: car
    return {
      ...common,
      suspensao: [
        { id: 'amortecedores', label: 'Amortecedores', priority: 'medium' },
        { id: 'molas', label: 'Molas', priority: 'low' },
        { id: 'buchas', label: 'Buchas', priority: 'low' },
      ],
    };
  }, [vehicleType]);

  // Inicializar checklist se vazio
  useMemo(() => {
    if (checklist.length === 0) {
      const initialChecklist = [];
      Object.entries(checklistItems).forEach(([category, items]) => {
        items.forEach(item => {
          initialChecklist.push({
            id: item.id,
            category,
            label: item.label,
            priority: item.priority,
            status: 'unchecked', // unchecked | ok | issue
            notes: '',
          });
        });
      });
      onChecklistChange(initialChecklist);
    }
  }, [checklistItems, checklist.length, onChecklistChange]);

  // Toggle categoria
  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Atualizar status do item
  const updateItemStatus = (itemId) => {
    const updatedChecklist = checklist.map(item => {
      if (item.id === itemId) {
        const statusCycle = {
          'unchecked': 'ok',
          'ok': 'issue',
          'issue': 'unchecked',
        };
        return { ...item, status: statusCycle[item.status] };
      }
      return item;
    });
    onChecklistChange(updatedChecklist);
  };

  // Atualizar notas
  const updateItemNotes = (itemId, noteText) => {
    setNotes({ ...notes, [itemId]: noteText });
    const updatedChecklist = checklist.map(item => {
      if (item.id === itemId) {
        return { ...item, notes: noteText };
      }
      return item;
    });
    onChecklistChange(updatedChecklist);
  };

  // Obter ícone de status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok':
        return <CheckSquare className="w-5 h-5 text-green-500" />;
      case 'issue':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Square className="w-5 h-5 text-gray-400" />;
    }
  };

  // Obter cor de status
  const getStatusColor = (status) => {
    switch (status) {
      case 'ok':
        return 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20';
      case 'issue':
        return 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20';
      default:
        return 'bg-gray-500/10 border-gray-300/30 hover:bg-gray-500/20 dark:border-gray-700/30';
    }
  };

  // Calcular progresso por categoria
  const getCategoryProgress = (category) => {
    const categoryItems = checklist.filter(item => item.category === category);
    const checkedItems = categoryItems.filter(item => item.status !== 'unchecked');
    return categoryItems.length > 0 
      ? Math.round((checkedItems.length / categoryItems.length) * 100)
      : 0;
  };

  // Labels de categoria
  const categoryLabels = {
    motor: 'Motor',
    freios: 'Freios',
    eletrica: 'Sistema Elétrico',
    pneus: 'Pneus',
    suspensao: 'Suspensão',
    transmissao: 'Transmissão',
  };

  // Ícone do veículo
  const VehicleIcon = vehicleType === 'motorcycle' ? Bike : vehicleType === 'truck' ? Truck : Car;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <VehicleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Checklist de Inspeção
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {checklist.filter(i => i.status !== 'unchecked').length} / {checklist.length}
        </span>
      </div>

      {/* Categorias */}
      <div className="space-y-3">
        {Object.entries(checklistItems).map(([category, items]) => {
          const isExpanded = expandedCategories.has(category);
          const progress = getCategoryProgress(category);
          const categoryChecklistItems = checklist.filter(item => item.category === category);

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                rounded-2xl overflow-hidden
                bg-white/80 dark:bg-gray-800/80
                backdrop-blur-xl
                border border-gray-200/50 dark:border-gray-700/50
                shadow-lg
              "
            >
              {/* Header da categoria */}
              <button
                onClick={() => toggleCategory(category)}
                className="
                  w-full px-4 py-3
                  flex items-center justify-between
                  hover:bg-gray-50/50 dark:hover:bg-gray-700/50
                  transition-colors duration-200
                "
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {categoryLabels[category]}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({categoryChecklistItems.filter(i => i.status !== 'unchecked').length}/{items.length})
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-10 text-right">
                    {progress}%
                  </span>
                </div>
              </button>

              {/* Items da categoria */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="p-4 space-y-2">
                      {categoryChecklistItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="space-y-2"
                        >
                          {/* Item */}
                          <div
                            className={`
                              flex items-center gap-3 p-3 rounded-xl
                              border transition-all duration-200
                              ${getStatusColor(item.status)}
                            `}
                          >
                            <button
                              onClick={() => updateItemStatus(item.id)}
                              className="flex-shrink-0 transition-transform hover:scale-110"
                            >
                              {getStatusIcon(item.status)}
                            </button>

                            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                              {item.label}
                            </span>

                            {item.priority === 'high' && (
                              <span className="
                                px-2 py-0.5 rounded-md text-xs font-medium
                                bg-red-500/10 text-red-600 dark:text-red-400
                              ">
                                Prioritário
                              </span>
                            )}
                          </div>

                          {/* Notas (se status for issue) */}
                          {item.status === 'issue' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <textarea
                                value={notes[item.id] || item.notes || ''}
                                onChange={(e) => updateItemNotes(item.id, e.target.value)}
                                placeholder="Descreva o problema encontrado..."
                                className="
                                  w-full px-3 py-2 rounded-lg
                                  bg-amber-50 dark:bg-amber-900/20
                                  border border-amber-200 dark:border-amber-800
                                  text-sm text-gray-700 dark:text-gray-300
                                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                                  focus:outline-none focus:ring-2 focus:ring-amber-500/50
                                  resize-none
                                "
                                rows={2}
                              />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Resumo */}
      <div className="
        flex items-center justify-between p-4 rounded-2xl
        bg-gradient-to-r from-blue-500/10 to-purple-500/10
        border border-blue-200/50 dark:border-blue-800/50
      ">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progresso Total
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {checklist.filter(i => i.status === 'ok').length} OK • {' '}
            {checklist.filter(i => i.status === 'issue').length} Problemas
          </span>
        </div>
      </div>
    </div>
  );
};

export default DynamicChecklist;

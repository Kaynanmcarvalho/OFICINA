import React from 'react';

interface ItemMetaRowProps {
  plate?: string;
  model?: string;
  date: Date;
  tags?: string[];
  showRelativeTime?: boolean;
}

/**
 * ItemMetaRow - Exibe metadados secundários
 * Formatação pt-BR com placa em monospace
 */
const ItemMetaRow: React.FC<ItemMetaRowProps> = ({
  plate,
  model,
  date,
  tags = [],
  showRelativeTime = true,
}) => {
  // Formatar data
  const formatDate = () => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Tempo relativo para últimas 24h
    if (showRelativeTime && diffDays < 1) {
      if (diffMins < 1) return 'agora';
      if (diffMins < 60) return `há ${diffMins} min`;
      if (diffHours < 24) return `há ${diffHours}h`;
    }

    // Formato padrão pt-BR
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Formatar placa
  const formatPlate = (plate: string) => {
    return plate.toUpperCase().replace(/([A-Z]{3})([0-9])/, '$1-$2');
  };

  const items = [
    plate && (
      <span key="plate" className="font-mono font-medium">
        {formatPlate(plate)}
      </span>
    ),
    model && <span key="model">{model}</span>,
    <span key="date">{formatDate()}</span>,
  ].filter(Boolean);

  return (
    <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index < items.length - 1 && (
            <span className="opacity-40">•</span>
          )}
        </React.Fragment>
      ))}
      
      {tags.length > 0 && (
        <div className="flex gap-1.5 ml-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="
                px-2 py-0.5
                rounded-md
                text-[11px]
                bg-neutral-100 dark:bg-neutral-800
                text-neutral-600 dark:text-neutral-400
              "
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemMetaRow;

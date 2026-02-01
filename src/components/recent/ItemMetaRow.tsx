import React from 'react';

export interface ItemMetaRowProps {
  /** Vehicle license plate */
  plate?: string;
  /** Vehicle model */
  model?: string;
  /** Record date */
  date: Date;
  /** Tags array */
  tags?: string[];
  /** Show relative time instead of formatted date */
  showRelativeTime?: boolean;
}

/**
 * Validates if date is valid
 */
const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const d = date instanceof Date ? date : new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

/**
 * Formats relative time in Portuguese
 */
const getRelativeTime = (date: Date): string | null => {
  if (!isValidDate(date)) return null;
  
  try {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Only show relative time for last 24 hours
    if (diffDays >= 1) return null;

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `há ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;

    return null;
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return null;
  }
};

/**
 * ItemMetaRow - Displays secondary metadata (plate, model, date, tags)
 * 
 * @example
 * <ItemMetaRow 
 *   plate="ABC-1234" 
 *   model="Honda Civic" 
 *   date={new Date()} 
 *   showRelativeTime 
 * />
 */
const ItemMetaRow: React.FC<ItemMetaRowProps> = ({
  plate,
  model,
  date,
  tags = [],
  showRelativeTime = false,
}) => {
  // Validate date
  if (!isValidDate(date)) {
    return (
      <div className="flex items-center gap-3 text-xs font-bold text-gray-700 dark:text-neutral-400">
        {plate && (
          <span className="font-mono font-medium">{plate.toUpperCase()}</span>
        )}
        {model && <span>{model}</span>}
        <span className="text-red-500">Data inválida</span>
      </div>

  }

  // Format date
  let formattedDate = '';
  let formattedTime = '';
  let relativeTime: string | null = null;
  
  try {
    relativeTime = showRelativeTime ? getRelativeTime(date) : null;
    formattedDate = relativeTime || new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);

    formattedTime = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    formattedDate = 'Data inválida';
    formattedTime = '';
  }

  // Format plate
  const formattedPlate = plate?.toUpperCase();

  const metaItems = [
    formattedPlate && (
      <span key="plate" className="font-mono font-medium">
        {formattedPlate}
      </span>
    ),
    model && (
      <span key="model">
        {model}
      </span>
    ),
    <span key="date">
      {formattedDate}
    </span>,
    !relativeTime && (
      <span key="time">
        {formattedTime}
      </span>
    ),
  ].filter(Boolean);

  return (
    <div className="flex items-center gap-3 text-xs font-bold text-gray-700 dark:text-neutral-400">
      {metaItems.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index < metaItems.length - 1 && (
            <span className="opacity-50 font-extrabold">•</span>
          )}
        </React.Fragment>
      ))}

      {/* Tags */}
      {tags.length > 0 && (
        <>
          <span className="opacity-50 font-extrabold">•</span>
          <div className="flex items-center gap-1.5">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="
                  inline-flex items-center
                  px-2 py-0.5
                  rounded-md
                  bg-gray-200 dark:bg-neutral-800
                  text-[11px]
                  font-bold
                  text-gray-800 dark:text-neutral-300
                "
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ItemMetaRow;

# Design System - Check-in Premium V2

## Princípios de Design

### 1. Apple-like Premium
- Minimalismo sofisticado
- Espaçamento generoso
- Hierarquia visual clara
- Microinterações delicadas

### 2. Glassmorphism
- Fundos translúcidos com blur
- Bordas sutis
- Sombras profundas
- Reflexos de luz

### 3. Fluidez
- Animações suaves (200-300ms)
- Transições naturais
- Feedback imediato
- Estados intermediários visíveis

## Paleta de Cores

### Tema Claro
```css
--bg-primary: #FFFFFF
--bg-secondary: #F9FAFB
--bg-tertiary: #F3F4F6
--text-primary: #111827
--text-secondary: #6B7280
--text-tertiary: #9CA3AF
--accent-primary: #F28C1D (Torq Orange)
--accent-secondary: #007AFF (Apple Blue)
--success: #10B981
--warning: #F59E0B
--error: #EF4444
--glass: rgba(255, 255, 255, 0.7)
--glass-border: rgba(255, 255, 255, 0.18)
```

### Tema Escuro
```css
--bg-primary: #000000
--bg-secondary: #1C1C1E
--bg-tertiary: #2C2C2E
--text-primary: #FFFFFF
--text-secondary: #EBEBF5
--text-tertiary: #8E8E93
--accent-primary: #FF9F0A
--accent-secondary: #0A84FF
--success: #30D158
--warning: #FF9F0A
--error: #FF453A
--glass: rgba(28, 28, 30, 0.7)
--glass-border: rgba(255, 255, 255, 0.1)
```

## Tipografia

### Fontes
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
--font-display: 'Plus Jakarta Sans', sans-serif
--font-mono: 'SF Mono', 'Fira Code', monospace
```

### Escala
```css
--text-xs: 0.75rem (12px)
--text-sm: 0.875rem (14px)
--text-base: 1rem (16px)
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px)
--text-2xl: 1.5rem (24px)
--text-3xl: 1.875rem (30px)
--text-4xl: 2.25rem (36px)
--text-5xl: 3rem (48px)
```

### Pesos
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

## Espaçamento

### Sistema 8pt
```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-5: 1.25rem (20px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-10: 2.5rem (40px)
--space-12: 3rem (48px)
--space-16: 4rem (64px)
--space-20: 5rem (80px)
```

## Bordas e Sombras

### Raios
```css
--radius-sm: 0.5rem (8px)
--radius-md: 0.75rem (12px)
--radius-lg: 1rem (16px)
--radius-xl: 1.5rem (24px)
--radius-2xl: 2rem (32px)
--radius-3xl: 3rem (48px)
--radius-full: 9999px
```

### Sombras
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)
```

### Glassmorphism
```css
.glass-card {
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-xl);
}
```

## Componentes

### 1. Timeline Inteligente

```jsx
<div className="relative">
  {/* Linha de progresso */}
  <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
    <motion.div
      className="h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  </div>

  {/* Estágios */}
  <div className="relative flex justify-between">
    {stages.map((stage, index) => (
      <motion.button
        key={stage.id}
        onClick={() => onStageClick(stage)}
        className={`
          flex flex-col items-center gap-2 z-10
          ${stage.completed ? 'opacity-100' : 'opacity-50'}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Ícone do estágio */}
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          transition-all duration-300
          ${stage.completed
            ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
            : stage.current
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 animate-pulse'
              : 'bg-gray-200 dark:bg-gray-700'
          }
        `}>
          {stage.completed ? (
            <Check className="w-8 h-8 text-white" />
          ) : (
            <stage.icon className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Label */}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {stage.label}
        </span>

        {/* Timestamp */}
        {stage.timestamp && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(stage.timestamp)}
          </span>
        )}
      </motion.button>
    ))}
  </div>
</div>
```

### 2. Resumo do Veículo

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="glass-card rounded-3xl p-6 space-y-4"
>
  {/* Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
        <Car className="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {brand} {model}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {year} • {color} • {plate}
        </p>
      </div>
    </div>
    
    {/* Badge de visitas */}
    <div className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        {visitCount}ª visita
      </span>
    </div>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-3 gap-4">
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {totalVisits}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Visitas
      </p>
    </div>
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {daysSinceLastVisit}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Dias desde última visita
      </p>
    </div>
    <div className="text-center">
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        R$ {totalSpent}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Total gasto
      </p>
    </div>
  </div>

  {/* Serviços frequentes */}
  <div className="flex flex-wrap gap-2">
    {frequentServices.map(service => (
      <span
        key={service}
        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300"
      >
        {service}
      </span>
    ))}
  </div>
</motion.div>
```

### 3. Histórico Visual

```jsx
<div className="space-y-4">
  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
    Histórico de Visitas
  </h4>

  <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
    {history.map((visit, index) => (
      <motion.div
        key={visit.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex-shrink-0 w-64 snap-start"
      >
        <div className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
          onClick={() => onVisitClick(visit)}
        >
          {/* Foto */}
          <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
            <img
              src={visit.entryPhoto}
              alt="Entrada"
              className="w-full h-full object-cover"
            />
            {/* Status badge */}
            <div className={`
              absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold
              ${visit.status === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-orange-500 text-white'
              }
            `}>
              {visit.status === 'completed' ? 'Concluído' : 'Em andamento'}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDate(visit.date)}
              </span>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                R$ {visit.totalValue}
              </span>
            </div>

            {/* Serviços */}
            <div className="flex flex-wrap gap-1">
              {visit.services.slice(0, 2).map(service => (
                <span
                  key={service}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {service}
                </span>
              ))}
              {visit.services.length > 2 && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  +{visit.services.length - 2}
                </span>
              )}
            </div>

            {/* Duração */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{visit.duration}h</span>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</div>
```

### 4. Dashboard Operacional

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {metrics.map((metric, index) => (
    <motion.div
      key={metric.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-2xl p-6 hover:shadow-2xl transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          bg-gradient-to-br ${metric.gradient}
        `}>
          <metric.icon className="w-6 h-6 text-white" />
        </div>
        
        {/* Trend indicator */}
        <div className={`
          flex items-center gap-1 text-sm font-semibold
          ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}
        `}>
          {metric.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{Math.abs(metric.trend)}%</span>
        </div>
      </div>

      <div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
          {metric.value}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {metric.label}
        </p>
      </div>

      {/* Mini chart */}
      <div className="mt-4 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metric.chartData}>
            <defs>
              <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metric.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={metric.color}
              fill={`url(#gradient-${metric.id})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  ))}
</div>
```

### 5. Sistema de PIN

```jsx
<div className="space-y-4">
  <h4 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
    Digite o PIN de Retirada
  </h4>

  {/* PIN Input */}
  <div className="flex justify-center gap-3">
    {[0, 1, 2, 3].map((index) => (
      <motion.input
        key={index}
        ref={el => pinInputs.current[index] = el}
        type="text"
        maxLength={1}
        value={pin[index] || ''}
        onChange={(e) => handlePinChange(index, e.target.value)}
        onKeyDown={(e) => handleKeyDown(index, e)}
        className={`
          w-16 h-16 text-center text-2xl font-bold rounded-2xl
          transition-all duration-200
          ${pinStatus === 'valid'
            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 text-green-600'
            : pinStatus === 'invalid'
              ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-600'
              : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
          }
          focus:outline-none focus:ring-2 focus:ring-orange-500
        `}
        animate={pinStatus === 'invalid' ? {
          x: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.4 }
        } : {}}
      />
    ))}
  </div>

  {/* Feedback */}
  <AnimatePresence>
    {pinStatus === 'valid' && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
      >
        <CheckCircle className="w-5 h-5" />
        <span className="font-semibold">PIN correto!</span>
      </motion.div>
    )}
    
    {pinStatus === 'invalid' && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400"
      >
        <XCircle className="w-5 h-5" />
        <span className="font-semibold">
          PIN incorreto. {3 - attempts} tentativa(s) restante(s)
        </span>
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

### 6. Visualizador de Fotos 3D

```jsx
<TransformWrapper
  initialScale={1}
  minScale={0.5}
  maxScale={4}
  centerOnInit
>
  {({ zoomIn, zoomOut, resetTransform }) => (
    <div className="relative">
      {/* Controles */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => zoomIn()}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => zoomOut()}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={() => resetTransform()}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      {/* Imagem */}
      <TransformComponent>
        <img
          src={currentPhoto}
          alt="Veículo"
          className="w-full h-auto rounded-2xl"
        />
      </TransformComponent>

      {/* Navegação */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => setCurrentPhoto(photo)}
            className={`
              w-3 h-3 rounded-full transition-all
              ${currentPhoto === photo
                ? 'bg-orange-500 w-8'
                : 'bg-gray-400 hover:bg-gray-500'
              }
            `}
          />
        ))}
      </div>
    </div>
  )}
</TransformWrapper>
```

## Animações

### Transições Padrão
```javascript
const transitions = {
  fast: { duration: 0.2, ease: "easeOut" },
  normal: { duration: 0.3, ease: "easeInOut" },
  slow: { duration: 0.5, ease: "easeInOut" }
};
```

### Variantes Comuns
```javascript
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};
```

## Responsividade

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile First
- Design para mobile primeiro
- Progressive enhancement para desktop
- Touch-friendly (mínimo 44x44px)
- Gestos nativos (swipe, pinch)

## Acessibilidade

- Contraste mínimo 4.5:1
- Focus visible em todos os elementos interativos
- ARIA labels apropriados
- Navegação por teclado
- Screen reader friendly

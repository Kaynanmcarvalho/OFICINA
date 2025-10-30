# 🎨 Customização Avançada - Check-in Premium

## 🎭 Variantes de Animação

### 1. Animação de Entrada Alternativa

```jsx
// src/pages/CheckInPage.jsx
// Substituir a animação do Hero

<motion.h1
  initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
  transition={{ 
    duration: 0.8, 
    ease: [0.6, -0.05, 0.01, 0.99] 
  }}
  className="text-5xl sm:text-6xl lg:text-7xl font-bold..."
>
  Check-in / Check-out
</motion.h1>
```

### 2. Hover com Rotação 3D

```jsx
// src/pages/checkin/componentes/RegistroCard.jsx
// Adicionar ao card principal

<motion.div
  whileHover={{ 
    scale: 1.02, 
    rotateY: 2,
    rotateX: -2,
    transition: { duration: 0.3 }
  }}
  style={{ transformStyle: 'preserve-3d' }}
  className="group relative"
>
```

### 3. Animação de Pulso no Badge

```jsx
// src/pages/checkin/componentes/RegistroCard.jsx
// Badge de status com pulso

<motion.span
  animate={!isCompleted ? {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1]
  } : {}}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  className={`inline-flex items-center...`}
>
```

## 🌈 Temas Personalizados

### Tema Neon
```jsx
// Adicionar ao tailwind.config.js
colors: {
  neon: {
    pink: '#FF10F0',
    blue: '#00F0FF',
    green: '#39FF14',
    purple: '#BF00FF'
  }
}

// Usar nos cards
className="bg-gradient-to-r from-neon-pink to-neon-purple"
```

### Tema Pastel
```jsx
colors: {
  pastel: {
    pink: '#FFD1DC',
    blue: '#AEC6CF',
    green: '#B4E7CE',
    yellow: '#FDFD96'
  }
}
```

### Tema Corporativo
```jsx
colors: {
  corporate: {
    navy: '#1E3A8A',
    gold: '#D4AF37',
    silver: '#C0C0C0',
    charcoal: '#36454F'
  }
}
```

## 🎬 Efeitos Especiais

### 1. Partículas de Fundo

```jsx
// Instalar: npm install react-tsparticles tsparticles

import Particles from "react-tsparticles";

<Particles
  options={{
    particles: {
      number: { value: 50 },
      size: { value: 3 },
      move: { enable: true, speed: 1 },
      opacity: { value: 0.3 }
    }
  }}
/>
```

### 2. Efeito Parallax

```jsx
import { useScroll, useTransform } from "framer-motion";

const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 300], [0, -50]);

<motion.div style={{ y }}>
  {/* Conteúdo com parallax */}
</motion.div>
```

### 3. Blur Progressivo

```jsx
const blur = useTransform(scrollY, [0, 300], [0, 10]);

<motion.div style={{ filter: `blur(${blur}px)` }}>
  {/* Conteúdo com blur */}
</motion.div>
```

## 🎨 Gradientes Avançados

### Gradiente Animado
```jsx
<motion.div
  animate={{
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
    ease: "linear"
  }}
  style={{
    backgroundSize: '200% 200%',
    backgroundImage: 'linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)'
  }}
/>
```

### Gradiente com Mesh
```jsx
<div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 via-pink-500/20 to-orange-500/20 blur-3xl" />
```

## 🔊 Feedback Sonoro (Opcional)

```jsx
// Criar arquivo: src/utils/sounds.js
export const playSound = (type) => {
  const sounds = {
    success: new Audio('/sounds/success.mp3'),
    click: new Audio('/sounds/click.mp3'),
    error: new Audio('/sounds/error.mp3')
  };
  
  sounds[type]?.play();
};

// Usar nos componentes
onClick={() => {
  playSound('click');
  handleAction();
}}
```

## 🎯 Microinterações Avançadas

### 1. Botão com Ripple Effect

```jsx
const [ripples, setRipples] = useState([]);

const addRipple = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  setRipples([...ripples, { x, y, id: Date.now() }]);
};

<button onClick={addRipple} className="relative overflow-hidden">
  {ripples.map(ripple => (
    <motion.span
      key={ripple.id}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'absolute',
        left: ripple.x,
        top: ripple.y,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.5)'
      }}
    />
  ))}
  Clique aqui
</button>
```

### 2. Shake Animation em Erro

```jsx
const [shake, setShake] = useState(false);

<motion.div
  animate={shake ? {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  } : {}}
>
  {/* Conteúdo */}
</motion.div>
```

### 3. Confetti ao Completar

```jsx
// Instalar: npm install react-confetti

import Confetti from 'react-confetti';

{showConfetti && (
  <Confetti
    width={window.innerWidth}
    height={window.innerHeight}
    recycle={false}
    numberOfPieces={200}
  />
)}
```

## 📊 Indicadores de Performance

### Loading Progress Bar

```jsx
import { motion } from 'framer-motion';

const [progress, setProgress] = useState(0);

<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  className="h-1 bg-blue-500 rounded-full"
/>
```

### Skeleton com Shimmer

```jsx
<div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg">
  <motion.div
    animate={{
      x: ['-100%', '100%']
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }}
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
  />
</div>
```

## 🎨 Modos de Visualização

### Modo Compacto

```jsx
const [viewMode, setViewMode] = useState('normal'); // 'normal' | 'compact'

{viewMode === 'compact' ? (
  <CompactRegistroCard checkin={checkin} />
) : (
  <RegistroCard checkin={checkin} />
)}
```

### Modo Grid

```jsx
<div className={`grid ${
  viewMode === 'grid' 
    ? 'grid-cols-2 lg:grid-cols-3' 
    : 'grid-cols-1'
} gap-4`}>
  {/* Cards */}
</div>
```

## 🔐 Animações Condicionais

### Baseado em Permissões

```jsx
const { user } = useAuthStore();
const canCheckout = user?.role === 'admin' || user?.role === 'manager';

<motion.button
  whileHover={canCheckout ? { scale: 1.05 } : {}}
  className={canCheckout ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
  disabled={!canCheckout}
>
  Check-out
</motion.button>
```

### Baseado em Status

```jsx
const getAnimationVariant = (status) => {
  return {
    completed: { scale: [1, 1.1, 1], transition: { duration: 0.5 } },
    pending: { opacity: [1, 0.5, 1], transition: { repeat: Infinity, duration: 2 } },
    error: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } }
  }[status];
};

<motion.div animate={getAnimationVariant(checkin.status)}>
  {/* Conteúdo */}
</motion.div>
```

## 🎭 Transições de Página

```jsx
// src/App.jsx
import { AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    <Route path="/checkin" element={
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <CheckInPage />
      </motion.div>
    } />
  </Routes>
</AnimatePresence>
```

## 🌟 Easter Eggs

### Konami Code

```jsx
useEffect(() => {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  const handleKeyDown = (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        // Ativar modo especial
        setSpecialMode(true);
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Double Click Secret

```jsx
const [clickCount, setClickCount] = useState(0);

const handleLogoClick = () => {
  setClickCount(prev => prev + 1);
  if (clickCount === 4) {
    // Ativar modo desenvolvedor
    setDevMode(true);
    setClickCount(0);
  }
};
```

---

**Explore, experimente e crie sua própria versão única!** 🚀

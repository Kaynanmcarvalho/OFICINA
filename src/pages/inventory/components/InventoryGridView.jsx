/**
 * InventoryGridView - Apple-like Premium Grid
 * Grid responsivo com auto-fit para cards de produto
 */

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const InventoryGridView = ({ products, onViewProduct, onEditProduct }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      }}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id || product.firestoreId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.02, 0.3) }}
        >
          <ProductCard
            product={product}
            onView={onViewProduct}
            onEdit={onEditProduct}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default InventoryGridView;

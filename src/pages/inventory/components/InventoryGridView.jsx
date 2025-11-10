import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const InventoryGridView = ({ products, onViewProduct, onEditProduct }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id || product.firestoreId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
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

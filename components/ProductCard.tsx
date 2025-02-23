'use client';
import { ProductDocument } from '@/lib/models/Product';
import { motion } from 'framer-motion';

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onClick,
}: {
  product: ProductDocument;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer p-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {product.name}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            {product.fabricant && product.modele && (
              <p>{product.fabricant} {product.modele}</p>
            )}
            {product.reference && (
              <p>Référence: {product.reference}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            Modifier
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {(product.plageMesure || product.annee) && (
          <div className="space-y-2">
            {product.plageMesure && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Plage:</span>
                <span className="font-medium">{product.plageMesure}</span>
              </div>
            )}
            {product.annee && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Année:</span>
                <span className="font-medium">{product.annee}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {product.subProducts?.length > 0 && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <h4 className="text-sm font-medium mb-2">Sous-produits:</h4>
          <div className="space-y-2">
            {product.subProducts.map((sub, index) => (
              <div key={index} className="text-sm text-gray-500 dark:text-gray-400">
                <div className="font-medium">{sub.name}</div>
                {sub.specifications && (
                  <div className="text-xs opacity-75">{sub.specifications}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
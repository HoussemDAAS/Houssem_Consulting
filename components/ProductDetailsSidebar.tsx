"use client";
import { ProductDocument } from "@/lib/models/Product";
import { motion } from "framer-motion";

export default function ProductDetailsSidebar({ product, onClose }: {
  product: ProductDocument;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl p-6 z-50 h-screen"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{product.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300">
          ✕
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">DETAILS TECHNIQUES</h3>
          <div className="space-y-3">
            {product.fabricant && (
              <div>
                <p className="font-medium">{product.fabricant}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fabricant</p>
              </div>
            )}
            {product.modele && (
              <div>
                <p className="font-medium">{product.modele}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Modèle</p>
              </div>
            )}
            {/* Add similar conditional blocks for other fields */}
            <div>
              <p className="font-medium">{product.reference}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Référence</p>
            </div>
            {product.plageMesure && (
              <div>
                <p className="font-medium">{product.plageMesure}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Plage de mesure</p>
              </div>
            )}
            {product.annee && (
              <div>
                <p className="font-medium">{product.annee}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Année</p>
              </div>
            )}
            {product.versionLogiciel && (
              <div>
                <p className="font-medium">{product.versionLogiciel}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Version Logiciel</p>
              </div>
            )}
          </div>
        </div>

        {product.autreInformation && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">INFORMATIONS COMPLÉMENTAIRES</h3>
            <p className="text-gray-700 dark:text-gray-300">{product.autreInformation}</p>
          </div>
        )}

{product.subProducts.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">SOUS-PRODUITS</h3>
            <div className="space-y-2">
              {product.subProducts.map((sub, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{sub.specifications}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
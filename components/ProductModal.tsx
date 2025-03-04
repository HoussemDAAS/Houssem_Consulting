// components/ProductModal.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { ProductDocument } from '@/lib/models/Product';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function ProductModal({
  isOpen,
  onClose,
  product,
  refreshProducts,
}: {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductDocument | null;
  refreshProducts: () => void;
}) {
  const [name, setName] = useState(product?.name || '');
  const [image, setImage] = useState(product?.image || '');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload file
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setImage(result.filename);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = product?._id ? `/api/products/${product._id}` : '/api/products';
    const method = product?._id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image }),
      });

      if (!response.ok) throw new Error('Failed to save product');
      refreshProducts();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setImage(product.image || '');
      setPreview(product.image || null);
    } else {
      setName('');
      setImage('');
      setPreview(null);
    }
  }, [product]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="relative bg-white dark:bg-[#0b0b0b] rounded-xl p-6 w-full max-w-md border border-[#ccbeac]"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
              {product ? 'Edit Product' : 'New Product'}
            </h2>
            <button onClick={onClose} className="text-[#0b0b0b] dark:text-[#ccbeac] hover:opacity-75">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac] mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#ccbeac] focus:ring-2 focus:ring-[#ccbeac] focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">
                Product Image
              </label>
              
              <div 
                className="relative aspect-square bg-white rounded-lg overflow-hidden border-2 border-dashed border-[#ccbeac] cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#ccbeac]">
                    <PhotoIcon className="w-12 h-12 mb-2" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ccbeac] hover:bg-[#ccbeac]/90 text-[#0b0b0b] px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
}
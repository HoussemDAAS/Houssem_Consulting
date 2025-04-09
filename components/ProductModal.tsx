'use client';
import { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { ProductDocument } from '@/lib/models/Product';
import { motion } from 'framer-motion';
import { Image, X } from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [abbreviation, setAbbreviation] = useState(product?.abbreviation || '');
  const [image, setImage] = useState(product?.image || '');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setAbbreviation(product.abbreviation || '');
      setImage(product.image || '');
      setOriginalImage(product.image || '');
      setPreview(product.image || null);
    } else {
      setName('');
      setAbbreviation('');
      setImage('');
      setOriginalImage('');
      setPreview(null);
    }
  }, [product]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) throw new Error('Upload failed');
      
      const { url } = await response.json();
      setImage(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (image) {
      try {
        await fetch(`/api/upload?url=${encodeURIComponent(image)}`, { 
          method: 'DELETE' 
        });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    setImage('');
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = product?._id ? `/api/products/${product._id}` : '/api/products';
      const method = product?._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          abbreviation: abbreviation || undefined, // Omit if empty
          image 
        }),
      });

      if (!response.ok) throw new Error('Failed to save product');
      
      if (originalImage && originalImage !== image) {
        await fetch(`/api/upload?url=${encodeURIComponent(originalImage)}`, { 
          method: 'DELETE' 
        });
      }

      refreshProducts();
      onClose();
      toast.success(product?._id ? 'Product updated' : 'Product created');
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
        <div className="fixed inset-0 bg-black/30" />

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="relative bg-white dark:bg-[#0b0b0b] rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md border border-[#ccbeac] mx-2"
        >
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#0b0b0b] dark:text-[#f9f9f4]">
              {product ? 'Edit Product' : 'New Product'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-[#0b0b0b] dark:text-[#ccbeac] hover:opacity-75 p-1"
              disabled={loading}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac] mb-1 sm:mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-[#ccbeac] focus:ring-2 focus:ring-[#ccbeac] focus:border-transparent text-sm sm:text-base"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac] mb-1 sm:mb-2">
                Abbreviation (optional)
              </label>
              <input
                type="text"
                value={abbreviation}
                onChange={(e) => {
                  // Auto-uppercase and limit to 10 characters
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                  setAbbreviation(value.substring(0, 10));
                }}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-[#ccbeac] focus:ring-2 focus:ring-[#ccbeac] focus:border-transparent text-sm sm:text-base"
                maxLength={10}
                disabled={loading}
                placeholder="e.g., CS for Colonne de siège"
              />
              <p className="text-xs text-gray-500 mt-1">
                {abbreviation.length}/10 characters (letters and numbers only)
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <label className="block text-sm font-medium text-[#0b0b0b] dark:text-[#ccbeac]">
                Product Image
              </label>
              
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden border-2 border-dashed border-[#ccbeac]">
                {preview ? (
                  <>
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-contain p-2 sm:p-4"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                      disabled={loading}
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </>
                ) : (
                  <div 
                    className="w-full h-full flex flex-col items-center justify-center text-[#ccbeac] cursor-pointer p-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2" />
                    <span className="text-xs sm:text-sm text-center">Click to upload image</span>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ccbeac] hover:bg-[#ccbeac]/90 text-[#0b0b0b] px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <span>{product?._id ? 'Update Product' : 'Create Product'}</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </Dialog>
  );
}
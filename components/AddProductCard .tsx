'use client';

export default function AddProductCard() {
  return (
    <div className="p-5">
      <button 
        className="w-full bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 transition-colors relative group h-32"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-blue-400 transform group-hover:rotate-90 transition-transform"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <span className="sr-only">Add product</span>
      </button>
    </div>
  );
}
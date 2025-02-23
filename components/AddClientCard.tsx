// AddClientCard.tsx
'use client';

export default function AddClientCard({ status, onClick }: { 
  status: string; 
  onClick: () => void 
}) {
  return (
    <div className="p-5 min-w-[300px]">
      <button 
        onClick={onClick}
        className="w-full bg-[#f9f9f4] dark:bg-[#0b0b0b] rounded-xl border-2 border-dashed border-[#ccbeac] hover:border-[#0b0b0b] dark:hover:border-[#f9f9f4] transition-colors relative group h-32"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#ccbeac]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-[#ccbeac] transform group-hover:rotate-90 transition-transform"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <span className="sr-only">Add {status} client</span>
      </button>
    </div>
  );
}
'use client';
import { forwardRef } from 'react';

interface PdfContentProps {
  filters: {
    countries: string[];
    cities: string[];
    manufacturers: string[];
    products: string[];
    secteurs: string[];
  };
  children: React.ReactNode;
}

const PdfContent = forwardRef<HTMLDivElement, PdfContentProps>(({ filters, children }, ref) => {
  const currentDate = new Date().toLocaleString();

  return (
    <div ref={ref} className="pdf-template">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-4">Houssem's Consulting</h1>
        <img 
          src="/logo.jpeg" 
          alt="Consulting Logo" 
          className="h-20 mx-auto mb-4"
          onLoad={(e) => console.log('Logo loaded')} // Add load listener
          onError={(e) => console.error('Logo failed to load')}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-lg font-semibold mb-2">Selected Filters</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value.join(', ') || 'All'}
            </div>
          ))}
        </div>
      </div>

      {/* Chart Content - Ensure proper sizing */}
      <div className="pdf-chart-container" style={{ height: '400px' }}>
        {children}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 right-0 text-sm p-4">
        Generated: {currentDate}
      </div>
    </div>
  );
});

PdfContent.displayName = 'PdfContent';
export const generatePdf = async (element: HTMLDivElement) => {
    try {
      // Wait for all assets to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Force visibility of all elements in the clone
          const pdfEl = clonedDoc.querySelector('.pdf-template');
          if (pdfEl) {
            pdfEl.style.position = 'static';
            pdfEl.style.left = '0';
            pdfEl.style.top = '0';
          }
        }
      });
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // 210mm - 20mm margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('report.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please check console for details.');
    }
  };
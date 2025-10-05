import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(invoiceNumber: string) {
  const element = document.getElementById('invoice-content');
  if (!element) {
    throw new Error('Invoice content not found');
  }

  // Capture the invoice as canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/png');
  
  // A4 dimensions in mm
  const pdfWidth = 210;
  const pdfHeight = 297;
  
  // Calculate scaling to fit content
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  
  const pdf = new jsPDF({
    orientation: imgHeight > pdfWidth ? 'portrait' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add image to PDF
  let position = 0;
  let heightLeft = imgHeight;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Add new pages if content exceeds one page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  // Save the PDF
  pdf.save(`Invoice-${invoiceNumber}.pdf`);
}

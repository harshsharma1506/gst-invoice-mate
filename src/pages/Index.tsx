import { useState } from "react";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { generatePDF } from "@/utils/pdfGenerator";
import { Button } from "@/components/ui/button";
import { FileText, Download, Home } from "lucide-react";
import { toast } from "sonner";

interface InvoiceData {
  supplier: {
    name: string;
    businessName: string;
    address: string;
    state: string;
    gstin: string;
    email: string;
    phone: string;
  };
  recipient: {
    name: string;
    address: string;
    state: string;
    gstin: string;
    email: string;
    phone: string;
  };
  invoice: {
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
  };
  items: Array<{
    description: string;
    hsnSac: string;
    quantity: number;
    rate: number;
    taxPercent: number;
    discount: number;
  }>;
  payment: {
    upiId: string;
    payeeName: string;
  };
}

const Index = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (data: InvoiceData) => {
    setInvoiceData(data);
    toast.success("Invoice preview generated! Review and download as PDF.");
  };

  const handleDownloadPDF = async () => {
    if (!invoiceData) return;
    
    setIsGenerating(true);
    try {
      await generatePDF(invoiceData.invoice.invoiceNumber);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setInvoiceData(null);
    toast.info("Form reset. Create a new invoice.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">GST Invoice Generator</h1>
              <p className="text-sm text-primary-foreground/80">
                For Indian Freelancers - Generate GST-compliant invoices with UPI QR codes
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!invoiceData ? (
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">How to use:</h2>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Fill in your supplier details (your business information)</li>
                <li>Enter recipient/client details</li>
                <li>Add invoice items with HSN/SAC codes and tax rates</li>
                <li>Provide UPI payment details for QR code generation</li>
                <li>Click "Generate Invoice PDF" to preview</li>
                <li>Download the GST-compliant PDF with embedded UPI QR code</li>
              </ol>
            </div>
            <InvoiceForm onGenerate={handleGenerate} />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold text-primary">Invoice Preview</h2>
              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  Create New Invoice
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isGenerating ? "Generating..." : "Download PDF"}
                </Button>
              </div>
            </div>
            
            <InvoicePreview data={invoiceData} />
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-900 mb-2">✓ Invoice Generated Successfully</h3>
              <p className="text-sm text-emerald-800">
                Your GST-compliant invoice is ready. The UPI QR code can be scanned with any UPI app (GPay, PhonePe, Paytm) for instant payment of ₹
                {invoiceData.items
                  .reduce((total, item) => {
                    const subtotal = item.quantity * item.rate - item.discount;
                    const tax = (subtotal * item.taxPercent) / 100;
                    return total + subtotal + tax;
                  }, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>GST Invoice Generator for Indian Freelancers</p>
          <p className="mt-1">
            Generate GST-compliant invoices with UPI payment QR codes • No backend required • Works offline
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

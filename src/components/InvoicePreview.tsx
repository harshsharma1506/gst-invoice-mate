import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Card } from "@/components/ui/card";

interface InvoiceItem {
  description: string;
  hsnSac: string;
  quantity: number;
  rate: number;
  taxPercent: number;
  discount: number;
}

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
  items: InvoiceItem[];
  payment: {
    upiId: string;
    payeeName: string;
  };
}

interface InvoicePreviewProps {
  data: InvoiceData;
}

function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const convert = (n: number): string => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let words = convert(rupees) + ' Rupees';
  if (paise > 0) {
    words += ' and ' + convert(paise) + ' Paise';
  }
  return words + ' Only';
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const invoiceRef = useRef<HTMLDivElement>(null);

  const isSameState = data.supplier.state === data.recipient.state;

  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.rate - item.discount;
    const taxAmount = (subtotal * item.taxPercent) / 100;
    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount
    };
  };

  const totals = data.items.reduce(
    (acc, item) => {
      const itemCalc = calculateItemTotal(item);
      return {
        subtotal: acc.subtotal + itemCalc.subtotal,
        tax: acc.tax + itemCalc.taxAmount,
        total: acc.total + itemCalc.total
      };
    },
    { subtotal: 0, tax: 0, total: 0 }
  );

  useEffect(() => {
    const generateQR = async () => {
      const upiLink = `upi://pay?pa=${encodeURIComponent(data.payment.upiId)}&pn=${encodeURIComponent(
        data.payment.payeeName
      )}&tn=Invoice%20${encodeURIComponent(data.invoice.invoiceNumber)}&am=${totals.total.toFixed(
        2
      )}&cu=INR`;
      
      try {
        const qr = await QRCode.toDataURL(upiLink, { width: 200, margin: 1 });
        setQrCode(qr);
      } catch (err) {
        console.error("QR Code generation failed:", err);
      }
    };

    generateQR();
  }, [data, totals.total]);

  return (
    <Card className="p-0 overflow-hidden">
      <div
        ref={invoiceRef}
        id="invoice-content"
        className="bg-white text-gray-900 p-8 max-w-[210mm] mx-auto"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="border-b-4 border-blue-600 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">TAX INVOICE</h1>
              <p className="text-sm text-gray-600">GST Compliant Invoice</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">Invoice #</p>
              <p className="text-xl font-bold text-blue-600">{data.invoice.invoiceNumber}</p>
              <p className="text-sm text-gray-600 mt-2">
                Date: {new Date(data.invoice.invoiceDate).toLocaleDateString('en-IN')}
              </p>
              {data.invoice.dueDate && (
                <p className="text-sm text-gray-600">
                  Due: {new Date(data.invoice.dueDate).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="text-sm font-bold text-gray-700 mb-2">FROM (Supplier)</h3>
            <p className="font-semibold text-gray-900">{data.supplier.businessName}</p>
            <p className="text-sm text-gray-700">{data.supplier.name}</p>
            <p className="text-sm text-gray-600">{data.supplier.address}</p>
            <p className="text-sm text-gray-600">{data.supplier.state}</p>
            <p className="text-sm font-medium text-gray-700 mt-2">GSTIN: {data.supplier.gstin}</p>
            <p className="text-sm text-gray-600">{data.supplier.email}</p>
            <p className="text-sm text-gray-600">{data.supplier.phone}</p>
          </div>

          <div className="border-l-4 border-gray-400 pl-4">
            <h3 className="text-sm font-bold text-gray-700 mb-2">TO (Recipient)</h3>
            <p className="font-semibold text-gray-900">{data.recipient.name}</p>
            <p className="text-sm text-gray-600">{data.recipient.address}</p>
            <p className="text-sm text-gray-600">{data.recipient.state}</p>
            <p className="text-sm font-medium text-gray-700 mt-2">GSTIN: {data.recipient.gstin}</p>
            <p className="text-sm text-gray-600">{data.recipient.email}</p>
            <p className="text-sm text-gray-600">{data.recipient.phone}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-blue-700 p-2 text-left">Description</th>
                <th className="border border-blue-700 p-2 text-center">HSN/SAC</th>
                <th className="border border-blue-700 p-2 text-right">Qty</th>
                <th className="border border-blue-700 p-2 text-right">Rate</th>
                <th className="border border-blue-700 p-2 text-right">Discount</th>
                <th className="border border-blue-700 p-2 text-right">Taxable</th>
                <th className="border border-blue-700 p-2 text-right">Tax %</th>
                <th className="border border-blue-700 p-2 text-right">Tax Amt</th>
                <th className="border border-blue-700 p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => {
                const calc = calculateItemTotal(item);
                return (
                  <tr key={index} className="border-b">
                    <td className="border border-gray-300 p-2">{item.description}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.hsnSac}</td>
                    <td className="border border-gray-300 p-2 text-right">{item.quantity}</td>
                    <td className="border border-gray-300 p-2 text-right">₹{item.rate.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">₹{item.discount.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">₹{calc.subtotal.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">{item.taxPercent}%</td>
                    <td className="border border-gray-300 p-2 text-right">₹{calc.taxAmount.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right font-semibold">
                      ₹{calc.total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tax Summary and Total */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-bold text-gray-700 mb-2">Tax Breakdown</h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-300">
              {isSameState ? (
                <>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CGST ({(data.items[0]?.taxPercent || 18) / 2}%)</span>
                    <span>₹{(totals.tax / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SGST ({(data.items[0]?.taxPercent || 18) / 2}%)</span>
                    <span>₹{(totals.tax / 2).toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-sm">
                  <span>IGST ({data.items[0]?.taxPercent || 18}%)</span>
                  <span>₹{totals.tax.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-blue-50 p-4 rounded border-2 border-blue-200">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold">₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-700">Total Tax:</span>
                <span className="font-semibold">₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t-2 border-blue-300">
                <span>Grand Total:</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 italic">
              {numberToWords(totals.total)}
            </p>
          </div>
        </div>

        {/* Payment Section */}
        <div className="border-t-2 border-gray-300 pt-6 mt-6">
          <h3 className="font-bold text-gray-700 mb-4">Payment Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm mb-1">
                <span className="font-semibold">UPI ID:</span> {data.payment.upiId}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Payee:</span> {data.payment.payeeName}
              </p>
              <p className="text-xs text-gray-600 mt-3">
                Scan the QR code with any UPI app (GPay, PhonePe, Paytm, etc.) to pay instantly.
              </p>
            </div>
            {qrCode && (
              <div className="flex flex-col items-center">
                <img src={qrCode} alt="UPI QR Code" className="w-40 h-40 border-2 border-gray-300" />
                <p className="text-xs text-center text-gray-600 mt-2">UPI Payment QR Code</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700 mb-6">Authorized Signature</p>
            <div className="border-t border-gray-400 w-48 ml-auto mt-2"></div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-6">
            This is a computer-generated invoice. Thank you for your business!
          </p>
        </div>
      </div>
    </Card>
  );
}

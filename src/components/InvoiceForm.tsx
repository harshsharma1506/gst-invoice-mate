import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InvoiceItem {
  description: string;
  hsnSac: string;
  quantity: number;
  rate: number;
  taxPercent: number;
  discount: number;
}

interface SupplierDetails {
  name: string;
  businessName: string;
  address: string;
  state: string;
  gstin: string;
  email: string;
  phone: string;
}

interface RecipientDetails {
  name: string;
  address: string;
  state: string;
  gstin: string;
  email: string;
  phone: string;
}

interface InvoiceDetails {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
}

interface PaymentInfo {
  upiId: string;
  payeeName: string;
}

interface InvoiceFormProps {
  onGenerate: (data: {
    supplier: SupplierDetails;
    recipient: RecipientDetails;
    invoice: InvoiceDetails;
    items: InvoiceItem[];
    payment: PaymentInfo;
  }) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export function InvoiceForm({ onGenerate }: InvoiceFormProps) {
  const [supplier, setSupplier] = useState<SupplierDetails>({
    name: "Harsh Sharma",
    businessName: "Harsh Freelance Services",
    address: "Bangalore, Karnataka",
    state: "Karnataka",
    gstin: "29ABCDE1234F2Z5",
    email: "harsh@example.com",
    phone: "+91 9876543210"
  });

  const [recipient, setRecipient] = useState<RecipientDetails>({
    name: "Client Co",
    address: "Mumbai, Maharashtra",
    state: "Maharashtra",
    gstin: "27PQRST6789L1Z2",
    email: "client@example.com",
    phone: "+91 9876543211"
  });

  const [invoice, setInvoice] = useState<InvoiceDetails>({
    invoiceNumber: "INV-2025-001",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: ""
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: "Software Development (20 hrs)",
      hsnSac: "998313",
      quantity: 20,
      rate: 1000,
      taxPercent: 18,
      discount: 0
    }
  ]);

  const [payment, setPayment] = useState<PaymentInfo>({
    upiId: "harsh@okaxis",
    payeeName: "Harsh Sharma"
  });

  const addItem = () => {
    setItems([...items, {
      description: "",
      hsnSac: "",
      quantity: 1,
      rate: 0,
      taxPercent: 18,
      discount: 0
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ supplier, recipient, invoice, items, payment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Supplier Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="supplierName">Name</Label>
            <Input
              id="supplierName"
              value={supplier.name}
              onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="supplierBusiness">Business Name</Label>
            <Input
              id="supplierBusiness"
              value={supplier.businessName}
              onChange={(e) => setSupplier({ ...supplier, businessName: e.target.value })}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="supplierAddress">Address</Label>
            <Input
              id="supplierAddress"
              value={supplier.address}
              onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="supplierState">State</Label>
            <Select value={supplier.state} onValueChange={(value) => setSupplier({ ...supplier, state: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="supplierGSTIN">GSTIN</Label>
            <Input
              id="supplierGSTIN"
              value={supplier.gstin}
              onChange={(e) => setSupplier({ ...supplier, gstin: e.target.value })}
              placeholder="29ABCDE1234F2Z5"
              required
            />
          </div>
          <div>
            <Label htmlFor="supplierEmail">Email</Label>
            <Input
              id="supplierEmail"
              type="email"
              value={supplier.email}
              onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="supplierPhone">Phone</Label>
            <Input
              id="supplierPhone"
              value={supplier.phone}
              onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Recipient Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recipientName">Name</Label>
            <Input
              id="recipientName"
              value={recipient.name}
              onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="recipientState">State</Label>
            <Select value={recipient.state} onValueChange={(value) => setRecipient({ ...recipient, state: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="recipientAddress">Address</Label>
            <Input
              id="recipientAddress"
              value={recipient.address}
              onChange={(e) => setRecipient({ ...recipient, address: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="recipientGSTIN">GSTIN</Label>
            <Input
              id="recipientGSTIN"
              value={recipient.gstin}
              onChange={(e) => setRecipient({ ...recipient, gstin: e.target.value })}
              placeholder="27PQRST6789L1Z2"
              required
            />
          </div>
          <div>
            <Label htmlFor="recipientEmail">Email</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={recipient.email}
              onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="recipientPhone">Phone</Label>
            <Input
              id="recipientPhone"
              value={recipient.phone}
              onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input
              id="invoiceDate"
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Input
              id="dueDate"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-primary">Items</CardTitle>
          <Button type="button" onClick={addItem} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Item {index + 1}</h4>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>HSN/SAC</Label>
                  <Input
                    value={item.hsnSac}
                    onChange={(e) => updateItem(index, 'hsnSac', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label>Rate (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label>Tax (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={item.taxPercent}
                    onChange={(e) => updateItem(index, 'taxPercent', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label>Discount (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.discount}
                    onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              value={payment.upiId}
              onChange={(e) => setPayment({ ...payment, upiId: e.target.value })}
              placeholder="yourname@okaxis"
              required
            />
          </div>
          <div>
            <Label htmlFor="payeeName">Payee Name</Label>
            <Input
              id="payeeName"
              value={payment.payeeName}
              onChange={(e) => setPayment({ ...payment, payeeName: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="gap-2">
          Generate Invoice PDF
        </Button>
      </div>
    </form>
  );
}

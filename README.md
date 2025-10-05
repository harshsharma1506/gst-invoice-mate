# 🇮🇳 GST Invoice Generator for Freelancers

A modern, browser-based **GST Invoice Generator** for Indian freelancers — built with  
**Vite + React + TypeScript + Tailwind CSS + shadcn-ui**.

It generates GST-compliant invoices with **auto tax calculation (CGST/SGST/IGST)**,  
and embeds a **GPay/UPI payment QR code** directly into the downloadable **PDF**.

---

## ✨ Features

- 🧾 **GST-Compliant PDF Invoice**
  - Supplier & Recipient details
  - HSN/SAC support
  - Automatic CGST/SGST/IGST calculation
  - Invoice number, date, and totals
  - Amount in words

- 💳 **Integrated UPI / GPay QR**
  - Generates a valid `upi://pay` deep link
  - Creates a QR that can be scanned in any UPI app
  - Embeds it inside the PDF near the payment section

- ⚡ **Modern Frontend Stack**
  - **Vite** for lightning-fast builds
  - **React + TypeScript** for maintainable UI
  - **Tailwind CSS + shadcn-ui** for sleek components
  - 100% client-side (no backend required)

- 🧠 **Smart UI**
  - Add or remove invoice items dynamically
  - Real-time tax and total calculations
  - Works offline after loading once

---

## 🚀 Live Demo

**[🌐 View on Vercel →](https://gst-invoice-mate-khzw9nncw-harshs-projects-0f146866.vercel.app/)**  
(Replace the link above with your actual deployment URL.)

---

## 🛠️ Tech Stack

| Layer | Tool |
|-------|------|
| Build Tool | [Vite](https://vitejs.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Framework | [React](https://react.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) |
| PDF Generator | [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) / [jsPDF](https://github.com/parallax/jsPDF) |
| QR Generator | [qrcodejs](https://github.com/davidshimjs/qrcodejs) |

---

## ⚙️ Setup & Development

### 1. Clone the repository
```bash
https://github.com/harshsharma1506/gst-invoice-mate.git

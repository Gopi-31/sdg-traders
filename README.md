# SDG Traders - Construction Materials Commercial Website

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Gopi-31/sdg-traders)

🌐 **Live Website (GitHub Pages):** [https://gopi-31.github.io/sdg-traders/](https://gopi-31.github.io/sdg-traders/)  
🚀 **Deploy on Vercel:** [Click here to 1-Click Deploy on Vercel](https://vercel.com/new/clone?repository-url=https://github.com/Gopi-31/sdg-traders)

A modern, high-performance, responsive e-commerce and quotation platform designed specifically for **SDG Traders**, supplying verified construction materials:

- **M-SAND** (Manufactured Sand)
- **P-SAND** (Plastering Sand)
- **STEEL BARS** (Fe-550D TMT Rebars)
- **CEMENTS** (53-Grade / PPC)
- **BRICKS** (Red Wirecut / High Density Fly Ash)
- **GRAVEL** (20mm & 40mm Blue Metal Coarse Aggregate)

---

## 🌟 Key Features

1. **"Welcome to sdg traders" Entry Experience**:
   - Animated welcome banner and modal greeting customers on page entry.
   - Highlights official direct supply and weighbridge guarantees.

2. **Transparent Price Allotment & Real-time Calculator**:
   - Each material has an allotted market price (per Ton, Bag, 1000 Pieces).
   - Real-time subtotal calculator on each material card as quantity changes (`+`/`−` or custom entry).

3. **Construction Material Estimator**:
   - Integrated site calculation engine for:
     - RCC Concrete Slab (Mix 1:1.5:3)
     - Wall Plastering (12mm single coat, 1:4 mix)
     - Brick Wall Masonry (9-inch brickwork)
   - Automatically calculates the required materials and costs for any square footage.
   - One-click **"Add All Estimated Materials to Order"** button.

4. **Order Confirmation & Checkout Flow**:
   - Customer enters Delivery Site Address, Name, Mobile Number, and preferred delivery date.
   - Direct transition to the **Dedicated Payment Page**.

5. **Payment Page & Official Contact Details**:
   - Prominently displays:
     - 📞 **Phone:** `6379505684` (Click-to-call link)
     - ✉️ **Email:** `gopisenthil42@gmail.com` (Click-to-email link)
   - **Payment Modes**:
     - **UPI Payment**: Displays QR code, UPI ID (`6379505684@upi`), and exact total payable amount with 1-click copy buttons.
     - **Direct Bank Transfer**: Bank details with copyable Account Number & IFSC code.
     - **Pay on Site Delivery (COD)**: Computerized weighbridge slip verification upon unloading.
   - **Direct WhatsApp Order**:
     - Pre-formats the entire order (materials, quantities, total amount, site address) and launches WhatsApp directly to `+91 6379505684`.
   - **Printable Proforma Invoice**:
     - Click **"Download / Print Order Invoice"** to print or save a clean, professional PDF invoice with SDG Traders branding.

---

## 🚀 How to Run the Website

### Option 1: Double-click to Open
Simply double-click `index.html` in Finder or your file manager. It opens immediately in Chrome, Safari, Edge, or Firefox without any installation.

### Option 2: Run a Local Web Server
You can run a local server in Terminal from the project directory:

```bash
cd /Users/gopi/.gemini/antigravity/scratch/sdg-traders
python3 -m http.server 8080
```
Then visit: [http://localhost:8080](http://localhost:8080) in your browser.

---

## ⚙️ How to Customize Prices & Details

All materials and rates are configured in `app.js` under `MATERIAL_CATALOG`:

```javascript
{
  id: 'msand',
  name: 'M-SAND (Manufactured Sand)',
  price: 1650, // Change price here (₹ / Ton)
  unit: 'Ton',
  ...
}
```

To update phone number or email:
- Search and replace `6379505684` and `gopisenthil42@gmail.com` across `index.html` and `app.js`.

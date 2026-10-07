/**
 * SDG TRADERS - Construction Materials Web Application
 * Handles Material Catalog, Pricing Calculations, Estimator, Cart, and Payment flow.
 * Official Contacts: Phone: 6379505684 | Email: gopisenthil42@gmail.com
 */

// 1. Master Material Catalog with Default Allotted Prices & Units
const MATERIAL_CATALOG = [
  {
    id: 'msand',
    name: 'M-SAND (Manufactured Sand)',
    category: 'sand',
    price: 1650, // Price in INR
    unit: 'Ton',
    spec: 'IS:383 Zone II Grade',
    desc: 'High-strength washed manufactured sand engineered for RCC slabs, beams, columns, and structural concrete.',
    image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=700&q=80',
    defaultQty: 5,
    minQty: 1,
    step: 1
  },
  {
    id: 'psand',
    name: 'P-SAND (Plastering Sand)',
    category: 'sand',
    price: 1850,
    unit: 'Ton',
    spec: 'Triple Washed < 2.36mm',
    desc: 'Super-fine grain sand with zero silt & micro dust. Prevents wall cracks and provides ultra-smooth interior & exterior plaster finish.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
    defaultQty: 3,
    minQty: 1,
    step: 1
  },
  {
    id: 'steel',
    name: 'STEEL BARS (TMT Rebars)',
    category: 'steel',
    price: 68000,
    unit: 'Ton',
    spec: 'Fe-550D High Ductility',
    desc: 'Primary grade earthquake-resistant Thermo-Mechanically Treated steel rebars. Available in 8mm, 10mm, 12mm, 16mm, 20mm & 25mm bundles.',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80',
    defaultQty: 1,
    minQty: 0.5,
    step: 0.5
  },
  {
    id: 'cement',
    name: 'CEMENTS (53-Grade / PPC)',
    category: 'cement',
    price: 420,
    unit: 'Bag (50 Kg)',
    spec: 'IS 12269 Certified Fresh Stock',
    desc: 'Freshly packed 53-Grade OPC and Portland Pozzolana Cement bags from leading certified manufacturers (UltraTech, Ramco, Coromandel).',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=700&q=80',
    defaultQty: 50,
    minQty: 10,
    step: 5
  },
  {
    id: 'bricks',
    name: 'BRICKS (Red Wirecut / Fly Ash)',
    category: 'bricks',
    price: 11000,
    unit: '1,000 Pieces',
    spec: 'Grade-A Kiln Burnt (9"x4.25"x3")',
    desc: 'Machine-cut dense red clay bricks and certified high-strength fly ash blocks with sharp edges, high compressive load capacity, and low water absorption.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=700&q=80',
    defaultQty: 3,
    minQty: 1,
    step: 1
  },
  {
    id: 'gravel',
    name: 'GRAVEL (Coarse Aggregate / Jelly)',
    category: 'sand',
    price: 1400,
    unit: 'Ton',
    spec: '20mm & 40mm Blue Metal Granite',
    desc: 'Triple-screened hard granite blue metal coarse aggregate. Angular cubic shape ensures maximum interlocking bond in RCC concrete mix.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80',
    defaultQty: 5,
    minQty: 1,
    step: 1
  }
];

// App State
let cart = [];
let currentFilter = 'all';
let confirmedOrderData = null;

// Currency Formatter for Indian Rupees
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Format numbers without currency symbol
function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num);
}

// Load cart from LocalStorage if available
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('sdg_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('LocalStorage not accessible', e);
  }
}

// Save cart to LocalStorage
function saveCartToStorage() {
  try {
    localStorage.setItem('sdg_cart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Could not save to LocalStorage', e);
  }
}

// 2. Render Materials Grid
function renderMaterials() {
  const container = document.getElementById('materialsGrid');
  if (!container) return;

  const filtered = currentFilter === 'all'
    ? MATERIAL_CATALOG
    : MATERIAL_CATALOG.filter(m => m.category === currentFilter);

  container.innerHTML = filtered.map(item => {
    // Check if item is already in cart to reflect current quantity
    const existing = cart.find(c => c.id === item.id);
    const initialQty = existing ? existing.quantity : item.defaultQty;
    const initialTotal = initialQty * item.price;

    return `
      <div class="material-card" data-id="${item.id}" data-category="${item.category}">
        <div class="card-image-wrap">
          <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=700&q=80'" />
          <span class="material-badge">${item.category.toUpperCase()}</span>
          <span class="verified-stamp"><i class="fa-solid fa-check"></i> IS Certified</span>
        </div>
        <div class="card-body">
          <div class="card-header-row">
            <h3 class="material-name">${item.name}</h3>
            <span class="material-spec">${item.spec}</span>
          </div>
          <p class="material-desc">${item.desc}</p>
          
          <div class="pricing-box">
            <div class="price-main">
              <span class="unit-rate">${formatINR(item.price)}</span>
              <span class="unit-label">/ ${item.unit}</span>
            </div>
            <span class="price-extra-note">Includes loading & computerized weighbridge verification</span>
          </div>

          <div class="order-controls-box">
            <div class="qty-control-row">
              <span class="qty-label">Quantity:</span>
              <div class="qty-counter">
                <button type="button" class="btn-qty" onclick="adjustCardQty('${item.id}', -${item.step})">−</button>
                <input 
                  type="number" 
                  id="qty-input-${item.id}" 
                  class="qty-input" 
                  value="${initialQty}" 
                  min="${item.minQty}" 
                  step="${item.step}" 
                  oninput="handleQtyInputChange('${item.id}')"
                />
                <button type="button" class="btn-qty" onclick="adjustCardQty('${item.id}', ${item.step})">+</button>
              </div>
            </div>

            <div class="calculated-item-total">
              <span>Allotted Price Total:</span>
              <span id="subtotal-${item.id}" class="calc-total-val">${formatINR(initialTotal)}</span>
            </div>

            <button type="button" class="btn-add-material" onclick="addToCartFromCard('${item.id}')">
              <i class="fa-solid fa-cart-plus"></i> ${existing ? 'Update In Order' : 'Add to Order'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Adjust quantity via +/- buttons on material card
window.adjustCardQty = function(id, delta) {
  const item = MATERIAL_CATALOG.find(m => m.id === id);
  if (!item) return;

  const input = document.getElementById(`qty-input-${id}`);
  if (!input) return;

  let currentVal = parseFloat(input.value) || 0;
  let newVal = Math.max(item.minQty, currentVal + delta);
  if (item.step < 1) {
    newVal = Math.round(newVal * 10) / 10;
  }
  input.value = newVal;
  updateCardSubtotal(id, newVal, item.price);
};

// Handle manual typed input change
window.handleQtyInputChange = function(id) {
  const item = MATERIAL_CATALOG.find(m => m.id === id);
  if (!item) return;

  const input = document.getElementById(`qty-input-${id}`);
  if (!input) return;

  let val = parseFloat(input.value);
  if (isNaN(val) || val < item.minQty) {
    val = item.minQty;
  }
  updateCardSubtotal(id, val, item.price);
};

function updateCardSubtotal(id, qty, unitPrice) {
  const subtotalEl = document.getElementById(`subtotal-${id}`);
  if (subtotalEl) {
    const total = qty * unitPrice;
    subtotalEl.innerText = formatINR(total);
  }
}

// Add material to cart from card
window.addToCartFromCard = function(id) {
  const item = MATERIAL_CATALOG.find(m => m.id === id);
  if (!item) return;

  const input = document.getElementById(`qty-input-${id}`);
  const qty = parseFloat(input.value) || item.minQty;

  const existingIndex = cart.findIndex(c => c.id === id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity = qty;
    showToast(`Updated ${item.name} quantity to ${qty} ${item.unit}`);
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      unit: item.unit,
      quantity: qty
    });
    showToast(`Added ${qty} ${item.unit} of ${item.name} to order`);
  }

  saveCartToStorage();
  updateCartUI();
  renderMaterials(); // Refresh button states
};

// 3. Cart State & Drawer Controls
function updateCartUI() {
  const badge = document.getElementById('cartCountBadge');
  const itemsContainer = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const grandTotalEl = document.getElementById('cartGrandTotal');

  const totalItemCount = cart.length;
  if (badge) badge.innerText = totalItemCount;

  const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (subtotalEl) subtotalEl.innerText = formatINR(subtotalAmount);
  if (grandTotalEl) grandTotalEl.innerText = formatINR(subtotalAmount);

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-cart-msg">
        <i class="fa-solid fa-cart-flatbed"></i>
        <p>Your order is currently empty.</p>
        <small>Select materials above to calculate total amount.</small>
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = cart.map(item => {
    const total = item.price * item.quantity;
    return `
      <div class="cart-item-card">
        <div class="cart-item-top">
          <div class="cart-item-info">
            <h5>${item.name}</h5>
            <span class="cart-item-rate">${formatINR(item.price)} per ${item.unit}</span>
          </div>
          <button class="btn-remove-item" onclick="removeFromCart('${item.id}')" title="Remove Item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div class="cart-item-bottom">
          <div class="cart-mini-qty">
            <button onclick="changeCartQty('${item.id}', -1)">−</button>
            <span>${item.quantity} ${item.unit}</span>
            <button onclick="changeCartQty('${item.id}', 1)">+</button>
          </div>
          <span class="cart-item-subtotal">${formatINR(total)}</span>
        </div>
      </div>
    `;
  }).join('');
}

window.removeFromCart = function(id) {
  cart = cart.filter(c => c.id !== id);
  saveCartToStorage();
  updateCartUI();
  renderMaterials();
  showToast('Item removed from order');
};

window.changeCartQty = function(id, delta) {
  const cartItem = cart.find(c => c.id === id);
  const catalogItem = MATERIAL_CATALOG.find(m => m.id === id);
  if (!cartItem || !catalogItem) return;

  const step = catalogItem.step || 1;
  const newQty = cartItem.quantity + (delta * step);

  if (newQty <= 0) {
    removeFromCart(id);
    return;
  }

  cartItem.quantity = Math.max(catalogItem.minQty, newQty);
  if (catalogItem.step < 1) {
    cartItem.quantity = Math.round(cartItem.quantity * 10) / 10;
  }

  saveCartToStorage();
  updateCartUI();
  renderMaterials();
};

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) {
    if (open) {
      drawer.classList.add('active');
    } else {
      drawer.classList.remove('active');
    }
  }
}

// 4. Construction Quantity Estimator Engine
const ESTIMATION_RULES = {
  // Concrete RCC Slab per 1000 sq ft (assuming standard 5 inch / 125mm slab thickness)
  concrete: (area) => {
    const factor = area / 1000;
    return [
      { id: 'cement', qty: Math.round(85 * factor), unit: 'Bag (50 Kg)' },
      { id: 'msand', qty: Math.round(8.5 * factor * 10) / 10, unit: 'Ton' },
      { id: 'gravel', qty: Math.round(12.5 * factor * 10) / 10, unit: 'Ton' },
      { id: 'steel', qty: Math.round(1.2 * factor * 10) / 10, unit: 'Ton' }
    ];
  },
  // Wall Plastering per 1000 sq ft (12mm single coat, 1:4 mix)
  plastering: (area) => {
    const factor = area / 1000;
    return [
      { id: 'psand', qty: Math.round(2.8 * factor * 10) / 10, unit: 'Ton' },
      { id: 'cement', qty: Math.round(15 * factor), unit: 'Bag (50 Kg)' }
    ];
  },
  // Brick Masonry per 1000 sq ft (9-inch thick standard wall)
  brickwork: (area) => {
    const factor = area / 1000;
    return [
      { id: 'bricks', qty: Math.round(9 * factor), unit: '1,000 Pieces' }, // 9,000 bricks
      { id: 'msand', qty: Math.round(4.2 * factor * 10) / 10, unit: 'Ton' },
      { id: 'cement', qty: Math.round(22 * factor), unit: 'Bag (50 Kg)' }
    ];
  }
};

let currentEstimations = [];

function runEstimator() {
  const typeSelect = document.getElementById('calcWorkType');
  const areaInput = document.getElementById('calcArea');
  const resultsContainer = document.getElementById('calculatorResults');
  const areaLabel = document.getElementById('estimatedAreaLabel');

  if (!typeSelect || !areaInput || !resultsContainer) return;

  const workType = typeSelect.value;
  const area = parseFloat(areaInput.value) || 1000;

  if (areaLabel) {
    areaLabel.innerText = `${formatNumber(area)} Sq Ft`;
  }

  const formula = ESTIMATION_RULES[workType] || ESTIMATION_RULES.concrete;
  const rawItems = formula(area);

  let totalCost = 0;
  currentEstimations = rawItems.map(raw => {
    const material = MATERIAL_CATALOG.find(m => m.id === raw.id);
    const cost = raw.qty * (material ? material.price : 0);
    totalCost += cost;
    return {
      id: raw.id,
      name: material ? material.name : raw.id,
      qty: raw.qty,
      unit: raw.unit,
      price: material ? material.price : 0,
      cost: cost
    };
  });

  resultsContainer.innerHTML = currentEstimations.map(item => `
    <div class="calc-item-row">
      <div class="calc-item-info">
        <span class="calc-item-title">${item.name}</span>
        <span class="calc-item-qty">Required: <strong>${item.qty} ${item.unit}</strong> @ ${formatINR(item.price)}/${item.unit}</span>
      </div>
      <div class="calc-item-cost">${formatINR(item.cost)}</div>
    </div>
  `).join('') + `
    <div class="calc-item-row" style="background: #fffbeb; border-color: #fde68a;">
      <div class="calc-item-info">
        <span class="calc-item-title" style="color: #92400e;">Total Material Estimate</span>
        <span class="calc-item-qty">Direct Quarry & Plant Pricing</span>
      </div>
      <div class="calc-item-cost" style="color: #b45309; font-size: 1.25rem;">${formatINR(totalCost)}</div>
    </div>
  `;
}

function addEstimationsToCart() {
  if (!currentEstimations || currentEstimations.length === 0) {
    runEstimator();
  }

  currentEstimations.forEach(est => {
    const existing = cart.find(c => c.id === est.id);
    if (existing) {
      existing.quantity = est.qty;
    } else {
      cart.push({
        id: est.id,
        name: est.name,
        price: est.price,
        unit: est.unit,
        quantity: est.qty
      });
    }
  });

  saveCartToStorage();
  updateCartUI();
  renderMaterials();
  showToast('Estimated materials added to your order!');
  toggleCartDrawer(true);
}

// 5. Order Modal & Dedicated Payment Page Flow
function openOrderModal() {
  if (cart.length === 0) {
    showToast('Please add at least one material to proceed to payment');
    return;
  }

  toggleCartDrawer(false);

  const modal = document.getElementById('orderModal');
  const step1 = document.getElementById('checkoutStep1');
  const step2 = document.getElementById('checkoutStep2');
  const title = document.getElementById('modalTitle');

  if (modal) {
    modal.classList.add('active');
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    if (title) title.innerText = 'Step 1: Confirm Site Delivery Details';
  }

  // Pre-fill today's / tomorrow's date
  const dateInput = document.getElementById('deliveryDate');
  if (dateInput && !dateInput.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Form Submission -> Transitions to Payment Page
function handleOrderFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('siteAddress').value.trim();
  const date = document.getElementById('deliveryDate').value;
  const paymentPref = document.getElementById('paymentPreference').value;
  const notes = document.getElementById('orderNotes').value.trim();

  const randomRef = 'SDG-' + Math.floor(1000 + Math.random() * 9000);
  const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  confirmedOrderData = {
    orderRef: randomRef,
    date: date || new Date().toISOString().split('T')[0],
    customer: {
      name: name,
      phone: phone,
      address: address
    },
    paymentPref: paymentPref,
    notes: notes,
    items: [...cart],
    totalAmount: grandTotal,
    companyPhone: '6379505684',
    companyEmail: 'gopisenthil42@gmail.com'
  };

  // Switch to Step 2: Payment Page
  transitionToPaymentPage();
}

function transitionToPaymentPage() {
  const step1 = document.getElementById('checkoutStep1');
  const step2 = document.getElementById('checkoutStep2');
  const title = document.getElementById('modalTitle');

  if (step1 && step2) {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  }

  if (title) {
    title.innerText = 'Official Payment Page & Contact Desk';
  }

  // Populate Order Reference & Phone
  const refEl = document.getElementById('orderRefId');
  if (refEl) refEl.innerText = confirmedOrderData.orderRef;

  const codPhoneEl = document.getElementById('codConfirmedPhone');
  if (codPhoneEl) codPhoneEl.innerText = confirmedOrderData.customer.phone;

  const totalEl = document.getElementById('finalGrandTotalAmount');
  if (totalEl) totalEl.innerText = formatINR(confirmedOrderData.totalAmount);

  const upiAmount = document.getElementById('upiAmountValue');
  if (upiAmount) upiAmount.innerText = formatINR(confirmedOrderData.totalAmount);

  // Populate Table of Ordered Materials & Allotted Prices
  const tableContainer = document.getElementById('finalOrderItemsTable');
  if (tableContainer) {
    tableContainer.innerHTML = `
      <table class="order-table">
        <thead>
          <tr>
            <th>Material Description</th>
            <th>Allotted Rate</th>
            <th>Quantity</th>
            <th>Calculated Total</th>
          </tr>
        </thead>
        <tbody>
          ${confirmedOrderData.items.map(item => `
            <tr>
              <td><strong>${item.name}</strong></td>
              <td>${formatINR(item.price)} / ${item.unit}</td>
              <td>${item.quantity} ${item.unit}</td>
              <td><strong>${formatINR(item.price * item.quantity)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Pre-activate selected payment tab
  const tabs = document.querySelectorAll('.pay-tab-btn');
  const panes = document.querySelectorAll('.pay-tab-pane');
  const targetTab = `${confirmedOrderData.paymentPref}-tab`;

  tabs.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === targetTab);
  });
  panes.forEach(pane => {
    pane.classList.toggle('active', pane.id === targetTab);
  });
}

// WhatsApp Integration to Direct Phone: 6379505684
function sendOrderToWhatsApp() {
  if (!confirmedOrderData) return;

  const orderLines = confirmedOrderData.items.map(i => 
    `• ${i.name}: ${i.quantity} ${i.unit} = ₹${i.price * i.quantity}`
  ).join('\n');

  const message = 
`*NEW MATERIAL ORDER - SDG TRADERS*
━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${confirmedOrderData.orderRef}
*Date:* ${confirmedOrderData.date}

*CUSTOMER DETAILS:*
• Name: ${confirmedOrderData.customer.name}
• Phone: ${confirmedOrderData.customer.phone}
• Delivery Site: ${confirmedOrderData.customer.address}

*MATERIALS ORDERED:*
${orderLines}

━━━━━━━━━━━━━━━━━━━━
*TOTAL AMOUNT PAYABLE:* ${formatINR(confirmedOrderData.totalAmount)}
*Payment Mode:* ${confirmedOrderData.paymentPref.toUpperCase()}
${confirmedOrderData.notes ? `*Site Notes:* ${confirmedOrderData.notes}` : ''}

Please confirm dispatch schedule and weighbridge slip.
Official Contact: 6379505684 / gopisenthil42@gmail.com`;

  const encoded = encodeURIComponent(message);
  const waUrl = `https://wa.me/916379505684?text=${encoded}`;
  window.open(waUrl, '_blank');
}

// Print Official Invoice
function printOrderInvoice() {
  if (!confirmedOrderData) return;

  document.getElementById('invOrderNo').innerText = confirmedOrderData.orderRef;
  document.getElementById('invDate').innerText = confirmedOrderData.date;
  document.getElementById('invCustName').innerText = `Name: ${confirmedOrderData.customer.name}`;
  document.getElementById('invCustPhone').innerText = `Phone: ${confirmedOrderData.customer.phone}`;
  document.getElementById('invCustAddress').innerText = `Site Address: ${confirmedOrderData.customer.address}`;
  document.getElementById('invGrandTotal').innerHTML = `<strong>${formatINR(confirmedOrderData.totalAmount)}</strong>`;

  const tbody = document.getElementById('invItemsBody');
  tbody.innerHTML = confirmedOrderData.items.map((item, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${item.name}</td>
      <td>${formatINR(item.price)} / ${item.unit}</td>
      <td>${item.quantity} ${item.unit}</td>
      <td>${formatINR(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  window.print();
}

// Toast helper
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msg = document.getElementById('toastMsg');
  if (!toast || !msg) return;

  msg.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Copy text utility
window.copyText = function(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check" style="color: #16a34a"></i>';
    showToast(`Copied to clipboard: ${text}`);
    setTimeout(() => {
      btn.innerHTML = original;
    }, 2000);
  });
};

// 6. Welcome Modal / Greeting System
function setupWelcomeGreeting() {
  const welcomeModal = document.getElementById('welcomeModal');
  const closeBtn = document.getElementById('closeWelcomeBtn');

  if (!welcomeModal) return;

  // Show welcome prompt on entry
  setTimeout(() => {
    welcomeModal.classList.add('show');
  }, 600);

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      welcomeModal.classList.remove('show');
    });
  }

  // Auto dismiss after 10 seconds if not clicked
  setTimeout(() => {
    if (welcomeModal.classList.contains('show')) {
      welcomeModal.classList.remove('show');
    }
  }, 10000);
}

// 7. Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  renderMaterials();
  updateCartUI();
  runEstimator();
  setupWelcomeGreeting();

  // Category filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-category');
      renderMaterials();
    });
  });

  // Cart Drawer open/close
  const cartBtn = document.getElementById('cartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const closeCartOverlay = document.getElementById('closeCartOverlay');
  const clearCartBtn = document.getElementById('clearCartBtn');

  if (cartBtn) cartBtn.addEventListener('click', () => toggleCartDrawer(true));
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCartDrawer(false));
  if (closeCartOverlay) closeCartOverlay.addEventListener('click', () => toggleCartDrawer(false));

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your material order?')) {
        cart = [];
        saveCartToStorage();
        updateCartUI();
        renderMaterials();
        showToast('Cart cleared');
      }
    });
  }

  // Estimator triggers
  const runEstimatorBtn = document.getElementById('runEstimatorBtn');
  const addEstimatedToCartBtn = document.getElementById('addEstimatedToCartBtn');
  const calcWorkType = document.getElementById('calcWorkType');
  const calcArea = document.getElementById('calcArea');

  if (runEstimatorBtn) runEstimatorBtn.addEventListener('click', runEstimator);
  if (calcWorkType) calcWorkType.addEventListener('change', runEstimator);
  if (calcArea) calcArea.addEventListener('input', runEstimator);
  if (addEstimatedToCartBtn) addEstimatedToCartBtn.addEventListener('click', addEstimationsToCart);

  // Checkout modal
  const proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');
  const closeOrderModalBtn = document.getElementById('closeOrderModalBtn');
  const orderForm = document.getElementById('orderForm');

  if (proceedToCheckoutBtn) proceedToCheckoutBtn.addEventListener('click', openOrderModal);
  if (closeOrderModalBtn) closeOrderModalBtn.addEventListener('click', closeOrderModal);
  if (orderForm) orderForm.addEventListener('submit', handleOrderFormSubmit);

  // Payment Tabs Switcher
  document.querySelectorAll('.pay-tab-btn').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      const target = tabBtn.getAttribute('data-tab');
      document.querySelectorAll('.pay-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.pay-tab-pane').forEach(p => p.classList.remove('active'));

      tabBtn.classList.add('active');
      const targetPane = document.getElementById(target);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Action Buttons on Payment Page
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppOrderBtn');
  const printInvoiceBtn = document.getElementById('printInvoiceBtn');
  const doneOrderBtn = document.getElementById('doneOrderBtn');

  if (sendWhatsAppBtn) sendWhatsAppBtn.addEventListener('click', sendOrderToWhatsApp);
  if (printInvoiceBtn) printInvoiceBtn.addEventListener('click', printOrderInvoice);
  if (doneOrderBtn) {
    doneOrderBtn.addEventListener('click', () => {
      closeOrderModal();
      showToast('Thank you for ordering with SDG Traders! Our team will contact you.');
      cart = [];
      saveCartToStorage();
      updateCartUI();
      renderMaterials();
    });
  }
});

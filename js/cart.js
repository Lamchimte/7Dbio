// =============================================
// CART STATE & DRAWER MANAGEMENT (v2.0)
// =============================================

// DOM Elements
const cartDrawer = document.getElementById("cart-drawer");
const cartDrawerOverlay = document.getElementById("cart-drawer-overlay");
const cartDrawerBtn = document.getElementById("cart-drawer-btn");
const cartDrawerCloseBtn = document.getElementById("cart-drawer-close-btn");
const cartTotalBadge = document.getElementById("cart-total-badge");
const cartItemsCount = document.getElementById("cart-items-count");
const cartDrawerBody = document.getElementById("cart-drawer-body");
const cartDrawerFooter = document.getElementById("cart-drawer-footer");
const cartDrawerTotalValue = document.getElementById("cart-drawer-total-value");
const cartCheckoutActionBtn = document.getElementById("cart-checkout-action-btn");

const saveCart = () => {
  localStorage.setItem("7dbio_v2_cart", JSON.stringify(currentCart));
  updateCartBadge();
};

const updateCartBadge = () => {
  const count = currentCart.reduce((total, item) => total + item.quantity, 0);
  if (cartTotalBadge) cartTotalBadge.textContent = count;
  if (cartItemsCount) cartItemsCount.textContent = count;
};

const handleAddToCartClick = (productId) => {
  addToCart(productId, 1);
  openCartDrawer();
};

const addToCart = (productId, qty = 1) => {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Determine active price (B2B wholesale vs Retail)
  const isB2B = currentUser && currentUser.role === 'b2b_clinic';
  const effectivePrice = isB2B && product.wholesalePrice ? product.wholesalePrice : product.price;

  const cartItemIndex = currentCart.findIndex(item => item.productId === productId);
  
  if (cartItemIndex > -1) {
    const newQty = currentCart[cartItemIndex].quantity + qty;
    if (newQty > product.stock) {
      currentCart[cartItemIndex].quantity = product.stock;
      showToast(t('toast_max_stock_pattern').replace('{name}', product.name).replace('{count}', product.stock));
    } else {
      currentCart[cartItemIndex].quantity = newQty;
      // Update price if B2B changed
      currentCart[cartItemIndex].price = effectivePrice;
      showToast(t('toast_qty_updated_pattern').replace('{name}', product.name));
    }
  } else {
    let finalQty = qty;
    if (finalQty > product.stock) {
      finalQty = product.stock;
      showToast(t('toast_add_max_pattern').replace('{count}', product.stock));
    }
    currentCart.push({
      productId: product.id,
      productName: product.name,
      price: effectivePrice,
      originalPrice: product.price,
      isWholesale: isB2B && !!product.wholesalePrice,
      image: product.image,
      batchNo: product.batchInfo ? product.batchInfo.batchNo : '',
      quantity: finalQty
    });
    showToast(t('toast_added_to_cart_pattern').replace('{name}', product.name));
  }

  saveCart();
  renderCartDrawer();
};

const changeCartQty = (productId, amount) => {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  const cartItemIndex = currentCart.findIndex(item => item.productId === productId);
  
  if (cartItemIndex === -1) return;

  const currentQty = currentCart[cartItemIndex].quantity;
  const newQty = currentQty + amount;

  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  if (product && newQty > product.stock) {
    showToast(`Vượt quá số lượng tồn kho khả dụng (${product.stock}).`);
    return;
  }

  currentCart[cartItemIndex].quantity = newQty;
  saveCart();
  renderCartDrawer();
  
  // If checkout view is active, update checkout summary too
  const viewCheckout = document.getElementById("view-checkout");
  if (viewCheckout && viewCheckout.classList.contains("active")) {
    renderCheckoutSummary();
  }
};

const removeFromCart = (productId) => {
  currentCart = currentCart.filter(item => item.productId !== productId);
  saveCart();
  renderCartDrawer();
  showToast("Đã xóa sản phẩm khỏi giỏ hàng.");
  
  const viewCheckout = document.getElementById("view-checkout");
  if (viewCheckout && viewCheckout.classList.contains("active")) {
    renderCheckoutSummary();
  }
};

const openCartDrawer = () => {
  if (cartDrawer && cartDrawerOverlay) {
    cartDrawer.classList.add("active");
    cartDrawerOverlay.classList.add("active");
    renderCartDrawer();
  }
};

const closeCartDrawer = () => {
  if (cartDrawer && cartDrawerOverlay) {
    cartDrawer.classList.remove("active");
    cartDrawerOverlay.classList.remove("active");
  }
};

const renderCartDrawer = () => {
  if (!cartDrawerBody || !cartDrawerFooter) return;
  cartDrawerBody.innerHTML = "";

  if (currentCart.length === 0) {
    cartDrawerBody.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-bag-shopping" style="font-size: 40px; color: var(--color-accent); opacity: 0.5;"></i>
        <p>${t('cart_empty')}</p>
        <button onclick="closeCartDrawer(); scrollToProducts();" class="btn-elegant btn-elegant-secondary" style="margin-top: 20px;">${t('cart_shop_now')}</button>
      </div>
    `;
    cartDrawerFooter.style.display = "none";
    return;
  }

  const list = document.createElement("div");
  list.className = "cart-item-list";
  let totalValue = 0;

  currentCart.forEach(item => {
    totalValue += item.price * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-img-wrapper">
        <img src="${item.image}" alt="${item.productName}" onerror="this.src='images/hero_banner.png'">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.productName}</h4>
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span class="cart-item-price">${formatVND(item.price)}</span>
          ${item.isWholesale ? '<span class="badge-b2b-price">Giá sỉ B2B</span>' : ''}
        </div>
        ${item.batchNo ? `<div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Lô: <strong>${item.batchNo}</strong></div>` : ''}
        <div class="cart-item-actions">
          <div class="cart-qty-ctrl">
            <button class="cart-qty-btn" onclick="changeCartQty('${item.productId}', -1)"><i class="fa-solid fa-minus" style="font-size:10px;"></i></button>
            <span class="cart-qty-value">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="changeCartQty('${item.productId}', 1)"><i class="fa-solid fa-plus" style="font-size:10px;"></i></button>
          </div>
          <button class="cart-item-remove-btn" onclick="removeFromCart('${item.productId}')">${t('cart_remove')}</button>
        </div>
      </div>
    `;
    list.appendChild(row);
  });

  // Cold Chain Guarantee Note
  const coldNote = document.createElement("div");
  coldNote.className = "cart-coldchain-notice";
  coldNote.innerHTML = `
    <i class="fa-solid fa-snowflake" style="color:#0284c7;"></i>
    <span>Đơn hàng được bảo quản bằng thùng xốp cách nhiệt & đá gel đạt chuẩn 2°C - 8°C.</span>
  `;
  list.appendChild(coldNote);

  cartDrawerBody.appendChild(list);
  if (cartDrawerTotalValue) cartDrawerTotalValue.textContent = formatVND(totalValue);
  
  const totalLabel = cartDrawerFooter.querySelector('.cart-summary-label');
  if (totalLabel) totalLabel.textContent = t('cart_total');
  
  const checkoutBtn = document.getElementById('cart-checkout-action-btn');
  if (checkoutBtn) checkoutBtn.textContent = t('cart_checkout');
  cartDrawerFooter.style.display = "block";
};

// Event listeners
if (cartDrawerBtn) cartDrawerBtn.addEventListener("click", () => openCartDrawer());
if (cartDrawerCloseBtn) cartDrawerCloseBtn.addEventListener("click", () => closeCartDrawer());
if (cartDrawerOverlay) cartDrawerOverlay.addEventListener("click", () => closeCartDrawer());

if (cartCheckoutActionBtn) {
  cartCheckoutActionBtn.addEventListener("click", () => {
    closeCartDrawer();
    if (!currentUser) {
      showToast("Vui lòng đăng nhập trước khi tiến hành đặt hàng.");
      openAuthModal('login');
    } else {
      const checkoutName = document.getElementById("checkout-name");
      const checkoutEmail = document.getElementById("checkout-email");
      const checkoutPhone = document.getElementById("checkout-phone");
      const checkoutAddress = document.getElementById("checkout-address");
      if (checkoutName) checkoutName.value = currentUser.name;
      if (checkoutEmail) checkoutEmail.value = currentUser.email;
      if (checkoutPhone && currentUser.phone) checkoutPhone.value = currentUser.phone;
      if (checkoutAddress && currentUser.address) checkoutAddress.value = currentUser.address;
      switchView('checkout');
    }
  });
}

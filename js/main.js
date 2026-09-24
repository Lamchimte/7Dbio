// =============================================
// MAIN APPLICATION COORDINATOR (v2.0)
// =============================================

// --- DOM ELEMENTS ---
const viewHome = document.getElementById("view-home");
const viewCheckout = document.getElementById("view-checkout");
const viewOrders = document.getElementById("view-orders");
const viewAdmin = document.getElementById("view-admin");
const viewProductDetail = document.getElementById("view-product-detail");
const viewPolicy = document.getElementById("view-policy");
const viewVerify = document.getElementById("view-verify");
const viewB2B = document.getElementById("view-b2b");
const productDetailPageContent = document.getElementById("product-detail-page-content");

const hamburgerBtn = document.getElementById("hamburger-btn");
const navBar = document.getElementById("nav-bar");
const logoHome = document.getElementById("logo-home");

const productDetailModal = document.getElementById("product-detail-modal");
const productDetailCloseBtn = document.getElementById("product-detail-close-btn");
const toastContainer = document.getElementById("toast-container");

// --- UTILITIES ---

// Format currency in VND
const formatVND = (number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

// Show toast message
const showToast = (message) => {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check" style="color: var(--color-accent);"></i>
    <span>${message}</span>
    <i class="fa-solid fa-xmark toast-message-close"></i>
  `;
  toastContainer.appendChild(toast);
  
  setTimeout(() => toast.classList.add("show"), 10);
  
  const removeTimeout = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);

  toast.querySelector(".toast-message-close").addEventListener("click", () => {
    clearTimeout(removeTimeout);
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  });
};

// Navigation Scrolling
const scrollToProducts = () => {
  switchView('home');
  const target = document.getElementById("products-section");
  if (target) target.scrollIntoView({ behavior: 'smooth' });
};

const scrollToProductsCategory = (category) => {
  scrollToProducts();
  const catBtn = document.querySelector(`.filter-tab-btn[data-category="${category}"]`);
  if (catBtn) catBtn.click();
};

const scrollToAbout = () => {
  switchView('home');
  const target = document.getElementById("about-section");
  if (target) target.scrollIntoView({ behavior: 'smooth' });
};

// Switch active view container (SPA Navigator)
const switchView = (viewName) => {
  // Reset active nav links
  document.querySelectorAll(".nav-link-item").forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("data-nav") === viewName) {
      item.classList.add("active");
    }
  });

  // Switch display
  [viewHome, viewCheckout, viewOrders, viewAdmin, viewProductDetail, viewPolicy, viewVerify, viewB2B].forEach(view => {
    if (view) view.classList.remove("active");
  });

  if (viewName === 'home') {
    if (viewHome) viewHome.classList.add("active");
  } else if (viewName === 'checkout') {
    if (viewCheckout) viewCheckout.classList.add("active");
    renderCheckoutSummary();
  } else if (viewName === 'orders') {
    if (viewOrders) viewOrders.classList.add("active");
    renderOrderHistory();
  } else if (viewName === 'admin') {
    if (viewAdmin) viewAdmin.classList.add("active");
    let targetAdminTab = 'products';
    if (currentUser) {
      if (currentUser.role === 'warehouse_logistics') {
        targetAdminTab = 'inventory';
      } else if (currentUser.role === 'sales_rep') {
        targetAdminTab = 'b2b';
      }
    }
    switchAdminTab(targetAdminTab);
  } else if (viewName === 'product-detail') {
    if (viewProductDetail) viewProductDetail.classList.add("active");
  } else if (viewName === 'policy') {
    if (viewPolicy) viewPolicy.classList.add("active");
  } else if (viewName === 'verify') {
    if (viewVerify) viewVerify.classList.add("active");
  } else if (viewName === 'b2b') {
    if (viewB2B) viewB2B.classList.add("active");
  }

  // Close nav on mobile
  if (navBar) navBar.classList.remove("active");
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- PRODUCT CARD NAVIGATION (HOMEPAGE) ---
const cardImageIndices = {};

const changeCardImage = (productId, direction) => {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  if (cardImageIndices[productId] === undefined) {
    cardImageIndices[productId] = 0;
  }

  cardImageIndices[productId] = (cardImageIndices[productId] + direction + images.length) % images.length;
  const newIdx = cardImageIndices[productId];

  // Update image with fade
  const imgEl = document.getElementById(`card-img-${productId}`);
  if (imgEl) {
    imgEl.style.opacity = '0';
    setTimeout(() => {
      imgEl.src = images[newIdx];
      imgEl.style.opacity = '1';
    }, 160);
  }

  // Update dot indicators
  const dotsEl = document.getElementById(`card-dots-${productId}`);
  if (dotsEl) {
    dotsEl.querySelectorAll('.card-img-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === newIdx);
    });
  }
};

// --- WISHLIST MANAGEMENT (YSL LUXURY EXPERIENCE) ---
const updateWishlistBadge = () => {
  const list = getWishlist();
  const totalBadge = document.getElementById("wishlist-total-badge");
  const itemsCount = document.getElementById("wishlist-items-count");
  if (totalBadge) totalBadge.textContent = list.length;
  if (itemsCount) itemsCount.textContent = list.length;
};

const openWishlistDrawer = () => {
  const drawer = document.getElementById("wishlist-drawer");
  const overlay = document.getElementById("wishlist-drawer-overlay");
  if (drawer && overlay) {
    renderWishlistDrawer();
    drawer.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
};

const closeWishlistDrawer = () => {
  const drawer = document.getElementById("wishlist-drawer");
  const overlay = document.getElementById("wishlist-drawer-overlay");
  if (drawer && overlay) {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
};

const handleToggleWishlist = (productId) => {
  const res = toggleWishlistItem(productId);
  updateWishlistBadge();
  renderWishlistDrawer();
  
  // Update card buttons active state
  document.querySelectorAll(`.card-wishlist-btn[data-id="${productId}"]`).forEach(btn => {
    btn.classList.toggle("active", res.added);
    const icon = btn.querySelector("i");
    if (icon) {
      icon.className = res.added ? "fa-solid fa-heart" : "fa-regular fa-heart";
    }
  });

  showToast(res.added ? t('wishlist_added') : t('wishlist_removed'));
};

const renderWishlistDrawer = () => {
  const list = getWishlist();
  const products = getProducts();
  const body = document.getElementById("wishlist-drawer-body");
  if (!body) return;

  if (list.length === 0) {
    body.innerHTML = `
      <div class="wishlist-empty-state">
        <i class="fa-regular fa-heart" style="font-size:42px; color:var(--color-accent); opacity:0.6; margin-bottom:16px;"></i>
        <h4>Danh sách yêu thích trống</h4>
        <p>Lưu lại những liệu trình Botox &amp; Filler yêu thích để theo dõi ưu đãi.</p>
        <button class="btn-elegant btn-elegant-primary" onclick="closeWishlistDrawer(); scrollToProducts();" style="margin-top:20px;">
          Khám phá bộ sưu tập
        </button>
      </div>
    `;
    return;
  }

  const wishlistedProds = list.map(id => products.find(p => p.id === id)).filter(Boolean);
  body.innerHTML = wishlistedProds.map(p => `
    <div class="wishlist-item-row">
      <img src="${p.image || 'images/hero_banner.png'}" alt="${p.name}" class="wishlist-item-img" onclick="closeWishlistDrawer(); openProductDetail('${p.id}')">
      <div class="wishlist-item-info">
        <div class="wishlist-item-category">${p.category.toUpperCase()}</div>
        <h4 class="wishlist-item-title" onclick="closeWishlistDrawer(); openProductDetail('${p.id}')">${p.name}</h4>
        <div class="wishlist-item-price">${formatVND(p.price)}</div>
        <div class="wishlist-item-actions">
          <button class="wishlist-add-cart-btn" onclick="addToCart('${p.id}', 1); closeWishlistDrawer();">
            <i class="fa-solid fa-bag-shopping"></i> Thêm vào giỏ
          </button>
          <button class="wishlist-remove-btn" onclick="handleToggleWishlist('${p.id}')" title="Xóa">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
};

// --- YSL LUXURY INTERACTION HANDLERS ---
const handleQuickAdd = (productId) => {
  addToCart(productId, 1);
};

const handleSortChange = (sortVal) => {
  activeSort = sortVal;
  renderProducts();
};

const setGridView = (cols) => {
  activeGridView = cols;
  const grid = document.getElementById("product-grid");
  const btn3 = document.getElementById("grid-toggle-3");
  const btn4 = document.getElementById("grid-toggle-4");
  if (grid) {
    grid.classList.toggle("grid-3-cols", cols === '3');
  }
  if (btn3) btn3.classList.toggle("active", cols === '3');
  if (btn4) btn4.classList.toggle("active", cols === '4');
};

const filterByQuickCategory = (cat) => {
  if (cat === 'prive') {
    activeCategory = 'all';
    const priveSec = document.querySelector('.prive-club-section');
    if (priveSec) priveSec.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  activeCategory = cat;
  document.querySelectorAll('.quick-jump-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-category') === cat);
  });
  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === cat);
  });
  renderProducts();
  scrollToProducts();
};

const addDuoToCart = (prodId1, prodId2) => {
  addToCart(prodId1, 1);
  addToCart(prodId2, 1);
  showToast("Đã thêm toàn bộ Routine Duo vào giỏ hàng với giá ưu đãi!");
  if (typeof openCartDrawer === 'function') openCartDrawer();
};

const handlePriveSubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById("prive-email-input");
  if (!input) return;
  const email = input.value.trim();
  if (!email) return;
  showToast(`Đặc quyền Privé được kích hoạt! Mã ưu đãi của bạn: PRIVELUXE10 (-10%)`);
  input.value = "";
};

// --- FACETED PRODUCT GRID RENDERING (YSL LUXURY SPEC) ---
const renderProducts = () => {
  const products = getProducts();
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;
  productGrid.innerHTML = "";

  // Update Category Tab Count Numbers
  const countAll = products.length;
  const countFiller = products.filter(p => p.category === 'filler').length;
  const countBotox = products.filter(p => p.category === 'botox').length;
  const countSkinbooster = products.filter(p => p.category === 'skinbooster').length;

  const elCountAll = document.getElementById("count-cat-all");
  const elCountFiller = document.getElementById("count-cat-filler");
  const elCountBotox = document.getElementById("count-cat-botox");
  const elCountSkinbooster = document.getElementById("count-cat-skinbooster");
  if (elCountAll) elCountAll.textContent = `(${countAll})`;
  if (elCountFiller) elCountFiller.textContent = `(${countFiller})`;
  if (elCountBotox) elCountBotox.textContent = `(${countBotox})`;
  if (elCountSkinbooster) elCountSkinbooster.textContent = `(${countSkinbooster})`;

  // Multi-dimensional filtering
  const filtered = products.filter(p => {
    // 1. Category filter
    if (activeCategory !== "all" && p.category !== activeCategory) {
      return false;
    }
    // 2. Brand filter
    if (activeBrand !== "all" && p.brandId !== activeBrand) {
      return false;
    }
    // 3. Indication filter
    if (activeIndication !== "all" && (!p.indicationIds || !p.indicationIds.includes(activeIndication))) {
      return false;
    }
    return true;
  });

  // Update Toolbar Counter Display
  const counterDisplay = document.getElementById("product-count-display");
  if (counterDisplay) {
    const unitWord = currentLang === 'en' ? 'products' : currentLang === 'zh' ? '个产品' : 'sản phẩm';
    counterDisplay.textContent = `${filtered.length} ${unitWord}`;
  }

  if (filtered.length === 0) {
    productGrid.innerHTML = `
      <div class="no-data" style="grid-column: 1 / -1; padding: 60px 20px; text-align: center;">
        <i class="fa-solid fa-filter-circle-xmark" style="font-size:36px; color:var(--text-muted); opacity:0.5; margin-bottom:12px;"></i>
        <p style="color:var(--text-muted); font-size:15px;">Không tìm thấy sản phẩm nào phù hợp với bộ lọc đã chọn.</p>
        <button onclick="resetFilters()" class="btn-elegant btn-elegant-secondary" style="margin-top:15px; font-size:12px;">Đặt lại bộ lọc</button>
      </div>`;
    return;
  }

  // Sorting
  const sorted = [...filtered];
  if (activeSort === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price);
  } else if (activeSort === 'name-asc') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Apply grid view class (3 vs 4 cols)
  if (activeGridView === '3') {
    productGrid.classList.add('grid-3-cols');
  } else {
    productGrid.classList.remove('grid-3-cols');
  }

  const isB2B = currentUser && currentUser.role === 'b2b_clinic';
  const wishlist = getWishlist();

  sorted.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card ysl-card animated-fade reveal";
    
    let catLabel = t('cat_filler');
    if (product.category === 'botox') catLabel = t('cat_botox');
    else if (product.category === 'skinbooster') catLabel = t('cat_skinbooster');

    const btnText = product.stock === 0 ? t('out_of_stock_short') : t('add_to_cart');
    const badgeOos = product.stock === 0 ? `<span class="badge-ysl-tag out-of-stock">${t('out_of_stock_long')}</span>` : '';
    const badgeCustom = product.badge ? `<span class="badge-ysl-tag">${product.badge}</span>` : '';
    const isWish = wishlist.includes(product.id);
    
    // Cold-chain indicator
    const coldChainBadge = product.category === 'botox' 
      ? `<span class="badge-cold-pill"><i class="fa-solid fa-snowflake"></i> 2°C - 8°C</span>` 
      : `<span class="badge-cold-pill"><i class="fa-solid fa-shield-halved"></i> BYT Certified</span>`;

    const images = (product.images && product.images.length > 0) ? product.images : [product.image];
    const activeIndex = cardImageIndices[product.id] !== undefined ? cardImageIndices[product.id] : 0;
    const activeImgSrc = images[activeIndex] || product.image || 'images/hero_banner.png';
    const showMultiple = images.length > 1;

    // Dots indicator HTML
    const dotsHtml = showMultiple ? `
      <div class="card-img-dots" id="card-dots-${product.id}">
        ${images.map((_, i) => `<span class="card-img-dot${i === activeIndex ? ' active' : ''}"></span>`).join('')}
      </div>` : '';

    // Price display logic (B2B vs Retail)
    let priceHtml = `<div class="product-card-price">${formatVND(product.price)}</div>`;
    if (isB2B && product.wholesalePrice) {
      priceHtml = `
        <div class="product-card-b2b-price-group">
          <span class="product-card-price b2b-active">${formatVND(product.wholesalePrice)}</span>
          <span class="product-card-original-price">${formatVND(product.price)}</span>
          <span class="b2b-tag">Giá sỉ B2B</span>
        </div>
      `;
    }

    // Volume badge
    const volumeBadge = product.volume ? `<span class="product-card-volume-chip">${product.volume}</span>` : '';

    card.innerHTML = `
      <div class="product-card-img-wrapper" onclick="openProductDetail('${product.id}')">
        <img class="product-card-img" id="card-img-${product.id}" src="${activeImgSrc}" alt="${product.name}" onerror="this.src='images/hero_banner.png'">
        <div class="card-badges-top-left">
          ${coldChainBadge}
          ${badgeCustom}
          ${badgeOos}
        </div>
        <button class="card-wishlist-btn ${isWish ? 'active' : ''}" data-id="${product.id}" onclick="event.stopPropagation(); handleToggleWishlist('${product.id}')" title="Yêu thích">
          <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        ${dotsHtml}
        ${showMultiple ? `
          <button class="card-slider-btn card-slider-btn-left" onclick="event.stopPropagation(); changeCardImage('${product.id}', -1)"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="card-slider-btn card-slider-btn-right" onclick="event.stopPropagation(); changeCardImage('${product.id}', 1)"><i class="fa-solid fa-chevron-right"></i></button>
        ` : ''}
        <div class="card-quick-add-overlay">
          <button class="btn-card-quick-add" onclick="event.stopPropagation(); handleQuickAdd('${product.id}')" ${product.stock === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            <i class="fa-solid fa-plus"></i> <span>${product.stock === 0 ? t('out_of_stock_short') : t('quick_add')}</span>
          </button>
        </div>
      </div>
      <div class="product-card-content">
        <div class="product-card-meta-row">
          <span class="product-card-type">${catLabel}</span>
          ${volumeBadge}
        </div>
        <h3 class="product-card-title" onclick="openProductDetail('${product.id}')">${product.name}</h3>
        ${priceHtml}
        <div class="product-card-btn-wrapper">
          <button class="product-card-btn" onclick="handleAddToCartClick('${product.id}')" ${product.stock === 0 ? 'disabled style="opacity:0.6; cursor:not-allowed;"' : ''}>
            <i class="fa-solid fa-cart-plus" style="margin-right:6px;"></i>${btnText}
          </button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);

    if (showMultiple) {
      const wrapper = card.querySelector('.product-card-img-wrapper');
      if (wrapper) {
        wrapper.addEventListener('mouseenter', () => wrapper.classList.add('card-hovered'));
        wrapper.addEventListener('mouseleave', () => wrapper.classList.remove('card-hovered'));
      }
    }
  });
  
  if (typeof initScrollReveal === 'function') {
    initScrollReveal();
  }
};

const resetFilters = () => {
  activeCategory = "all";
  activeBrand = "all";
  activeIndication = "all";
  activeSort = "featured";
  
  document.querySelectorAll(".filter-tab-btn").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-category") === "all");
  });
  document.querySelectorAll(".quick-jump-item").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-category") === "all");
  });
  
  const brandSelect = document.getElementById("filter-brand-select");
  if (brandSelect) brandSelect.value = "all";
  
  const indicationSelect = document.getElementById("filter-indication-select");
  if (indicationSelect) indicationSelect.value = "all";

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) sortSelect.value = "featured";

  renderProducts();
};

// Handle Category Tabs
document.querySelectorAll(".filter-tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.getAttribute("data-category");
    document.querySelectorAll(".quick-jump-item").forEach(item => {
      item.classList.toggle("active", item.getAttribute("data-category") === activeCategory);
    });
    renderProducts();
  });
});

// Handle Faceted Brand & Indication Selectors
const initFacetedFilters = () => {
  const brandSelect = document.getElementById("filter-brand-select");
  const indicationSelect = document.getElementById("filter-indication-select");
  
  if (brandSelect) {
    brandSelect.addEventListener("change", (e) => {
      activeBrand = e.target.value;
      renderProducts();
    });
  }
  
  if (indicationSelect) {
    indicationSelect.addEventListener("change", (e) => {
      activeIndication = e.target.value;
      renderProducts();
    });
  }
};

// --- PRODUCT DETAILS PAGE RENDERING (WITH MEDICAL SPECIFICATIONS) ---
let currentDetailProduct = null;
let currentDetailImgIndex = 0;
let currentDetailTab = 'specs';
let currentDetailQty = 1;

const openProductDetail = (productId) => {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentDetailProduct = product;
  currentDetailImgIndex = 0;
  currentDetailQty = 1;
  currentDetailTab = 'specs';

  renderProductDetailPage();
  switchView('product-detail');
};

const renderProductDetailPage = () => {
  if (!currentDetailProduct || !productDetailPageContent) return;
  const product = currentDetailProduct;
  const isB2B = currentUser && currentUser.role === 'b2b_clinic';

  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  const mainSrc = images[currentDetailImgIndex] || 'images/hero_banner.png';

  const thumbsHtml = images.length > 1 ? `
    <div class="product-gallery-thumbs" style="margin-top: 15px;">
      ${images.map((src, i) => `
        <div class="thumb-item ${i === currentDetailImgIndex ? 'active' : ''}" onclick="switchDetailImage(${i})">
          <img src="${src}" onerror="this.src='images/hero_banner.png'">
        </div>
      `).join('')}
    </div>` : '';

  const showSliderBtns = images.length > 1;

  // Price layout in detail
  let priceDetailHtml = `<div class="product-detail-price">${formatVND(product.price)}</div>`;
  if (isB2B && product.wholesalePrice) {
    priceDetailHtml = `
      <div class="product-detail-price-b2b">
        <div class="price-b2b-val">${formatVND(product.wholesalePrice)} <span class="badge-b2b-price">Giá sỉ B2B</span></div>
        <div class="price-retail-sub">${t('retail_price')} ${formatVND(product.price)}</div>
      </div>
    `;
  }

  // Medical specs data
  const specs = product.medicalSpecs || {
    activeIngredient: "Hyaluronic Acid / Botulinum Toxin A",
    origin: "Chính hãng Châu Âu / Hoa Kỳ",
    licenseNumber: "Đầy đủ số đăng ký lưu hành BYT",
    storageTemp: "2°C - 8°C (Cold-Chain)",
    durationMonths: "12 - 18 tháng",
    needleGauge: "27G - 30G"
  };

  const batch = product.batchInfo || {
    batchNo: "VB2026A",
    mfgDate: "2026-01-01",
    expDate: "2028-01-01"
  };

  productDetailPageContent.innerHTML = `
    <div class="product-detail-gallery-col">
      <div class="product-detail-slider">
        ${showSliderBtns ? `<button class="slider-btn slider-btn-left" onclick="prevDetailImage()"><i class="fa-solid fa-chevron-left"></i></button>` : ''}
        <img id="detail-slider-main-img" class="detail-slider-main-img" src="${mainSrc}" alt="${product.name}" onerror="this.src='images/hero_banner.png'">
        ${showSliderBtns ? `<button class="slider-btn slider-btn-right" onclick="nextDetailImage()"><i class="fa-solid fa-chevron-right"></i></button>` : ''}
      </div>
      ${thumbsHtml}
      
      <!-- Cold Chain Trust Badge -->
      <div class="detail-coldchain-box">
        <div class="coldchain-icon"><i class="fa-solid fa-snowflake"></i></div>
        <div class="coldchain-text">
          <h4>${t('cold_chain_badge')}</h4>
          <p>${t('cold_chain_desc')}</p>
        </div>
      </div>
    </div>

    <div class="product-detail-info-col">
      <span class="product-detail-type">${product.category === 'filler' ? t('cat_filler') : product.category === 'botox' ? t('cat_botox') : t('cat_skinbooster')}</span>
      <h1 class="product-detail-title">${product.name}</h1>
      ${priceDetailHtml}
      
      <!-- Add to Cart / Order Row -->
      <div class="product-detail-purchase-row" style="margin-top: 20px; margin-bottom: 20px;">
        <div class="product-detail-qty-group">
          <button class="product-detail-qty-btn" onclick="changeDetailPageQty(-1)"><i class="fa-solid fa-minus"></i></button>
          <span id="detail-page-qty-val" class="product-detail-qty-value">1</span>
          <button class="product-detail-qty-btn" onclick="changeDetailPageQty(1)"><i class="fa-solid fa-plus"></i></button>
        </div>
        <button id="detail-page-add-to-cart-btn" class="btn-elegant btn-elegant-primary product-detail-add-btn"
                onclick="addDetailPageToCart('${product.id}')" ${product.stock === 0 ? 'disabled style="opacity:0.6; cursor:not-allowed;"' : ''}>
          <i class="fa-solid fa-bag-shopping" style="margin-right:8px;"></i>${product.stock === 0 ? t('out_of_stock_long') : t('add_to_cart_long')}
        </button>
      </div>

      <div class="detail-stock-meta">
        <span>${t('stock_label')} <strong>${product.stock} ${t('stock_unit')}</strong></span>
        <span>•</span>
        <span>Lô sản xuất: <strong>${batch.batchNo}</strong></span>
        <span>•</span>
        <span>Hạn dùng: <strong>${batch.expDate}</strong></span>
      </div>
      
      <!-- Detailed Tab Content: Specs, Desc, Uses, Usage -->
      <div class="product-detail-tabs">
        <div class="detail-tab-headers">
          <button class="detail-tab-header-btn ${currentDetailTab === 'specs' ? 'active' : ''}" onclick="switchDetailTab(this, 'specs')">${t('medical_specs_title')}</button>
          <button class="detail-tab-header-btn ${currentDetailTab === 'desc' ? 'active' : ''}" onclick="switchDetailTab(this, 'desc')">${t('tab_description')}</button>
          <button class="detail-tab-header-btn ${currentDetailTab === 'uses' ? 'active' : ''}" onclick="switchDetailTab(this, 'uses')">${t('tab_uses')}</button>
          <button class="detail-tab-header-btn ${currentDetailTab === 'usage' ? 'active' : ''}" onclick="switchDetailTab(this, 'usage')">${t('tab_usage')}</button>
        </div>
        <div class="detail-tab-contents">
          <!-- Medical Specs Tab -->
          <div id="detail-tab-specs" class="detail-tab-content-pane ${currentDetailTab === 'specs' ? 'active' : ''}">
            <table class="medical-specs-table">
              <tbody>
                <tr>
                  <th>${t('spec_ingredient')}</th>
                  <td><strong>${specs.activeIngredient}</strong></td>
                </tr>
                <tr>
                  <th>${t('spec_origin')}</th>
                  <td>${specs.origin}</td>
                </tr>
                <tr>
                  <th>${t('spec_license')}</th>
                  <td><span class="badge-license">${specs.licenseNumber}</span></td>
                </tr>
                <tr>
                  <th>${t('spec_storage')}</th>
                  <td><i class="fa-solid fa-temperature-arrow-down" style="color:#0284c7;"></i> ${specs.storageTemp}</td>
                </tr>
                <tr>
                  <th>${t('spec_duration')}</th>
                  <td>${specs.durationMonths}</td>
                </tr>
                <tr>
                  <th>${t('spec_needle')}</th>
                  <td>${specs.needleGauge}</td>
                </tr>
                <tr>
                  <th>${t('spec_batch')}</th>
                  <td>Lô: <strong>${batch.batchNo}</strong> (HSD: ${batch.expDate})</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div id="detail-tab-desc" class="detail-tab-content-pane ${currentDetailTab === 'desc' ? 'active' : ''}">
            <p>${product.description || ''}</p>
          </div>
          <div id="detail-tab-uses" class="detail-tab-content-pane ${currentDetailTab === 'uses' ? 'active' : ''}">
            <p>${product.uses || ''}</p>
          </div>
          <div id="detail-tab-usage" class="detail-tab-content-pane ${currentDetailTab === 'usage' ? 'active' : ''}">
            <p>${product.usage || ''}</p>
          </div>
        </div>
      </div>
    </div>
  `;
};

const switchDetailImage = (index) => {
  currentDetailImgIndex = index;
  renderProductDetailPage();
};

const prevDetailImage = () => {
  if (!currentDetailProduct) return;
  const images = (currentDetailProduct.images && currentDetailProduct.images.length > 0) ? currentDetailProduct.images : [currentDetailProduct.image];
  currentDetailImgIndex = (currentDetailImgIndex - 1 + images.length) % images.length;
  renderProductDetailPage();
};

const nextDetailImage = () => {
  if (!currentDetailProduct) return;
  const images = (currentDetailProduct.images && currentDetailProduct.images.length > 0) ? currentDetailProduct.images : [currentDetailProduct.image];
  currentDetailImgIndex = (currentDetailImgIndex + 1) % images.length;
  renderProductDetailPage();
};

const changeDetailPageQty = (amount) => {
  if (!currentDetailProduct) return;
  const stockVal = currentDetailProduct.stock;
  if (stockVal === 0) return;
  
  currentDetailQty += amount;
  if (currentDetailQty < 1) currentDetailQty = 1;
  if (currentDetailQty > stockVal) {
    currentDetailQty = stockVal;
    showToast(t('toast_only_left_pattern').replace('{count}', stockVal));
  }
  const valEl = document.getElementById("detail-page-qty-val");
  if (valEl) valEl.textContent = currentDetailQty;
};

const addDetailPageToCart = (productId) => {
  if (!currentDetailProduct) return;
  addToCart(productId, currentDetailQty);
  currentDetailQty = 1;
  const valEl = document.getElementById("detail-page-qty-val");
  if (valEl) valEl.textContent = "1";
};

const switchDetailTab = (btnEl, tabName) => {
  currentDetailTab = tabName;
  btnEl.parentElement.querySelectorAll('.detail-tab-header-btn').forEach(btn => btn.classList.remove('active'));
  btnEl.classList.add('active');

  const panesContainer = btnEl.parentElement.nextElementSibling;
  panesContainer.querySelectorAll('.detail-tab-content-pane').forEach(pane => pane.classList.remove('active'));
  
  const targetPane = panesContainer.querySelector(`#detail-tab-${tabName}`);
  if (targetPane) targetPane.classList.add('active');
};

// --- ANTI-COUNTERFEIT SERIAL VERIFICATION VIEW LOGIC ---
const initVerifyView = () => {
  const verifyBtn = document.getElementById("verify-submit-btn");
  const verifyInput = document.getElementById("verify-code-input");
  const verifyResultCard = document.getElementById("verify-result-card");
  
  if (!verifyBtn || !verifyInput) return;

  const performVerify = (codeToTest) => {
    const code = codeToTest || verifyInput.value.trim();
    if (!code) {
      showToast("Vui lòng nhập mã Serial để kiểm tra.");
      return;
    }

    verifyInput.value = code;
    const result = verifySerialCode(code);

    if (verifyResultCard) {
      verifyResultCard.style.display = "block";
      if (result) {
        verifyResultCard.className = "verify-result-box genuine-card animated-fade";
        verifyResultCard.innerHTML = `
          <div class="verify-header-badge">
            <i class="fa-solid fa-circle-check"></i>
            <h3>${t('verify_result_genuine')}</h3>
          </div>
          <div class="verify-detail-body">
            <p><strong>Mã Serial:</strong> <span class="serial-code-text">${result.serial}</span></p>
            <p><strong>Sản phẩm:</strong> <strong>${result.productName}</strong></p>
            <p><strong>Số lô sản xuất:</strong> ${result.batchNo} | <strong>Hạn sử dụng:</strong> ${result.expDate}</p>
            <p><strong>Xuất xứ:</strong> ${result.origin}</p>
            <p><strong>Số công bố BYT:</strong> ${result.license}</p>
            <p><strong>Nhà phân phối:</strong> ${result.distributor}</p>
            <div class="verify-scan-count">
              <i class="fa-solid fa-shield-halved"></i> Số lần tra cứu: <strong>${result.checkCount}</strong> lần. Xác thực chính hãng 100%.
            </div>
          </div>
        `;
      } else {
        verifyResultCard.className = "verify-result-box fake-card animated-fade";
        verifyResultCard.innerHTML = `
          <div class="verify-header-badge">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h3>${t('verify_result_fake')}</h3>
          </div>
          <div class="verify-detail-body">
            <p>Mã serial <strong>"${code}"</strong> không tìm thấy trong cơ sở dữ liệu phân phối chính ngạch của 7Dbio.</p>
            <p style="color:#C0392B;">Cảnh báo: Sản phẩm có nguy cơ là hàng xách tay trôi nổi, hàng giả hoặc đã bị làm giả tem nhãn. Quý khách vui lòng liên hệ hotline <strong>0988.777.999</strong> để được hỗ trợ xác minh.</p>
          </div>
        `;
      }
      verifyResultCard.scrollIntoView({ behavior: 'smooth' });
    }
  };

  verifyBtn.addEventListener("click", () => performVerify());
  verifyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performVerify();
    }
  });

  // Handle sample codes clicks
  document.querySelectorAll(".sample-verify-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const code = chip.getAttribute("data-code");
      performVerify(code);
    });
  });
};

// --- B2B PARTNER FORM LOGIC ---
const initB2BView = () => {
  const b2bForm = document.getElementById("b2b-register-form");
  if (!b2bForm) return;

  b2bForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const docName = document.getElementById("b2b-name").value.trim();
    const clinic = document.getElementById("b2b-clinic").value.trim();
    const license = document.getElementById("b2b-license").value.trim();
    const phone = document.getElementById("b2b-phone").value.trim();
    const email = document.getElementById("b2b-email").value.trim().toLowerCase();

    // Auto grant B2B account for demo
    const users = getUsers();
    let existing = users.find(u => u.email === email);
    if (!existing) {
      existing = {
        email: email,
        password: "user123",
        name: docName,
        clinicName: clinic,
        medicalLicense: license,
        phone: phone,
        role: "b2b_clinic"
      };
      users.push(existing);
      setUsers(users);
    } else {
      existing.role = "b2b_clinic";
      existing.clinicName = clinic;
      existing.medicalLicense = license;
      setUsers(users);
    }

    // Auto log in as B2B Clinic
    currentUser = existing;
    sessionStorage.setItem("7dbio_current_user", JSON.stringify(currentUser));
    updateAuthHeader();
    renderProducts();

    showToast(`Hồ sơ đã được phê duyệt! Chào mừng Quý Bác sĩ ${docName} - ${clinic}.`);
    b2bForm.reset();
    
    setTimeout(() => {
      switchView('home');
      scrollToProducts();
    }, 1200);
  });
};

// --- LANGUAGE STATE HANDLER ---
const setLanguage = (lang) => {
  currentLang = lang;
  localStorage.setItem('7dbio_lang', lang);
  const tr = translations[lang] || translations['vi'];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (tr[key] !== undefined) el.innerHTML = tr[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (tr[key] !== undefined) el.setAttribute('placeholder', tr[key]);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  
  renderProducts();
  if (typeof renderCartDrawer === 'function') renderCartDrawer();
  if (typeof updateAuthHeader === 'function') updateAuthHeader();
  if (typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
  if (typeof renderOrderHistory === 'function') renderOrderHistory();
  if (typeof renderAdminProducts === 'function') renderAdminProducts();
  if (typeof renderAdminOrders === 'function') renderAdminOrders();
  if (viewProductDetail && viewProductDetail.classList.contains("active")) {
    renderProductDetailPage();
  }
};

// --- CORE EVENT BINDINGS ---

if (logoHome) {
  logoHome.addEventListener("click", (e) => {
    e.preventDefault();
    switchView('home');
  });
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", () => {
    if (navBar) navBar.classList.toggle("active");
  });
}

if (productDetailCloseBtn) {
  productDetailCloseBtn.addEventListener("click", () => {
    if (productDetailModal) productDetailModal.classList.remove("active");
    currentDetailQty = 1;
  });
}

// Click outside close modal overlays
window.addEventListener("click", (e) => {
  if (e.target === authModal) {
    if (typeof closeAuthModal === 'function') closeAuthModal();
  }
  if (e.target === productDetailModal) {
    if (productDetailModal) productDetailModal.classList.remove("active");
    currentDetailQty = 1;
  }
  const adProdModal = document.getElementById('admin-product-modal');
  if (e.target === adProdModal) {
    if (adProdModal) adProdModal.classList.remove("active");
  }
  const socModal = document.getElementById('social-settings-modal');
  if (e.target === socModal) {
    if (socModal) socModal.classList.remove("active");
  }
});

// Keyboard Navigation for Detail Image Slider
document.addEventListener("keydown", (e) => {
  if (viewProductDetail && viewProductDetail.classList.contains("active")) {
    if (e.key === "ArrowLeft") {
      prevDetailImage();
    } else if (e.key === "ArrowRight") {
      nextDetailImage();
    }
  }
});

// --- INITIALIZE APPLICATION ---
const initApp = () => {
  if (typeof updateAuthHeader === 'function') updateAuthHeader();
  initFacetedFilters();
  initVerifyView();
  initB2BView();
  renderProducts();
  if (typeof updateCartBadge === 'function') updateCartBadge();
  updateWishlistBadge();
  setLanguage(currentLang);
  if (typeof updateFooterSocials === 'function') updateFooterSocials();
  if (typeof renderFooterContactInfo === 'function') renderFooterContactInfo();
  if (typeof initAdminImageUpload === 'function') initAdminImageUpload();
  
  // Wishlist Drawer Button
  const wishlistBtn = document.getElementById("wishlist-drawer-btn");
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => openWishlistDrawer());
  }

  // Language Switchers
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });
};

// Start App
initApp();

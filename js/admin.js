// =============================================
// ADMIN CONTROLS, CRUD & DATA MANAGEMENT (v2.0)
// =============================================

// DOM Elements
const adminAddProductBtn = document.getElementById("admin-add-product-btn");
const adminTabProducts = document.getElementById("admin-tab-products");
const adminTabOrders = document.getElementById("admin-tab-orders");
const adminTabVerifications = document.getElementById("admin-tab-verifications");
const adminSectionProducts = document.getElementById("admin-section-products");
const adminSectionOrders = document.getElementById("admin-section-orders");
const adminSectionVerifications = document.getElementById("admin-section-verifications");
const adminProductsTableBody = document.getElementById("admin-products-table-body");
const adminOrdersTableBody = document.getElementById("admin-orders-table-body");
const adminPendingCount = document.getElementById("admin-pending-count");
const adminVerifPendingCount = document.getElementById("admin-verif-pending-count");

// CRUD Product Modal Elements
const adminProductModal = document.getElementById("admin-product-modal");
const adminProductModalCloseBtn = document.getElementById("admin-product-modal-close-btn");
const adminProductModalTitle = document.getElementById("admin-product-modal-title");
const adminProductForm = document.getElementById("admin-product-form");
const adminProductId = document.getElementById("admin-product-id");
const adminProductName = document.getElementById("admin-product-name");
const adminProductCategory = document.getElementById("admin-product-category");
const adminProductBrand = document.getElementById("admin-product-brand");
const adminProductPrice = document.getElementById("admin-product-price");
const adminProductWholesale = document.getElementById("admin-product-wholesale");
const adminProductStock = document.getElementById("admin-product-stock");
const adminProductIngredient = document.getElementById("admin-product-ingredient");
const adminProductOrigin = document.getElementById("admin-product-origin");
const adminProductLicense = document.getElementById("admin-product-license");
const adminProductStorage = document.getElementById("admin-product-storage");
const adminProductDuration = document.getElementById("admin-product-duration");
const adminProductBatch = document.getElementById("admin-product-batch");
const adminProductExp = document.getElementById("admin-product-exp");
const adminProductDesc = document.getElementById("admin-product-desc");
const adminProductUses = document.getElementById("admin-product-uses");
const adminProductUsage = document.getElementById("admin-product-usage");
const adminProductSubmitBtn = document.getElementById("admin-product-submit-btn");

// Image Upload variables
let adminProductImages = [];

// Badge updater
const updateAdminBadges = () => {
  const orders = typeof getOrders === 'function' ? getOrders() : [];
  const pendingOrders = orders.filter(o => o.status === 'pending');
  if (adminPendingCount) adminPendingCount.textContent = pendingOrders.length;

  const b2bApps = typeof getB2BApplications === 'function' ? getB2BApplications() : [];
  const pendingB2B = b2bApps.filter(a => a.status === 'pending');
  const b2bPendingEl = document.getElementById("admin-b2b-pending-count");
  if (b2bPendingEl) b2bPendingEl.textContent = pendingB2B.length;

  const regReqs = typeof getRegistrationRequests === 'function' ? getRegistrationRequests() : [];
  const pendingRegs = regReqs.filter(r => r.status === 'pending');
  const regPendingEl = document.getElementById("admin-verif-pending-count");
  if (regPendingEl) regPendingEl.textContent = pendingRegs.length;
};

// --- RBAC & STAFF BANNER CONTROLS ---
const updateAdminStaffBanner = () => {
  const banner = document.getElementById("admin-staff-banner");
  if (!banner) return;
  if (!currentUser || !isInternalUser(currentUser)) {
    banner.style.display = "none";
    return;
  }
  banner.style.display = "flex";

  const locUser = typeof getLocalizedStaff === 'function' ? getLocalizedStaff(currentUser, currentLang) : currentUser;

  const avatarEl = document.getElementById("admin-banner-avatar");
  const nameEl = document.getElementById("admin-banner-name");
  const badgeEl = document.getElementById("admin-banner-badge");
  const levelEl = document.getElementById("admin-banner-level");
  const titleEl = document.getElementById("admin-banner-title");
  const deptEl = document.getElementById("admin-banner-dept");

  if (avatarEl) avatarEl.textContent = locUser.avatar || (locUser.name ? locUser.name.charAt(0) : "7D");
  if (nameEl) nameEl.textContent = locUser.name;
  if (titleEl) titleEl.textContent = locUser.title || "Chuyên viên vận hành hệ thống";
  if (deptEl) deptEl.innerHTML = `<i class="fa-solid fa-building-shield"></i> ${locUser.department || "Khối Y Dược & Vận Hành 7Dbio"}`;

  const role = locUser.role;
  const levelPrefix = t('staff_level_prefix') || 'CẤP';
  if (badgeEl && levelEl) {
    if (role === 'super_admin' || role === 'admin') {
      badgeEl.className = "badge-role badge-super-admin";
      badgeEl.innerHTML = `<i class="fa-solid fa-crown"></i> ${t('staff_badge_super_admin') || 'SUPER ADMIN'}`;
      levelEl.textContent = `${levelPrefix} 5`;
    } else if (role === 'warehouse_logistics') {
      badgeEl.className = "badge-role badge-warehouse";
      badgeEl.innerHTML = `<i class="fa-solid fa-snowflake"></i> ${t('staff_badge_warehouse') || 'KHO LẠNH GSP'}`;
      levelEl.textContent = `${levelPrefix} 4`;
    } else if (role === 'sales_rep') {
      badgeEl.className = "badge-role badge-sales";
      badgeEl.innerHTML = `<i class="fa-solid fa-briefcase"></i> ${t('staff_badge_sales') || 'SALES B2B'}`;
      levelEl.textContent = `${levelPrefix} 3`;
    }
  }

  // Update quick stats in banner
  const statOnline = document.getElementById("admin-banner-stat-online");
  if (statOnline) statOnline.textContent = t('admin_stat_online');
  const statGspOpt = document.getElementById("admin-banner-stat-gsp-opt");
  if (statGspOpt) statGspOpt.textContent = t('admin_stat_gsp_opt');
};

const applyRolePermissions = () => {
  if (!currentUser) return;
  const role = currentUser.role;

  const tabP = document.getElementById("admin-tab-products");
  const tabO = document.getElementById("admin-tab-orders");
  const tabB = document.getElementById("admin-tab-b2b");
  const tabV = document.getElementById("admin-tab-verifications");
  const tabI = document.getElementById("admin-tab-inventory");
  const tabS = document.getElementById("admin-tab-staff");
  const tabCfg = document.getElementById("admin-tab-settings");
  const addProdBtn = document.getElementById("admin-add-product-btn");
  const socialBtn = document.getElementById("admin-social-settings-btn");

  if (role === 'super_admin' || role === 'admin') {
    if (tabP) tabP.style.display = "inline-flex";
    if (tabO) tabO.style.display = "inline-flex";
    if (tabB) tabB.style.display = "inline-flex";
    if (tabV) tabV.style.display = "inline-flex";
    if (tabI) tabI.style.display = "inline-flex";
    if (tabS) tabS.style.display = "inline-flex";
    if (tabCfg) tabCfg.style.display = "inline-flex";
    if (addProdBtn) addProdBtn.style.display = "inline-flex";
    if (socialBtn) socialBtn.style.display = "inline-flex";
  } else if (role === 'warehouse_logistics') {
    if (tabP) tabP.style.display = "inline-flex";
    if (tabO) tabO.style.display = "inline-flex";
    if (tabI) tabI.style.display = "inline-flex";
    if (tabB) tabB.style.display = "none";
    if (tabV) tabV.style.display = "none";
    if (tabS) tabS.style.display = "none";
    if (tabCfg) tabCfg.style.display = "none";
    if (addProdBtn) addProdBtn.style.display = "none";
    if (socialBtn) socialBtn.style.display = "none";
  } else if (role === 'sales_rep') {
    if (tabP) tabP.style.display = "inline-flex";
    if (tabO) tabO.style.display = "inline-flex";
    if (tabB) tabB.style.display = "inline-flex";
    if (tabV) tabV.style.display = "inline-flex";
    if (tabI) tabI.style.display = "none";
    if (tabS) tabS.style.display = "none";
    if (tabCfg) tabCfg.style.display = "none";
    if (addProdBtn) addProdBtn.style.display = "none";
    if (socialBtn) socialBtn.style.display = "none";
  }
};

// Tab switching inside Admin view
const switchAdminTab = (tabName) => {
  updateAdminStaffBanner();
  applyRolePermissions();
  updateAdminBadges();

  if (currentUser) {
    if (currentUser.role === 'warehouse_logistics' && ['b2b', 'verifications', 'staff', 'settings'].includes(tabName)) {
      tabName = 'inventory';
    } else if (currentUser.role === 'sales_rep' && ['inventory', 'staff', 'settings'].includes(tabName)) {
      tabName = 'verifications';
    }
  }

  const tabP = document.getElementById("admin-tab-products");
  const tabO = document.getElementById("admin-tab-orders");
  const tabB = document.getElementById("admin-tab-b2b");
  const tabV = document.getElementById("admin-tab-verifications");
  const tabI = document.getElementById("admin-tab-inventory");
  const tabS = document.getElementById("admin-tab-staff");
  const tabCfg = document.getElementById("admin-tab-settings");

  const secP = document.getElementById("admin-section-products");
  const secO = document.getElementById("admin-section-orders");
  const secB = document.getElementById("admin-section-b2b");
  const secV = document.getElementById("admin-section-verifications");
  const secI = document.getElementById("admin-section-inventory");
  const secS = document.getElementById("admin-section-staff");
  const secCfg = document.getElementById("admin-section-settings");

  const tabs = [tabP, tabO, tabB, tabV, tabI, tabS, tabCfg];
  const sections = [secP, secO, secB, secV, secI, secS, secCfg];

  tabs.forEach(t => { if (t) t.classList.remove("active"); });
  sections.forEach(s => { if (s) s.classList.remove("active"); });

  if (tabName === 'products') {
    if (tabP) tabP.classList.add("active");
    if (secP) secP.classList.add("active");
    renderAdminProducts();
  } else if (tabName === 'orders') {
    if (tabO) tabO.classList.add("active");
    if (secO) secO.classList.add("active");
    renderAdminOrders();
  } else if (tabName === 'b2b') {
    if (tabB) tabB.classList.add("active");
    if (secB) secB.classList.add("active");
    renderAdminB2BApplications();
  } else if (tabName === 'verifications') {
    if (tabV) tabV.classList.add("active");
    if (secV) secV.classList.add("active");
    renderAdminVerifications();
  } else if (tabName === 'inventory') {
    if (tabI) tabI.classList.add("active");
    if (secI) secI.classList.add("active");
    renderAdminInventory();
  } else if (tabName === 'staff') {
    if (tabS) tabS.classList.add("active");
    if (secS) secS.classList.add("active");
    renderAdminStaff();
  } else if (tabName === 'settings') {
    if (tabCfg) tabCfg.classList.add("active");
    if (secCfg) secCfg.classList.add("active");
    if (typeof renderAdminSettings === 'function') {
      renderAdminSettings();
    }
  }
};

// Bind tab event listeners
const tabPBtn = document.getElementById("admin-tab-products");
if (tabPBtn) tabPBtn.addEventListener("click", () => switchAdminTab('products'));
const tabOBtn = document.getElementById("admin-tab-orders");
if (tabOBtn) tabOBtn.addEventListener("click", () => switchAdminTab('orders'));
const tabBBtn = document.getElementById("admin-tab-b2b");
if (tabBBtn) tabBBtn.addEventListener("click", () => switchAdminTab('b2b'));
const tabVBtn = document.getElementById("admin-tab-verifications");
if (tabVBtn) tabVBtn.addEventListener("click", () => switchAdminTab('verifications'));
const tabIBtn = document.getElementById("admin-tab-inventory");
if (tabIBtn) tabIBtn.addEventListener("click", () => switchAdminTab('inventory'));
const tabSBtn = document.getElementById("admin-tab-staff");
if (tabSBtn) tabSBtn.addEventListener("click", () => switchAdminTab('staff'));
const tabCfgBtn = document.getElementById("admin-tab-settings");
if (tabCfgBtn) tabCfgBtn.addEventListener("click", () => switchAdminTab('settings'));

const renderAdminProducts = () => {
  if (!adminProductsTableBody) return;
  const products = getProducts();
  adminProductsTableBody.innerHTML = "";

  const isSuperAdmin = currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'admin');
  const isWarehouse = currentUser && currentUser.role === 'warehouse_logistics';
  const isSales = currentUser && currentUser.role === 'sales_rep';

  products.forEach(p => {
    const tr = document.createElement("tr");
    const locProd = typeof getLocalizedProduct === 'function' ? getLocalizedProduct(p, currentLang) : p;
    const catLabel = locProd.category === 'filler' ? t('cat_filler') : locProd.category === 'botox' ? t('cat_botox') : t('cat_skinbooster');
    const batchNo = locProd.batchInfo ? locProd.batchInfo.batchNo : '—';
    const wholesale = locProd.wholesalePrice ? formatVND(locProd.wholesalePrice) : '—';

    let actionBtns = '';
    if (isSuperAdmin) {
      actionBtns = `
        <button class="admin-table-btn admin-table-btn-edit" onclick="openAdminProductModal('${p.id}')">${t('admin_btn_edit')}</button>
        <button class="admin-table-btn admin-table-btn-delete" onclick="handleDeleteProduct('${p.id}')">${t('admin_btn_delete')}</button>
      `;
    } else if (isWarehouse) {
      actionBtns = `
        <button class="admin-table-btn admin-table-btn-edit" onclick="openAdminProductModal('${p.id}')"><i class="fa-solid fa-snowflake"></i> ${t('admin_btn_view_batch') || 'Xem Lô/Hạn'}</button>
      `;
    } else if (isSales) {
      actionBtns = `
        <button class="admin-table-btn admin-table-btn-edit" onclick="openAdminProductModal('${p.id}')"><i class="fa-solid fa-eye"></i> ${t('admin_btn_quote_wholesale') || 'Báo giá Sỉ'}</button>
      `;
    } else {
      actionBtns = `<button class="admin-table-btn admin-table-btn-edit" onclick="openAdminProductModal('${p.id}')">${t('admin_btn_edit')}</button>`;
    }

    tr.innerHTML = `
      <td><img src="${locProd.image}" alt="${locProd.name}" class="admin-product-thumb" onerror="this.src='images/hero_banner.png'"></td>
      <td>
        <div style="font-weight:600; color:var(--text-dark);">${locProd.name}</div>
        <div style="font-size:11px; color:var(--text-muted);">${t('admin_col_batch')}: <strong>${batchNo}</strong> | ${t('admin_col_wholesale_vip')}: <strong>${wholesale}</strong></div>
      </td>
      <td><span style="text-transform:uppercase; font-size:11px; font-weight:600;">${catLabel}</span></td>
      <td>${formatVND(locProd.price)}</td>
      <td style="font-weight:600; color:${locProd.stock === 0 ? '#C0392B' : 'inherit'}">${locProd.stock}</td>
      <td>
        <div class="admin-table-action-btns">
          ${actionBtns}
        </div>
      </td>
    `;
    adminProductsTableBody.appendChild(tr);
  });
};

const renderAdminOrders = () => {
  if (!adminOrdersTableBody) return;
  const orders = getOrders();
  adminOrdersTableBody.innerHTML = "";
  
  const sortedOrders = [...orders].sort((a,b) => new Date(b.date) - new Date(a.date));

  const pendingOrders = orders.filter(o => o.status === 'pending');
  if (adminPendingCount) adminPendingCount.textContent = pendingOrders.length;

  if (sortedOrders.length === 0) {
    adminOrdersTableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:40px; font-style:italic; color:var(--text-muted)">${t('admin_no_orders')}</td></tr>`;
    return;
  }

  sortedOrders.forEach(o => {
    const tr = document.createElement("tr");
    const locale = currentLang === 'en' ? 'en-US' : currentLang === 'zh' ? 'zh-CN' : 'vi-VN';
    const dateStr = new Date(o.date).toLocaleDateString(locale, { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    let itemsStr = o.items.map(i => `${i.productName} (x${i.quantity})`).join("<br>");
    const paymentText = o.paymentMethod === 'cod' ? t('payment_cod') : t('payment_bank');

    tr.innerHTML = `
      <td>
        <span style="font-weight:700; color:var(--color-primary);">${o.id}</span>
        ${o.trackingCode ? `<div style="font-size:10px; color:#0284c7;"><i class="fa-solid fa-snowflake"></i> ${o.trackingCode}</div>` : ''}
      </td>
      <td>
        <strong>${o.name}</strong> ${o.clinicName ? `<span style="font-size:11px; color:var(--color-primary);">(${o.clinicName})</span>` : ''}<br>
        <span style="font-size:11px; color:var(--text-muted);">${o.phone}</span><br>
        <span style="font-size:11px; color:var(--text-muted);">${o.address}</span>
      </td>
      <td>${dateStr}</td>
      <td style="font-size:12px; line-height:1.4;">${itemsStr}</td>
      <td style="font-weight:600;">
        ${formatVND(o.total)}
        ${o.discountAmount ? `<div style="font-size:10px; color:#059669;">- ${formatVND(o.discountAmount)} (${o.couponCode})</div>` : ''}
      </td>
      <td style="text-transform:uppercase; font-size:11px; font-weight:600;">
        ${paymentText}
        ${o.isPaid ? `<span style="display:block; color:#10b981; font-size:10px;">${t('order_paid') || 'Đã thanh toán'}</span>` : ''}
      </td>
      <td>
        <select class="admin-order-status-select" onchange="handleAdminUpdateOrderStatus('${o.id}', this.value)">
          <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>${t('admin_status_pending')}</option>
          <option value="shipping" ${o.status === 'shipping' ? 'selected' : ''}>${t('admin_status_shipping')}</option>
          <option value="completed" ${o.status === 'completed' ? 'selected' : ''}>${t('admin_status_completed')}</option>
        </select>
      </td>
    `;
    adminOrdersTableBody.appendChild(tr);
  });
};

const handleAdminUpdateOrderStatus = (orderId, newStatus) => {
  const orders = getOrders();
  const orderIdx = orders.findIndex(o => o.id === orderId);
  if (orderIdx === -1) return;

  orders[orderIdx].status = newStatus;
  
  // Append step to timeline
  const now = new Date();
  const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  if (!orders[orderIdx].timeline) orders[orderIdx].timeline = [];
  
  if (newStatus === 'shipping') {
    orders[orderIdx].timeline.push({
      step: "Bàn giao vận chuyển ColdChain",
      time: timeStr,
      desc: "Kiện hàng đã được giao cho đơn vị vận chuyển lạnh chuyên dụng bảo quản 2-8°C"
    });
  } else if (newStatus === 'completed') {
    orders[orderIdx].isPaid = true;
    orders[orderIdx].timeline.push({
      step: "Giao hàng thành công",
      time: timeStr,
      desc: "Khách hàng/Bác sĩ đã nhận kiện hàng nguyên tem niêm phong"
    });
  }

  setOrders(orders);
  showToast(t('admin_status_updated').replace('{id}', orderId));
  renderAdminOrders();
};

const handleDeleteProduct = (productId) => {
  if (!confirm(t('admin_confirm_delete'))) return;

  const products = getProducts();
  const updated = products.filter(p => p.id !== productId);
  setProducts(updated);
  showToast(t('admin_delete_success'));
  
  renderAdminProducts();
  if (typeof renderProducts === 'function') renderProducts();
};

// Open CRUD Product Modal
const openAdminProductModal = (productId = null) => {
  if (!adminProductModal || !adminProductForm) return;
  adminProductModal.classList.add("active");
  adminProductForm.reset();
  adminProductImages = [];
  renderAdminImagePreviews();

  if (productId) {
    if (adminProductModalTitle) {
      adminProductModalTitle.textContent = t('modal_title_edit');
      adminProductModalTitle.setAttribute('data-i18n', 'modal_title_edit');
    }
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (adminProductId) adminProductId.value = product.id;
    if (adminProductName) adminProductName.value = product.name;
    if (adminProductCategory) adminProductCategory.value = product.category;
    if (adminProductBrand) adminProductBrand.value = product.brandId || "allergan";
    if (adminProductPrice) adminProductPrice.value = product.price;
    if (adminProductWholesale) adminProductWholesale.value = product.wholesalePrice || Math.round(product.price * 0.85);
    if (adminProductStock) adminProductStock.value = product.stock;
    
    // Medical specs
    const specs = product.medicalSpecs || {};
    if (adminProductIngredient) adminProductIngredient.value = specs.activeIngredient || "";
    if (adminProductOrigin) adminProductOrigin.value = specs.origin || "";
    if (adminProductLicense) adminProductLicense.value = specs.licenseNumber || "";
    if (adminProductStorage) adminProductStorage.value = specs.storageTemp || "2°C - 8°C";
    if (adminProductDuration) adminProductDuration.value = specs.durationMonths || "12 - 18 tháng";

    // Batch info
    const batch = product.batchInfo || {};
    if (adminProductBatch) adminProductBatch.value = batch.batchNo || "";
    if (adminProductExp) adminProductExp.value = batch.expDate || "";

    if (adminProductDesc) adminProductDesc.value = product.description;
    if (adminProductUses) adminProductUses.value = product.uses || "";
    if (adminProductUsage) adminProductUsage.value = product.usage || "";
    
    adminProductImages = (product.images && product.images.length > 0) ? [...product.images] : (product.image ? [product.image] : []);
    renderAdminImagePreviews();
  } else {
    if (adminProductModalTitle) {
      adminProductModalTitle.textContent = t('modal_title_add');
      adminProductModalTitle.setAttribute('data-i18n', 'modal_title_add');
    }
    if (adminProductId) adminProductId.value = "";
    if (adminProductBrand) adminProductBrand.value = "allergan";
    if (adminProductWholesale) adminProductWholesale.value = "";
    if (adminProductIngredient) adminProductIngredient.value = "";
    if (adminProductOrigin) adminProductOrigin.value = "";
    if (adminProductLicense) adminProductLicense.value = "";
    if (adminProductStorage) adminProductStorage.value = "2°C - 8°C (Cold-Chain)";
    if (adminProductDuration) adminProductDuration.value = "12 - 18 tháng";
    if (adminProductBatch) adminProductBatch.value = "7D" + Math.floor(1000 + Math.random()*9000);
    if (adminProductExp) adminProductExp.value = "2028-12-31";
    if (adminProductUses) adminProductUses.value = "";
    if (adminProductUsage) adminProductUsage.value = "";
  }
};

// Save Product
if (adminProductForm) {
  adminProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const id = adminProductId.value;
    const name = adminProductName.value.trim();
    const category = adminProductCategory.value;
    const brandId = adminProductBrand ? adminProductBrand.value : "allergan";
    const price = parseInt(adminProductPrice.value);
    const wholesalePrice = adminProductWholesale && adminProductWholesale.value ? parseInt(adminProductWholesale.value) : Math.round(price * 0.85);
    const stock = parseInt(adminProductStock.value);
    const image = adminProductImages[0] || 'images/hero_banner.png';
    const images = [...adminProductImages];
    const description = adminProductDesc.value.trim();
    const uses = adminProductUses.value.trim();
    const usage = adminProductUsage.value.trim();

    // Medical specs & Batch
    const medicalSpecs = {
      activeIngredient: adminProductIngredient ? adminProductIngredient.value.trim() : "Hyaluronic Acid / Botulinum Toxin",
      origin: adminProductOrigin ? adminProductOrigin.value.trim() : "Pháp / Hoa Kỳ",
      licenseNumber: adminProductLicense ? adminProductLicense.value.trim() : "2100451/BYT-TB-CT",
      storageTemp: adminProductStorage ? adminProductStorage.value.trim() : "2°C - 8°C (Cold-Chain)",
      durationMonths: adminProductDuration ? adminProductDuration.value.trim() : "12 - 18 tháng",
      needleGauge: "27G - 30G"
    };

    const batchInfo = {
      batchNo: adminProductBatch && adminProductBatch.value.trim() ? adminProductBatch.value.trim() : "VB2026A",
      mfgDate: "2026-01-01",
      expDate: adminProductExp && adminProductExp.value.trim() ? adminProductExp.value.trim() : "2028-01-01"
    };

    const products = getProducts();

    if (id) {
      const idx = products.findIndex(p => p.id === id);
      if (idx > -1) {
        products[idx] = { 
          ...products[idx], 
          id, name, category, brandId, price, wholesalePrice, stock, image, images, 
          medicalSpecs, batchInfo, description, uses, usage 
        };
        showToast(t('toast_edit_success'));
      }
    } else {
      const newId = "prod-" + Date.now();
      products.push({ 
        id: newId, sku: "7D-" + Math.floor(1000 + Math.random()*9000), 
        name, category, brandId, price, wholesalePrice, stock, image, images, 
        medicalSpecs, batchInfo, description, uses, usage 
      });
      showToast(t('toast_add_success'));
    }

    setProducts(products);
    adminProductModal.classList.remove("active");
    
    renderAdminProducts();
    if (typeof renderProducts === 'function') renderProducts();
  });
}

// Image previewing inside Modal
const renderAdminImagePreviews = () => {
  const grid = document.getElementById('img-preview-grid');
  if (!grid) return;
  grid.innerHTML = '';
  adminProductImages.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'img-preview-item' + (i === 0 ? ' is-main' : '');
    item.innerHTML = `
      <img src="${src}" onerror="this.src='images/hero_banner.png'">
      ${i === 0 ? `<div class="img-main-label">${t('lbl_prod_main_badge')}</div>` : ''}
      <button class="img-remove-btn" onclick="removeAdminImage(${i})" type="button">&times;</button>
    `;
    grid.appendChild(item);
  });
};

const removeAdminImage = (idx) => {
  adminProductImages.splice(idx, 1);
  renderAdminImagePreviews();
};

const addAdminImageFromSrc = (src) => {
  if (!src || adminProductImages.includes(src)) return;
  adminProductImages.push(src);
  renderAdminImagePreviews();
};

const initAdminImageUpload = () => {
  const dropZone = document.getElementById('img-drop-zone');
  const fileInput = document.getElementById('img-file-input');
  const urlInput = document.getElementById('img-url-input');
  const urlAddBtn = document.getElementById('img-url-add-btn');
  if (!dropZone) return;

  dropZone.addEventListener('click', () => { if (fileInput) fileInput.click(); });
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    Array.from(e.dataTransfer.files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => addAdminImageFromSrc(ev.target.result);
      reader.readAsDataURL(file);
    });
  });
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      Array.from(fileInput.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => addAdminImageFromSrc(ev.target.result);
        reader.readAsDataURL(file);
      });
      fileInput.value = '';
    });
  }
  if (urlAddBtn && urlInput) {
    urlAddBtn.addEventListener('click', () => {
      const val = urlInput.value.trim();
      if (val) { addAdminImageFromSrc(val); urlInput.value = ''; }
    });
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); urlAddBtn.click(); }
    });
  }
};

// Social Settings Modal Logic
const adminSocialSettingsBtn = document.getElementById('admin-social-settings-btn');
const socialSettingsModal = document.getElementById('social-settings-modal');
const socialSettingsCloseBtn = document.getElementById('social-settings-close-btn');
const socialSettingsSaveBtn = document.getElementById('social-settings-save-btn');

if (adminSocialSettingsBtn) {
  adminSocialSettingsBtn.addEventListener('click', () => {
    const socials = getSocialLinks();
    const fbInput = document.getElementById('social-fb-input');
    const igInput = document.getElementById('social-ig-input');
    const zaloInput = document.getElementById('social-zalo-input');
    if (fbInput) fbInput.value = socials.facebook === '#' ? '' : socials.facebook;
    if (igInput) igInput.value = socials.instagram === '#' ? '' : socials.instagram;
    if (zaloInput) zaloInput.value = socials.zalo === '#' ? '' : socials.zalo;
    if (socialSettingsModal) socialSettingsModal.classList.add('active');
  });
}

if (socialSettingsCloseBtn) {
  socialSettingsCloseBtn.addEventListener('click', () => {
    if (socialSettingsModal) socialSettingsModal.classList.remove('active');
  });
}

if (socialSettingsSaveBtn) {
  socialSettingsSaveBtn.addEventListener('click', () => {
    const fb = document.getElementById('social-fb-input').value.trim() || '#';
    const ig = document.getElementById('social-ig-input').value.trim() || '#';
    const zalo = document.getElementById('social-zalo-input').value.trim() || '#';
    setSocialLinks({ facebook: fb, instagram: ig, zalo: zalo });
    updateFooterSocials();
    if (socialSettingsModal) socialSettingsModal.classList.remove('active');
    showToast(t('toast_social_success'));
  });
}

const updateFooterSocials = () => {
  const socials = getSocialLinks();
  const fb = document.getElementById('social-facebook');
  const ig = document.getElementById('social-instagram');
  const zalo = document.getElementById('social-zalo');
  if (fb) fb.href = socials.facebook;
  if (ig) ig.href = socials.instagram;
  if (zalo) zalo.href = socials.zalo;
};

// Bind admin modal triggers
if (adminAddProductBtn) adminAddProductBtn.addEventListener("click", () => openAdminProductModal());
if (adminProductModalCloseBtn) adminProductModalCloseBtn.addEventListener("click", () => {
  if (adminProductModal) adminProductModal.classList.remove("active");
});

// =======================================================================
// B2B PARTNER CLINIC REVIEW & ONBOARDING (Level 3 Sales & Level 5 Admin)
// =======================================================================
let currentB2BFilter = 'all';

const filterB2BTable = (status) => {
  currentB2BFilter = status;
  const pills = document.querySelectorAll('.b2b-filter-pill');
  pills.forEach(p => {
    p.classList.remove('active');
    if (p.getAttribute('onclick') && p.getAttribute('onclick').includes(status)) {
      p.classList.add('active');
    }
  });
  renderAdminB2BApplications();
};

const renderAdminB2BApplications = () => {
  const tbody = document.getElementById("admin-b2b-table-body");
  if (!tbody) return;
  const apps = typeof getB2BApplications === 'function' ? getB2BApplications() : [];

  const pendingApps = apps.filter(a => a.status === 'pending');
  const approvedApps = apps.filter(a => a.status === 'approved');
  
  const b2bPendingCountEl = document.getElementById("admin-b2b-pending-count");
  if (b2bPendingCountEl) b2bPendingCountEl.textContent = pendingApps.length;
  
  const cntAll = document.getElementById("b2b-count-all");
  const cntPend = document.getElementById("b2b-count-pending");
  const cntAppr = document.getElementById("b2b-count-approved");
  if (cntAll) cntAll.textContent = apps.length;
  if (cntPend) cntPend.textContent = pendingApps.length;
  if (cntAppr) cntAppr.textContent = approvedApps.length;

  const filtered = currentB2BFilter === 'all' ? apps : apps.filter(a => a.status === currentB2BFilter);

  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:40px; font-style:italic; color:var(--text-muted)">Không có hồ sơ B2B nào trong danh mục này.</td></tr>`;
    return;
  }

  filtered.forEach(app => {
    const tr = document.createElement("tr");
    
    let statusPill = '';
    let actionHtml = '';

    if (app.status === 'pending') {
      statusPill = `<span class="b2b-status-pill status-pending"><i class="fa-solid fa-hourglass-half"></i> Chờ thẩm định</span>`;
      actionHtml = `
        <div class="admin-table-action-btns">
          <button class="admin-table-btn admin-table-btn-approve" onclick="handleApproveB2B('${app.id}')" title="Phê duyệt CCHN">
            <i class="fa-solid fa-check"></i> Duyệt CCHN
          </button>
          <button class="admin-table-btn admin-table-btn-delete" onclick="handleRejectB2B('${app.id}')" title="Từ chối">
            <i class="fa-solid fa-xmark"></i> Từ chối
          </button>
        </div>
      `;
    } else if (app.status === 'approved') {
      statusPill = `<span class="b2b-status-pill status-approved"><i class="fa-solid fa-circle-check"></i> Đã cấp phép</span>`;
      actionHtml = `<div style="font-size:11px; color:#059669; font-weight:600;"><i class="fa-solid fa-user-check"></i> Kích hoạt giá sỉ VIP</div>`;
    } else {
      statusPill = `<span class="b2b-status-pill status-rejected"><i class="fa-solid fa-circle-xmark"></i> Từ chối</span>`;
      actionHtml = `<div style="font-size:11px; color:#dc2626; font-weight:600;"><i class="fa-solid fa-ban"></i> Đã từ chối</div>`;
    }

    const reviewerInfo = app.reviewedBy ? `<div style="font-size:10px; color:var(--text-muted); margin-top:2px;"><i class="fa-solid fa-signature"></i> ${app.reviewedBy}</div>` : '';

    tr.innerHTML = `
      <td><span style="font-weight:700; color:var(--color-primary);">${app.id}</span></td>
      <td>
        <strong style="color:var(--text-dark);">${app.doctorName}</strong>
      </td>
      <td>
        <span style="font-weight:600; color:var(--text-dark);">${app.clinicName}</span>
      </td>
      <td>
        <code style="font-size:11px; background:#f1f5f9; padding:3px 6px; border-radius:3px; color:#0f172a; font-weight:600;">${app.medicalLicense}</code>
      </td>
      <td>
        <div style="font-size:12px;"><i class="fa-solid fa-phone" style="font-size:10px; color:var(--text-muted);"></i> ${app.phone}</div>
        <div style="font-size:11px; color:var(--text-muted);"><i class="fa-solid fa-envelope" style="font-size:10px;"></i> ${app.email}</div>
      </td>
      <td style="font-size:12px; color:var(--text-muted); max-width:200px;">
        ${app.notes || '—'}
        ${reviewerInfo}
      </td>
      <td>${statusPill}</td>
      <td>${actionHtml}</td>
    `;
    tbody.appendChild(tr);
  });
};

const handleApproveB2B = (appId) => {
  const apps = getB2BApplications();
  const appIdx = apps.findIndex(a => a.id === appId);
  if (appIdx === -1) return;

  const app = apps[appIdx];
  app.status = 'approved';
  app.reviewedBy = `${currentUser ? currentUser.name : "Sales Team"} (${new Date().toLocaleDateString('vi-VN')})`;
  setB2BApplications(apps);

  // Upgrade or create user account
  const users = getUsers();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === app.email.toLowerCase());
  if (userIdx > -1) {
    users[userIdx].role = 'b2b_clinic';
    users[userIdx].clinicName = app.clinicName;
    users[userIdx].medicalLicense = app.medicalLicense;
  } else {
    users.push({
      id: "USR-B2B-" + Date.now(),
      email: app.email.toLowerCase(),
      password: "user123",
      name: app.doctorName,
      clinicName: app.clinicName,
      medicalLicense: app.medicalLicense,
      phone: app.phone,
      role: "b2b_clinic"
    });
  }
  setUsers(users);

  showToast(`Đã thẩm định thành công hồ sơ ${app.doctorName} (${app.clinicName})! Cấp hạn mức B2B.`);
  renderAdminB2BApplications();
  if (typeof renderProducts === 'function') renderProducts();
};

const handleRejectB2B = (appId) => {
  if (!confirm("Bạn có chắc chắn muốn từ chối hồ sơ thẩm định B2B này?")) return;
  const apps = getB2BApplications();
  const appIdx = apps.findIndex(a => a.id === appId);
  if (appIdx === -1) return;

  apps[appIdx].status = 'rejected';
  apps[appIdx].reviewedBy = `${currentUser ? currentUser.name : "Sales Team"} (${new Date().toLocaleDateString('vi-VN')})`;
  setB2BApplications(apps);

  showToast("Đã từ chối hồ sơ đối tác.");
  renderAdminB2BApplications();
};

// =======================================================================
// CUSTOMER REGISTRATION VERIFICATION & EMAIL ALERTS (Level 3 Sales & Level 5)
// =======================================================================
let currentVerifFilter = 'all';

const filterVerifTable = (status) => {
  currentVerifFilter = status;
  const pills = document.querySelectorAll('#admin-verif-filter-group .b2b-filter-pill');
  pills.forEach(p => {
    p.classList.remove('active');
    if (p.getAttribute('onclick') && p.getAttribute('onclick').includes(status)) {
      p.classList.add('active');
    }
  });
  renderAdminVerifications();
};

const renderAdminVerifications = () => {
  const tbody = document.getElementById("admin-verif-table-body");
  if (!tbody) return;

  const reqs = typeof getRegistrationRequests === 'function' ? getRegistrationRequests() : [];
  const emails = typeof getAdminEmails === 'function' ? getAdminEmails() : [];
  const settings = typeof getSettings === 'function' ? getSettings() : {};

  const pendingReqs = reqs.filter(r => r.status === 'pending');
  const approvedReqs = reqs.filter(r => r.status === 'approved');

  // Update counters & metrics
  const statPending = document.getElementById("verif-stat-pending");
  const statApproved = document.getElementById("verif-stat-approved");
  const statEmails = document.getElementById("verif-stat-emails");
  const emailBadge = document.getElementById("verif-admin-email-badge");
  const tabPendingBadge = document.getElementById("admin-verif-pending-count");
  const cntAll = document.getElementById("verif-count-all");
  const cntPend = document.getElementById("verif-count-pending");
  const cntAppr = document.getElementById("verif-count-approved");

  if (statPending) statPending.textContent = pendingReqs.length;
  if (statApproved) statApproved.textContent = approvedReqs.length;
  if (statEmails) statEmails.textContent = emails.length;
  if (emailBadge) emailBadge.textContent = settings.adminNotificationEmail || 'admin@7dbio.com';
  if (tabPendingBadge) tabPendingBadge.textContent = pendingReqs.length;
  if (cntAll) cntAll.textContent = reqs.length;
  if (cntPend) cntPend.textContent = pendingReqs.length;
  if (cntAppr) cntAppr.textContent = approvedReqs.length;

  const filtered = currentVerifFilter === 'all' ? reqs : reqs.filter(r => r.status === currentVerifFilter);

  tbody.innerHTML = "";

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding:40px; font-style:italic; color:var(--text-muted)">Không có yêu cầu xác thực nào trong danh mục này.</td></tr>`;
    return;
  }

  filtered.forEach(req => {
    const tr = document.createElement("tr");

    let statusBadge = '';
    let actionHtml = '';

    if (req.status === 'pending') {
      statusBadge = `<span class="b2b-status-pill status-pending"><i class="fa-solid fa-hourglass-half"></i> Chờ xác thực</span>`;
      actionHtml = `
        <div class="admin-table-action-btns">
          <button class="admin-table-btn admin-table-btn-approve" onclick="handleApproveCustomer('${req.id}')" title="Xác thực & Kích hoạt quyền truy cập">
            <i class="fa-solid fa-user-check"></i> Xác thực
          </button>
          <button class="admin-table-btn admin-table-btn-delete" onclick="handleRejectCustomer('${req.id}')" title="Từ chối yêu cầu">
            <i class="fa-solid fa-user-xmark"></i> Từ chối
          </button>
        </div>
      `;
    } else if (req.status === 'approved') {
      statusBadge = `<span class="b2b-status-pill status-approved"><i class="fa-solid fa-circle-check"></i> Đã kích hoạt</span>`;
      actionHtml = `
        <div style="font-size:11px; color:#059669; font-weight:600; line-height:1.4;">
          <i class="fa-solid fa-shield-check"></i> Đầy đủ quyền truy cập<br>
          <span style="font-size:10px; color:var(--text-muted); font-weight:normal;">Bởi: ${req.reviewedBy || 'Admin'}</span>
        </div>
      `;
    } else {
      statusBadge = `<span class="b2b-status-pill status-rejected"><i class="fa-solid fa-ban"></i> Đã từ chối</span>`;
      actionHtml = `
        <div style="font-size:11px; color:#dc2626; font-weight:600;">
          <i class="fa-solid fa-circle-xmark"></i> Đã từ chối truy cập
        </div>
      `;
    }

    const regDateStr = req.registeredAt ? new Date(req.registeredAt).toLocaleString('vi-VN', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric' }) : '—';

    // Email dispatch status & preview button
    const emailCell = `
      <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-start;">
        <span class="badge-email-sent">
          <i class="fa-solid fa-paper-plane" style="color:#0284c7;"></i>
          <span>${req.emailSentTo || 'admin@7dbio.com'}</span>
        </span>
        <button type="button" class="btn-email-preview-link" onclick="viewAdminAlertEmail('${req.id}')">
          <i class="fa-solid fa-envelope-open-text"></i> Xem Email cảnh báo
        </button>
      </div>
    `;

    tr.innerHTML = `
      <td><span style="font-weight:700; color:var(--color-primary); font-family:monospace;">${req.id}</span></td>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="staff-table-avatar" style="width:30px; height:30px; font-size:11px;">${req.name ? req.name.charAt(0) : 'K'}</div>
          <div>
            <strong style="color:var(--text-dark);">${req.name}</strong>
            <div style="font-size:10px; color:var(--text-muted);">Khách hàng mới</div>
          </div>
        </div>
      </td>
      <td>
        <div style="font-size:12px;"><strong>${req.email}</strong></div>
        <div style="font-size:11px; color:var(--text-muted);"><i class="fa-solid fa-phone" style="font-size:9px;"></i> ${req.phone || 'Chưa cung cấp'}</div>
      </td>
      <td style="font-size:12px; color:var(--text-muted);">${regDateStr}</td>
      <td style="font-size:12px; color:var(--text-dark); max-width:200px;">
        <div style="background:#f8fafc; padding:4px 8px; border-left:2px solid var(--color-accent); font-size:11px;">
          ${req.notes || 'Khách hàng cá nhân tìm hiểu sản phẩm'}
        </div>
      </td>
      <td>${emailCell}</td>
      <td>${statusBadge}</td>
      <td>${actionHtml}</td>
    `;
    tbody.appendChild(tr);
  });
};

const handleApproveCustomer = (requestId) => {
  const reviewer = currentUser ? `${currentUser.name} (${currentUser.title || 'Admin'})` : "Ban Quản Trị 7Dbio";
  const ok = typeof approveCustomerRegistration === 'function' ? approveCustomerRegistration(requestId, reviewer) : false;
  if (ok) {
    showToast(`Đã xác thực và kích hoạt tài khoản khách hàng thành công! Khách hàng có thể đăng nhập đầy đủ.`);
    renderAdminVerifications();
    updateAdminBadges();
    if (typeof renderAdminStaff === 'function') renderAdminStaff();
  } else {
    alert("Không tìm thấy yêu cầu xác thực hoặc đã xử lý.");
  }
};

const handleRejectCustomer = (requestId) => {
  const reason = prompt("Nhập lý do từ chối yêu cầu đăng ký (tuỳ chọn):", "Thông tin đăng ký chưa đạt yêu cầu xác thực y khoa");
  if (reason === null) return; // User cancelled
  const reviewer = currentUser ? `${currentUser.name} (${currentUser.title || 'Admin'})` : "Ban Quản Trị 7Dbio";
  const ok = typeof rejectCustomerRegistration === 'function' ? rejectCustomerRegistration(requestId, reviewer, reason) : false;
  if (ok) {
    showToast("Đã từ chối yêu cầu đăng ký tài khoản.");
    renderAdminVerifications();
    updateAdminBadges();
  }
};

// Modal email preview
const viewAdminAlertEmail = (requestId) => {
  const reqs = typeof getRegistrationRequests === 'function' ? getRegistrationRequests() : [];
  const req = reqs.find(r => r.id === requestId);
  const emails = typeof getAdminEmails === 'function' ? getAdminEmails() : [];
  let emailRecord = emails.find(e => e.requestId === requestId || (req && e.customerEmail === req.email));

  if (!emailRecord && req) {
    emailRecord = {
      id: "EML-" + req.id,
      to: req.emailSentTo || "admin@7dbio.com",
      from: "7Dbio Medical Notification System <no-reply@7dbio.com>",
      subject: `[7DBIO ALERT] Yêu cầu đăng ký tài khoản mới cần xác thực - ${req.name}`,
      customerName: req.name,
      customerEmail: req.email,
      customerPhone: req.phone || "Chưa cung cấp",
      notes: req.notes || "Khách hàng đăng ký trên trang chủ 7Dbio",
      sentAt: req.registeredAt || new Date().toISOString(),
      status: "delivered"
    };
  }

  if (!emailRecord) {
    alert("Không tìm thấy bản ghi email thông báo.");
    return;
  }

  const modal = document.getElementById("email-preview-modal");
  const fromEl = document.getElementById("email-preview-from");
  const toEl = document.getElementById("email-preview-to");
  const subjEl = document.getElementById("email-preview-subject");
  const timeEl = document.getElementById("email-preview-time");
  const bodyEl = document.getElementById("email-preview-body-content");

  if (fromEl) fromEl.textContent = emailRecord.from || "7Dbio Medical Cloud <no-reply@7dbio.com>";
  if (toEl) toEl.textContent = emailRecord.to || "admin@7dbio.com";
  if (subjEl) subjEl.textContent = emailRecord.subject;
  if (timeEl) timeEl.textContent = new Date(emailRecord.sentAt).toLocaleString('vi-VN', { hour:'2-digit', minute:'2-digit', second:'2-digit', day:'2-digit', month:'2-digit', year:'numeric' }) + " (UTC+7)";

  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 16px;">
        <!-- Header -->
        <div style="border-bottom: 2px solid #C5A059; padding-bottom: 10px; margin-bottom: 14px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h2 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 18px; color: #000; letter-spacing: 0.5px;">7Dbio<span style="color:#C5A059;">.</span> VIETNAM</h2>
            <div style="font-size: 10px; color: #64748b; letter-spacing: 0.5px;">MEDICAL AESTHETICS & BIOTECHNOLOGY DISPATCH</div>
          </div>
          <span style="background: #fef3c7; color: #d97706; border: 1px solid #fde68a; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 2px;">
            <i class="fa-solid fa-bell"></i> YÊU CẦU DUYỆT TÀI KHOẢN
          </span>
        </div>

        <p style="font-size: 13px; line-height: 1.5; margin: 0 0 8px;">
          Kính gửi <strong>Ban Quản Trị Hệ Thống 7Dbio</strong>,
        </p>

        <p style="font-size: 12px; line-height: 1.5; color: #334155; margin: 0 0 14px;">
          Hệ thống vừa ghi nhận một khách hàng mới gửi biểu mẫu đăng ký thành viên trên cổng điện tử <code>7dbio.com</code>. Để đảm bảo tuân thủ quy chế an toàn Dược phẩm sinh học và phân phối chuẩn y khoa, tài khoản đang được giữ ở trạng thái <strong>Chờ Xác Thực (Pending)</strong>.
        </p>

        <!-- Customer Summary Box (Compact) -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 12px 14px; margin-bottom: 14px;">
          <h4 style="margin: 0 0 8px; font-size: 11.5px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
            <i class="fa-solid fa-address-card" style="color:#C5A059; margin-right:6px;"></i>Thông Tin Hồ Sơ Đăng Ký
          </h4>
          <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 4px 0; color: #64748b; width: 130px;">Mã Request:</td>
              <td style="padding: 4px 0; font-weight: 700; font-family: monospace; color:#0284c7;">${req ? req.id : requestId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 4px 0; color: #64748b;">Họ và Tên:</td>
              <td style="padding: 4px 0; font-weight: 700; color: #0f172a;">${emailRecord.customerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 4px 0; color: #64748b;">Email đăng nhập:</td>
              <td style="padding: 4px 0; font-weight: 600; color: #0f172a;">${emailRecord.customerEmail}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 4px 0; color: #64748b;">Số điện thoại:</td>
              <td style="padding: 4px 0; font-weight: 600; color: #0f172a;">${emailRecord.customerPhone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 4px 0; color: #64748b;">Nhu cầu / Đơn vị:</td>
              <td style="padding: 4px 0; color: #334155;">${emailRecord.notes}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;">Thời gian đăng ký:</td>
              <td style="padding: 4px 0; color: #64748b;">${new Date(emailRecord.sentAt).toLocaleString('vi-VN')}</td>
            </tr>
          </table>
        </div>

        <!-- Call to action inside email (Compact) -->
        <div style="background: #fafaf9; border-left: 3px solid #C5A059; padding: 10px 14px; margin-bottom: 14px; font-size: 11.5px; color: #44403c; line-height: 1.5;">
          <strong>Hướng dẫn Quản trị viên:</strong> Vui lòng đăng nhập Bảng Điều Khiển Quản Trị hoặc nhấp nút phía dưới để kích hoạt tài khoản cho khách hàng.
        </div>

        ${req && req.status === 'pending' ? `
          <div style="text-align: center; margin-bottom: 14px;">
            <button type="button" class="btn-elegant btn-elegant-primary" onclick="closeEmailPreviewModal(); handleApproveCustomer('${req.id}');" style="padding: 10px 24px; font-size: 12px; letter-spacing: 0.5px;">
              <i class="fa-solid fa-check" style="margin-right:6px;"></i> Xác Thực &amp; Kích Hoạt Tài Khoản Này Ngay
            </button>
          </div>
        ` : `
          <div style="text-align:center; padding:9px 12px; background:#ecfdf5; border:1px solid #a7f3d0; color:#059669; font-size:11.5px; font-weight:600; margin-bottom:14px; border-radius:3px;">
            <i class="fa-solid fa-circle-check"></i> Tài khoản này đã được xác thực trước đó (${req?.reviewedBy || 'Admin'}).
          </div>
        `}

        <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10.5px; color: #94a3b8; text-align: center; line-height: 1.5;">
          Đây là email thông báo tự động từ Cổng Điều Hành Dược Mỹ Phẩm 7Dbio.<br>
          Địa chỉ nhận: <strong>${emailRecord.to}</strong> &bull; Hỗ trợ kỹ thuật: <code>tech@7dbio.com</code>
        </div>
      </div>
    `;
  }

  if (modal) modal.classList.add("active");
};

const closeEmailPreviewModal = () => {
  const modal = document.getElementById("email-preview-modal");
  if (modal) modal.classList.remove("active");
};

// =======================================================================
// COLD-CHAIN GSP INVENTORY & BATCH EXPIRY (Level 4 Warehouse & Level 5)
// =======================================================================
const renderAdminInventory = () => {
  const tbody = document.getElementById("admin-inventory-table-body");
  if (!tbody) return;
  const products = getProducts();
  tbody.innerHTML = "";

  products.forEach(p => {
    const tr = document.createElement("tr");
    const locProd = typeof getLocalizedProduct === 'function' ? getLocalizedProduct(p, currentLang) : p;
    const sku = locProd.sku || `7D-${locProd.id}`;
    const storage = locProd.medicalSpecs?.storageTemp || "2°C - 8°C (Cold-Chain)";
    const batchNo = locProd.batchInfo?.batchNo || "VB2026A";
    const expDate = locProd.batchInfo?.expDate || "2028-01-01";

    const expTime = new Date(expDate).getTime();
    const nowTime = new Date().getTime();
    const diffDays = Math.ceil((expTime - nowTime) / (1000 * 60 * 60 * 24));
    
    let expBadge = '';
    const safeDaysText = (t('exp_safe_days') || '{days} ngày').replace('{days}', diffDays);
    const nearExpText = t('exp_near_expiry') || 'Gần hết hạn';
    if (diffDays > 365) {
      expBadge = `<span class="badge-exp-safe"><i class="fa-solid fa-shield-check"></i> ${expDate} (${safeDaysText})</span>`;
    } else if (diffDays > 90) {
      expBadge = `<span class="badge-exp-safe" style="background:#fef3c7; color:#d97706; border-color:#fde68a;"><i class="fa-solid fa-clock"></i> ${expDate} (${safeDaysText})</span>`;
    } else {
      expBadge = `<span class="badge-exp-warn"><i class="fa-solid fa-triangle-exclamation"></i> ${expDate} (${nearExpText})</span>`;
    }

    tr.innerHTML = `
      <td><span style="font-family:monospace; font-weight:700; color:var(--color-primary);">${sku}</span></td>
      <td>
        <div style="font-weight:600; color:var(--text-dark);">${locProd.name}</div>
        <div style="font-size:11px; color:var(--text-muted);">${locProd.medicalSpecs?.activeIngredient || ''}</div>
      </td>
      <td>
        <span class="storage-temp-badge"><i class="fa-solid fa-snowflake"></i> ${storage}</span>
      </td>
      <td><strong style="color:#0f172a;">${batchNo}</strong></td>
      <td>${expBadge}</td>
      <td>
        <span class="stock-pill-val ${locProd.stock <= 5 ? 'stock-critical' : ''}">${locProd.stock} ${t('stock_unit') || 'sản phẩm'}</span>
      </td>
      <td>
        <div class="stock-control-group">
          <button class="btn-stock-pill" onclick="handleAdjustStock('${p.id}', -1)" title="Giảm 1">-</button>
          <span class="stock-num-badge">${locProd.stock}</span>
          <button class="btn-stock-pill" onclick="handleAdjustStock('${p.id}', 1)" title="Tăng 1">+</button>
          <button class="btn-stock-restock" onclick="handleRestockProduct('${p.id}')" title="Nhập thêm 10 sp">+10</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Render Anti-Counterfeit Serials Monitor
  const serialsTbody = document.getElementById("admin-serials-table-body");
  if (serialsTbody) {
    const serials = typeof getSerials === 'function' ? getSerials() : [];
    serialsTbody.innerHTML = "";
    serials.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><code class="serial-code-text"><i class="fa-solid fa-barcode" style="margin-right:6px;"></i>${s.code}</code></td>
        <td><strong>${s.productName}</strong></td>
        <td>${s.batchNo}</td>
        <td><span style="color:var(--color-primary); font-weight:600;">${s.clinicAssigned || 'Trung tâm Phân phối 7Dbio'}</span></td>
        <td><span style="font-weight:700; color:#0284c7;">${s.verifiedCount || 1} lượt</span></td>
        <td>
          <span class="badge-serial-active"><i class="fa-solid fa-shield-halved"></i> Mã gốc chính hãng</span>
        </td>
      `;
      serialsTbody.appendChild(tr);
    });
  }
};

const handleAdjustStock = (productId, delta) => {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === productId);
  if (idx === -1) return;

  const currentStock = products[idx].stock || 0;
  const newStock = Math.max(0, currentStock + delta);
  products[idx].stock = newStock;
  setProducts(products);

  renderAdminInventory();
  if (typeof renderProducts === 'function') renderProducts();
  showToast(`Đã cập nhật tồn kho: ${products[idx].name} (${newStock} sp).`);
};

const handleRestockProduct = (productId) => {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === productId);
  if (idx === -1) return;

  products[idx].stock = (products[idx].stock || 0) + 10;
  setProducts(products);

  renderAdminInventory();
  if (typeof renderProducts === 'function') renderProducts();
  showToast(`Đã nhập thêm 10 sản phẩm cho ${products[idx].name}!`);
};

// =======================================================================
// STAFF & RBAC PERMISSIONS MATRIX (Level 5 Super Admin Only)
// =======================================================================
const renderAdminStaff = () => {
  const tbody = document.getElementById("admin-staff-table-body");
  if (!tbody) return;
  const users = getUsers();
  const staff = users.filter(u => isInternalUser(u));

  // Sort by level descending
  staff.sort((a,b) => {
    const lvlA = ROLE_DEFINITIONS[a.role]?.level || 0;
    const lvlB = ROLE_DEFINITIONS[b.role]?.level || 0;
    return lvlB - lvlA;
  });

  tbody.innerHTML = "";

  staff.forEach(u => {
    const tr = document.createElement("tr");
    const locUser = typeof getLocalizedStaff === 'function' ? getLocalizedStaff(u, currentLang) : u;
    const roleDef = ROLE_DEFINITIONS[u.role] || {};

    let roleBadge = '';
    let permPills = '';
    const levelPrefix = t('staff_level_prefix') || 'CẤP';

    if (u.role === 'super_admin' || u.role === 'admin') {
      roleBadge = `<span class="badge-role badge-super-admin"><i class="fa-solid fa-crown"></i> ${t('staff_badge_super_admin') || 'SUPER ADMIN'}</span> <span class="badge-level">${levelPrefix} 5</span>`;
      permPills = `<span class="perm-pill perm-all"><i class="fa-solid fa-shield-halved"></i> ${t('perm_all')}</span>`;
    } else if (u.role === 'warehouse_logistics') {
      roleBadge = `<span class="badge-role badge-warehouse"><i class="fa-solid fa-snowflake"></i> ${t('staff_badge_warehouse') || 'KHO LẠNH GSP'}</span> <span class="badge-level">${levelPrefix} 4</span>`;
      permPills = `
        <span class="perm-pill"><i class="fa-solid fa-temperature-arrow-down"></i> ${t('perm_coldchain')}</span>
        <span class="perm-pill"><i class="fa-solid fa-boxes-stacked"></i> ${t('perm_stock_batch')}</span>
        <span class="perm-pill"><i class="fa-solid fa-qrcode"></i> ${t('perm_anti_counterfeit')}</span>
        <span class="perm-pill"><i class="fa-solid fa-truck-fast"></i> ${t('perm_cold_shipping')}</span>
      `;
    } else if (u.role === 'sales_rep') {
      roleBadge = `<span class="badge-role badge-sales"><i class="fa-solid fa-briefcase"></i> ${t('staff_badge_sales') || 'SALES B2B'}</span> <span class="badge-level">${levelPrefix} 3</span>`;
      permPills = `
        <span class="perm-pill"><i class="fa-solid fa-user-doctor"></i> ${t('perm_b2b_eval')}</span>
        <span class="perm-pill"><i class="fa-solid fa-tags"></i> ${t('perm_vip_pricing')}</span>
        <span class="perm-pill"><i class="fa-solid fa-cart-flatbed"></i> ${t('perm_b2b_orders')}</span>
        <span class="perm-pill"><i class="fa-solid fa-chart-line"></i> ${t('perm_b2b_crm')}</span>
      `;
    }

    tr.innerHTML = `
      <td>
        <div class="staff-table-avatar">${locUser.avatar || (locUser.name ? locUser.name.charAt(0) : "7D")}</div>
      </td>
      <td>
        <strong style="font-size:14px; color:var(--text-dark);">${locUser.name}</strong>
      </td>
      <td>
        <div style="font-weight:600; font-size:12px; color:var(--color-primary);">${locUser.title || roleDef.label}</div>
        <div style="font-size:11px; color:var(--text-muted);">${locUser.department || roleDef.department}</div>
      </td>
      <td>${roleBadge}</td>
      <td>
        <div style="font-size:12px;"><i class="fa-solid fa-envelope" style="font-size:10px; color:var(--text-muted);"></i> <strong>${locUser.email}</strong></div>
        <div style="font-size:11px; color:var(--text-muted);"><i class="fa-solid fa-phone" style="font-size:10px;"></i> ${locUser.phone || '0988.xxx.xxx'}</div>
      </td>
      <td style="max-width:280px;">
        <div class="perm-pills-wrap">
          ${permPills}
        </div>
      </td>
      <td>
        <span class="staff-status-active"><i class="fa-solid fa-circle" style="color:#10b981; font-size:8px;"></i> ${t('staff_status_active') || 'Đang hoạt động'}</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

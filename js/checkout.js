// =============================================
// CHECKOUT FLOW, COUPONS & ORDER TIMELINE (v2.0)
// =============================================

// DOM Elements
const checkoutForm = document.getElementById("checkout-form");
const checkoutName = document.getElementById("checkout-name");
const checkoutPhone = document.getElementById("checkout-phone");
const checkoutEmail = document.getElementById("checkout-email");
const checkoutAddress = document.getElementById("checkout-address");
const checkoutNote = document.getElementById("checkout-note");
const paymentCodLabel = document.getElementById("payment-cod-label");
const paymentBankLabel = document.getElementById("payment-bank-label");
const bankTransferDetails = document.getElementById("bank-transfer-details");
const bankTransferMemo = document.getElementById("bank-transfer-memo");
const checkoutSummaryItems = document.getElementById("checkout-summary-items");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutShipping = document.getElementById("checkout-shipping");
const checkoutGrandTotal = document.getElementById("checkout-grand-total");
const placeOrderBtn = document.getElementById("place-order-btn");
const orderHistoryList = document.getElementById("order-history-list");

// Discount coupon variables
let checkoutCoupon = null;

const renderCheckoutSummary = () => {
  if (!checkoutSummaryItems || !checkoutSubtotal || !checkoutShipping || !checkoutGrandTotal || !placeOrderBtn) return;
  checkoutSummaryItems.innerHTML = "";
  
  if (currentCart.length === 0) {
    checkoutSummaryItems.innerHTML = `<div class="no-data">${t('cart_empty')}</div>`;
    checkoutSubtotal.textContent = "0đ";
    checkoutShipping.textContent = "0đ";
    checkoutGrandTotal.textContent = "0đ";
    placeOrderBtn.disabled = true;
    return;
  }

  placeOrderBtn.disabled = false;
  let subtotal = 0;

  currentCart.forEach(item => {
    subtotal += item.price * item.quantity;
    const row = document.createElement("div");
    row.className = "checkout-summary-item";
    row.innerHTML = `
      <div>
        <span>${item.productName} <strong>x ${item.quantity}</strong></span>
        ${item.isWholesale ? '<span class="badge-b2b-price" style="font-size:10px; margin-left:4px;">Giá sỉ B2B</span>' : ''}
      </div>
      <span>${formatVND(item.price * item.quantity)}</span>
    `;
    checkoutSummaryItems.appendChild(row);
  });

  let shipping = subtotal >= 2000000 ? 0 : 35000;
  let discountAmount = 0;

  if (checkoutCoupon) {
    if (checkoutCoupon.isFreeShip) {
      shipping = 0;
    } else {
      discountAmount = checkoutCoupon.discount || 0;
    }
  }

  const grandTotal = Math.max(0, subtotal + shipping - discountAmount);

  checkoutSubtotal.textContent = formatVND(subtotal);
  checkoutShipping.textContent = shipping === 0 ? t('free_shipping') : formatVND(shipping);
  
  // Render Discount line if applicable
  const discountRow = document.getElementById("checkout-discount-row");
  const discountVal = document.getElementById("checkout-discount-val");
  if (discountRow && discountVal) {
    if (discountAmount > 0) {
      discountRow.style.display = "flex";
      discountVal.textContent = `- ${formatVND(discountAmount)}`;
    } else {
      discountRow.style.display = "none";
    }
  }

  checkoutGrandTotal.textContent = formatVND(grandTotal);
};

// Handle Coupon Application
const applyCheckoutCoupon = () => {
  const input = document.getElementById("coupon-input");
  const msgEl = document.getElementById("coupon-message");
  if (!input) return;

  const code = input.value.trim();
  if (!code) {
    if (msgEl) {
      msgEl.textContent = "Vui lòng nhập mã giảm giá.";
      msgEl.className = "coupon-msg coupon-err";
    }
    return;
  }

  const subtotal = currentCart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const result = applyCouponCode(code, subtotal);

  if (result.success) {
    checkoutCoupon = result;
    if (msgEl) {
      msgEl.textContent = result.message;
      msgEl.className = "coupon-msg coupon-success";
    }
    showToast(result.message);
  } else {
    checkoutCoupon = null;
    if (msgEl) {
      msgEl.textContent = result.message;
      msgEl.className = "coupon-msg coupon-err";
    }
  }

  renderCheckoutSummary();
};

// Handle payment toggles
document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
  radio.addEventListener("change", (e) => {
    if (!paymentCodLabel || !paymentBankLabel || !bankTransferDetails || !bankTransferMemo) return;
    
    if (e.target.value === 'cod') {
      paymentCodLabel.classList.add("active");
      bankTransferDetails.classList.remove("active");
    } else {
      paymentBankLabel.classList.add("active");
      bankTransferDetails.classList.add("active");
      
      const phoneVal = (checkoutPhone && checkoutPhone.value.trim()) || "098XXXXXXX";
      bankTransferMemo.textContent = `7D ${phoneVal}`;
    }
  });
});

if (checkoutPhone) {
  checkoutPhone.addEventListener("input", () => {
    if (bankTransferMemo) {
      const phoneVal = checkoutPhone.value.trim() || "098XXXXXXX";
      bankTransferMemo.textContent = `7D ${phoneVal}`;
    }
  });
}

// Placing Order
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    if (currentCart.length === 0) {
      showToast(t('toast_cart_empty'));
      return;
    }

    if (!currentUser) {
      showToast(t('toast_login_required'));
      openAuthModal('login');
      return;
    }

    if (!checkoutName.value.trim() || !checkoutPhone.value.trim() || !checkoutEmail.value.trim() || !checkoutAddress.value.trim()) {
      showToast(t('toast_shipping_info_required'));
      if (checkoutForm) checkoutForm.reportValidity();
      return;
    }

    const products = getProducts();
    
    // Stock Check
    for (const item of currentCart) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod || prod.stock < item.quantity) {
        showToast(t('toast_out_of_stock_pattern').replace('{name}', item.productName));
        return;
      }
    }

    // Deduct stock
    const updatedProducts = products.map(prod => {
      const cartItem = currentCart.find(item => item.productId === prod.id);
      if (cartItem) {
        return { ...prod, stock: prod.stock - cartItem.quantity };
      }
      return prod;
    });
    setProducts(updatedProducts);
    if (typeof renderProducts === 'function') renderProducts();

    // Create Order with Cold-Chain Tracking
    const orders = getOrders();
    const paymentRadio = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethod = paymentRadio ? paymentRadio.value : 'cod';
    const subtotal = currentCart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    let shipping = subtotal >= 2000000 ? 0 : 35000;
    let discount = 0;

    if (checkoutCoupon) {
      if (checkoutCoupon.isFreeShip) shipping = 0;
      else discount = checkoutCoupon.discount || 0;
    }

    const orderIdNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = "ORD-7D" + orderIdNum;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder = {
      id: orderId,
      userEmail: currentUser.email,
      name: checkoutName.value.trim(),
      clinicName: currentUser.clinicName || "",
      phone: checkoutPhone.value.trim(),
      address: checkoutAddress.value.trim(),
      note: checkoutNote ? checkoutNote.value.trim() : "",
      paymentMethod: paymentMethod,
      isPaid: paymentMethod === 'bank',
      shippingProvider: "ColdChain Express (Thùng lạnh 2-8°C)",
      trackingCode: `7D-CC-${orderIdNum}0-VN`,
      items: currentCart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        batchNo: item.batchNo || "2026-STD"
      })),
      subtotal: subtotal,
      discountAmount: discount,
      couponCode: checkoutCoupon ? checkoutCoupon.coupon.code : "",
      shippingFee: shipping,
      total: Math.max(0, subtotal + shipping - discount),
      status: "pending",
      date: now.toISOString(),
      timeline: [
        {
          step: "Đã tiếp nhận đơn hàng",
          time: formattedDate,
          desc: "Đơn hàng đã được ghi nhận trên hệ thống 7Dbio"
        },
        {
          step: paymentMethod === 'bank' ? "Đã xác nhận thanh toán QR" : "Chờ xác nhận COD",
          time: formattedDate,
          desc: paymentMethod === 'bank' ? "Đã khớp lệnh thanh toán qua Vietcombank" : "Nhân viên sẽ gọi điện xác nhận đơn hàng"
        },
        {
          step: "Đóng gói lạnh bảo ôn",
          time: "Dự kiến 2h tới",
          desc: "Kiểm tra nhiệt độ chuẩn 2-8°C và dán tem niêm phong"
        },
        {
          step: "Bàn giao vận chuyển ColdChain",
          time: "Dự kiến trong ngày",
          desc: `Mã vận đơn hành trình: 7D-CC-${orderIdNum}0-VN`
        }
      ]
    };

    orders.unshift(newOrder);
    setOrders(orders);

    currentCart = [];
    checkoutCoupon = null;
    saveCart();

    showToast(t('toast_order_success'));
    if (checkoutForm) checkoutForm.reset();
    
    setTimeout(() => {
      switchView('orders');
    }, 800);
  });
}

// Render Order History with Tracking Timeline
const renderOrderHistory = () => {
  if (!orderHistoryList) return;
  orderHistoryList.innerHTML = "";
  if (!currentUser) return;

  const orders = getOrders();
  const myOrders = orders.filter(o => o.userEmail === currentUser.email).sort((a,b) => new Date(b.date) - new Date(a.date));

  if (myOrders.length === 0) {
    orderHistoryList.innerHTML = `<div class="no-data">${t('no_orders')}</div>`;
    return;
  }

  myOrders.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-history-card animated-fade";
    
    let statusClass = "order-status-pending";
    let statusText = t('status_pending');
    if (order.status === 'shipping') {
      statusClass = "order-status-shipping";
      statusText = t('status_shipping');
    } else if (order.status === 'completed') {
      statusClass = "order-status-completed";
      statusText = t('status_completed');
    }

    const locale = currentLang === 'en' ? 'en-US' : currentLang === 'zh' ? 'zh-CN' : 'vi-VN';
    const dateStr = new Date(order.date).toLocaleDateString(locale, {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    let itemsHtml = "";
    order.items.forEach(item => {
      itemsHtml += `
        <div class="order-history-item-row">
          <div>
            <span class="order-history-item-name">${item.productName} <strong style="color:var(--color-primary)">x${item.quantity}</strong></span>
            ${item.batchNo ? `<span style="display:block; font-size:11px; color:var(--text-muted);">Số lô: ${item.batchNo}</span>` : ''}
          </div>
          <span class="order-history-item-price">${formatVND(item.price * item.quantity)}</span>
        </div>
      `;
    });

    // Timeline HTML
    let timelineHtml = "";
    if (order.timeline && order.timeline.length > 0) {
      timelineHtml = `
        <div class="order-timeline-box">
          <h4 class="order-timeline-title"><i class="fa-solid fa-truck-ramp-box" style="color:var(--color-accent); margin-right:8px;"></i>${t('order_timeline_title')}</h4>
          <div class="order-timeline-stepper">
            ${order.timeline.map((step, idx) => `
              <div class="timeline-step-item ${idx === 0 ? 'active' : ''}">
                <div class="timeline-step-dot"></div>
                <div class="timeline-step-content">
                  <div class="timeline-step-name"><strong>${step.step}</strong> <span class="timeline-step-time">${step.time}</span></div>
                  <div class="timeline-step-desc">${step.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="order-history-header">
        <div>
          <span class="order-history-id">${t('order_id_label')} <strong>${order.id}</strong></span>
          ${order.trackingCode ? `<span class="order-tracking-badge"><i class="fa-solid fa-snowflake"></i> ${order.trackingCode}</span>` : ''}
        </div>
        <span class="order-history-date">${dateStr}</span>
      </div>

      <div class="order-history-items">
        ${itemsHtml}
      </div>

      <div class="order-shipping-meta">
        <p><strong>${t('order_recipient')}</strong> ${order.name} ${order.clinicName ? `(${order.clinicName})` : ''} - 📞 ${order.phone}</p>
        <p><strong>${t('order_address')}</strong> ${order.address}</p>
        <p><strong>${t('order_payment')}</strong> ${order.paymentMethod === 'cod' ? t('payment_cod') : t('payment_bank')} ${order.isPaid ? '— <span style="color:#10b981; font-weight:600;"><i class="fa-solid fa-circle-check"></i> Đã thanh toán</span>' : ''}</p>
        <p><strong>Vận chuyển:</strong> ${order.shippingProvider || 'ColdChain Express 2-8°C'}</p>
        ${order.discountAmount ? `<p style="color:#059669;"><strong>${t('discount_label')}:</strong> -${formatVND(order.discountAmount)} (Mã: ${order.couponCode})</p>` : ''}
      </div>

      ${timelineHtml}

      <div class="order-history-footer">
        <span class="order-status-badge ${statusClass}">${statusText}</span>
        <div class="order-history-total">${t('order_total_label')} <span>${formatVND(order.total)}</span></div>
      </div>
    `;
    orderHistoryList.appendChild(card);
  });
};

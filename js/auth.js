// =============================================
// AUTHENTICATION SYSTEM (Login / Register / B2B)
// =============================================

// DOM Elements
const authModal = document.getElementById("auth-modal");
const authModalCloseBtn = document.getElementById("auth-modal-close-btn");
const authTabLogin = document.getElementById("auth-tab-login");
const authTabRegister = document.getElementById("auth-tab-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");
const authStatusContainer = document.getElementById("auth-status-container");

const updateAuthHeader = () => {
  if (!authStatusContainer) return;
  if (currentUser) {
    let roleBadge = '';
    const isInternal = isInternalUser(currentUser);

    if (currentUser.role === 'super_admin' || currentUser.role === 'admin') {
      roleBadge = '<span class="badge-role badge-super-admin"><i class="fa-solid fa-crown"></i> SUPER ADMIN</span>';
    } else if (currentUser.role === 'warehouse_logistics') {
      roleBadge = '<span class="badge-role badge-warehouse"><i class="fa-solid fa-snowflake"></i> KHO LẠNH GSP</span>';
    } else if (currentUser.role === 'sales_rep') {
      roleBadge = '<span class="badge-role badge-sales"><i class="fa-solid fa-briefcase"></i> SALES B2B</span>';
    } else if (currentUser.role === 'b2b_clinic') {
      roleBadge = `<span class="badge-role badge-b2b"><i class="fa-solid fa-user-doctor"></i> ${t('role_b2b_badge')}</span>`;
    }

    // Show User status
    authStatusContainer.innerHTML = `
      <div class="user-profile-header">
        <span class="user-welcome-top">
          ${t('welcome')} <strong id="header-user-name" style="cursor:pointer; text-decoration:underline;">${currentUser.name}</strong>
          ${roleBadge}
        </span>
        <button id="logout-btn" class="auth-btn-top" style="color:#C0392B;">
          <i class="fa-solid fa-right-from-bracket"></i> ${t('btn_logout')}
        </button>
      </div>
    `;

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        logoutUser();
      });
    }

    const nameBtn = document.getElementById("header-user-name");
    if (nameBtn) {
      nameBtn.addEventListener("click", () => {
        if (isInternal) {
          switchView('admin');
        } else {
          switchView('orders');
        }
      });
    }

    // Toggle nav items based on role
    const navAdmin = document.getElementById("nav-admin-li");
    const navOrders = document.getElementById("nav-orders-li");
    if (navAdmin) {
      navAdmin.style.display = isInternal ? "block" : "none";
      const navAdminLink = navAdmin.querySelector("a");
      if (navAdminLink) {
        if (currentUser.role === 'super_admin' || currentUser.role === 'admin') {
          navAdminLink.innerHTML = '<i class="fa-solid fa-shield-halved" style="margin-right:4px;"></i> Quản trị tối cao';
        } else if (currentUser.role === 'warehouse_logistics') {
          navAdminLink.innerHTML = '<i class="fa-solid fa-snowflake" style="margin-right:4px;"></i> Quản lý Kho lạnh';
        } else if (currentUser.role === 'sales_rep') {
          navAdminLink.innerHTML = '<i class="fa-solid fa-briefcase" style="margin-right:4px;"></i> Cổng B2B Sales';
        }
      }
    }
    if (navOrders) navOrders.style.display = isInternal ? "none" : "block";
  } else {
    // Default logged-out header
    authStatusContainer.innerHTML = `
      <button id="show-auth-btn" class="auth-btn-top">
        <i class="fa-regular fa-user"></i>
        <span>${t('login')}</span>
      </button>
    `;
    
    const showAuthBtn = document.getElementById("show-auth-btn");
    if (showAuthBtn) {
      showAuthBtn.addEventListener("click", () => {
        openAuthModal('login');
      });
    }

    const navAdmin = document.getElementById("nav-admin-li");
    const navOrders = document.getElementById("nav-orders-li");
    if (navAdmin) navAdmin.style.display = "none";
    if (navOrders) navOrders.style.display = "none";
  }
};

const openAuthModal = (tab = 'login') => {
  if (authModal) {
    authModal.classList.add("active");
    switchAuthTab(tab);
  }
};

const closeAuthModal = () => {
  if (authModal) {
    authModal.classList.remove("active");
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
    if (loginError) loginError.style.display = "none";
    if (registerError) registerError.style.display = "none";
  }
};

const switchAuthTab = (tab) => {
  if (!authTabLogin || !authTabRegister || !loginForm || !registerForm) return;
  if (tab === 'login') {
    authTabLogin.classList.add("active");
    authTabRegister.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
  } else {
    authTabLogin.classList.remove("active");
    authTabRegister.classList.add("active");
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
  }
};

const logoutUser = () => {
  currentUser = null;
  sessionStorage.removeItem("7dbio_current_user");
  sessionStorage.removeItem("puredermi_current_user");
  updateAuthHeader();
  if (typeof renderProducts === 'function') renderProducts();
  switchView('home');
  showToast(t('toast_logout_success'));
};

const quickLogin = (email, password) => {
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  if (emailInput && passwordInput) {
    emailInput.value = email;
    passwordInput.value = password;
    if (loginForm) loginForm.requestSubmit();
  }
};

// Event Listeners initialization
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (loginError) loginError.style.display = "none";
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      // Check customer verification status (Level 1 Customer)
      if (user.role === 'customer' && (user.status === 'pending_verification' || user.verified === false)) {
        showCustomerPendingModal(user);
        return;
      }
      if (user.status === 'rejected') {
        alert("Tài khoản của bạn đã bị từ chối xác thực. Vui lòng liên hệ Hotline 0988.777.999 để được hỗ trợ.");
        return;
      }

      currentUser = user;
      sessionStorage.setItem("7dbio_current_user", JSON.stringify(currentUser));
      updateAuthHeader();
      closeAuthModal();
      showToast(t('toast_login_success').replace('{name}', currentUser.name));
      
      // Re-render products to show B2B wholesale pricing if applicable
      if (typeof renderProducts === 'function') renderProducts();

      // Auto redirect based on internal vs customer role
      if (isInternalUser(currentUser)) {
        switchView('admin');
      } else {
        const viewCheckout = document.getElementById("view-checkout");
        if (viewCheckout && viewCheckout.classList.contains("active")) {
          const checkoutName = document.getElementById("checkout-name");
          const checkoutEmail = document.getElementById("checkout-email");
          const checkoutPhone = document.getElementById("checkout-phone");
          const checkoutAddress = document.getElementById("checkout-address");
          if (checkoutName) checkoutName.value = currentUser.name;
          if (checkoutEmail) checkoutEmail.value = currentUser.email;
          if (checkoutPhone && currentUser.phone) checkoutPhone.value = currentUser.phone;
          if (checkoutAddress && currentUser.address) checkoutAddress.value = currentUser.address;
        }
      }
    } else {
      if (loginError) loginError.style.display = "block";
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (registerError) registerError.style.display = "none";
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim().toLowerCase();
    const phoneInput = document.getElementById("register-phone");
    const notesInput = document.getElementById("register-notes");
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const notes = notesInput ? notesInput.value : "Khách hàng cá nhân tìm hiểu sản phẩm";
    const password = document.getElementById("register-password").value;

    if (password.length < 6) {
      if (registerError) {
        registerError.textContent = t('err_password_too_short');
        registerError.style.display = "block";
      }
      return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
      if (registerError) {
        registerError.textContent = t('err_email_exists');
        registerError.style.display = "block";
      }
      return;
    }

    // Create user with pending_verification status
    const newUser = { 
      id: "USR-CUS-" + Date.now(),
      email, 
      password, 
      name, 
      phone,
      notes,
      role: "customer",
      status: "pending_verification",
      verified: false,
      registeredAt: new Date().toISOString()
    };
    users.push(newUser);
    setUsers(users);

    // Save registration request ticket
    const reqs = getRegistrationRequests();
    const newReq = {
      id: "REG-" + Date.now().toString().slice(-6),
      userId: newUser.id,
      name,
      email,
      phone,
      notes,
      registeredAt: new Date().toISOString(),
      status: "pending",
      emailDispatched: true,
      emailSentTo: "admin@7dbio.com",
      emailDispatchedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null
    };
    reqs.unshift(newReq);
    setRegistrationRequests(reqs);

    // Dispatch automated email notification to Administrator
    if (typeof dispatchAdminRegistrationEmail === 'function') {
      dispatchAdminRegistrationEmail({ name, email, phone, notes });
    }

    // Close Auth modal and show Verification Notice Modal
    closeAuthModal();
    showVerificationSentModal(newUser);
    showToast("Đã gửi yêu cầu đăng ký & email thông báo tới Ban Quản Trị!");
  });
}

const showVerificationSentModal = (user) => {
  let modal = document.getElementById("verification-notice-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "verification-notice-modal";
    modal.className = "modal-overlay active";
    document.body.appendChild(modal);
  } else {
    modal.classList.add("active");
  }

  modal.innerHTML = `
    <div class="modal-container" style="max-width: 520px; text-align: center; padding: 36px 30px;">
      <div style="width:68px; height:68px; border-radius:50%; background:rgba(197, 160, 89, 0.15); border: 2px solid var(--color-accent); display:flex; align-items:center; justify-content:center; margin: 0 auto 18px; color: var(--color-accent); font-size: 28px;">
        <i class="fa-solid fa-envelope-circle-check"></i>
      </div>
      <h3 style="font-size: 22px; font-family: 'Playfair Display', serif; color: var(--text-dark); margin-bottom: 8px;">
        Yêu Cầu Đăng Ký Đã Được Tiếp Nhận
      </h3>
      <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
        Cảm ơn Quý khách <strong>${user.name}</strong>! Hồ sơ đăng ký đã được chuyển tới hệ thống điều phối y khoa của 7Dbio.
      </p>

      <div style="background: #f8fafc; border: 1px solid var(--border-light); padding: 16px; text-align: left; margin-bottom: 22px; font-size: 12px; line-height: 1.8;">
        <div style="display:flex; justify-content:space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
          <span style="color:var(--text-muted);">Email đăng ký:</span>
          <strong>${user.email}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
          <span style="color:var(--text-muted);">Số điện thoại:</span>
          <strong>${user.phone || 'Chưa cung cấp'}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px; margin-bottom: 6px;">
          <span style="color:var(--text-muted);">Email thông báo Admin:</span>
          <span style="color:#0284c7; font-weight:700;"><i class="fa-solid fa-paper-plane"></i> Đã gửi tới admin@7dbio.com</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Trạng thái tài khoản:</span>
          <span style="color:#d97706; font-weight:700;"><i class="fa-solid fa-hourglass-half"></i> Chờ Ban Quản Trị xác thực</span>
        </div>
      </div>

      <p style="font-size: 11px; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px; font-style: italic;">
        * Nhằm đảm bảo an toàn Dược - Mỹ phẩm sinh học và tiêu chuẩn Y khoa, Quản trị viên sẽ kiểm tra và kích hoạt tài khoản trong vòng 15-30 phút làm việc.
      </p>

      <div style="display:flex; gap:10px; justify-content:center;">
        <button type="button" class="btn-elegant btn-elegant-primary" onclick="closeVerificationNoticeModal(); openAuthModal('login');" style="flex:1; padding: 12px;">
          Chuyển đến Đăng nhập
        </button>
        <button type="button" class="btn-elegant btn-elegant-secondary" onclick="closeVerificationNoticeModal();" style="flex:1; padding: 12px;">
          Đóng cửa sổ
        </button>
      </div>
    </div>
  `;
};

const showCustomerPendingModal = (user) => {
  let modal = document.getElementById("verification-notice-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "verification-notice-modal";
    modal.className = "modal-overlay active";
    document.body.appendChild(modal);
  } else {
    modal.classList.add("active");
  }

  modal.innerHTML = `
    <div class="modal-container" style="max-width: 500px; text-align: center; padding: 36px 30px;">
      <div style="width:64px; height:64px; border-radius:50%; background:rgba(217, 119, 6, 0.12); border: 2px solid #d97706; display:flex; align-items:center; justify-content:center; margin: 0 auto 16px; color: #d97706; font-size: 26px;">
        <i class="fa-solid fa-user-clock"></i>
      </div>
      <h3 style="font-size: 20px; font-family: 'Playfair Display', serif; color: var(--text-dark); margin-bottom: 8px;">
        Tài Khoản Đang Chờ Xác Thực
      </h3>
      <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 18px;">
        Tài khoản <strong>${user.email}</strong> đang trong hàng đợi phê duyệt của Ban Quản Trị.
      </p>

      <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 14px 16px; text-align: left; margin-bottom: 20px; font-size: 12px; color: #92400e; line-height: 1.6;">
        <i class="fa-solid fa-circle-info" style="margin-right:6px;"></i>
        Hệ thống đã tự động gửi email thông báo tới Ban Quản Trị (<code>admin@7dbio.com</code>). Sau khi được xác thực, tài khoản sẽ được cấp toàn bộ quyền xem chi tiết sản phẩm, công nghệ chuỗi lạnh và đặt hàng.
      </div>

      <p style="font-size: 12px; color: var(--text-dark); margin-bottom: 20px;">
        Cần kích hoạt khẩn cấp? Vui lòng liên hệ Hotline y tế: <strong>0988.777.999</strong>
      </p>

      <button type="button" class="btn-elegant btn-elegant-primary" onclick="closeVerificationNoticeModal();" style="width:100%; padding: 12px;">
        Tôi đã hiểu
      </button>
    </div>
  `;
};

const closeVerificationNoticeModal = () => {
  const modal = document.getElementById("verification-notice-modal");
  if (modal) modal.classList.remove("active");
};

if (authModalCloseBtn) authModalCloseBtn.addEventListener("click", () => closeAuthModal());
if (authTabLogin) authTabLogin.addEventListener("click", () => switchAuthTab('login'));
if (authTabRegister) authTabRegister.addEventListener("click", () => switchAuthTab('register'));

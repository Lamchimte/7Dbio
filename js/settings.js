// =============================================
// WEBSITE SETTINGS & POLICIES MANAGEMENT
// =============================================

// Dynamic rendering of Policies
const openPolicy = (policyType) => {
  const settings = getSettings();
  const titleEl = document.getElementById("policy-title");
  const contentEl = document.getElementById("policy-content");
  
  if (!titleEl || !contentEl) return;
  
  const langKey = currentLang || 'vi';

  if (policyType === 'privacy') {
    titleEl.textContent = t('footer_privacy');
    contentEl.innerHTML = (settings.privacy && settings.privacy[langKey]) || (settings.privacy && settings.privacy['vi']) || '';
  } else if (policyType === 'return') {
    titleEl.textContent = t('footer_return');
    contentEl.innerHTML = (settings.returnPolicy && settings.returnPolicy[langKey]) || (settings.returnPolicy && settings.returnPolicy['vi']) || '';
  }
  
  switchView('policy');
};

// Dynamic Footer contact loading
const renderFooterContactInfo = () => {
  const settings = getSettings();
  const contact = settings.contact || {};
  const container = document.querySelector('.footer-contact-info');
  if (!container) return;

  container.innerHTML = `
    <p><i class="fa-solid fa-location-dot" style="margin-right:8px; color:var(--color-accent);"></i>${contact.address || '15 Láng Hạ, Ba Đình, Hà Nội'}</p>
    <p><i class="fa-solid fa-phone" style="margin-right:8px; color:var(--color-accent);"></i>${contact.phone || '0988.777.999'}</p>
    <p><i class="fa-solid fa-envelope" style="margin-right:8px; color:var(--color-accent);"></i>${contact.email || 'contact@7dbio.com'}</p>
  `;
};

// Admin Settings Tab Rendering
const renderAdminSettings = () => {
  const settings = getSettings();
  const contact = settings.contact || {};
  
  const phoneInput = document.getElementById("settings-contact-phone");
  const emailInput = document.getElementById("settings-contact-email");
  const addressInput = document.getElementById("settings-contact-address");
  const editLangSelect = document.getElementById("settings-edit-lang");
  const privacyTextarea = document.getElementById("settings-privacy");
  const returnTextarea = document.getElementById("settings-return");

  if (phoneInput) phoneInput.value = contact.phone || '';
  if (emailInput) emailInput.value = contact.email || '';
  if (addressInput) addressInput.value = contact.address || '';
  
  const adminEmailInput = document.getElementById("settings-admin-email");
  if (adminEmailInput) adminEmailInput.value = settings.adminNotificationEmail || 'admin@7dbio.com';
  
  if (editLangSelect) {
    settingsEditLang = editLangSelect.value;
  }
  
  // Populate the policy content based on selected language
  if (privacyTextarea && settings.privacy) {
    privacyTextarea.value = settings.privacy[settingsEditLang] || '';
  }
  if (returnTextarea && settings.returnPolicy) {
    returnTextarea.value = settings.returnPolicy[settingsEditLang] || '';
  }
};

// Handle language selection changes inside editor
const settingsEditLangSelect = document.getElementById("settings-edit-lang");
if (settingsEditLangSelect) {
  settingsEditLangSelect.addEventListener("change", (e) => {
    const settings = getSettings();
    const privacyTextarea = document.getElementById("settings-privacy");
    const returnTextarea = document.getElementById("settings-return");

    // First save the currently displayed content to the settings object
    if (privacyTextarea) {
      settings.privacy[settingsEditLang] = privacyTextarea.value;
    }
    if (returnTextarea) {
      settings.returnPolicy[settingsEditLang] = returnTextarea.value;
    }
    setSettings(settings);

    // Now switch to the newly selected language and update the textareas
    settingsEditLang = e.target.value;
    if (privacyTextarea) {
      privacyTextarea.value = settings.privacy[settingsEditLang] || '';
    }
    if (returnTextarea) {
      returnTextarea.value = settings.returnPolicy[settingsEditLang] || '';
    }
  });
}

// Handle Admin Settings form submission
const adminSettingsForm = document.getElementById("admin-settings-form");
if (adminSettingsForm) {
  adminSettingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const settings = getSettings();
    
    const phoneInput = document.getElementById("settings-contact-phone");
    const emailInput = document.getElementById("settings-contact-email");
    const addressInput = document.getElementById("settings-contact-address");
    const privacyTextarea = document.getElementById("settings-privacy");
    const returnTextarea = document.getElementById("settings-return");

    // Save contact info
    settings.contact = {
      phone: phoneInput ? phoneInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      address: addressInput ? addressInput.value.trim() : ''
    };

    const adminEmailInput = document.getElementById("settings-admin-email");
    if (adminEmailInput) {
      settings.adminNotificationEmail = adminEmailInput.value.trim() || 'admin@7dbio.com';
    }

    // Save policy content for currently active language
    if (privacyTextarea) {
      settings.privacy[settingsEditLang] = privacyTextarea.value;
    }
    if (returnTextarea) {
      settings.returnPolicy[settingsEditLang] = returnTextarea.value;
    }

    setSettings(settings);
    renderFooterContactInfo();
    showToast(t('toast_settings_success') || "Đã lưu cấu hình website thành công!");
  });
}

(function () {
  'use strict';

  /* ── Storage keys ── */
  const USERS_KEY    = 'soundtest_users_v1';
  const SESSION_KEY   = 'soundtest_session_v1';
  const RECORDS_KEY   = 'soundtest_records_v1';
  const TEMPLATES_KEY = 'soundtest_templates_v1';

  /* ── Storage helpers ── */
  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch (_) { return []; }
  }

  function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

  function loadSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch (_) { return null; }
  }

  function saveSession(session) {
    if (!session) { localStorage.removeItem(SESSION_KEY); return; }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function loadRecords() {
    try { return JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]'); }
    catch (_) { return []; }
  }

  function loadTemplates() {
    try { return JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]'); }
    catch (_) { return []; }
  }

  async function hashPassword(password) {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /* ── Navigation bar (logged-in state) ── */
  function ensureNavUtility() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return null;
    let utility = nav.querySelector('.nav-utility');
    if (!utility) {
      utility = document.createElement('div');
      utility.className = 'nav-utility';
      nav.appendChild(utility);
    }
    return utility;
  }

  function renderNavAuth() {
    const utility = ensureNavUtility();
    if (!utility) return;
    [...utility.querySelectorAll('[data-auth-ui]')].forEach(el => el.remove());
    const session = loadSession();
    if (session?.email) {
      const info = document.createElement('span');
      info.className = 'nav-auth-pill';
      info.setAttribute('data-auth-ui', 'true');
      info.innerHTML = `<strong>${window.__sfUtils.escHtml(session.name || 'User')}</strong><span>${window.__sfUtils.escHtml(session.email)}</span>`;
      utility.appendChild(info);
      const profile = document.createElement('a');
      profile.className = 'nav-auth-btn';
      profile.setAttribute('data-auth-ui', 'true');
      profile.href = 'auth.html';
      profile.textContent = 'Account';
      utility.appendChild(profile);
      const logout = document.createElement('button');
      logout.className = 'nav-auth-btn';
      logout.type = 'button';
      logout.setAttribute('data-auth-ui', 'true');
      logout.textContent = 'Logout';
      logout.addEventListener('click', () => { saveSession(null); renderNavAuth(); location.href = 'index.html'; });
      utility.appendChild(logout);
      return;
    }
    const login = document.createElement('a');
    login.className = 'nav-auth-btn';
    login.href = 'auth.html?mode=login';
    login.textContent = 'Login';
    login.setAttribute('data-auth-ui', 'true');
    utility.appendChild(login);
    const register = document.createElement('a');
    register.className = 'nav-auth-btn';
    register.href = 'auth.html?mode=register';
    register.textContent = 'Register';
    register.setAttribute('data-auth-ui', 'true');
    utility.appendChild(register);
  }

  /* ── Auth page: show/hide shells ── */
  function initAuthPage() {
    const unauthenticated = document.querySelector('[data-auth-page="unauthenticated"]');
    const authenticated   = document.querySelector('[data-auth-page="authenticated"]');
    if (!unauthenticated || !authenticated) return;

    const session = loadSession();
    // Close any open panels before switching shells
    closePanel('profile');
    closePanel('password');
    if (session?.email) {
      unauthenticated.hidden = true;
      authenticated.hidden = false;
      renderDashboard(session);
    } else {
      unauthenticated.hidden = false;
      authenticated.hidden = true;
      initUnauthenticated();
    }
  }

  /* ── Unauthenticated page ── */
  function initUnauthenticated() {
    // Tab switching
    const tabLogin    = document.querySelector('[data-auth-tab="login"]');
    const tabRegister = document.querySelector('[data-auth-tab="register"]');
    const formLogin    = document.querySelector('[data-auth-form="login"]');
    const formRegister = document.querySelector('[data-auth-form="register"]');
    const indicator    = document.querySelector('.auth-tab-indicator');
    if (!tabLogin || !formLogin) return;

    const mode = new URLSearchParams(location.search).get('mode') === 'register' ? 'register' : 'login';
    applyMode(mode);

    tabLogin.addEventListener('click',  () => applyMode('login'));
    tabRegister.addEventListener('click', () => applyMode('register'));

    // Switch-tab links in form notes
    document.querySelectorAll('[data-switch-tab]').forEach(link => {
      link.addEventListener('click', e => { e.preventDefault(); applyMode(link.dataset.switchTab); });
    });

    // Toggle password visibility
    document.querySelectorAll('[data-toggle-password]').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.togglePassword);
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const eyeOpen  = btn.querySelector('.eye-open');
        const eyeClosed = btn.querySelector('.eye-closed');
        if (eyeOpen)  eyeOpen.style.display  = isPassword ? 'none' : 'block';
        if (eyeClosed) eyeClosed.style.display = isPassword ? 'block' : 'none';
      });
    });

    // Password strength
    const regPassword = document.getElementById('registerPassword');
    if (regPassword) {
      regPassword.addEventListener('input', () => updatePasswordStrength(regPassword.value));
    }

    // Form submissions
    formLogin.addEventListener('submit', loginUser);
    formRegister.addEventListener('submit', registerUser);

    function applyMode(mode) {
      const isRegister = mode === 'register';
      formLogin.hidden    = isRegister;
      formRegister.hidden = !isRegister;
      tabLogin.classList.toggle('active', !isRegister);
      tabRegister.classList.toggle('active', isRegister);
      if (indicator) {
        indicator.style.transform = isRegister ? 'translateX(100%)' : 'translateX(0)';
      }
      clearErrors();
      clearGlobalMessage();
    }
  }

  /* ── Password strength ── */
  function updatePasswordStrength(password) {
    const container = document.querySelector('[data-strength="registerPassword"]');
    if (!container) return;
    const bars = container.querySelectorAll('.bar');
    const label = container.querySelector('.strength-label');
    let score = 0;
    if (!password) { bars.forEach(b => b.classList.remove('active')); if (label) { label.textContent = ''; label.removeAttribute('data-strength'); } return; }
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const data   = ['', 'weak', 'fair', 'good', 'strong'];
    bars.forEach((b, i) => b.classList.toggle('active', i < score));
    if (label) {
      label.textContent = labels[score];
      label.setAttribute('data-strength', data[score]);
    }
  }

  /* ── Field-level validation ── */
  function setFieldError(name, msg) {
    const el = document.querySelector(`[data-error="${name}"]`);
    if (el) el.textContent = msg || '';
    return !!msg;
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    const global = document.querySelector('[data-auth-message]');
    if (global) global.textContent = '';
  }

  function setGlobalMessage(text, isError) {
    const el = document.querySelector('[data-auth-message]');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('auth-form-global', true);
    if (isError) el.setAttribute('data-error', 'true');
    else el.removeAttribute('data-error');
  }

  function clearGlobalMessage() {
    const el = document.querySelector('[data-auth-message]');
    if (el) { el.textContent = ''; el.removeAttribute('data-error'); }
  }

  /* ── Register ── */
  async function registerUser(e) {
    e.preventDefault();
    clearErrors();
    const form = e.currentTarget;
    const name    = form.querySelector('input[name="name"]').value.trim();
    const email    = form.querySelector('input[name="email"]').value.trim().toLowerCase();
    const password = form.querySelector('input[name="password"]').value;
    const confirm  = form.querySelector('input[name="confirmPassword"]').value;

    if (!name || name.length < 2)              { setFieldError('name', 'Name must be at least 2 characters.'); return; }
    if (!email || !email.includes('@'))        { setFieldError('email', 'Enter a valid email address.'); return; }
    if (!password || password.length < 8)     { setFieldError('password', 'Password must be at least 8 characters.'); return; }
    if (password !== confirm)                  { setFieldError('confirmPassword', 'Passwords do not match.'); return; }

    const users = loadUsers();
    if (users.find(u => u.email === email)) { setFieldError('email', 'Email already registered. Please sign in.'); return; }

    users.push({ name, email, passwordHash: await hashPassword(password), createdAt: new Date().toISOString() });
    saveUsers(users);
    saveSession({ name, email, signedAt: new Date().toISOString() });
    showToast('Account created successfully!', 'success');
    setTimeout(() => location.href = 'auth.html', 800);
  }

  /* ── Login ── */
  async function loginUser(e) {
    e.preventDefault();
    clearErrors();
    const form  = e.currentTarget;
    const email = form.querySelector('input[name="email"]').value.trim().toLowerCase();
    const password = form.querySelector('input[name="password"]').value;

    if (!email)    { setFieldError('email', 'Email is required.'); return; }
    if (!password) { setFieldError('password', 'Password is required.'); return; }

    const users  = loadUsers();
    const target = users.find(u => u.email === email);
    if (!target)    { setFieldError('email', 'No account found with this email.'); return; }
    if (await hashPassword(password) !== target.passwordHash) { setFieldError('password', 'Incorrect password.'); return; }

    saveSession({ name: target.name, email: target.email, signedAt: new Date().toISOString() });
    showToast('Welcome back!', 'success');
    setTimeout(() => location.href = 'auth.html', 600);
  }

  /* ── Dashboard rendering ── */
  function renderDashboard(session) {
    // Avatar initial
    const avatarEl = document.querySelector('[data-avatar-initial]');
    if (avatarEl) avatarEl.textContent = (session.name || session.email || 'U').charAt(0).toUpperCase();

    // Profile info
    const nameEl  = document.querySelector('[data-profile-name]');
    const emailEl = document.querySelector('[data-profile-email]');
    const sinceEl = document.querySelector('[data-profile-since]');
    if (nameEl)  nameEl.textContent  = session.name || 'User';
    if (emailEl) emailEl.textContent = session.email;

    // Find user for createdAt
    const users = loadUsers();
    const user   = users.find(u => u.email === session.email);
    if (sinceEl && user?.createdAt) {
      sinceEl.textContent = new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    }

    // Stats
    const records   = loadRecords();
    const templates = loadTemplates();
    const stats = {
      records:   records.length,
      exports:   records.filter(r => r.exportedAt).length,
      photos:    records.reduce((n, r) => n + (r.photos ? r.photos.length : 0), 0),
      templates: templates.length,
    };
    Object.entries(stats).forEach(([key, val]) => {
      const el = document.querySelector(`[data-stat="${key}"]`);
      if (el) el.textContent = val;
    });

    // Plan badge
    const planBadge = document.querySelector('[data-plan-badge]');
    if (planBadge) {
      const plan = user?.plan || 'free';
      planBadge.setAttribute('data-plan', plan);
      const planName = planBadge.querySelector('.plan-name');
      if (planName) planName.textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
    }

    // Subscription card
    const upsellEl      = document.querySelector('[data-subscription-upsell]');
    const prodactiveEl  = document.querySelector('[data-prodactive]');
    const badgeEl       = document.querySelector('[data-subscription-badge]');
    const planDisplay   = document.querySelector('[data-plan-display]');
    const prodactiveTier = document.querySelector('[data-prodactive-tier]');
    const planTierEl    = planDisplay?.querySelector('.plan-tier');
    const planDescEl    = planDisplay?.querySelector('.plan-desc');

    const isPro = user?.plan && user.plan !== 'free';
    if (upsellEl)      upsellEl.hidden      = isPro;
    if (prodactiveEl)  prodactiveEl.hidden  = !isPro;
    if (planDisplay)   planDisplay.hidden    = isPro;
    if (badgeEl)       badgeEl.textContent   = isPro ? `${user.plan} plan` : 'Free plan';
    if (isPro && prodactiveTier) prodactiveTier.textContent = user.plan.charAt(0).toUpperCase() + user.plan.slice(1) + ' Plan';

    if (!isPro && planTierEl) planTierEl.textContent = 'Free';
    if (!isPro && planDescEl) planDescEl.textContent = 'Real-time dB meter, basic audio recording, manual screenshot, time & location stamp';
    if (isPro && planTierEl) { planTierEl.textContent = user.plan.charAt(0).toUpperCase() + user.plan.slice(1); }

    // Activity list
    renderActivity(records);

    // Bind dashboard actions
    bindDashboardActions(session);
  }

  function renderActivity(records) {
    const list = document.querySelector('[data-activity-list]');
    if (!list) return;
    if (!records || records.length === 0) return; // empty state already in HTML
  }

  function bindDashboardActions(session) {
    // Logout
    document.getElementById('dashboard-logout')?.addEventListener('click', () => {
      saveSession(null);
      showToast('Signed out', 'success');
      setTimeout(() => location.href = 'index.html', 600);
    });

    // Export all data
    document.getElementById('export-all-data')?.addEventListener('click', () => {
      const users    = loadUsers();
      const records  = loadRecords();
      const templates = loadTemplates();
      const me = users.find(u => u.email === session.email);
      const data = {
        exportedAt: new Date().toISOString(),
        account: me ? { name: me.name, email: me.email, createdAt: me.createdAt, plan: me.plan || 'free' } : null,
        records,
        templates,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = Object.assign(document.createElement('a'), { href: url, download: `soundtest-pro-export-${Date.now()}.json` });
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data exported successfully', 'success');
    });

    // Delete account
    document.getElementById('delete-account-btn')?.addEventListener('click', () => {
      if (!confirm('Delete your account and all local data? This cannot be undone.')) return;
      let users = loadUsers();
      users = users.filter(u => u.email !== session.email);
      saveUsers(users);
      localStorage.removeItem(RECORDS_KEY);
      localStorage.removeItem(TEMPLATES_KEY);
      saveSession(null);
      showToast('Account deleted', 'success');
      setTimeout(() => location.href = 'index.html', 800);
    });

    // Edit profile
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
      const nameInput = editProfileForm.querySelector('#editName');
      if (nameInput && session.name) nameInput.value = session.name;
      editProfileBtn?.addEventListener('click', () => openPanel('profile'));
      editProfileForm.addEventListener('submit', async e => {
        e.preventDefault();
        const newName = editProfileForm.querySelector('#editName').value.trim();
        if (!newName || newName.length < 2) { setPanelError(editProfileForm, 'Name must be at least 2 characters.'); return; }
        let users = loadUsers();
        const idx = users.findIndex(u => u.email === session.email);
        if (idx !== -1) { users[idx].name = newName; saveUsers(users); }
        saveSession({ ...session, name: newName });
        closePanel('profile');
        initAuthPage();
        renderNavAuth();
        showToast('Profile updated', 'success');
      });
    }

    // Change password
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        const cur  = changePasswordForm.querySelector('#currentPassword').value;
        const neu  = changePasswordForm.querySelector('#newPassword').value;
        const con  = changePasswordForm.querySelector('#confirmNewPassword').value;
        if (!cur) { setPanelError(changePasswordForm, 'Current password is required.'); return; }
        if (!neu || neu.length < 8) { setPanelError(changePasswordForm, 'New password must be at least 8 characters.'); return; }
        if (neu !== con) { setPanelError(changePasswordForm, 'New passwords do not match.'); return; }

        let users = loadUsers();
        const idx = users.findIndex(u => u.email === session.email);
        if (idx === -1) { setPanelError(changePasswordForm, 'Account not found.'); return; }
        if (await hashPassword(cur) !== users[idx].passwordHash) { setPanelError(changePasswordForm, 'Current password is incorrect.'); return; }

        users[idx].passwordHash = await hashPassword(neu);
        saveUsers(users);
        closePanel('password');
        changePasswordForm.reset();
        showToast('Password updated successfully', 'success');
      });
    }

    // Panel openers from settings
    document.querySelector('[data-open-panel="password"]')?.addEventListener('click', () => openPanel('password'));
  }

  /* ── Panels ── */
  function openPanel(name) {
    const overlay = document.getElementById(`${name}PanelOverlay`);
    const drawer  = document.getElementById(`${name}Panel`);
    if (overlay) { overlay.style.display = 'block'; overlay.hidden = false; }
    if (drawer)  { drawer.hidden = false; drawer.style.display = 'flex'; drawer.querySelector('input')?.focus(); }
    document.body.style.overflow = 'hidden';
  }

  function closePanel(name) {
    const overlay = document.getElementById(`${name}PanelOverlay`);
    const drawer  = document.getElementById(`${name}Panel`);
    if (overlay) overlay.style.display = 'none';
    if (drawer)  { drawer.style.display = 'none'; drawer.hidden = true; }
    document.body.style.overflow = '';
    const form = drawer?.querySelector('form');
    if (form) form.reset();
    clearPanelError(form);
  }

  // Expose globally for inline onclick handlers
  window.closePanel = closePanel;
  window.openPanel  = openPanel;

  function setPanelError(form, msg) {
    const el = form?.querySelector('[data-panel-error]');
    if (el) el.textContent = msg;
  }

  function clearPanelError(form) {
    const el = form?.querySelector('[data-panel-error]');
    if (el) el.textContent = '';
  }

  /* ── Toast notifications ── */
  function showToast(message, type = 'success') {
    const stack = document.getElementById('toastStack');
    if (!stack) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('data-autodismiss', 'true');
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">
        ${type === 'success'
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
        }
      </span>
      <span>${window.__sfUtils.escHtml(message)}</span>
    `;
    stack.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  /* ── Utilities ── */
  // escHtml provided by assets/utils.js (window.__sfUtils.escHtml)

  /* ── Panel close bindings ── */
  document.addEventListener('DOMContentLoaded', () => {
    renderNavAuth();
    initAuthPage();

    // Close panel buttons
    document.querySelectorAll('[data-close-panel]').forEach(btn => {
      btn.addEventListener('click', () => closePanel(btn.dataset.closePanel));
    });

    // Overlay clicks
    document.querySelectorAll('.panel-overlay').forEach(overlay => {
      overlay.addEventListener('click', () => {
        const id = overlay.id.replace('Overlay', '');
        closePanel(id);
      });
    });

    // Escape key closes panels
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.panel-drawer').forEach(drawer => {
        if (drawer.style.display === 'none') return;
        const id = drawer.id.replace('Panel', '');
        closePanel(id);
      });
    });
  });
})();

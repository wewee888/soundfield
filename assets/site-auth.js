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
    try {
      const authRecords = JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
      const sfData = JSON.parse(localStorage.getItem('sf_v5') || '{}');
      const sfRecords = Array.isArray(sfData.records) ? sfData.records : [];
      const combined = [...authRecords];
      sfRecords.forEach(r => {
        if (!combined.some(c => c.id === r.id)) {
          combined.push({
            id: r.id,
            title: r.scene ? `${r.scene} noise recording` : 'Sound measurement',
            decibels: r.laeq || r.db || 0,
            timestamp: r.time,
            location: r.place || r.city || '',
            exportedAt: r.exportedAt || null,
            photos: r.photos || (r.photoBlob ? [r.photoBlob] : []),
          });
        }
      });
      return combined;
    } catch (_) {
      return [];
    }
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

  const NAV_AUTH_I18N = {
    zh: { login: '登录', register: '注册', account: '个人中心', logout: '退出' },
    en: { login: 'Login', register: 'Register', account: 'Account', logout: 'Logout' },
    es: { login: 'Acceso', register: 'Registro', account: 'Cuenta', logout: 'Salir' },
    fr: { login: 'Connexion', register: 'S’inscrire', account: 'Compte', logout: 'Déconnexion' },
    de: { login: 'Anmelden', register: 'Registrieren', account: 'Konto', logout: 'Abmelden' },
    ja: { login: 'ログイン', register: '登録', account: 'アカウント', logout: 'ログアウト' },
    ko: { login: '로그인', register: '회원가입', account: '계정', logout: '로그아웃' },
    vi: { login: 'Đăng nhập', register: 'Đăng ký', account: 'Tài khoản', logout: 'Đăng xuất' },
    th: { login: 'เข้าสู่ระบบ', register: 'ลงทะเบียน', account: 'บัญชี', logout: 'ออกจากระบบ' },
  };

  function getNavAuthLang() {
    const docLang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    if (NAV_AUTH_I18N[docLang]) return docLang;
    const match = window.location.pathname.match(/\/(zh|en|es|fr|de|ja|ko|vi|th)\//);
    return match ? match[1] : 'en';
  }

  function renderNavAuth() {
    const utility = ensureNavUtility();
    if (!utility) return;
    [...utility.querySelectorAll('[data-auth-ui]')].forEach(el => el.remove());
    const lang = getNavAuthLang();
    const t = NAV_AUTH_I18N[lang] || NAV_AUTH_I18N.en;
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
      profile.textContent = t.account;
      utility.appendChild(profile);
      const logout = document.createElement('button');
      logout.className = 'nav-auth-btn';
      logout.type = 'button';
      logout.setAttribute('data-auth-ui', 'true');
      logout.textContent = t.logout;
      logout.addEventListener('click', () => { saveSession(null); renderNavAuth(); location.href = 'index.html'; });
      utility.appendChild(logout);
      return;
    }
    const login = document.createElement('a');
    login.className = 'nav-auth-btn';
    login.href = 'auth.html?mode=login';
    login.textContent = t.login;
    login.setAttribute('data-auth-ui', 'true');
    utility.appendChild(login);
    const register = document.createElement('a');
    register.className = 'nav-auth-btn';
    register.href = 'auth.html?mode=register';
    register.textContent = t.register;
    register.setAttribute('data-auth-ui', 'true');
    utility.appendChild(register);
  }

  /* ── Magic link token auto-login ── */
  async function checkMagicTokenLogin() {
    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get('magic_token');
    if (!magicToken) return false;

    showToast('正在验证魔法链接安全凭证… / Verifying…', 'info');
    try {
      const res = await fetch('/api/auth/verify-magic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ magic_token: magicToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        showToast(data.message || '魔法链接已失效或已被使用，请重新获取。', 'err');
        return false;
      }

      const email = data.email;
      const users = loadUsers();
      let user = users.find(u => u.email === email);
      const plan = data.membership?.active ? data.membership.plan : (user?.plan || 'free');

      if (!user) {
        user = {
          name: email.split('@')[0],
          email,
          createdAt: new Date().toISOString(),
          plan,
        };
        users.push(user);
        saveUsers(users);
      } else {
        user.plan = plan;
        saveUsers(users);
      }

      saveSession({
        name: user.name,
        email: user.email,
        plan: user.plan,
        signedAt: new Date().toISOString(),
        token: data.session_token,
      });

      if (data.membership?.active) {
        try {
          localStorage.setItem('sf_membership_v1', JSON.stringify({
            email,
            active: true,
            plan: data.membership.plan || 'pro',
            provider: 'magic_link',
            status: 'paid',
            lastCheckedAt: new Date().toISOString(),
          }));
        } catch (_) {}
      }

      const cleanUrl = window.location.pathname + (params.get('redirect_to') ? `?redirect_to=${encodeURIComponent(params.get('redirect_to'))}` : '');
      window.history.replaceState({}, document.title, cleanUrl);

      showToast('🎉 魔法链接登录成功！欢迎回来。', 'success');
      return true;
    } catch (_) {
      showToast('网络连接异常，请重试', 'err');
      return false;
    }
  }

  /* ── Auth page: show/hide shells ── */
  async function initAuthPage() {
    const unauthenticated = document.querySelector('[data-auth-page="unauthenticated"]');
    const authenticated   = document.querySelector('[data-auth-page="authenticated"]');
    if (!unauthenticated || !authenticated) return;

    // Check URL magic link token
    await checkMagicTokenLogin();

    let session = loadSession();
    // Sync active plan from sf_membership_v1 if present
    try {
      const sfMem = JSON.parse(localStorage.getItem('sf_membership_v1') || 'null');
      if (sfMem?.active && session) {
        session.plan = sfMem.plan || session.plan || 'pro';
        saveSession(session);
      }
    } catch (_) {}

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

    // Login subtabs switching (Password vs Magic Link)
    const tabPassword = document.getElementById('tabLoginPassword');
    const tabMagic = document.getElementById('tabLoginMagic');
    const subformPassword = document.getElementById('passwordLoginForm');
    const subformMagic = document.getElementById('magicLoginForm');

    if (tabPassword && tabMagic && subformPassword && subformMagic) {
      tabPassword.addEventListener('click', () => {
        tabPassword.classList.add('active');
        tabPassword.style.background = 'rgba(44,240,193,0.14)';
        tabPassword.style.color = '#2cf0c1';
        tabMagic.classList.remove('active');
        tabMagic.style.background = 'transparent';
        tabMagic.style.color = '#94a3b8';
        subformPassword.style.display = 'block';
        subformMagic.style.display = 'none';
        clearErrors();
      });

      tabMagic.addEventListener('click', () => {
        tabMagic.classList.add('active');
        tabMagic.style.background = 'rgba(44,240,193,0.14)';
        tabMagic.style.color = '#2cf0c1';
        tabPassword.classList.remove('active');
        tabPassword.style.background = 'transparent';
        tabPassword.style.color = '#94a3b8';
        subformPassword.style.display = 'none';
        subformMagic.style.display = 'block';
        clearErrors();
      });
    }

    // Send Magic Link Button
    const btnSendMagic = document.getElementById('btnSendMagicLink');
    const magicCodeSection = document.getElementById('magicCodeSection');
    if (btnSendMagic) {
      btnSendMagic.addEventListener('click', async () => {
        clearErrors();
        const emailInput = document.getElementById('magicLoginEmail');
        const email = String(emailInput?.value || '').trim().toLowerCase();
        if (!email || !email.includes('@')) {
          setFieldError('magicEmail', '请输入有效的邮箱地址 / Enter a valid email.');
          return;
        }

        btnSendMagic.disabled = true;
        btnSendMagic.textContent = '正在发送凭证… / Sending…';

        try {
          const resp = await fetch('/api/auth/magic-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const result = await resp.json().catch(() => ({}));
          if (!resp.ok || !result.ok) {
            setFieldError('magicEmail', result.message || '发送失败，请稍后重试');
            btnSendMagic.disabled = false;
            btnSendMagic.textContent = '✨ 发送登录链接与验证码 / Send Magic Link';
            return;
          }

          showToast('📬 登录凭证已发送，请查收邮箱！', 'success');
          if (magicCodeSection) magicCodeSection.style.display = 'block';
          btnSendMagic.style.display = 'none';
          document.getElementById('magicCodeInput')?.focus();

          if (result.simulated && result.code) {
            showToast(`[测试模式验证码]: ${result.code}`, 'info');
          }
        } catch (_) {
          setFieldError('magicEmail', '网络错误，请稍后重试');
          btnSendMagic.disabled = false;
          btnSendMagic.textContent = '✨ 发送登录链接与验证码 / Send Magic Link';
        }
      });
    }

    // Verify 6-digit Code Button
    const btnVerifyCode = document.getElementById('btnVerifyCode');
    if (btnVerifyCode) {
      btnVerifyCode.addEventListener('click', async () => {
        clearErrors();
        const email = String(document.getElementById('magicLoginEmail')?.value || '').trim().toLowerCase();
        const code = String(document.getElementById('magicCodeInput')?.value || '').trim();
        if (!code || code.length !== 6) {
          setFieldError('magicCode', '请输入 6 位纯数字验证码');
          return;
        }

        btnVerifyCode.disabled = true;
        btnVerifyCode.textContent = '正在核验… / Verifying…';

        try {
          const resp = await fetch('/api/auth/verify-magic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
          });
          const result = await resp.json().catch(() => ({}));
          if (!resp.ok || !result.ok) {
            setFieldError('magicCode', result.message || '验证码错误或已失效');
            btnVerifyCode.disabled = false;
            btnVerifyCode.textContent = '验证并登录 / Verify & Sign In';
            return;
          }

          const users = loadUsers();
          let user = users.find(u => u.email === email);
          const plan = result.membership?.active ? result.membership.plan : (user?.plan || 'free');

          if (!user) {
            user = {
              name: email.split('@')[0],
              email,
              createdAt: new Date().toISOString(),
              plan,
            };
            users.push(user);
            saveUsers(users);
          } else {
            user.plan = plan;
            saveUsers(users);
          }

          saveSession({
            name: user.name,
            email: user.email,
            plan: user.plan,
            signedAt: new Date().toISOString(),
            token: result.session_token,
          });

          if (result.membership?.active) {
            try {
              localStorage.setItem('sf_membership_v1', JSON.stringify({
                email,
                active: true,
                plan: result.membership.plan || 'pro',
                provider: 'magic_code',
                status: 'paid',
                lastCheckedAt: new Date().toISOString(),
              }));
            } catch (_) {}
          }

          showToast('🎉 登录成功！欢迎回来。', 'success');
          setTimeout(() => {
            initAuthPage();
            renderNavAuth();
          }, 500);
        } catch (_) {
          setFieldError('magicCode', '核验服务出现异常，请稍后重试');
          btnVerifyCode.disabled = false;
          btnVerifyCode.textContent = '验证并登录 / Verify & Sign In';
        }
      });
    }

    // Form submissions
    if (subformPassword) {
      subformPassword.addEventListener('submit', loginUser);
    } else {
      formLogin.querySelector('form')?.addEventListener('submit', loginUser);
    }
    formRegister.querySelector('form')?.addEventListener('submit', registerUser);

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

    // Verify Cloudflare Turnstile token
    let turnstileToken = '';
    if (window.turnstile && typeof window.turnstile.getResponse === 'function') {
      try { turnstileToken = window.turnstile.getResponse(); } catch (_) {}
    }
    if (!turnstileToken) {
      const tsInput = form.querySelector('[name="cf-turnstile-response"]');
      if (tsInput) turnstileToken = tsInput.value;
    }

    try {
      const verifyResp = await fetch('/api/auth/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      });
      const verifyData = await verifyResp.json().catch(() => ({}));
      if (!verifyResp.ok || !verifyData.ok) {
        setFieldError('turnstile', '请完成人机安全验证 / Please complete human verification.');
        if (window.turnstile && typeof window.turnstile.reset === 'function') {
          try { window.turnstile.reset(); } catch (_) {}
        }
        return;
      }
    } catch (_) {
      // Offline fallback
    }

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

    // Find or initialize user
    const users = loadUsers();
    let user = users.find(u => u.email === session.email);
    if (!user) {
      user = {
        name: session.name || session.email.split('@')[0],
        email: session.email,
        createdAt: session.signedAt || new Date().toISOString(),
        plan: session.plan || 'free',
      };
      users.push(user);
      saveUsers(users);
    }

    // Check if sf_membership_v1 has active VIP plan
    try {
      const sfMem = JSON.parse(localStorage.getItem('sf_membership_v1') || 'null');
      if (sfMem?.active && sfMem.plan && sfMem.plan !== 'free') {
        user.plan = sfMem.plan;
        session.plan = sfMem.plan;
        saveUsers(users);
        saveSession(session);
      }
    } catch (_) {}

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

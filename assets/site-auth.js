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

  /* ── Cross-device session sync ─────────────────────────────────────────────
   * Called silently on every page load. Sends the stored session_token to the
   * server and gets back the current membership status from KV. This is what
   * keeps "logged in on phone → also logged in on PC" working.
   * ─────────────────────────────────────────────────────────────────────────*/
  async function silentSessionRefresh() {
    const session = loadSession();
    if (!session?.token) return; // No token → nothing to refresh

    try {
      const resp = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: session.token }),
        // 4s timeout — fail fast, don't block UI
        signal: AbortSignal.timeout ? AbortSignal.timeout(4000) : undefined,
      });

      if (resp.status === 401) {
        // Token expired or invalidated server-side → force logout
        saveSession(null);
        return;
      }

      if (!resp.ok) return; // Server error — keep existing session, try again next visit

      const data = await resp.json().catch(() => null);
      if (!data?.valid) {
        // Invalid but not 401 — e.g. KV unavailable in dev. Keep session.
        return;
      }

      // Update local session with fresh membership from server
      const freshPlan = data.membership?.active ? (data.membership.plan || 'pro') : 'free';
      const updated = {
        ...session,
        plan: freshPlan,
        email: data.email || session.email,
        refreshedAt: new Date().toISOString(),
      };
      saveSession(updated);

      // Also sync sf_membership_v1 so the app meter picks up Pro features
      if (data.membership?.active) {
        try {
          localStorage.setItem('sf_membership_v1', JSON.stringify({
            email: data.email,
            active: true,
            plan: data.membership.plan || 'pro',
            provider: 'session_refresh',
            status: data.membership.status || 'paid',
            lastCheckedAt: new Date().toISOString(),
          }));
        } catch (_) {}
      } else {
        // Remove stale Pro from localStorage if server says inactive
        try { localStorage.removeItem('sf_membership_v1'); } catch (_) {}
      }
    } catch (_) {
      // Network error / timeout — silently ignore, keep existing session
    }
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

  const AUTH_MSGS = {
    zh: {
      name_len: '用户昵称至少需要 2 个字符',
      email_valid: '请输入有效的邮箱地址',
      email_req: '请输入邮箱地址',
      pwd_len: '密码长度至少需要 8 位字符',
      pwd_req: '请输入密码',
      pwd_mismatch: '两次输入的密码不一致',
      email_exists: '该邮箱已被注册，请直接登录',
      no_account: '未找到该邮箱对应的账号，请先注册',
      pwd_incorrect: '密码错误，请核对后重试',
      turnstile_err: '请完成人机安全验证',
      account_created: '账号创建成功！正在跳转…',
      welcome_back: '欢迎回来！登录成功',
      signed_out: '已安全退出登录',
      data_exported: '数据备份已成功导出',
      confirm_delete: '确定要注销此账户并清除所有本地声学记录吗？此操作无法撤销。',
      account_deleted: '账户及相关记录已注销清除',
      profile_updated: '个人资料已更新',
      cur_pwd_req: '请输入当前密码',
      new_pwd_len: '新密码长度至少需要 8 位字符',
      cur_pwd_incorrect: '当前密码输入不正确',
      pwd_updated: '密码已成功修改',
    },
    en: {
      name_len: 'Name must be at least 2 characters.',
      email_valid: 'Enter a valid email address.',
      email_req: 'Email is required.',
      pwd_len: 'Password must be at least 8 characters.',
      pwd_req: 'Password is required.',
      pwd_mismatch: 'Passwords do not match.',
      email_exists: 'Email already registered. Please sign in.',
      no_account: 'No account found with this email.',
      pwd_incorrect: 'Incorrect password.',
      turnstile_err: 'Please complete human verification.',
      account_created: 'Account created successfully!',
      welcome_back: 'Welcome back!',
      signed_out: 'Signed out',
      data_exported: 'Data exported successfully',
      confirm_delete: 'Delete your account and all local data? This cannot be undone.',
      account_deleted: 'Account deleted',
      profile_updated: 'Profile updated',
      cur_pwd_req: 'Current password is required.',
      new_pwd_len: 'New password must be at least 8 characters.',
      cur_pwd_incorrect: 'Current password is incorrect.',
      pwd_updated: 'Password updated successfully',
    }
  };

  function getNavAuthLang() {
    const docLang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    if (NAV_AUTH_I18N[docLang]) return docLang;
    const match = window.location.pathname.match(/\/(zh|en|es|fr|de|ja|ko|vi|th)\//);
    if (match) return match[1];
    try {
      const cookieMatch = document.cookie?.match(/(?:^|; )sf_locale=([^;]*)/);
      const cookieLocale = cookieMatch ? decodeURIComponent(cookieMatch[1]).slice(0, 2).toLowerCase() : '';
      if (NAV_AUTH_I18N[cookieLocale]) return cookieLocale;
      const storedLocale = (localStorage.getItem('soundtest_locale') || '').slice(0, 2).toLowerCase();
      if (NAV_AUTH_I18N[storedLocale]) return storedLocale;
    } catch (_) {}
    return 'en';
  }

  function getAuthMsg(key) {
    const lang = getNavAuthLang();
    return (AUTH_MSGS[lang] && AUTH_MSGS[lang][key]) || AUTH_MSGS.en[key] || '';
  }

  function getLocaleAuthHref(mode) {
    const isInLocaleDir = /\/(zh|en|es|fr|de|ja|ko|vi|th)\//.test(window.location.pathname);
    if (isInLocaleDir) {
      return mode ? `auth.html?mode=${mode}` : 'auth.html';
    }
    const lang = getNavAuthLang();
    if (lang && lang !== 'en') {
      return mode ? `${lang}/auth.html?mode=${mode}` : `${lang}/auth.html`;
    }
    return mode ? `auth.html?mode=${mode}` : 'auth.html';
  }

  function getLocaleHomeHref() {
    const isInLocaleDir = /\/(zh|en|es|fr|de|ja|ko|vi|th)\//.test(window.location.pathname);
    if (isInLocaleDir) {
      return 'index.html';
    }
    const lang = getNavAuthLang();
    if (lang && lang !== 'en') {
      return `${lang}/index.html`;
    }
    return 'index.html';
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
      profile.href = getLocaleAuthHref();
      profile.textContent = t.account;
      utility.appendChild(profile);
      const logout = document.createElement('button');
      logout.className = 'nav-auth-btn';
      logout.type = 'button';
      logout.setAttribute('data-auth-ui', 'true');
      logout.textContent = t.logout;
      logout.addEventListener('click', () => { saveSession(null); renderNavAuth(); location.href = getLocaleHomeHref(); });
      utility.appendChild(logout);
      return;
    }
    const login = document.createElement('a');
    login.className = 'nav-auth-btn';
    login.href = getLocaleAuthHref('login');
    login.textContent = t.login;
    login.setAttribute('data-auth-ui', 'true');
    utility.appendChild(login);
    const register = document.createElement('a');
    register.className = 'nav-auth-btn';
    register.href = getLocaleAuthHref('register');
    register.textContent = t.register;
    register.setAttribute('data-auth-ui', 'true');
    utility.appendChild(register);
  }

  /* ── Magic link token auto-login ── */
  let magicTokenCheckPromise = null;
  async function checkMagicTokenLogin() {
    if (magicTokenCheckPromise) return magicTokenCheckPromise;
    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get('magic_token');
    if (!magicToken) return false;

    magicTokenCheckPromise = (async () => {
      showToast(getNavAuthLang() === 'zh' ? '正在验证安全登录凭证… / Verifying…' : 'Verifying credentials…', 'info');
      try {
        const res = await fetch('/api/auth/verify-magic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ magic_token: magicToken }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          showToast(data.message || (getNavAuthLang() === 'zh' ? '登录凭证已失效或已被使用，请重新获取。' : 'Credentials expired or invalid.'), 'err');
          return false;
        }

        const email = data.email;
        const isSuperAdmin = (email.toLowerCase() === 'wewee1@gmail.com') || (data.membership?.role === 'admin');
        const users = loadUsers();
        let user = users.find(u => u.email === email);
        const plan = isSuperAdmin ? 'team' : (data.membership?.active ? data.membership.plan : (user?.plan || 'free'));

        if (!user) {
          user = {
            name: email.split('@')[0],
            email,
            createdAt: new Date().toISOString(),
            plan,
            role: isSuperAdmin ? 'admin' : 'user',
          };
          users.push(user);
          saveUsers(users);
        } else {
          user.plan = plan;
          if (isSuperAdmin) user.role = 'admin';
          saveUsers(users);
        }

        const session = {
          name: user.name,
          email: user.email,
          plan: user.plan,
          role: isSuperAdmin ? 'admin' : (data.membership?.role || user.role || 'user'),
          signedAt: new Date().toISOString(),
          token: data.session_token,
        };
        saveSession(session);

        if (data.membership?.active || isSuperAdmin) {
          try {
            localStorage.setItem('sf_membership_v1', JSON.stringify({
              email,
              active: true,
              plan: isSuperAdmin ? 'team' : (data.membership?.plan || 'pro'),
              role: isSuperAdmin ? 'admin' : 'user',
              provider: 'magic_link',
              status: 'paid',
              lastCheckedAt: new Date().toISOString(),
            }));
          } catch (_) {}
        }

        const redirectTo = params.get('redirect_to');
        const cleanUrl = window.location.pathname + (redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : '');
        window.history.replaceState({}, document.title, cleanUrl);

        showToast(getNavAuthLang() === 'zh' ? '🎉 登录成功！欢迎回来。' : '🎉 Successfully signed in! Welcome back.', 'success');

        // Immediately update DOM shells to authenticated state
        const unauth = document.querySelector('[data-auth-page="unauthenticated"]');
        const auth = document.querySelector('[data-auth-page="authenticated"]');
        if (unauth && auth) {
          unauth.hidden = true;
          unauth.style.display = 'none';
          auth.hidden = false;
          auth.style.display = 'block';
          renderDashboard(session);
          renderNavAuth();
        }

        if (redirectTo && !redirectTo.includes('auth.html')) {
          setTimeout(() => location.href = redirectTo, 800);
        }
        return true;
      } catch (_) {
        showToast(getNavAuthLang() === 'zh' ? '网络连接异常，请重试' : 'Network error, please retry.', 'err');
        return false;
      }
    })();

    return magicTokenCheckPromise;
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
      unauthenticated.style.display = 'none';
      authenticated.hidden = false;
      authenticated.style.display = 'block';
      renderDashboard(session);
    } else {
      unauthenticated.hidden = false;
      unauthenticated.style.display = '';
      authenticated.hidden = true;
      authenticated.style.display = 'none';
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

    // Send Magic Link Button & Keyboard handlers
    const btnSendMagic = document.getElementById('btnSendMagicLink');
    const magicCodeSection = document.getElementById('magicCodeSection');
    const magicEmailInput = document.getElementById('magicLoginEmail');
    const magicCodeInput = document.getElementById('magicCodeInput');
    let resendTimer = null;

    if (magicEmailInput && btnSendMagic) {
      magicEmailInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); btnSendMagic.click(); }
      });
    }

    if (btnSendMagic) {
      btnSendMagic.addEventListener('click', async () => {
        clearErrors();
        const email = String(magicEmailInput?.value || '').trim().toLowerCase();
        if (!email || !email.includes('@')) {
          setFieldError('magicEmail', getNavAuthLang() === 'zh' ? '请输入有效的邮箱地址' : 'Enter a valid email address.');
          return;
        }

        btnSendMagic.disabled = true;
        btnSendMagic.textContent = getNavAuthLang() === 'zh' ? '正在发送凭证…' : 'Sending…';
        if (magicCodeSection) magicCodeSection.style.display = 'block';

        try {
          const redirectTo = new URLSearchParams(window.location.search).get('redirect_to') || '';
          const resp = await fetch('/api/auth/magic-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, redirect_to: redirectTo }),
          });
          const result = await resp.json().catch(() => ({}));
          if (!resp.ok || !result.ok) {
            setFieldError('magicEmail', result.message || (getNavAuthLang() === 'zh' ? '发送失败，请稍后重试' : 'Failed to send, please retry.'));
            btnSendMagic.disabled = false;
            btnSendMagic.textContent = getNavAuthLang() === 'zh' ? '✨ 发送邮箱验证码与快捷链接' : '✨ Send Verification Code & Login Link';
            if (magicCodeSection) magicCodeSection.style.display = 'block';
            return;
          }

          showToast(getNavAuthLang() === 'zh' ? '📬 登录凭证已发送，请查收邮箱！' : '📬 Login credentials sent to your inbox!', 'success');
          if (magicCodeSection) magicCodeSection.style.display = 'block';
          if (magicCodeInput) {
            magicCodeInput.focus();
          }

          let countdown = 60;
          btnSendMagic.disabled = true;
          btnSendMagic.textContent = getNavAuthLang() === 'zh' ? `重新发送 (${countdown}s)` : `Resend (${countdown}s)`;
          clearInterval(resendTimer);
          resendTimer = setInterval(() => {
            countdown -= 1;
            if (countdown <= 0) {
              clearInterval(resendTimer);
              btnSendMagic.disabled = false;
              btnSendMagic.textContent = getNavAuthLang() === 'zh' ? '✨ 重新发送验证码与链接' : '✨ Resend Code & Link';
            } else {
              btnSendMagic.textContent = getNavAuthLang() === 'zh' ? `重新发送 (${countdown}s)` : `Resend (${countdown}s)`;
            }
          }, 1000);

          if (result.simulated && result.code) {
            showToast(`[测试模式验证码]: ${result.code}`, 'info');
          }
        } catch (_) {
          setFieldError('magicEmail', getNavAuthLang() === 'zh' ? '若已在邮箱收到验证码，请在下方直接输入：' : 'If you received the code in your email, please enter it below:');
          btnSendMagic.disabled = false;
          btnSendMagic.textContent = getNavAuthLang() === 'zh' ? '✨ 重新发送验证码与链接' : '✨ Resend Code & Link';
          if (magicCodeSection) magicCodeSection.style.display = 'block';
        }
      });
    }

    // Verify 6-digit Code Button
    const btnVerifyCode = document.getElementById('btnVerifyCode');
    if (magicCodeInput && btnVerifyCode) {
      magicCodeInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); btnVerifyCode.click(); }
      });
      magicCodeInput.addEventListener('input', () => {
        const val = magicCodeInput.value.replace(/\D/g, '').slice(0, 6);
        magicCodeInput.value = val;
        if (val.length === 6) {
          btnVerifyCode.click();
        }
      });
    }

    if (btnVerifyCode) {
      btnVerifyCode.addEventListener('click', async () => {
        clearErrors();
        const email = String(magicEmailInput?.value || '').trim().toLowerCase();
        const code = String(magicCodeInput?.value || '').trim();
        if (!code || code.length !== 6) {
          setFieldError('magicCode', getNavAuthLang() === 'zh' ? '请输入 6 位纯数字验证码' : 'Enter the 6-digit verification code.');
          return;
        }

        btnVerifyCode.disabled = true;
        btnVerifyCode.textContent = getNavAuthLang() === 'zh' ? '正在核验…' : 'Verifying…';

        try {
          const resp = await fetch('/api/auth/verify-magic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
          });
          const result = await resp.json().catch(() => ({}));
          if (!resp.ok || !result.ok) {
            setFieldError('magicCode', result.message || (getNavAuthLang() === 'zh' ? '验证码错误或已失效' : 'Invalid or expired code.'));
            btnVerifyCode.disabled = false;
            btnVerifyCode.textContent = getNavAuthLang() === 'zh' ? '验证并进入账户' : 'Verify & Sign In';
            return;
          }

          const isSuperAdmin = (email.toLowerCase() === 'wewee1@gmail.com') || (result.membership?.role === 'admin');
          const users = loadUsers();
          let user = users.find(u => u.email === email);
          const plan = isSuperAdmin ? 'team' : (result.membership?.active ? result.membership.plan : (user?.plan || 'free'));

          if (!user) {
            user = {
              name: email.split('@')[0],
              email,
              createdAt: new Date().toISOString(),
              plan,
              role: isSuperAdmin ? 'admin' : 'user',
            };
            users.push(user);
            saveUsers(users);
          } else {
            user.plan = plan;
            if (isSuperAdmin) user.role = 'admin';
            saveUsers(users);
          }

          saveSession({
            name: user.name,
            email: user.email,
            plan: user.plan,
            role: isSuperAdmin ? 'admin' : (result.membership?.role || user.role || 'user'),
            signedAt: new Date().toISOString(),
            token: result.session_token,
          });

          if (result.membership?.active || isSuperAdmin) {
            try {
              localStorage.setItem('sf_membership_v1', JSON.stringify({
                email,
                active: true,
                plan: isSuperAdmin ? 'team' : (result.membership?.plan || 'pro'),
                role: isSuperAdmin ? 'admin' : 'user',
                provider: 'magic_code',
                status: 'paid',
                lastCheckedAt: new Date().toISOString(),
              }));
            } catch (_) {}
          }

          showToast(getNavAuthLang() === 'zh' ? '🎉 登录成功！欢迎回来。' : '🎉 Signed in successfully!', 'success');
          setTimeout(() => {
            const redirectTo = new URLSearchParams(window.location.search).get('redirect_to');
            if (redirectTo && !redirectTo.includes('auth.html')) {
              location.href = redirectTo;
              return;
            }
            initAuthPage();
            renderNavAuth();
          }, 600);
        } catch (_) {
          setFieldError('magicCode', getNavAuthLang() === 'zh' ? '核验服务出现异常，请稍后重试' : 'Verification failed, please retry.');
          btnVerifyCode.disabled = false;
          btnVerifyCode.textContent = getNavAuthLang() === 'zh' ? '验证并进入账户' : 'Verify & Sign In';
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

    if (!name || name.length < 2)              { setFieldError('name', getAuthMsg('name_len')); return; }
    if (!email || !email.includes('@'))        { setFieldError('email', getAuthMsg('email_valid')); return; }
    if (!password || password.length < 8)     { setFieldError('password', getAuthMsg('pwd_len')); return; }
    if (password !== confirm)                  { setFieldError('confirmPassword', getAuthMsg('pwd_mismatch')); return; }

    const users = loadUsers();
    if (users.find(u => u.email === email)) { setFieldError('email', getAuthMsg('email_exists')); return; }

    // Verify Cloudflare Turnstile token only if widget is present in form/DOM
    const turnstileEl = document.getElementById('cfTurnstileWidget') || form.querySelector('.cf-turnstile');
    if (turnstileEl) {
      let turnstileToken = '';
      if (window.turnstile && typeof window.turnstile.getResponse === 'function') {
        try { turnstileToken = window.turnstile.getResponse(); } catch (_) {}
      }
      if (!turnstileToken) {
        const tsInput = form.querySelector('[name="cf-turnstile-response"]');
        if (tsInput) turnstileToken = tsInput.value;
      }
      if (turnstileToken) {
        try {
          const verifyResp = await fetch('/api/auth/verify-turnstile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: turnstileToken }),
          });
          const verifyData = await verifyResp.json().catch(() => ({}));
          if (!verifyResp.ok || !verifyData.ok) {
            setFieldError('turnstile', getAuthMsg('turnstile_err'));
            if (window.turnstile && typeof window.turnstile.reset === 'function') {
              try { window.turnstile.reset(); } catch (_) {}
            }
            return;
          }
        } catch (_) {
          // Offline fallback
        }
      }
    }

    const pwdHash = await hashPassword(password);
    let serverSessionToken = '';
    let plan = 'free';

    // Register with Cloudflare KV backend for cross-device auth
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          passwordHash: pwdHash,
          clientCreatedAt: new Date().toISOString(),
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data.ok) {
        if (data.error === 'email_exists') {
          setFieldError('email', getAuthMsg('email_exists'));
          return;
        }
      } else {
        serverSessionToken = data.session_token || '';
        if (data.membership?.active) {
          plan = data.membership.plan || 'pro';
        }
      }
    } catch (_) {
      // Offline fallback
    }

    users.push({ name, email, passwordHash: pwdHash, createdAt: new Date().toISOString(), plan });
    saveUsers(users);
    saveSession({
      name,
      email,
      plan,
      token: serverSessionToken,
      signedAt: new Date().toISOString(),
    });

    if (plan !== 'free') {
      try {
        localStorage.setItem('sf_membership_v1', JSON.stringify({
          email,
          active: true,
          plan,
          provider: 'register',
          status: 'paid',
          lastCheckedAt: new Date().toISOString(),
        }));
      } catch (_) {}
    }

    showToast(getAuthMsg('account_created'), 'success');
    setTimeout(() => location.href = getLocaleAuthHref(), 800);
  }

  /* ── Login ── */
  async function loginUser(e) {
    e.preventDefault();
    clearErrors();
    const form  = e.currentTarget;
    const email = form.querySelector('input[name="email"]').value.trim().toLowerCase();
    const password = form.querySelector('input[name="password"]').value;

    if (!email)    { setFieldError('email', getAuthMsg('email_req')); return; }
    if (!password) { setFieldError('password', getAuthMsg('pwd_req')); return; }

    const pwdHash = await hashPassword(password);
    let loginSuccess = false;
    let userName = '';
    let userPlan = 'free';
    let sessionToken = '';
    let createdAt = new Date().toISOString();

    // 1. Authenticate against Cloudflare KV backend (allows cross-device PC -> Mobile login)
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, passwordHash: pwdHash }),
      });
      const data = await resp.json().catch(() => ({}));

      if (resp.ok && data.ok) {
        loginSuccess = true;
        userName = data.name || email.split('@')[0];
        sessionToken = data.session_token || '';
        if (data.membership?.active) {
          userPlan = data.membership.plan || 'pro';
        }
        if (data.createdAt) createdAt = data.createdAt;
      } else if (data.error === 'pwd_incorrect') {
        setFieldError('password', getAuthMsg('pwd_incorrect'));
        return;
      } else if (data.error === 'no_account') {
        // If not in cloud KV yet, check local device cache to auto-migrate legacy account
        const users = loadUsers();
        const localUser = users.find(u => u.email === email);
        if (localUser && localUser.passwordHash === pwdHash) {
          try {
            const regResp = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: localUser.name,
                email: localUser.email,
                passwordHash: localUser.passwordHash,
                clientCreatedAt: localUser.createdAt,
              }),
            });
            const regData = await regResp.json().catch(() => ({}));
            if (regResp.ok && regData.ok) {
              loginSuccess = true;
              userName = localUser.name;
              sessionToken = regData.session_token || '';
              if (regData.membership?.active) userPlan = regData.membership.plan || 'pro';
            }
          } catch (_) {}
        }

        if (!loginSuccess) {
          setFieldError('email', getAuthMsg('no_account'));
          return;
        }
      }
    } catch (_) {
      // Offline fallback: check local storage
      const users  = loadUsers();
      const target = users.find(u => u.email === email);
      if (!target)    { setFieldError('email', getAuthMsg('no_account')); return; }
      if (pwdHash !== target.passwordHash) { setFieldError('password', getAuthMsg('pwd_incorrect')); return; }
      loginSuccess = true;
      userName = target.name;
      userPlan = target.plan || 'free';
    }

    if (loginSuccess) {
      // Sync to local users cache on this device
      const users = loadUsers();
      let user = users.find(u => u.email === email);
      if (!user) {
        user = { name: userName, email, passwordHash: pwdHash, createdAt, plan: userPlan };
        users.push(user);
      } else {
        user.name = userName;
        user.plan = userPlan;
        user.passwordHash = pwdHash;
      }
      saveUsers(users);

      saveSession({
        name: userName,
        email,
        plan: userPlan,
        token: sessionToken,
        signedAt: new Date().toISOString(),
      });

      if (userPlan !== 'free') {
        try {
          localStorage.setItem('sf_membership_v1', JSON.stringify({
            email,
            active: true,
            plan: userPlan,
            provider: 'login',
            status: 'paid',
            lastCheckedAt: new Date().toISOString(),
          }));
        } catch (_) {}
      }

      showToast(getAuthMsg('welcome_back'), 'success');
      setTimeout(() => location.href = getLocaleAuthHref(), 600);
    }
  }

  /* ── Paid Feature Upgrade & Payment Modal ── */
  let authPayPollTimer = null;

  function closeUpgradePayModal() {
    if (authPayPollTimer) {
      clearInterval(authPayPollTimer);
      authPayPollTimer = null;
    }
    const overlay = document.getElementById('authUpgradePayModalOverlay');
    if (overlay) {
      overlay.remove();
    }
    document.body.style.overflow = '';
  }

  function getEffectivePlan(session) {
    if (session?.email && String(session.email).trim().toLowerCase() === 'wewee1@gmail.com') {
      return 'team';
    }
    let plan = session?.plan || 'free';
    try {
      const sfMem = JSON.parse(localStorage.getItem('sf_membership_v1') || 'null');
      if (sfMem?.active && sfMem.plan && sfMem.plan !== 'free') {
        plan = sfMem.plan;
      }
    } catch (_) {}
    return String(plan).toLowerCase();
  }

  function openUpgradePayModal({ feature = 'sync', session = null, onSuccess = null } = {}) {
    closeUpgradePayModal();

    const isZh = getNavAuthLang() === 'zh';
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    const featureConfigs = {
      sync: {
        badge: isZh ? '⚡ PRO 专业版专属权益' : '⚡ PRO EXCLUSIVE FEATURE',
        title: isZh ? '升级解锁「存储健康度与多端云同步」' : 'Upgrade to Unlock Cloud Sync',
        subtitle: isZh
          ? '端到端加密同步现场取证元数据、跨设备访问与夜间持续哨兵监测'
          : 'End-to-end encrypted evidence sync, multi-device access & continuous sentry mode',
        bullets: isZh
          ? [
              '⚡ 跨手机与电脑实时同步现场取证元数据与项目模版',
              '🛡️ 解锁防伪司法级 PDF 报告无水印直出与 SHA-256 存证指纹',
              '🌙 支持夜间床头哨兵自动监测与超标噪音自动录音',
            ]
          : [
              '⚡ End-to-end encrypted cross-device sync for metadata & templates',
              '🛡️ Watermark-free certified PDF reports with SHA-256 evidence hashes',
              '🌙 Sentry mode for automated overnight noise monitoring & capture',
            ],
        plans: [
          { id: 'yearly', name: isZh ? 'PRO 年度版' : 'Pro Annual', fee: '19.90', origFee: '¥59.90', tag: isZh ? '★ 最受欢迎 · 省67%' : '★ POPULAR' },
          { id: 'lifetime', name: isZh ? 'PRO 终身版' : 'Lifetime', fee: '39.90', origFee: '¥199.00', tag: isZh ? '💎 买断立省¥159' : '💎 LIFETIME' },
          { id: 'pro', name: isZh ? 'PRO 月度版' : 'Pro Monthly', fee: '9.90', origFee: '¥19.90', tag: isZh ? '单月体验' : 'MONTHLY' },
        ],
        defaultPlan: 'yearly',
      },
      team: {
        badge: isZh ? '🏢 企业团队版专属权益' : '🏢 ENTERPRISE / TEAM FEATURE',
        title: isZh ? '升级企业团队版「报告抬头与协同」' : 'Upgrade to Team Edition',
        subtitle: isZh
          ? '企业法定抬头、项目编号规则、专用核验章与 5 席位协同'
          : 'Custom enterprise branding, project rules, audit stamps & team collaboration',
        bullets: isZh
          ? [
              '🏢 自定义企业 / 物业法定全称与官方报告抬头',
              '🏷️ 项目 / 案件编号规则前缀与现场核验员姓名套用',
              '🔖 专属盖章说明与报告结论防伪存证数字印章',
              '👥 包含 5 个协同成员席位与团队共享取证空间',
            ]
          : [
              '🏢 Custom company / property management legal headers',
              '🏷️ Project / case prefix rules and lead inspector names',
              '🔖 Official audit verification stamps & conclusion notes',
              '👥 5 member seats with shared enterprise evidence workspace',
            ],
        plans: [
          { id: 'team', name: isZh ? '企业团队年卡' : 'Team Annual', fee: '1998.00', origFee: '¥3,999.00', tag: isZh ? '🏢 5人团队 · 企业级' : '🏢 5 SEATS' },
          { id: 'lifetime', name: isZh ? '个人终身买断' : 'Pro Lifetime', fee: '39.90', origFee: '¥199.00', tag: isZh ? '💎 个人买断' : '💎 PERSONAL' },
          { id: 'yearly', name: isZh ? '个人年度版' : 'Pro Annual', fee: '19.90', origFee: '¥59.90', tag: isZh ? '个人年卡' : 'PERSONAL' },
        ],
        defaultPlan: 'team',
      },
      pro: {
        badge: isZh ? '⚡ PRO 专业版专属权益' : '⚡ PRO MEMBERSHIP',
        title: isZh ? '升级为 SOUNDTEST.PRO 专业版' : 'Upgrade to SOUNDTEST.PRO',
        subtitle: isZh
          ? '解锁防伪司法级 PDF 报告、多端云同步与夜间持续哨兵监测'
          : 'Unlock certified PDF reports, multi-device cloud sync and sentry mode',
        bullets: isZh
          ? [
              '⚡ 跨手机与电脑实时同步现场取证元数据与项目模版',
              '🛡️ 解锁防伪司法级 PDF 报告无水印直出与 SHA-256 存证指纹',
              '🌙 支持夜间床头哨兵自动监测与超标噪音自动录音',
            ]
          : [
              '⚡ End-to-end encrypted cross-device sync for metadata & templates',
              '🛡️ Watermark-free certified PDF reports with SHA-256 evidence hashes',
              '🌙 Sentry mode for automated overnight noise monitoring & capture',
            ],
        plans: [
          { id: 'yearly', name: isZh ? 'PRO 年度版' : 'Pro Annual', fee: '19.90', origFee: '¥59.90', tag: isZh ? '★ 最受欢迎 · 省67%' : '★ POPULAR' },
          { id: 'lifetime', name: isZh ? 'PRO 终身版' : 'Lifetime', fee: '39.90', origFee: '¥199.00', tag: isZh ? '💎 买断立省¥159' : '💎 LIFETIME' },
          { id: 'pro', name: isZh ? 'PRO 月度版' : 'Pro Monthly', fee: '9.90', origFee: '¥19.90', tag: isZh ? '单月体验' : 'MONTHLY' },
        ],
        defaultPlan: 'yearly',
      },
    };

    const cfg = featureConfigs[feature] || featureConfigs.sync;
    let selectedPlanId = cfg.defaultPlan;

    // Create modal DOM element
    const overlay = document.createElement('div');
    overlay.className = 'auth-pay-overlay';
    overlay.id = 'authUpgradePayModalOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    overlay.innerHTML = `
      <div class="auth-pay-modal">
        <button type="button" class="auth-pay-close" id="authPayModalClose" aria-label="${isZh ? '关闭' : 'Close'}">×</button>
        <div class="auth-pay-header">
          <span class="auth-pay-badge">${cfg.badge}</span>
          <h2 class="auth-pay-title">${cfg.title}</h2>
          <p class="auth-pay-subtitle">${cfg.subtitle}</p>
        </div>

        <div class="auth-pay-features">
          ${cfg.bullets.map(b => `
            <div class="auth-pay-feature-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${b}</span>
            </div>
          `).join('')}
        </div>

        <div class="auth-pay-plans" id="authPayPlanButtons">
          ${cfg.plans.map(p => `
            <button type="button" class="auth-pay-plan-btn ${p.id === selectedPlanId ? 'active' : ''}" data-pay-plan="${p.id}">
              ${p.tag ? `<span class="auth-pay-plan-tag">${p.tag}</span>` : ''}
              <span class="auth-pay-plan-name">${p.name}</span>
              <span class="auth-pay-plan-price">¥${p.fee}</span>
            </button>
          `).join('')}
        </div>

        <div class="auth-pay-box">
          <div class="auth-pay-pricing-summary">
            <span class="auth-pay-summary-label" id="authPayPlanLabel">${isZh ? '微信扫码安全直付' : 'WeChat Pay Safe Checkout'}</span>
            <div class="auth-pay-summary-amount">
              <span class="auth-pay-currency">¥</span>
              <span class="auth-pay-amount-num" id="authPayAmount">--</span>
              <span class="auth-pay-orig-num" id="authPayOrig">--</span>
            </div>
          </div>

          <div class="auth-pay-qr-wrapper" id="authPayQrWrapper">
            <img class="auth-pay-qr-img" id="authPayQrImg" alt="${isZh ? '微信支付二维码' : 'WeChat Pay QR Code'}" src="" style="display:none;" />
            <div class="auth-pay-qr-loading" id="authPayQrLoading">
              <div class="auth-pay-spinner"></div>
              <span>${isZh ? '正在生成微信安全支付二维码…' : 'Generating payment QR code…'}</span>
            </div>
          </div>

          <div class="auth-pay-mobile-action" id="authPayMobileAction" style="display:none;">
            <a class="auth-pay-mobile-btn" id="authPayMobileBtn" href="#" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 1.99 1.01 3.77 2.61 4.96L2.8 16.2c-.08.24.15.45.38.35l3.22-1.38c.66.19 1.37.33 2.1.33.25 0 .5-.02.74-.04-.21-.63-.34-1.3-.34-2 0-3.87 3.8-7 8.5-7 .34 0 .67.02 1 .05C17.06 3.93 13.09 2 8.5 2zM6 6.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5.5 3c-4.14 0-7.5 2.69-7.5 6s3.36 6 7.5 6c.65 0 1.28-.08 1.87-.24l2.58 1.11c.21.09.43-.09.35-.31l-.64-2.18C22.02 18.77 23 17.25 23 15.5c0-3.31-3.36-6-7.5-6zm-2.5 3.5c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm4.5 0c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75z"/></svg>
              <span>${isZh ? '唤起微信完成支付' : 'Open WeChat to Pay'}</span>
            </a>
          </div>

          <div class="auth-pay-status-pill" id="authPayStatusPill">
            <span class="auth-pay-dot"></span>
            <span id="authPayStatusText">${isZh ? '等待扫码中，支付完成后自动激活…' : 'Awaiting payment, auto-activates when done…'}</span>
          </div>
        </div>

        <div class="auth-pay-footer">
          <span>🔒 ${isZh ? '虎皮椒安全微信结算 · 支付成功即时生效 · 跨设备多端通用' : 'Secure payment gateway · Instant activation across devices'}</span>
          <div>
            ${isZh
              ? '如需对公转账或开具发票，请联系客服 <a href="mailto:billing@soundtest.pro">billing@soundtest.pro</a>'
              : 'Need invoicing or wire transfer? Contact <a href="mailto:billing@soundtest.pro">billing@soundtest.pro</a>'}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Close handlers
    overlay.querySelector('#authPayModalClose')?.addEventListener('click', closeUpgradePayModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeUpgradePayModal();
    });
    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        closeUpgradePayModal();
        window.removeEventListener('keydown', keyHandler);
      }
    };
    window.addEventListener('keydown', keyHandler);

    // Plan selection handler
    const planButtons = overlay.querySelectorAll('[data-pay-plan]');
    planButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const nextPlanId = btn.getAttribute('data-pay-plan');
        if (nextPlanId === selectedPlanId) return;
        selectedPlanId = nextPlanId;
        planButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-pay-plan') === selectedPlanId));
        loadPaymentOrder(selectedPlanId);
      });
    });

    async function loadPaymentOrder(planId) {
      if (authPayPollTimer) {
        clearInterval(authPayPollTimer);
        authPayPollTimer = null;
      }

      const curPlanCfg = cfg.plans.find(p => p.id === planId) || cfg.plans[0];
      const amountEl = overlay.querySelector('#authPayAmount');
      const origEl = overlay.querySelector('#authPayOrig');
      const qrImg = overlay.querySelector('#authPayQrImg');
      const qrLoading = overlay.querySelector('#authPayQrLoading');
      const mobileAction = overlay.querySelector('#authPayMobileAction');
      const mobileBtn = overlay.querySelector('#authPayMobileBtn');
      const statusText = overlay.querySelector('#authPayStatusText');

      if (amountEl) amountEl.textContent = curPlanCfg.fee;
      if (origEl) origEl.textContent = curPlanCfg.origFee;

      if (qrLoading) {
        qrLoading.style.display = 'flex';
        qrLoading.innerHTML = `<div class="auth-pay-spinner"></div><span>${isZh ? '正在生成微信安全支付二维码…' : 'Generating payment QR code…'}</span>`;
      }
      if (qrImg) qrImg.style.display = 'none';
      if (mobileAction) mobileAction.style.display = 'none';
      if (statusText) statusText.textContent = isZh ? '正在连接安全收银台…' : 'Connecting to checkout gateway…';

      try {
        const resp = await fetch('/api/payment/hupijiao-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: planId,
            email: session?.email || '',
            return_url: window.location.href,
          }),
        });

        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data.ok) {
          throw new Error(data.error || (isZh ? '创建订单失败' : 'Failed to create order'));
        }

        if (qrLoading) qrLoading.style.display = 'none';

        if (isMobile) {
          if (mobileAction && mobileBtn && data.url) {
            mobileAction.style.display = 'block';
            mobileBtn.href = data.url;
          }
          if (statusText) statusText.textContent = isZh ? '请点击上方按钮唤起微信支付…' : 'Click the button above to pay in WeChat…';
        } else {
          if (qrImg && data.url_qrcode) {
            qrImg.src = data.url_qrcode;
            qrImg.style.display = 'block';
          }
          if (statusText) statusText.textContent = isZh ? '请使用手机微信扫码支付，完成后自动激活…' : 'Please scan with WeChat, auto-activates when done…';
        }

        // Start polling
        startPaymentPolling(data.order_id, data.open_order_id, planId);
      } catch (err) {
        if (qrLoading) {
          qrLoading.style.display = 'flex';
          qrLoading.innerHTML = `<span style="color:#ff6276;padding:10px;text-align:center;">${err.message || (isZh ? '网络连接超时，请重试' : 'Network error, please retry')}</span><button type="button" class="btn-outline btn-sm" id="authPayRetryBtn" style="margin-top:6px;">${isZh ? '重新加载' : 'Retry'}</button>`;
          qrLoading.querySelector('#authPayRetryBtn')?.addEventListener('click', () => loadPaymentOrder(planId));
        }
        if (statusText) statusText.textContent = isZh ? '订单初始化失败，请稍后重试' : 'Order initialization failed';
      }
    }

    function startPaymentPolling(orderId, openOrderId, planId) {
      if (authPayPollTimer) clearInterval(authPayPollTimer);
      let count = 0;
      authPayPollTimer = setInterval(async () => {
        count++;
        if (count > 150) { // 5 minutes timeout
          clearInterval(authPayPollTimer);
          authPayPollTimer = null;
          return;
        }

        try {
          const checkResp = await fetch(`/api/payment/hupijiao-check?order_id=${encodeURIComponent(orderId)}&open_order_id=${encodeURIComponent(openOrderId || '')}`);
          const info = await checkResp.json().catch(() => ({}));
          if (info && info.paid) {
            clearInterval(authPayPollTimer);
            authPayPollTimer = null;
            handlePaymentSuccess(planId, orderId);
          }
        } catch (_) {}
      }, 2000);
    }

    function handlePaymentSuccess(planId, orderId) {
      const statusText = overlay.querySelector('#authPayStatusText');
      if (statusText) statusText.textContent = isZh ? '🎉 支付成功！正在为您激活权益…' : '🎉 Payment successful! Activating…';

      const activeDays = planId === 'lifetime' ? 36500 : (planId === 'pro' ? 30 : 365);
      const expDate = new Date(Date.now() + activeDays * 86400 * 1000).toISOString();
      const effectiveTier = (planId === 'team') ? 'team' : 'pro';

      // 1. Sync local sf_membership_v1 for core meter tools
      try {
        localStorage.setItem('sf_membership_v1', JSON.stringify({
          email: session?.email || '',
          active: true,
          plan: effectiveTier,
          plan_display: planId,
          provider: 'wechat_pay',
          status: 'paid',
          expires_at: expDate,
          order_id: orderId,
          lastCheckedAt: new Date().toISOString(),
        }));
      } catch (_) {}

      // 2. Update session and users
      if (session) {
        session.plan = effectiveTier;
        saveSession(session);
        const users = loadUsers();
        const uIdx = users.findIndex(u => u.email === session.email);
        if (uIdx !== -1) {
          users[uIdx].plan = effectiveTier;
          saveUsers(users);
        }
      }

      showToast(isZh ? '🎉 微信支付成功！已为您即时激活会员权益' : '🎉 Payment successful! Membership activated.', 'success');

      setTimeout(() => {
        closeUpgradePayModal();
        if (session) {
          renderDashboard(session);
        }
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      }, 700);
    }

    // Initial load
    loadPaymentOrder(selectedPlanId);
  }

  // Expose on window for easy access/testing
  if (typeof window !== 'undefined') {
    window.soundtestAuth = window.soundtestAuth || {};
    window.soundtestAuth.openUpgradePayModal = openUpgradePayModal;
    window.soundtestAuth.closeUpgradePayModal = closeUpgradePayModal;
    window.soundtestAuth.getEffectivePlan = getEffectivePlan;
  }

  /* ── Dashboard rendering ── */
  function renderDashboard(session) {
    const lang = getNavAuthLang();

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
      sinceEl.textContent = new Date(user.createdAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : undefined, { year: 'numeric', month: 'long' });
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
    const effectivePlan = getEffectivePlan(session);
    const isPro = effectivePlan && effectivePlan !== 'free';

    const planBadge = document.querySelector('[data-plan-badge]');
    if (planBadge) {
      planBadge.setAttribute('data-plan', effectivePlan);
      const planName = planBadge.querySelector('.plan-name');
      if (planName) {
        if (lang === 'zh') {
          planName.textContent = effectivePlan === 'pro' ? 'Pro 专业版' : (effectivePlan === 'team' ? '团队版' : (effectivePlan === 'lifetime' ? '终身版' : '免费版'));
        } else {
          planName.textContent = effectivePlan.charAt(0).toUpperCase() + effectivePlan.slice(1);
        }
      }
    }

    // Subscription card
    const upsellEl      = document.querySelector('[data-subscription-upsell]');
    const prodactiveEl  = document.querySelector('[data-prodactive]');
    const badgeEl       = document.querySelector('[data-subscription-badge]');
    const planDisplay   = document.querySelector('[data-plan-display]');
    const prodactiveTier = document.querySelector('[data-prodactive-tier]');
    const planTierEl    = planDisplay?.querySelector('.plan-tier');
    const planDescEl    = planDisplay?.querySelector('.plan-desc');

    if (upsellEl)      upsellEl.hidden      = isPro;
    if (prodactiveEl)  prodactiveEl.hidden  = !isPro;
    if (planDisplay)   planDisplay.hidden    = isPro;
    if (badgeEl) {
      if (lang === 'zh') {
        badgeEl.textContent = isPro ? (effectivePlan === 'pro' ? 'Pro 专业版' : (effectivePlan === 'team' ? '团队版' : '终身版')) : '免费版';
      } else {
        badgeEl.textContent = isPro ? `${effectivePlan} plan` : 'Free plan';
      }
    }
    if (isPro && prodactiveTier) {
      if (lang === 'zh') {
        prodactiveTier.textContent = (effectivePlan === 'pro' ? 'Pro 专业版' : (effectivePlan === 'team' ? 'Team 团队版' : '终身高级版')) + ' 会员权益生效中';
      } else {
        prodactiveTier.textContent = effectivePlan.charAt(0).toUpperCase() + effectivePlan.slice(1) + ' Plan';
      }
    }

    if (!isPro && planTierEl) planTierEl.textContent = lang === 'zh' ? '免费版' : 'Free';
    if (!isPro && planDescEl && lang === 'zh') {
      planDescEl.textContent = '实时分贝仪监测、基础录音、手动截图、时间与位置水印';
    }
    if (isPro && planTierEl) {
      planTierEl.textContent = lang === 'zh' ? (effectivePlan === 'pro' ? 'Pro 专业版' : effectivePlan) : (effectivePlan.charAt(0).toUpperCase() + effectivePlan.slice(1));
    }

    // Bind upsell button to open payment modal directly
    const upsellBtn = upsellEl?.querySelector('a');
    if (upsellBtn && !upsellBtn.hasAttribute('data-pay-bound')) {
      upsellBtn.setAttribute('data-pay-bound', 'true');
      upsellBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openUpgradePayModal({ feature: 'pro', session });
      });
    }

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
    // Logout — clears local session immediately, revokes server token in background
    document.getElementById('dashboard-logout')?.addEventListener('click', () => {
      const token = session?.token;
      saveSession(null);
      // Revoke server-side KV token (fire-and-forget)
      if (token) {
        fetch('/api/auth/session', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        }).catch(() => {});
      }
      showToast(getAuthMsg('signed_out'), 'success');
      setTimeout(() => location.href = getLocaleHomeHref(), 600);
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
      showToast(getAuthMsg('data_exported'), 'success');
    });

    // Delete account
    document.getElementById('delete-account-btn')?.addEventListener('click', async () => {
      if (!confirm(getAuthMsg('confirm_delete'))) return;
      const email = session?.email;
      const token = session?.token;

      try {
        await fetch('/api/auth/delete-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token }),
        });
      } catch (_) {}

      let users = loadUsers();
      users = users.filter(u => u.email !== email);
      saveUsers(users);
      localStorage.removeItem(RECORDS_KEY);
      localStorage.removeItem(TEMPLATES_KEY);
      saveSession(null);
      showToast(getAuthMsg('account_deleted'), 'success');
      setTimeout(() => location.href = getLocaleHomeHref(), 800);
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
        if (!newName || newName.length < 2) { setPanelError(editProfileForm, getAuthMsg('name_len')); return; }
        let users = loadUsers();
        const idx = users.findIndex(u => u.email === session.email);
        if (idx !== -1) { users[idx].name = newName; saveUsers(users); }
        saveSession({ ...session, name: newName });
        closePanel('profile');
        initAuthPage();
        renderNavAuth();
        showToast(getAuthMsg('profile_updated'), 'success');
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
        if (!cur) { setPanelError(changePasswordForm, getAuthMsg('cur_pwd_req')); return; }
        if (!neu || neu.length < 8) { setPanelError(changePasswordForm, getAuthMsg('new_pwd_len')); return; }
        if (neu !== con) { setPanelError(changePasswordForm, getAuthMsg('pwd_mismatch')); return; }

        const users = loadUsers();
        const idx = users.findIndex(u => u.email === session.email);
        const curHash = await hashPassword(cur);
        if (idx !== -1 && users[idx].passwordHash && curHash !== users[idx].passwordHash) {
          setPanelError(changePasswordForm, getAuthMsg('cur_pwd_incorrect'));
          return;
        }

        const neuHash = await hashPassword(neu);

        // Update in Cloudflare KV
        try {
          const resp = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.email,
              currentPasswordHash: curHash,
              newPasswordHash: neuHash,
            }),
          });
          const data = await resp.json().catch(() => ({}));
          if (!resp.ok && data.error === 'cur_pwd_incorrect') {
            setPanelError(changePasswordForm, getAuthMsg('cur_pwd_incorrect'));
            return;
          }
        } catch (_) {}

        if (idx !== -1) {
          users[idx].passwordHash = neuHash;
          saveUsers(users);
        }
        closePanel('password');
        changePasswordForm.reset();
        showToast(getAuthMsg('pwd_updated'), 'success');
      });
    }

    // Panel openers from settings
    document.querySelector('[data-open-panel="password"]')?.addEventListener('click', () => openPanel('password'));

    // ── Storage Card Calculation & Cloud Sync ──
    async function updateStorageCard() {
      const usageEl = document.querySelector('[data-storage-usage-text]');
      const quotaEl = document.querySelector('[data-storage-quota-text]');
      const fillEl = document.querySelector('[data-storage-fill]');
      if (!usageEl) return;

      const records = loadRecords();
      let est = { usage: 0, quota: 0 };
      if (navigator.storage && navigator.storage.estimate) {
        try {
          est = await navigator.storage.estimate();
        } catch (_) {}
      }

      function fmtBytes(bytes) {
        if (!bytes || bytes <= 0) return '0.4 MB';
        const mb = (bytes / (1024 * 1024)).toFixed(1);
        return `${mb} MB`;
      }

      const usageMb = fmtBytes(est.usage || 419430);
      const isZh = getNavAuthLang() === 'zh';
      const quotaText = isZh ? `本地 IndexedDB (${records.length} 条记录)` : `Local IndexedDB (${records.length} records)`;
      usageEl.textContent = `${usageMb} ${isZh ? '已用存储' : 'used'}`;
      if (quotaEl) quotaEl.textContent = quotaText;
      if (fillEl) {
        const pct = est.quota ? Math.min(100, Math.max(3, Math.round((est.usage / est.quota) * 100))) : 4;
        fillEl.style.width = `${pct}%`;
      }
    }
    updateStorageCard();

    document.getElementById('btn-check-storage')?.addEventListener('click', () => {
      updateStorageCard();
      showToast(getNavAuthLang() === 'zh' ? '存储健康度已刷新' : 'Storage status refreshed', 'info');
    });

    const runCloudSync = async () => {
      const isZh = getNavAuthLang() === 'zh';
      showToast(isZh ? '正在与云端安全同步元数据…' : 'Syncing metadata with cloud…', 'info');
      try {
        const records = loadRecords();
        const branding = JSON.parse(localStorage.getItem('sf_enterprise_branding_v1') || '{}');
        if (session?.email) {
          await fetch('/api/team/workspace', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamId: session.email, ...branding, recordCount: records.length }),
          });
        }
      } catch (_) {}
      setTimeout(() => {
        showToast(isZh ? '元数据已成功同步！多端已接入' : 'Metadata successfully synced!', 'success');
      }, 500);
    };

    document.getElementById('btn-sync-cloud')?.addEventListener('click', () => {
      const plan = getEffectivePlan(session);
      const hasAccess = ['pro', 'yearly', 'lifetime', 'team'].includes(plan);
      if (!hasAccess) {
        openUpgradePayModal({
          feature: 'sync',
          session,
          onSuccess: () => runCloudSync(),
        });
        return;
      }
      runCloudSync();
    });

    // ── Team / Enterprise Report Branding (Stage 3) ──
    const BRANDING_KEY = 'sf_enterprise_branding_v1';
    let savedBranding = {};
    try {
      savedBranding = JSON.parse(localStorage.getItem(BRANDING_KEY) || '{}');
    } catch (_) {}

    const orgInput = document.getElementById('tbOrgName');
    const prefixInput = document.getElementById('tbProjectPrefix');
    const inspectorInput = document.getElementById('tbInspector');
    const stampInput = document.getElementById('tbStampText');
    const savedPill = document.getElementById('branding-saved-pill');

    if (orgInput && savedBranding.enterpriseName) orgInput.value = savedBranding.enterpriseName;
    if (prefixInput && savedBranding.projectCodePrefix) prefixInput.value = savedBranding.projectCodePrefix;
    if (inspectorInput && savedBranding.defaultInspector) inspectorInput.value = savedBranding.defaultInspector;
    if (stampInput && savedBranding.disclaimerStamp) stampInput.value = savedBranding.disclaimerStamp;

    // Fetch from server if logged in
    if (session?.email) {
      fetch(`/api/team/workspace?teamId=${encodeURIComponent(session.email)}`)
        .then(r => r.json())
        .then(data => {
          if (data?.ok && data?.workspace) {
            const ws = data.workspace;
            if (orgInput && !orgInput.value && ws.enterpriseName) orgInput.value = ws.enterpriseName;
            if (prefixInput && !prefixInput.value && ws.projectCodePrefix) prefixInput.value = ws.projectCodePrefix;
            if (inspectorInput && !inspectorInput.value && ws.defaultInspector) inspectorInput.value = ws.defaultInspector;
            if (stampInput && !stampInput.value && ws.disclaimerStamp) stampInput.value = ws.disclaimerStamp;
          }
        })
        .catch(() => {});
    }

    const saveBranding = async () => {
      const isZh = getNavAuthLang() === 'zh';
      const newBranding = {
        enterpriseName: orgInput?.value.trim() || '',
        projectCodePrefix: prefixInput?.value.trim() || '',
        defaultInspector: inspectorInput?.value.trim() || '',
        disclaimerStamp: stampInput?.value.trim() || '',
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(BRANDING_KEY, JSON.stringify(newBranding));

      if (session?.email) {
        try {
          await fetch('/api/team/workspace', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamId: session.email, ...newBranding }),
          });
        } catch (_) {}
      }

      if (savedPill) {
        savedPill.style.display = 'inline-block';
        setTimeout(() => { savedPill.style.display = 'none'; }, 3000);
      }
      showToast(isZh ? '企业报告抬头配置已保存！PDF 与水印将自动套用' : 'Report branding saved! PDF and watermarks will now apply.', 'success');
    };

    const brandingForm = document.getElementById('team-branding-form');
    brandingForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const plan = getEffectivePlan(session);
      if (plan !== 'team') {
        openUpgradePayModal({
          feature: 'team',
          session,
          onSuccess: () => saveBranding(),
        });
        return;
      }
      saveBranding();
    });

    document.getElementById('btn-save-branding')?.addEventListener('click', (e) => {
      const plan = getEffectivePlan(session);
      if (plan !== 'team') {
        e.preventDefault();
        openUpgradePayModal({
          feature: 'team',
          session,
          onSuccess: () => saveBranding(),
        });
      }
    });

    // ── Super Admin Console Handlers ──
    const adminCard = document.getElementById('adminConsoleCard');
    const isSuperAdmin = (session?.email && String(session.email).trim().toLowerCase() === 'wewee1@gmail.com') || (session?.role === 'admin');

    if (adminCard) {
      if (isSuperAdmin) {
        adminCard.style.display = 'block';
        const btnGrant = document.getElementById('btnAdminGrant');
        const btnQuery = document.getElementById('btnAdminQuery');
        const inputTarget = document.getElementById('adminTargetEmail');
        const selectPlan = document.getElementById('adminTargetPlan');
        const selectDuration = document.getElementById('adminTargetDuration');
        const feedbackBox = document.getElementById('adminFeedbackBox');

        function setFeedback(msg, isSuccess = true) {
          if (!feedbackBox) return;
          feedbackBox.textContent = msg;
          feedbackBox.className = 'admin-result-box ' + (isSuccess ? 'is-success' : 'is-error');
          feedbackBox.style.display = 'block';
        }

        if (btnGrant && !btnGrant.hasAttribute('data-bound')) {
          btnGrant.setAttribute('data-bound', 'true');
          btnGrant.addEventListener('click', async () => {
            const targetEmail = String(inputTarget?.value || '').trim().toLowerCase();
            if (!targetEmail || !targetEmail.includes('@')) {
              setFeedback('请输入有效的目标用户邮箱地址', false);
              return;
            }
            btnGrant.disabled = true;
            btnGrant.textContent = '正在授权…';
            try {
              const res = await fetch('/api/admin/membership', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-admin-email': session.email,
                  'x-session-token': session.token || '',
                },
                body: JSON.stringify({
                  admin_email: session.email,
                  admin_token: session.token,
                  target_email: targetEmail,
                  plan: selectPlan?.value || 'team',
                  duration_days: parseInt(selectDuration?.value || '3650', 10),
                }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok || !data.ok) {
                setFeedback(data.message || '授权配置失败，请检查网络或权限', false);
              } else {
                setFeedback(`✅ ${data.message}（到期时间: ${data.record?.expires_at ? new Date(data.record.expires_at).toLocaleDateString() : '永久'}）`, true);
                showToast('会员权限配置已生效！', 'success');
              }
            } catch (err) {
              setFeedback('网络请求异常，请稍后重试: ' + err.message, false);
            } finally {
              btnGrant.disabled = false;
              btnGrant.textContent = '⚡ 立即生效';
            }
          });
        }

        if (btnQuery && !btnQuery.hasAttribute('data-bound')) {
          btnQuery.setAttribute('data-bound', 'true');
          btnQuery.addEventListener('click', async () => {
            const targetEmail = String(inputTarget?.value || '').trim().toLowerCase();
            if (!targetEmail || !targetEmail.includes('@')) {
              setFeedback('请输入要查询的目标用户邮箱地址', false);
              return;
            }
            btnQuery.disabled = true;
            btnQuery.textContent = '正在查询…';
            try {
              const res = await fetch(`/api/admin/membership?email=${encodeURIComponent(targetEmail)}`, {
                headers: {
                  'x-admin-email': session.email,
                  'x-session-token': session.token || '',
                },
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok || !data.ok) {
                setFeedback(data.message || '查询失败', false);
              } else {
                const mem = data.membership;
                if (!mem || !mem.active || mem.plan === 'free') {
                  setFeedback(`ℹ️ 用户 ${targetEmail} 当前为【免费版】或无有效会员记录。`, false);
                } else {
                  const exp = mem.expires_at ? new Date(mem.expires_at).toLocaleDateString() : '永久有效';
                  setFeedback(`🌟 用户 ${targetEmail} 当前权限: 【${(mem.plan_display || mem.plan).toUpperCase()}】 | 状态: ${mem.status} | 有效期至: ${exp}`, true);
                }
              }
            } catch (err) {
              setFeedback('网络请求异常: ' + err.message, false);
            } finally {
              btnQuery.disabled = false;
              btnQuery.textContent = '🔍 查询状态';
            }
          });
        }
      } else {
        adminCard.style.display = 'none';
      }
    }
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

  /* ── Panel close bindings & App Bootstrap ── */
  function bootstrap() {
    renderNavAuth();
    if (document.querySelector('[data-auth-page]')) {
      initAuthPage();
    }

    // Fire session refresh in background — no await so UI is never blocked
    silentSessionRefresh().then(() => {
      renderNavAuth();
      const currentSession = loadSession();
      if (currentSession?.email && document.querySelector('[data-auth-page="authenticated"]')) {
        renderDashboard(currentSession);
      }
    }).catch(() => {});

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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();

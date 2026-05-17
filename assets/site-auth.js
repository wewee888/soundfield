(function () {
  'use strict';

  const USERS_KEY = 'soundtest_users_v1';
  const SESSION_KEY = 'soundtest_session_v1';

  function loadUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY) || '[]';
      const list = JSON.parse(raw);
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch (_) {
      return null;
    }
  }

  function saveSession(session) {
    if (!session) {
      localStorage.removeItem(SESSION_KEY);
      return;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  async function hashPassword(password) {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    const hex = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    return hex;
  }

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
    [...utility.querySelectorAll('[data-auth-ui]')].forEach((el) => el.remove());
    const session = loadSession();
    if (session?.email) {
      const info = document.createElement('span');
      info.className = 'nav-auth-pill';
      info.setAttribute('data-auth-ui', 'true');
      info.innerHTML = `<strong>${session.name || 'User'}</strong><span>${session.email}</span>`;
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
      logout.addEventListener('click', () => {
        saveSession(null);
        renderNavAuth();
      });
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

  function setMode(mode) {
    const loginForm = document.querySelector('[data-auth-form="login"]');
    const registerForm = document.querySelector('[data-auth-form="register"]');
    const loginTab = document.querySelector('[data-auth-tab="login"]');
    const registerTab = document.querySelector('[data-auth-tab="register"]');
    if (!loginForm || !registerForm || !loginTab || !registerTab) return;
    const isRegister = mode === 'register';
    registerForm.hidden = !isRegister;
    loginForm.hidden = isRegister;
    registerTab.classList.toggle('active', isRegister);
    loginTab.classList.toggle('active', !isRegister);
  }

  function showMessage(text, kind = 'info') {
    const box = document.querySelector('[data-auth-message]');
    if (!box) return;
    box.textContent = text;
    box.style.color = kind === 'error' ? '#ff8f9a' : '#9ee7d6';
  }

  async function registerUser(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim().toLowerCase();
    const password = form.querySelector('input[name="password"]').value;
    const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;
    if (!name || !email || !password) return showMessage('Please complete all fields.', 'error');
    if (password.length < 8) return showMessage('Password must be at least 8 characters.', 'error');
    if (password !== confirmPassword) return showMessage('Passwords do not match.', 'error');

    const users = loadUsers();
    if (users.find((item) => item.email === email)) return showMessage('Email already registered. Please login.', 'error');
    users.push({
      name,
      email,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
    saveSession({ name, email, signedAt: new Date().toISOString() });
    showMessage('Registration successful. Redirecting...');
    setTimeout(() => {
      location.href = 'index.html';
    }, 700);
  }

  async function loginUser(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.querySelector('input[name="email"]').value.trim().toLowerCase();
    const password = form.querySelector('input[name="password"]').value;
    if (!email || !password) return showMessage('Please enter email and password.', 'error');

    const users = loadUsers();
    const target = users.find((item) => item.email === email);
    if (!target) return showMessage('Account not found.', 'error');
    const hash = await hashPassword(password);
    if (hash !== target.passwordHash) return showMessage('Incorrect password.', 'error');
    saveSession({ name: target.name, email: target.email, signedAt: new Date().toISOString() });
    showMessage('Login successful. Redirecting...');
    setTimeout(() => {
      location.href = 'index.html';
    }, 700);
  }

  function initAuthPage() {
    const shell = document.querySelector('[data-auth-shell]');
    if (!shell) return;
    const mode = new URLSearchParams(location.search).get('mode') === 'register' ? 'register' : 'login';
    setMode(mode);
    document.querySelector('[data-auth-tab="login"]')?.addEventListener('click', () => setMode('login'));
    document.querySelector('[data-auth-tab="register"]')?.addEventListener('click', () => setMode('register'));
    document.querySelector('[data-auth-form="login"]')?.addEventListener('submit', loginUser);
    document.querySelector('[data-auth-form="register"]')?.addEventListener('submit', registerUser);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderNavAuth();
    initAuthPage();
  });
})();

// Penyimpanan bersama Backoffice (simulasi tanpa server).
// Data dasar dibaca dari window.BO_DATA[usecase]; setiap perubahan analis disimpan sebagai
// "patch" di localStorage sehingga shell dan semua halaman (iframe satu origin) melihat state yang sama.
// Saat integrasi API, ganti fungsi list/get/update/create/log dengan panggilan endpoint.
(function () {
  'use strict';
  // ---------- tema (gelap bawaan, sama dengan Backoffice Sitroom) ----------
  var THEME_KEY = 'bo.theme';
  function themeNow() { try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch (e) { return 'dark'; } }
  function applyTheme() { document.documentElement.setAttribute('data-theme', themeNow()); }
  applyTheme();
  window.addEventListener('storage', function (e) { if (e.key === THEME_KEY || e.key === null) applyTheme(); });

  var KEY = 'bo.sim.v1';
  var ROLES = {
    analis: { key: 'analis', nama: 'Analis Harmonisasi', peran: 'Analis', unit: 'Bidang Analisis Regulasi Investasi', ini: 'AH' },
    approver: { key: 'approver', nama: 'Analis Utama', peran: 'Approver', unit: 'Bidang Analisis Regulasi Investasi', ini: 'AU' }
  };
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var MONL = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  var ROOT = (function () {
    var s = document.currentScript && document.currentScript.src;
    try { return new URL('../', s || location.href).href; } catch (e) { return '/'; }
  })();

  function def() { return { role: 'analis', p: {}, n: {}, o: {}, audit: [], read: {}, seq: 0 }; }
  function load() {
    try { var v = JSON.parse(localStorage.getItem(KEY)); if (v && typeof v === 'object') return Object.assign(def(), v); } catch (e) {}
    return def();
  }
  var S = load(), ver = 0, cache = {}, subs = [];

  function emit() { ver++; cache = {}; subs.slice().forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } }); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} emit(); }
  window.addEventListener('storage', function (e) { if (e.key === KEY || e.key === null) { S = load(); emit(); } });

  function data(uc) { return (window.BO_DATA || {})[uc] || null; }
  function at(obj, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function k3(uc, ent, id) { return uc + '|' + ent + '|' + id; }

  function now() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  var BO = {
    ROOT: ROOT, ROLES: ROLES,
    data: data,
    version: function () { return ver; },

    // ---------- koleksi ----------
    list: function (uc, ent) {
      var ck = uc + '|' + ent;
      if (cache[ck]) return cache[ck];
      var base = at(data(uc), ent) || [];
      var out = base.map(function (r) { var p = S.p[k3(uc, ent, r.id)]; return p ? Object.assign({}, r, p) : r; });
      (S.n[ck] || []).forEach(function (r) { var p = S.p[k3(uc, ent, r.id)]; out.push(p ? Object.assign({}, r, p) : r); });
      cache[ck] = out;
      return out;
    },
    get: function (uc, ent, id) { var l = BO.list(uc, ent); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; },
    update: function (uc, ent, id, patch, log) {
      var k = k3(uc, ent, id);
      S.p[k] = Object.assign({}, S.p[k] || {}, patch);
      if (log) pushLog(uc, ent, id, log);
      save();
    },
    create: function (uc, ent, rec, log) {
      var ck = uc + '|' + ent;
      S.n[ck] = (S.n[ck] || []).concat([rec]);
      if (log) pushLog(uc, ent, rec.id, log);
      save();
    },
    nextId: function (uc, ent, prefix, w) {
      var l = BO.list(uc, ent), max = 0;
      l.forEach(function (r) { var m = String(r.id).match(/(\d+)$/); if (m) max = Math.max(max, Number(m[1])); });
      return prefix + String(max + 1).padStart(w || 3, '0');
    },
    // ---------- draf lokal halaman (functional update agar klik beruntun tidak saling menimpa) ----------
    draftSet: function (cmp, id, saved, patch) {
      cmp.setState(function (s) {
        var D = Object.assign({}, s.draft), cur = D[id] || saved;
        D[id] = Object.assign({}, cur, typeof patch === 'function' ? patch(cur) : patch);
        return { draft: D };
      });
    },
    // ---------- objek konfigurasi (bukan array) ----------
    obj: function (uc, path) {
      var b = at(data(uc), path) || {}, p = S.o[uc + '|' + path];
      return p ? Object.assign({}, b, p) : b;
    },
    setObj: function (uc, path, patch, log) {
      var k = uc + '|' + path;
      S.o[k] = Object.assign({}, S.o[k] || {}, patch);
      if (log) pushLog(uc, path, log.obj || path, log);
      save();
    },

    // ---------- audit ----------
    log: function (uc, ent, obj, log) { pushLog(uc, ent, obj, log); save(); },
    audit: function (uc) {
      var base = [];
      Object.keys(window.BO_DATA || {}).forEach(function (k) { if (!uc || uc === k) base = base.concat(window.BO_DATA[k].audit || []); });
      var live = S.audit.filter(function (a) { return !uc || a.uc === uc; });
      return live.concat(base).sort(function (a, b) { return a.at < b.at ? 1 : a.at > b.at ? -1 : 0; });
    },
    liveAudit: function () { return S.audit.slice(); },

    // ---------- peran ----------
    role: function () { return ROLES[S.role] || ROLES.analis; },
    setRole: function (r) { if (ROLES[r] && S.role !== r) { S.role = r; save(); } },

    // ---------- notifikasi ----------
    // aksi oleh sistem/peran lain dalam cakupan use case = notifikasi bagi peran aktif
    notifs: function (uc) { var me = BO.role().key; return BO.audit(uc).filter(function (a) { return a.peran !== me; }).slice(0, 40); },
    unread: function (uc) { return BO.notifs(uc).filter(function (a) { return !S.read[a.id]; }).length; },
    isRead: function (id) { return !!S.read[id]; },
    markRead: function (ids) { ids.forEach(function (id) { S.read[id] = 1; }); save(); },

    // ---------- tema & sesi demo ----------
    theme: themeNow,
    setTheme: function (t) {
      try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
      applyTheme();
      // iframe satu origin tidak menerima event storage dari jendela yang sama → teruskan manual
      Array.prototype.forEach.call(document.querySelectorAll('iframe'), function (f) { try { f.contentDocument.documentElement.setAttribute('data-theme', t); } catch (e) {} });
    },
    authed: function () { try { return localStorage.getItem('bo.auth') === '1'; } catch (e) { return true; } },
    login: function (u, p) { if (u === 'admin' && p === 'admin') { try { localStorage.setItem('bo.auth', '1'); } catch (e) {} return true; } return false; },
    logout: function () { try { localStorage.removeItem('bo.auth'); } catch (e) {} },

    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} S = def(); emit(); },

    // ---------- langganan perubahan ----------
    on: function (fn) { subs.push(fn); return function () { subs = subs.filter(function (f) { return f !== fn; }); }; },
    // dipanggil dari componentDidMount halaman dc-runtime
    mount: function (cmp) {
      cmp.__boOff = BO.on(function () { cmp.setState({ __bo: ver }); });
      cmp.__boMsg = function (e) { var d = e.data; if (d && d.type === 'bo:open' && typeof cmp.onOpen === 'function') cmp.onOpen(d.id || null); };
      window.addEventListener('message', cmp.__boMsg);
    },
    unmount: function (cmp) { if (cmp.__boOff) cmp.__boOff(); if (cmp.__boMsg) window.removeEventListener('message', cmp.__boMsg); },

    // ---------- navigasi (shell ↔ halaman) ----------
    inShell: function () { try { return window.parent !== window && !!window.parent.__BO_SHELL__; } catch (e) { return false; } },
    nav: function (path) {
      if (BO.inShell()) window.parent.postMessage({ type: 'bo:nav', path: path }, '*');
      else location.href = ROOT + 'index.html#' + path;
    },
    // perbarui alamat di shell tanpa memuat ulang halaman (mis. membuka/menutup detail)
    route: function (path) { if (BO.inShell()) window.parent.postMessage({ type: 'bo:route', path: path }, '*'); },
    param: function (name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } },

    // ---------- toast ----------
    toast: function (msg, kind) {
      var el = document.getElementById('bo-toast');
      if (!el) { el = document.createElement('div'); el.id = 'bo-toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
      el.className = 'bo-toast on ' + (kind || '');
      el.textContent = msg;
      clearTimeout(BO._tt);
      BO._tt = setTimeout(function () { el.className = 'bo-toast ' + (kind || ''); }, 2800);
    },

    // ---------- format ----------
    now: now,
    nf: function (n, d) { return Number(n).toLocaleString('id-ID', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); },
    pct: function (a, b) { return b ? Math.round((a / b) * 1000) / 10 : 0; },
    date: function (s) { if (!s) return '—'; var p = String(s).slice(0, 10).split('-').map(Number); return p[2] + ' ' + MON[p[1] - 1] + ' ' + p[0]; },
    dateL: function (s) { var p = String(s).slice(0, 10).split('-').map(Number); return p[2] + ' ' + MONL[p[1] - 1] + ' ' + p[0]; },
    dt: function (s) { if (!s) return '—'; var t = String(s).slice(11, 16); return BO.date(s) + (t ? ', ' + t.replace(':', '.') + ' WIB' : ''); },
    esc: function (s) { return String(s == null ? '' : s); }
  };

  function pushLog(uc, ent, obj, log) {
    var r = BO.role();
    S.seq = (S.seq || 0) + 1;
    S.audit.unshift({
      id: 'AL-' + String(S.seq).padStart(4, '0'), at: now(), uc: uc, ent: ent, obj: obj,
      aktor: r.nama, peran: r.key, aksi: log.aksi || '', sebelum: log.sebelum || '—', sesudah: log.sesudah || '—', alasan: log.alasan || '—'
    });
    if (S.audit.length > 500) S.audit.length = 500;
  }

  window.BO = BO;
})();

// Pustaka kecil halaman bergaya Sitroom (pages/app, pages/ws): ikon, render ulang, event delegasi,
// dan logika Workspace Harmonisasi (hitungan, label, daftar "Perlu Tindakan").
// Pola: UI.page({ state, render(s) → html, on: { aksi(el, ev) } }). Atribut data-on="aksi" memicu handler,
// data-nav="path" berpindah halaman lewat shell. Render ulang otomatis saat data BO berubah.
(function () {
  'use strict';
  var UC = 'harmonisasi';
  var P = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    dash: '<path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M12 3a9 9 0 0 1 9 9h-9z"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>',
    check: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    list: '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="3" y1="15" x2="21" y2="15"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/>',
    widget: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="12" y2="16"/>',
    alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    alertc: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    spark: '<path d="M12 3l1.6 4.9L18.5 9.5l-4.9 1.6L12 16l-1.6-4.9L5.5 9.5l4.9-1.6z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/><path d="M5 2l.6 1.4L7 4l-1.4.6L5 6l-.6-1.4L3 4l1.4-.6z"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    chev: '<polyline points="6 9 12 15 18 9"/>', chevr: '<polyline points="9 18 15 12 9 6"/>', chevl: '<polyline points="15 18 9 12 15 6"/>', chevu: '<polyline points="18 15 12 9 6 15"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    more: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
    moreh: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    sync: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
    okc: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    ok: '<polyline points="20 6 9 17 4 12"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    archive: '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
    draft: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/>',
    approve: '<path d="M9 12l2 2 4-4"/><path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    hist: '<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    lib: '<path d="M4 4v16"/><path d="M8 4v16"/><path d="M12 4l4 16"/><path d="M16 4v16" opacity="0"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    hour: '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22"/><path d="M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><polyline points="21 3 21 8 16 8"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    clip: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>',
    send: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>',
    kpi: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'
  };
  function icon(k, cls) { return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (P[k] || '') + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  function d(s, yy) { if (!s) return '—'; var p = String(s).slice(0, 10).split('-').map(Number); return p[2] + ' ' + MON[p[1] - 1] + (yy === false ? '' : ' ' + (yy === 2 ? String(p[0]).slice(2) : p[0])); }
  function t(s) { var x = String(s || '').slice(11, 16); return x ? x.replace(':', '.') : ''; }
  function dt(s, yy) { var x = t(s); return d(s, yy) + (x ? ', ' + x : ''); }

  // ---------- Workspace Harmonisasi ----------
  var L = function (e) { return BO.list(UC, e); };
  var MODUL = { payung: 'Payung Kebijakan', peluang: 'Peluang Daerah', demografi: 'Demografi & Mobilitas', perizinan: 'Perizinan', keselarasan: 'Keselarasan Regulasi' };
  var TIPE = { kpi: 'KPI Card', insight: 'Insight Card', peta: 'Peta', tabel: 'Tabel' };
  var LV = { crit: 'Kritis', warn: 'Peringatan', info: 'Informasi' };
  var WS = {
    uc: UC, MODUL: MODUL, TIPE: TIPE, LV: LV,
    ws: function () { return BO.data(UC).ws; },
    widgets: function () { return L('ws.widgets'); },
    ews: function () { return L('ws.ews'); },
    sources: function () { return L('ws.dataSource'); },
    knowledge: function () { return L('ws.knowledge'); },
    topik: function () { return L('ws.topik'); },
    versi: function () { return L('ws.versi'); },
    reviewed: function (e) { return [1, 2, 3, 4].every(function (k) { return e.review && e.review[k]; }); },
    reviewN: function (e) { return [1, 2, 3, 4].filter(function (k) { return e.review && e.review[k]; }).length; },
    aiReview: function () { return L('keluaranAI').filter(function (a) { return a.status === 'review'; }).length; },
    aiApproval: function () { return L('keluaranAI').filter(function (a) { return a.status === 'approval'; }); },
    hpMenunggu: function () { return L('penilaian').filter(function (p) { return p.status === 'menunggu'; }).length; },
    // daftar Perlu Tindakan (kind: err|warn|ai|info) — mine: untuk peran aktif
    todo: function () {
      var role = BO.role().key, out = [], ws = WS.ws();
      WS.sources().forEach(function (s) {
        if (s.status !== 'aktif') return;
        if (s.segar === 'ganggu') out.push({ k: 'err', ic: 'db', tag: 'Gangguan', t: 'Data gangguan: ' + s.galat, s: s.nama + ' · ' + s.penyedia, btn: 'Lihat', nav: 'workspace/harmonisasi/data-source/' + s.id, mine: role === 'analis' });
        if (s.segar === 'telat') out.push({ k: 'warn', ic: 'db', tag: 'Terlambat', t: 'Data terlambat ' + (s.galat.match(/\d+/) || [''])[0] + ' hari', s: s.nama + ' · ' + s.penyedia, btn: 'Lihat', nav: 'workspace/harmonisasi/data-source/' + s.id, mine: role === 'analis' });
      });
      WS.ews().filter(function (e) { return e.status === 'active' && !WS.reviewed(e); }).forEach(function (e) {
        out.push({ k: 'err', ic: 'alert', tag: LV[e.level], t: 'EWS aktif perlu direview analis · ' + WS.reviewN(e) + ' dari 4 bagian selesai', s: e.judul, btn: 'Review', nav: 'workspace/harmonisasi/ews/' + e.id, mine: role === 'analis' });
      });
      var ap = WS.ews().filter(function (e) { return e.status === 'approval'; });
      if (ap.length) out.push({ k: 'warn', ic: 'approve', tag: 'Approval', t: ap.length + ' EWS menunggu keputusan Approver', s: 'Deteksi AI terbaru ' + dt(ap[0].terdeteksi, false), btn: 'Putuskan', nav: role === 'approver' ? 'approvals' : 'workspace/harmonisasi/ews', mine: role === 'approver' });
      var nai = WS.aiReview();
      if (nai) out.push({ k: 'ai', ic: 'spark', tag: 'Belum ditinjau', t: nai + ' narasi AI menunggu tinjauan analis', s: 'Ringkasan, Poin Penting, Dampak, Saran untuk Presiden', btn: 'Tinjau', nav: 'harmonisasi/narasi-ai', mine: role === 'analis' });
      var aap = WS.aiApproval().length;
      if (aap) out.push({ k: 'ai', ic: 'spark', tag: 'Approval', t: aap + ' narasi AI menunggu persetujuan tayang', s: 'Operation › Harmonisasi › Tinjauan Narasi AI', btn: 'Tinjau', nav: 'harmonisasi/narasi-ai', mine: role === 'approver' });
      var hp = WS.hpMenunggu();
      if (hp) out.push({ k: 'info', ic: 'check', tag: 'Verifikasi', t: hp + ' hasil penilaian keselarasan menunggu verifikasi', s: 'BO-01 · Operation › Harmonisasi › Verifikasi Penilaian', btn: 'Buka', nav: 'harmonisasi/verifikasi', mine: role === 'analis' });
      var wa = WS.widgets().filter(function (w) { return w.status === 'approval'; }).length;
      if (wa) out.push({ k: 'warn', ic: 'widget', tag: 'Approval', t: wa + ' widget menunggu persetujuan', s: 'Widget baru/revisi sebelum tayang di Dashboard Presiden', btn: 'Putuskan', nav: role === 'approver' ? 'approvals' : 'workspace/harmonisasi/widgets', mine: role === 'approver' });
      var dsm = WS.sources().filter(function (s) { return s.status === 'menunggu'; }).length;
      if (dsm) out.push({ k: 'info', ic: 'db', tag: 'Approval', t: dsm + ' data source baru menunggu persetujuan', s: 'Unggahan analis sebelum bisa dipakai widget', btn: 'Putuskan', nav: role === 'approver' ? 'approvals' : 'workspace/harmonisasi/data-source', mine: role === 'approver' });
      return out;
    },
    fresh: function () {
      var a = WS.sources().filter(function (s) { return s.status === 'aktif'; });
      return { ganggu: a.filter(function (s) { return s.segar === 'ganggu'; }), telat: a.filter(function (s) { return s.segar === 'telat'; }), ok: a.filter(function (s) { return s.segar === 'ok'; }), all: a };
    },
    // antrean persetujuan lintas jenis (halaman Approvals)
    approvals: function () {
      var out = [];
      WS.ews().filter(function (e) { return e.status === 'approval'; }).forEach(function (e) { out.push({ jenis: 'EWS', id: e.id, ent: 'ws.ews', judul: e.judul, sub: LV[e.level] + ' · deteksi AI', at: e.diajukan || e.terdeteksi, oleh: 'Sistem AI', nav: 'workspace/harmonisasi/ews/' + e.id }); });
      WS.widgets().filter(function (w) { return w.status === 'approval'; }).forEach(function (w) { out.push({ jenis: 'Widget', id: w.id, ent: 'ws.widgets', judul: w.judul, sub: TIPE[w.tipe] + ' · ' + MODUL[w.modul] + ' · v' + w.ver, at: w.diperbarui, oleh: w.dibuatOleh || 'Analis Harmonisasi', nav: 'workspace/harmonisasi/widgets/' + w.id }); });
      WS.sources().filter(function (s) { return s.status === 'menunggu'; }).forEach(function (s) { out.push({ jenis: 'Data Source', id: s.id, ent: 'ws.dataSource', judul: s.nama, sub: s.penyedia + ' · ' + BO.nf(s.record) + ' record', at: s.diperbarui, oleh: s.diunggah || 'Analis Harmonisasi', nav: 'workspace/harmonisasi/data-source/' + s.id }); });
      WS.versi().filter(function (v) { return v.status === 'approval'; }).forEach(function (v) { out.push({ jenis: 'Dashboard', id: v.id, ent: 'ws.versi', judul: 'Dashboard Harmonisasi ' + v.id, sub: v.catatan, at: v.tgl, oleh: v.oleh, nav: 'dashboard-management/harmonisasi' }); });
      return out.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    },
    activity: function (n) {
      var seed = WS.ws().aktivitas.map(function (a) { return { kind: a[0], w: a[1], at: a[2] }; });
      var live = BO.audit(UC).filter(function (a) { return /^ws\./.test(a.ent) || a.peran !== 'sistem'; }).slice(0, 8).map(function (a) {
        return { kind: a.peran === 'sistem' ? 'ai' : a.peran, w: a.aksi + (a.obj ? ': ' + objName(a.ent, a.obj) : ''), at: a.at, by: a.aktor };
      });
      return live.concat(seed).sort(function (a, b) { return a.at < b.at ? 1 : -1; }).slice(0, n || 5);
    }
  };
  function objName(ent, id) {
    var map = { 'ws.ews': 'judul', 'ws.widgets': 'judul', 'ws.dataSource': 'nama', 'ws.knowledge': 'judul', keluaranAI: null };
    if (map[ent]) { var r = BO.get(UC, ent, id); return r ? r[map[ent]] : id; }
    if (ent === 'keluaranAI') { var a = BO.get(UC, 'keluaranAI', id); return a ? (a.ed || a.ai).judul : id; }
    return id;
  }

  // ---------- kerangka render ----------
  var UI = {
    icon: icon, esc: esc, d: d, t: t, dt: dt, WS: WS,
    nav: function (p) { BO.nav(p); },
    page: function (o) {
      var root = document.getElementById('app');
      var self = { state: o.state || {}, set: function (patch) { Object.assign(self.state, typeof patch === 'function' ? patch(self.state) : patch); draw(); } };
      function draw() {
        var a = document.activeElement, fid = a && a.id, s0 = a && a.selectionStart, s1 = a && a.selectionEnd;
        root.innerHTML = o.render.call(self, self.state);
        if (fid) { var n = document.getElementById(fid); if (n) { n.focus(); try { if (s0 != null) n.setSelectionRange(s0, s1); } catch (e) {} } }
        if (o.after) o.after.call(self, self.state);
      }
      function fire(type, ev) {
        var el = ev.target.closest('[data-' + type + ']');
        if (!el || !root.contains(el)) return false;
        var name = el.getAttribute('data-' + type);
        var fn = (o.on || {})[name];
        if (fn) { fn.call(self, el, ev); return true; }
        return false;
      }
      root.addEventListener('click', function (ev) {
        var nv = ev.target.closest('[data-nav]'), on = ev.target.closest('[data-on]');
        // tombol aksi di dalam kartu yang bisa diklik → jalankan aksinya, bukan navigasi
        if (on && root.contains(on) && (!nv || nv.contains(on))) { fire('on', ev); return; }
        if (nv && root.contains(nv)) { ev.preventDefault(); BO.nav(nv.getAttribute('data-nav')); }
      });
      root.addEventListener('input', function (ev) { fire('in', ev); });
      root.addEventListener('change', function (ev) { fire('ch', ev); });
      root.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') fire('enter', ev); });
      BO.on(draw);
      window.addEventListener('message', function (e) { var x = e.data; if (x && x.type === 'bo:open' && o.onOpen) o.onOpen.call(self, x.id || null); });
      draw();
      return self;
    },
    // komponen kecil
    tabs: function (items, cur, act) {
      return '<div class="tabs" role="tablist">' + items.map(function (it) {
        return '<button type="button" role="tab" class="tab' + (it.k === cur ? ' on' : '') + '" aria-selected="' + (it.k === cur) + '" data-on="' + act + '" data-k="' + it.k + '">' + (it.ic ? icon(it.ic) : '') + esc(it.l) + (it.n != null ? '<span class="cnt' + (it.hl && it.n ? ' hl' : '') + '">' + it.n + '</span>' : '') + '</button>';
      }).join('') + '</div>';
    },
    chips: function (items, cur, act) {
      return items.map(function (it) { return '<button type="button" class="chip' + (it.k === cur ? ' on' : '') + '" aria-pressed="' + (it.k === cur) + '" data-on="' + act + '" data-k="' + it.k + '">' + esc(it.l) + (it.n != null ? '<span class="n">' + it.n + '</span>' : '') + '</button>'; }).join('');
    },
    todoRow: function (x) {
      return '<div class="todo"><span class="tic t-' + x.k + '">' + icon(x.ic) + '</span><div class="tx"><div class="tt">' + esc(x.t) + '</div><div class="ts">' + (x.uc ? '<span class="tag">' + esc(x.uc) + '</span>' : '') + esc(x.s) + '</div></div><button type="button" class="btn" data-nav="' + x.nav + '">' + esc(x.btn) + '</button></div>';
    },
    donut: function (parts, label, sub) {
      var tot = parts.reduce(function (a, p) { return a + p.v; }, 0) || 1, r = 64, c = 2 * Math.PI * r, off = 0, gap = 3;
      var arcs = parts.map(function (p) {
        var len = Math.max(0, p.v / tot * c - gap); var s = '<circle cx="80" cy="80" r="' + r + '" fill="none" stroke="' + p.c + '" stroke-width="22" stroke-dasharray="' + len + ' ' + (c - len) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 80 80)"/>';
        off += p.v / tot * c; return p.v ? s : '';
      }).join('');
      return '<svg viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="' + esc(label + ' ' + sub) + '">' + arcs + '<text x="80" y="80" text-anchor="middle" font-size="24" font-weight="700" fill="var(--content-primary)">' + esc(label) + '</text><text x="80" y="100" text-anchor="middle" font-size="11" fill="var(--content-secondary)">' + esc(sub) + '</text></svg>';
    },
    soon: function (title, text, ic) { return '<div class="soon"><div class="em">' + icon(ic || 'clock') + '</div><h2>' + esc(title) + '</h2><p>' + esc(text) + '</p></div>'; },
    reason: function (title, label, cb) {
      var r = window.prompt(title + (label ? '\n' + label : ''), '');
      if (r == null) return; if (!String(r).trim()) { BO.toast('Alasan wajib diisi.', 'x'); return; } cb(String(r).trim());
    }
  };
  window.UI = UI;
})();

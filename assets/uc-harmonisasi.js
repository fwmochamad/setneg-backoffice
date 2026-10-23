// Logika domain use case Harmonisasi Investasi: kamus label, aturan kelengkapan,
// dan indikator operasional BO-01 s.d. BO-15 (Back Office 2026 · KAK 2026).
// Semua angka dihitung dari BO.list(...) sehingga ikut berubah ketika analis bertindak.
(function () {
  'use strict';
  var UC = 'harmonisasi';
  var H = function () { return window.BO_DATA[UC]; };
  var L = function (ent) { return BO.list(UC, ent); };
  var map = function (pairs) { var o = {}; pairs.forEach(function (p) { o[p[0]] = p[1]; }); return o; };

  var ST_AI = { review: ['Menunggu tinjauan', 'pl-rev'], approval: ['Menunggu persetujuan', 'pl-app'], published: ['Tayang', 'pl-pub'], taken: ['Ditarik', 'pl-take'] };
  var ST_HP = { menunggu: ['Menunggu verifikasi', 'pl-rev'], terverifikasi: ['Terverifikasi', 'pl-pub'], dikembalikan: ['Perlu penilaian ulang', 'pl-warn'] };
  var ST_KS = { menunggu: ['Menunggu tinjauan', 'pl-rev'], ditinjau: ['Selesai ditinjau', 'pl-pub'] };
  var ST_TL = { belum: ['Belum ditindaklanjuti', 'pl-gray'], proses: ['Dalam penanganan', 'pl-rev'], tunggu: ['Menunggu keputusan', 'pl-warn'], selesai: ['Selesai', 'pl-pub'] };
  var ST_PV = { selesai: ['Selesai dikurasi', 'pl-pub'], proses: ['Dalam kurasi', 'pl-rev'] };
  var ST_REG = { berlaku: ['Berlaku', 'pl-pub'], diubah: ['Diubah', 'pl-warn'], dicabut: ['Dicabut', 'pl-gray'] };
  var PERAN_REG = { acuan: 'Acuan berlaku', objek: 'Objek penilaian', historis: 'Historis', pembanding: 'Pembanding' };
  var ST_PN = { tayang: ['Ditayangkan', 'pl-pub'], menunggu: ['Menunggu persetujuan', 'pl-app'], draf: ['Draf · belum tayang', 'pl-gray'], ditarik: ['Ditarik', 'pl-take'] };

  var U = {
    key: UC,
    ST_AI: ST_AI, ST_HP: ST_HP, ST_KS: ST_KS, ST_TL: ST_TL, ST_PV: ST_PV, ST_REG: ST_REG, PERAN_REG: PERAN_REG, ST_PN: ST_PN,
    modulL: function (k) { return map(H().modul)[k] || k; },
    modulS: function (k) { return { payung: 'Payung Kebijakan', peluang: 'Peluang Daerah', demografi: 'Demografi', perizinan: 'Perizinan', keselarasan: 'Keselarasan' }[k] || k; },
    modulNo: function (k) { var i = H().modul.map(function (m) { return m[0]; }).indexOf(k); return i + 1; },
    jenisL: function (k) { return map(H().jenisIndikasi)[k] || '—'; },
    sekL: function (k) { var s = H().sektor.filter(function (x) { return x[0] === k; })[0]; return s ? (k === 'X' ? 'Lintas sektor' : k + ' · ' + s[1]) : k; },
    sekShort: function (k) { var s = H().sektor.filter(function (x) { return x[0] === k; })[0]; return s ? (k === 'X' ? 'Lintas sektor' : k + ' · ' + s[1].split(',')[0]) : k; },
    reg: function (id) { return BO.get(UC, 'regulasi', id); },

    // ---------- aturan kelengkapan ----------
    metaKosong: function (r) {
      return H().metaWajib.filter(function (m) { var v = r[m[0]]; return Array.isArray(v) ? !v.length : !v; });
    },
    metaLengkap: function (r) { return U.metaKosong(r).length === 0; },
    buktiKurang: function (p) {
      var out = H().buktiWajib.filter(function (b) { return !(p.bukti || {})[b[0]]; }).map(function (b) { return b[1]; });
      if (!p.pertimbangan || !String(p.pertimbangan).trim()) out.push('Pertimbangan analis');
      return out;
    },
    hpLengkap: function (p) { return U.buktiKurang(p).length === 0; },
    tlLengkap: function (t) { return !!t.status && !!(t.pic && String(t.pic).trim()); },
    pvChecklist: function (p) { var c = p.checklist || {}; var items = H().checklistProvinsi; return { done: items.filter(function (i) { return c[i[0]]; }).length, total: items.length }; },
    aiSah: function (a) { return a.status === 'published' && a.disetujuiVer === a.ver; },
    aiTeks: function (a) { return a.ed || a.ai; },

    // ---------- indikator BO ----------
    kpis: function () {
      var hp = L('penilaian'), reg = L('regulasi'), ks = L('klasifikasi'), tl = L('tindakLanjut'), pv = L('provinsi'), ai = L('keluaranAI');
      var cnt = function (a, f) { return a.filter(f).length; };
      var hpMenunggu = cnt(hp, function (p) { return p.status === 'menunggu'; });
      var hpVer = cnt(hp, function (p) { return p.status === 'terverifikasi'; });
      var hpLengkap = cnt(hp, function (p) { return p.status === 'terverifikasi' && U.hpLengkap(p); });
      var regLengkap = cnt(reg, U.metaLengkap);
      var ksMenunggu = cnt(ks, function (k) { return k.status === 'menunggu'; });
      var ksDitinjau = cnt(ks, function (k) { return k.status === 'ditinjau'; });
      var tlLengkap = cnt(tl, U.tlLengkap);
      var pvSelesai = cnt(pv, function (p) { return p.status === 'selesai'; });
      var aiAntre = cnt(ai, function (a) { return a.status === 'review' || a.status === 'approval'; });
      var aiPub = cnt(ai, function (a) { return a.status === 'published'; });
      var aiSah = cnt(ai, U.aiSah);
      var ms = BO.obj(UC, 'cms.masterSektor'), kr = BO.obj(UC, 'cms.kriteria');
      var am = L('cms.ambang'), ly = L('cms.layer'), pn = L('cms.penayangan');
      var amSet = cnt(am, function (a) { return a.status === 'ditetapkan'; });
      var lyAktif = cnt(ly, function (l) { return l.aktif; });
      var pnBy = function (s) { return cnt(pn, function (p) { return p.status === s; }); };
      var P = function (a, b) { return BO.nf(BO.pct(a, b), BO.pct(a, b) % 1 ? 1 : 0) + '%'; };

      return [
        { id: 'BO-01', area: 'ra', page: 'verifikasi', q: 'menunggu', label: 'Hasil penilaian menunggu verifikasi', v: BO.nf(hpMenunggu), sat: 'hasil penilaian', sub: hpMenunggu + ' record versi terbaru dalam antrean',
          f: 'Hitung ID hasil penilaian versi terbaru yang berstatus menunggu verifikasi.', baca: 'Jumlah record dalam antrean, bukan jumlah regulasi tidak selaras.', tone: 'blue' },
        { id: 'BO-02', area: 'ra', page: 'verifikasi', label: 'Cakupan verifikasi hasil penilaian', v: P(hpVer, hp.length), sat: '%', sub: hpVer + ' dari ' + hp.length + ' hasil selesai diverifikasi', bar: BO.pct(hpVer, hp.length),
          f: 'Hasil penilaian selesai diverifikasi / seluruh hasil penilaian dalam cakupan × 100%.', baca: 'Cakupan verifikasi. Keputusan verifikasi tidak selalu menyetujui tayang.', tone: 'blue' },
        { id: 'BO-03', area: 'ra', page: 'verifikasi', q: 'kurang', label: 'Kelengkapan pertimbangan dan bukti penilaian', v: P(hpLengkap, hpVer), sat: '%', sub: hpLengkap + ' dari ' + hpVer + ' hasil lengkap bukti dan pertimbangan', bar: BO.pct(hpLengkap, hpVer),
          f: 'Hasil penilaian dengan seluruh pertimbangan dan bukti wajib lengkap / hasil penilaian yang diperiksa × 100%.', baca: 'Checklist kelengkapan. Lengkap tidak otomatis akurat.', tone: 'blue' },
        { id: 'BO-04', area: 'ra', page: 'regulasi', label: 'Regulasi dalam koleksi yang dikelola', v: BO.nf(reg.length), sat: 'dokumen', sub: cnt(reg, function (r) { return r.status === 'berlaku'; }) + ' berlaku · ' + cnt(reg, function (r) { return r.status !== 'berlaku'; }) + ' historis/pembanding',
          f: 'Hitung ID regulasi unik dalam koleksi Workspace.', baca: 'Koleksi dapat mencakup regulasi historis/pembanding; berbeda dari jumlah regulasi berlaku di dashboard.', tone: 'slate' },
        { id: 'BO-05', area: 'ra', page: 'regulasi', q: 'kurang', label: 'Kelengkapan metadata resmi regulasi', v: P(regLengkap, reg.length), sat: '%', sub: regLengkap + ' dari ' + reg.length + ' regulasi lengkap metadata resmi', bar: BO.pct(regLengkap, reg.length),
          f: 'Regulasi dengan semua metadata wajib dan rujukan resmi lengkap / regulasi dalam cakupan pemeriksaan × 100%.', baca: 'Kelengkapan berdasarkan field wajib yang disepakati.', tone: 'slate' },
        { id: 'BO-06', area: 'ra', page: 'klasifikasi', q: 'menunggu', label: 'Klasifikasi sektor menunggu tinjauan', v: BO.nf(ksMenunggu), sat: 'hasil klasifikasi', sub: 'Hasil otomatis versi terbaru yang belum ditinjau',
          f: 'Hitung ID hasil klasifikasi otomatis versi terbaru yang belum selesai ditinjau.', baca: 'Antrean hasil klasifikasi otomatis versi terbaru.', tone: 'purple' },
        { id: 'BO-07', area: 'ra', page: 'klasifikasi', label: 'Cakupan peninjauan klasifikasi otomatis', v: P(ksDitinjau, ks.length), sat: '%', sub: ksDitinjau + ' dari ' + ks.length + ' hasil klasifikasi ditinjau', bar: BO.pct(ksDitinjau, ks.length),
          f: 'Hasil klasifikasi selesai ditinjau / hasil klasifikasi otomatis dalam cakupan × 100%.', baca: 'Cakupan tinjauan, bukan akurasi model.', tone: 'purple' },
        { id: 'BO-08', area: 'ra', page: 'tindak-lanjut', q: 'kurang', label: 'Kelengkapan pencatatan tindak lanjut', v: P(tlLengkap, tl.length), sat: '%', sub: tlLengkap + ' dari ' + tl.length + ' tindak lanjut memiliki status dan PIC', bar: BO.pct(tlLengkap, tl.length),
          f: 'Tindak lanjut dengan status dan penanggung jawab terisi resmi / tindak lanjut dalam cakupan × 100%.', baca: 'Kelengkapan pencatatan, bukan persentase penyelesaian tindak lanjut.', tone: 'amber' },
        { id: 'BO-09', area: 'ra', page: 'provinsi', label: 'Cakupan kurasi profil dan indikator provinsi', v: P(pvSelesai, pv.length), sat: '%', sub: pvSelesai + ' dari ' + pv.length + ' provinsi dalam cakupan selesai dikurasi', bar: BO.pct(pvSelesai, pv.length),
          f: 'Provinsi dengan profil dan indikator yang selesai dikurasi sesuai checklist / provinsi dalam cakupan × 100%.', baca: 'Menggunakan subset ' + pv.length + ' provinsi dalam cakupan, bukan seluruh provinsi Indonesia.', tone: 'teal' },
        { id: 'BO-10', area: 'ra', page: 'narasi-ai', q: 'antre', label: 'Keluaran AI menunggu peninjauan/persetujuan', v: BO.nf(aiAntre), sat: 'keluaran AI', sub: cnt(ai, function (a) { return a.status === 'review'; }) + ' menunggu tinjauan · ' + cnt(ai, function (a) { return a.status === 'approval'; }) + ' menunggu persetujuan',
          f: 'Hitung ID keluaran AI versi terbaru yang belum selesai ditinjau/disetujui sesuai alur.', baca: 'Antrean versi terbaru sesuai alur yang disepakati.', tone: 'violet' },
        { id: 'BO-11', area: 'ra', page: 'narasi-ai', q: 'published', label: 'Kepatuhan persetujuan keluaran AI yang ditayangkan', v: P(aiSah, aiPub), sat: '%', sub: aiSah + ' dari ' + aiPub + ' keluaran AI tayang disetujui sesuai versi', bar: BO.pct(aiSah, aiPub),
          f: 'Keluaran AI tayang dengan persetujuan analis yang sesuai versi / seluruh keluaran AI tayang dalam cakupan × 100%.', baca: 'Kepatuhan persetujuan sesuai versi, bukan akurasi AI.', tone: 'violet' },
        { id: 'BO-12', area: 'cms', page: 'cms-kriteria', label: 'Daftar sektor dan kriteria yang dikonfigurasi', v: 'Master sektor ' + ms.versiAktif + ' · kriteria ' + kr.versiAktif, sat: 'konfigurasi', sub: (ms.aktif || []).length + ' sektor aktif · ' + (kr.items || []).filter(function (i) { return i.aktif; }).length + ' kriteria aktif',
          f: 'Tampilkan master sektor dan kriteria beserta versi yang digunakan; tidak membutuhkan formula angka.', baca: 'Label versi masih placeholder. Nilai/versi aktual harus ditetapkan.', tone: 'slate', text: true },
        { id: 'BO-13', area: 'cms', page: 'cms-ambang', label: 'Ambang batas peringatan yang digunakan', v: amSet ? amSet + ' dari ' + am.length + ' ambang ditetapkan' : 'Ambang belum ditetapkan', sat: 'konfigurasi', sub: am.length + ' indikator peringatan menunggu penetapan nilai',
          f: 'Nilai ambang mengikuti aturan yang disetujui; tidak ada formula ambang dalam KAK.', baca: 'Backoffice tidak mengarang nilai peringatan karena KAK tidak menentukan threshold.', tone: amSet ? 'slate' : 'amber', text: true },
        { id: 'BO-14', area: 'cms', page: 'cms-peta', label: 'Lapisan peta dan indikator wilayah yang dikonfigurasi', v: lyAktif + ' dari ' + ly.length + ' lapisan aktif', sat: 'konfigurasi', sub: 'Setiap lapisan dilengkapi sumber, periode dan cakupan wilayah',
          f: 'Tampilkan layer/indikator beserta sumber, cakupan wilayah dan periode; tanpa KPI numerik wajib.', baca: 'Konfigurasi dalam cakupan KAK.', tone: 'slate', text: true },
        { id: 'BO-15', area: 'cms', page: 'cms-penayangan', label: 'Status penayangan analisis provinsi/sektor', v: pnBy('tayang') + ' ditayangkan', sat: 'status', sub: pnBy('menunggu') + ' menunggu persetujuan · ' + pnBy('draf') + ' draf · ' + pnBy('ditarik') + ' ditarik',
          f: 'Status dan versi analisis yang ditayangkan pada cakupan terpilih. Rekap jumlah per status hanya jika diperlukan.', baca: 'Status/versi penayangan per provinsi dan sektor.', tone: 'slate', text: true }
      ];
    },

    // nilai template kartu KPI untuk halaman (ids: daftar ID BO)
    kpiVals: function (ids) {
      var all = U.kpis();
      return all.filter(function (k) { return !ids || ids.indexOf(k.id) >= 0; }).map(function (k) {
        return Object.assign({}, k, {
          cls: 't-' + k.tone, vcls: k.text ? 'txt' : '', hasBar: k.bar != null, barW: (k.bar || 0) + '%',
          // filter dikirim sebagai segmen "f:<nama>" (mis. #harmonisasi/verifikasi/f:menunggu)
          go: function () { BO.nav(UC + '/' + k.page + (k.q ? '/f:' + k.q : '')); }, goL: 'Buka ' + k.label.toLowerCase().split(' ').slice(0, 3).join(' ') + ' →'
        });
      });
    },
    // riwayat audit satu objek, siap untuk timeline
    auditOf: function (ent, id) {
      return BO.audit(UC).filter(function (a) { return a.ent === ent && a.obj === id; }).map(function (a) {
        var cls = a.peran === 'sistem' ? 'ai' : /setuju|tayang|selesai|diverifikasi|ditetapkan|ditinjau/i.test(a.aksi) && !/tarik|kembali/i.test(a.aksi) ? 'ok' : /tarik|kembali|batal|tolak/i.test(a.aksi) ? 'x' : '';
        return { w: a.aksi, m: a.aktor + ' · ' + BO.dt(a.at), d: (a.sebelum !== '—' || a.sesudah !== '—') ? a.sebelum + ' → ' + a.sesudah : '', why: a.alasan && a.alasan !== '—' ? 'Alasan: ' + a.alasan : '', cls: cls, hasD: a.sebelum !== '—' || a.sesudah !== '—', hasWhy: !!a.alasan && a.alasan !== '—' };
      });
    },

    // badge angka di sidebar shell
    badges: function () {
      var c = function (ent, f) { return L(ent).filter(f).length; };
      var role = BO.role().key;
      return {
        'verifikasi': c('penilaian', function (p) { return p.status === 'menunggu'; }),
        'regulasi': c('regulasi', function (r) { return !U.metaLengkap(r); }),
        'klasifikasi': c('klasifikasi', function (k) { return k.status === 'menunggu'; }),
        'tindak-lanjut': c('tindakLanjut', function (t) { return !U.tlLengkap(t); }),
        'provinsi': c('provinsi', function (p) { return p.status !== 'selesai'; }),
        'narasi-ai': c('keluaranAI', function (a) { return role === 'approver' ? a.status === 'approval' : (a.status === 'review' || a.status === 'approval'); }),
        'cms-ambang': c('cms.ambang', function (a) { return a.status !== 'ditetapkan'; }),
        'cms-penayangan': c('cms.penayangan', function (p) { return p.status === 'menunggu'; })
      };
    },

    // label objek untuk audit/notifikasi
    objL: function (ent, id) {
      var r;
      if (ent === 'keluaranAI') { r = BO.get(UC, ent, id); return r ? U.aiTeks(r).judul : id; }
      if (ent === 'penilaian') { r = BO.get(UC, ent, id); var g = r && U.reg(r.regId); return g ? g.nomor : id; }
      if (ent === 'regulasi') { r = BO.get(UC, ent, id); return r ? r.nomor : id; }
      if (ent === 'klasifikasi') { r = BO.get(UC, ent, id); var g2 = r && U.reg(r.regId); return g2 ? g2.nomor : id; }
      if (ent === 'tindakLanjut') { r = BO.get(UC, ent, id); return r ? r.judul : id; }
      if (ent === 'provinsi') { r = BO.get(UC, ent, id); return r ? 'Profil ' + r.nama : id; }
      if (ent === 'cms.penayangan' || ent === 'penayangan') { r = BO.get(UC, 'cms.penayangan', id); return r ? 'Analisis ' + r.cakupan : id; }
      if (ent === 'cms.ambang') { r = BO.get(UC, ent, id); return r ? 'Ambang · ' + r.l : id; }
      if (ent === 'cms.layer') { r = BO.get(UC, ent, id); return r ? 'Lapisan · ' + r.l : id; }
      if (ent === 'cms.masterSektor' || ent === 'masterSektor') return 'Master sektor ' + id;
      if (ent === 'cms.kriteria' || ent === 'kriteria') return 'Kriteria penilaian ' + id;
      if (ent === 'ws.ews' || ent === 'ws.widgets' || ent === 'ws.knowledge' || ent === 'ws.topik') { r = BO.get(UC, ent, id); return r ? r.judul : id; }
      if (ent === 'ws.dataSource') { r = BO.get(UC, ent, id); return r ? r.nama : id; }
      if (ent === 'ws.versi') return 'Dashboard Harmonisasi ' + id;
      return id;
    },
    entL: { keluaranAI: 'Keluaran AI', penilaian: 'Hasil penilaian', regulasi: 'Regulasi', klasifikasi: 'Klasifikasi sektor', tindakLanjut: 'Tindak lanjut', provinsi: 'Profil provinsi', 'cms.penayangan': 'Penayangan', penayangan: 'Penayangan', 'cms.ambang': 'Ambang batas', 'cms.layer': 'Lapisan peta', 'cms.masterSektor': 'Master sektor', masterSektor: 'Master sektor', 'cms.kriteria': 'Kriteria penilaian', kriteria: 'Kriteria penilaian', 'ws.ews': 'Early Warning System', 'ws.widgets': 'Widget', 'ws.dataSource': 'Data Source', 'ws.versi': 'Versi dashboard', 'ws.knowledge': 'Data Knowledge', 'ws.topik': 'Topik pantauan' },
    // halaman tujuan untuk membuka objek dari audit/notifikasi
    objPath: function (ent, id) {
      var m = { keluaranAI: 'narasi-ai', penilaian: 'verifikasi', regulasi: 'regulasi', klasifikasi: 'klasifikasi', tindakLanjut: 'tindak-lanjut', provinsi: 'provinsi', 'cms.penayangan': 'cms-penayangan', penayangan: 'cms-penayangan', 'cms.ambang': 'cms-ambang', 'cms.layer': 'cms-peta', 'cms.masterSektor': 'cms-kriteria', masterSektor: 'cms-kriteria', 'cms.kriteria': 'cms-kriteria', kriteria: 'cms-kriteria' };
      var wsm = { 'ws.ews': 'workspace/harmonisasi/ews/', 'ws.widgets': 'workspace/harmonisasi/widgets/', 'ws.dataSource': 'workspace/harmonisasi/data-source/', 'ws.versi': 'dashboard-management/harmonisasi', 'ws.knowledge': 'workspace/harmonisasi/assistant/knowledge', 'ws.topik': 'workspace/harmonisasi/ews/topik' };
      if (wsm[ent]) return wsm[ent] + (/\/$/.test(wsm[ent]) ? id : '');
      var pg = m[ent];
      if (!pg) return null;
      var withId = ['narasi-ai', 'verifikasi', 'regulasi', 'klasifikasi', 'tindak-lanjut', 'provinsi'].indexOf(pg) >= 0;
      return UC + '/' + pg + (withId && id ? '/' + id : '');
    }
  };

  window.BO_UC = window.BO_UC || {};
  window.BO_UC[UC] = U;
})();

// Registry use case Backoffice Dashboard Presiden.
// Satu backoffice menampung beberapa use case, seperti dashboard. Untuk menambah use case:
// 1) tambahkan entri di bawah, 2) buat folder pages/<key>/, 3) siapkan data/<key>-data.js.
// status: 'aktif' (halaman tersedia) | 'segera' (menampilkan halaman placeholder)
window.BO_USECASES = [
  {
    key: 'eksekutif', nama: 'Eksekutif', ringkas: 'Ringkasan Nasional, Analisis Sektor, Sentimen, Pengaduan, Arahan Presiden', status: 'segera', modul: 5
  },
  {
    key: 'ekonomi', nama: 'Ekonomi', ringkas: 'Indikator makro, harga pangan, dan kinerja sektor ekonomi', status: 'segera', modul: 0
  },
  {
    key: 'harmonisasi', nama: 'Harmonisasi Investasi', ringkas: 'Payung Kebijakan, Peluang Daerah, Demografi, Perizinan, Keselarasan Regulasi', status: 'aktif', modul: 5,
    awal: 'overview',
    grup: [
      {
        l: 'Ruang Kerja Analis', items: [
          { k: 'overview', l: 'Ringkasan', ic: 'grid', f: 'harmonisasi/overview.html' },
          { k: 'verifikasi', l: 'Verifikasi Penilaian', ic: 'check', f: 'harmonisasi/verifikasi.html', bo: 'BO-01–03' },
          { k: 'regulasi', l: 'Koleksi Regulasi', ic: 'book', f: 'harmonisasi/regulasi.html', bo: 'BO-04–05' },
          { k: 'klasifikasi', l: 'Klasifikasi Sektor', ic: 'tag', f: 'harmonisasi/klasifikasi.html', bo: 'BO-06–07' },
          { k: 'tindak-lanjut', l: 'Tindak Lanjut', ic: 'flag', f: 'harmonisasi/tindak-lanjut.html', bo: 'BO-08' },
          { k: 'provinsi', l: 'Kurasi Profil Provinsi', ic: 'map', f: 'harmonisasi/provinsi.html', bo: 'BO-09' },
          { k: 'narasi-ai', l: 'Tinjauan Narasi AI', ic: 'spark', f: 'harmonisasi/narasi-ai.html', bo: 'BO-10–11' }
        ]
      },
      {
        l: 'CMS Harmonisasi', items: [
          { k: 'cms-kriteria', l: 'Master Sektor & Kriteria', ic: 'sliders', f: 'harmonisasi/cms-kriteria.html', bo: 'BO-12' },
          { k: 'cms-ambang', l: 'Ambang Batas Peringatan', ic: 'bell', f: 'harmonisasi/cms-ambang.html', bo: 'BO-13' },
          { k: 'cms-peta', l: 'Lapisan Peta & Indikator', ic: 'layers', f: 'harmonisasi/cms-peta.html', bo: 'BO-14' },
          { k: 'cms-penayangan', l: 'Penayangan Analisis', ic: 'eye', f: 'harmonisasi/cms-penayangan.html', bo: 'BO-15' }
        ]
      }
    ]
  }
];

// Menu lintas use case (grup Administrasi)
window.BO_SHARED = [
  { k: 'audit', l: 'Audit Trail', ic: 'history', f: 'shared/audit.html' },
  { k: 'notifikasi', l: 'Notifikasi', ic: 'inbox', f: 'shared/notifikasi.html' }
];

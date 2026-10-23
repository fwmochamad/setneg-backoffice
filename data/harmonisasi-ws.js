// Data contoh (mock) Workspace · use case Harmonisasi Investasi (pola Backoffice Sitroom:
// Dashboard, Widget, Early Warning System, Data Source, AI Training Center, Dashboard Management, Approvals).
// Dimuat SETELAH data/harmonisasi-data.js. Struktur siap diganti respons API.
// Semua nama, angka dan tanggal adalah DATA SIMULASI, diselaraskan dengan Dashboard Harmonisasi Investasi.
(function () {
  'use strict';
  var D = window.BO_DATA = window.BO_DATA || {};

  // ---------- katalog use case (sama dengan Backoffice Sitroom) ----------
  // aktif: true hanya Harmonisasi. Use case lain tampil sebagai daftar, tanpa isi.
  var KATALOG = [
    { key: 'eksekutif', nama: 'Eksekutif' },
    { key: 'pertahanan', nama: 'Pertahanan & Keamanan', sub: [
      ['umum', 'Umum'], ['intelijen-strategis', 'Intelijen Strategis'], ['postur-pertahanan', 'Postur Pertahanan'], ['keamanan-laut', 'Keamanan Laut'],
      ['kewilayahan', 'Kewilayahan'], ['objek-vital-nasional', 'Objek Vital Nasional'], ['geopolitik', 'Geopolitik'], ['siber', 'Siber']] },
    { key: 'ekonomi', nama: 'Ekonomi', sub: [
      ['ekonomi-makro', 'Ekonomi Makro'], ['investasi', 'Investasi'], ['esdm', 'ESDM'], ['ketenagakerjaan', 'Ketenagakerjaan'], ['pendapatan-negara', 'Pendapatan Negara'], ['belanja-negara', 'Belanja Negara']] },
    { key: 'pkpn', nama: 'PKPN', sub: [['mbg', 'MBG'], ['kdmp', 'KDMP'], ['knmp', 'KNMP']] },
    { key: 'kebijakan', nama: 'Kebijakan', sub: [['analisa-kebijakan', 'Analisa Kebijakan'], ['tracking-kebijakan', 'Tracking Kebijakan']] },
    { key: 'harmonisasi', nama: 'Harmonisasi', aktif: true },
    { key: 'ketahanan-energi', nama: 'Ketahanan Energi' },
    { key: 'ketahanan-pangan', nama: 'Ketahanan Pangan' },
    { key: 'kunjungan-kerja-presiden', nama: 'Kunjungan Kerja Presiden' },
    { key: 'pelayanan-publik', nama: 'Pelayanan Publik' }
  ];

  // ---------- Widget (komponen Dashboard Harmonisasi Investasi per modul) ----------
  // tipe: kpi | insight | peta | tabel   ·   status: active | draft | approval | archived
  var W = function (id, modul, tipe, judul, desc, sumber, extra) {
    return Object.assign({ id: id, modul: modul, tipe: tipe, judul: judul, desc: desc, sumber: sumber, status: 'active', bawaan: true, diperbarui: '2026-10-16T06:00', tooltip: desc, ver: 1 }, extra || {});
  };
  var widgets = [
    // Modul 1 · Payung Kebijakan Investasi
    W('hrm-kpi-regulasi', 'payung', 'kpi', 'Regulasi investasi berlaku', 'Jumlah regulasi investasi yang berstatus berlaku dalam koleksi', ['regulasi'], { nilai: '290', satuan: 'regulasi', delta: 'pusat 251 · daerah 39' }),
    W('hrm-kpi-keselarasan', 'payung', 'kpi', 'Tingkat keselarasan', 'Persentase regulasi yang dinilai selaras dari regulasi yang sudah dinilai', ['regulasi', 'temuan'], { nilai: '95,4%', satuan: '', delta: 'selaras 271 dari 284 dinilai' }),
    W('hrm-kpi-tidak-selaras', 'payung', 'kpi', 'Regulasi tidak selaras', 'Regulasi berlaku dengan indikasi ketidakselarasan terverifikasi analis', ['temuan'], { nilai: '13', satuan: 'regulasi', delta: 'belum dinilai 6 (Perda baru)' }),
    W('hrm-kpi-teknis', 'payung', 'kpi', 'Dominasi aturan teknis', 'Porsi peraturan menteri terhadap seluruh regulasi investasi berlaku', ['regulasi'], { nilai: '64%', satuan: '', delta: 'Peraturan Menteri 185 regulasi' }),
    W('hrm-sebaran-puu', 'payung', 'insight', 'Jumlah regulasi menurut jenis · 2026', 'Sebaran PUU investasi menurut jenis dan tingkat', ['regulasi'], {
      bars: [['Peraturan Menteri', 185], ['Peraturan Daerah', 41], ['Undang-Undang', 28], ['Peraturan Presiden', 26], ['Keputusan Menteri', 10]],
      insight: 'Peraturan menteri mendominasi koleksi (185 dari 290 regulasi), menandakan pengaturan investasi banyak berada di tingkat teknis operasional kementerian/lembaga.' }),
    W('hrm-daftar-regulasi', 'payung', 'tabel', 'Daftar Regulasi Investasi', 'Nomor, jenis, tahun, judul, ringkasan dan status keselarasan', ['regulasi']),
    W('hrm-relasi', 'payung', 'insight', 'Relasi induk & turunan', 'Hubungan regulasi induk dengan peraturan pelaksana', ['regulasi'], { insight: 'PP No. 28 Tahun 2025 memiliki 31 peraturan pelaksana; sembilan peraturan menteri pelaksana belum ditetapkan.' }),
    W('hrm-status-berlaku', 'payung', 'insight', 'Status keberlakuan & log status', 'Riwayat perubahan, pencabutan dan penetapan regulasi', ['regulasi']),
    // Modul 2 · Peluang Investasi Daerah
    W('hrm-kpi-realisasi', 'peluang', 'kpi', 'Realisasi investasi Tw II 2026', 'Realisasi PMA dan PMDN nasional triwulan berjalan', ['bkpm'], { nilai: 'Rp 1.050T', satuan: '', delta: '↑ 12,4% yoy' }),
    W('hrm-peta-peluang', 'peluang', 'peta', 'Peta peluang investasi daerah', 'Koroplet realisasi investasi dan titik proyek siap investasi per provinsi', ['bkpm', 'pir', 'penduduk']),
    W('hrm-top-pdrb', 'peluang', 'insight', 'Top 5 PDRB provinsi', 'Lima provinsi dengan PDRB ADHB tertinggi', ['pdrb'], {
      bars: [['DKI Jakarta', 3632], ['Jawa Timur', 3105], ['Jawa Barat', 2850], ['Jawa Tengah', 1858], ['Sumatera Utara', 1121]],
      insight: 'Lima provinsi teratas menyumbang lebih dari separuh PDRB nasional; empat di antaranya berada di Pulau Jawa.' }),
    W('hrm-proyek-siap', 'peluang', 'tabel', 'Proyek siap investasi', 'Daftar proyek siap investasi per provinsi dan sektor', ['pir']),
    W('hrm-pelaksanaan', 'peluang', 'insight', 'Pelaksanaan investasi & hambatan regulasi', 'Ringkasan pelaksanaan investasi dan hambatan regulasi per provinsi', ['bkpm', 'regulasi']),
    W('hrm-peluang-sektor', 'peluang', 'insight', 'Peluang sektor & rekomendasi kebijakan', 'Sektor unggulan provinsi dan rekomendasi kebijakan', ['pdrb', 'bkpm']),
    // Modul 3 · Demografi & Mobilitas Penduduk
    W('hrm-peta-kepadatan', 'demografi', 'peta', 'Peta kepadatan penduduk & profil wilayah', 'Kepadatan (jiwa/km²) dan porsi penduduk nasional per provinsi', ['penduduk']),
    W('hrm-tren-migrasi', 'demografi', 'insight', 'Tren migrasi masuk & keluar', 'Arus migrasi risen masuk dan keluar per provinsi', ['migrasi'], {
      bars: [['Jawa Barat', 412], ['Banten', 268], ['Kepulauan Riau', 141], ['Kalimantan Timur', 133], ['Jawa Tengah', 121]],
      insight: 'Migrasi masuk terpusat di beberapa provinsi, menandakan pasar kerja dan belanja yang tumbuh lebih cepat.' }),
    W('hrm-komuter', 'demografi', 'insight', 'Mobilitas kerja (komuter)', 'Komuter kerja harian di aglomerasi utama', ['pergerakan']),
    W('hrm-pergerakan', 'demografi', 'tabel', 'Provinsi dengan pergerakan masuk/keluar tertinggi', 'Peringkat provinsi berdasarkan pergerakan penduduk', ['pergerakan']),
    W('hrm-wisata', 'demografi', 'insight', 'Wisata & penerbangan', 'Perjalanan wisatawan nusantara dan penumpang penerbangan', ['pergerakan']),
    // Modul 4 · Kemudahan Berusaha & Perizinan
    W('hrm-kpi-izin', 'perizinan', 'kpi', 'Total izin terbit Apr–Sep 2026', 'Jumlah perizinan berusaha yang terbit di OSS RBA', ['oss'], { nilai: '1,28 jt', satuan: 'izin', delta: '↑ 8,1% Apr → Sep' }),
    W('hrm-kpi-sla', 'perizinan', 'kpi', 'Perlu perhatian (melewati SLA)', 'Permohonan yang melewati standar waktu layanan', ['oss'], { nilai: '4.912', satuan: 'permohonan', delta: '42% di persetujuan lingkungan' }),
    W('hrm-izin-status', 'perizinan', 'insight', 'Jumlah izin diterbitkan & status', 'Izin terbit per bulan dan status permohonan', ['oss']),
    W('hrm-izin-terlama', 'perizinan', 'tabel', 'Jenis izin & wilayah dengan waktu terlama', 'Jenis izin dengan rata-rata waktu penyelesaian terlama', ['oss']),
    W('hrm-progres', 'perizinan', 'insight', 'Progres Permohonan Belum Terbit', 'Tahapan permohonan yang belum terbit', ['oss']),
    W('hrm-tren-kemudahan', 'perizinan', 'insight', 'Tren kemudahan berusaha', 'Perkembangan indikator kemudahan berusaha', ['oss'], { status: 'draft', bawaan: false, ver: 1, diperbarui: '2026-10-14T10:20', dibuatOleh: 'Analis Harmonisasi' }),
    // Modul 5 · Keselarasan Regulasi & Tindak Lanjut
    W('hrm-kpi-penanganan', 'keselarasan', 'kpi', 'Tindak lanjut dalam penanganan', 'Temuan yang sedang ditangani instansi penanggung jawab', ['temuan'], { nilai: '9', satuan: 'temuan', delta: 'rata-rata 47 hari penanganan' }),
    W('hrm-jenis-indikasi', 'keselarasan', 'insight', 'Jenis indikasi ketidakselarasan', 'Temuan menurut jenis indikasi', ['temuan'], {
      bars: [['Hambatan kemudahan berusaha', 7], ['Tumpang tindih kewenangan', 3], ['Pertentangan norma', 2], ['Tidak sesuai sasaran', 1]],
      insight: 'Hambatan kemudahan berusaha menjadi jenis indikasi terbanyak (7 temuan), terutama persyaratan tambahan di luar OSS pada peraturan daerah.' }),
    W('hrm-temuan-sektor', 'keselarasan', 'insight', 'Temuan menurut sektor', 'Temuan per kategori KBLI 2025', ['temuan']),
    W('hrm-status-tl', 'keselarasan', 'insight', 'Status tindak lanjut', 'Status penanganan temuan per instansi', ['temuan']),
    W('hrm-daftar-temuan', 'keselarasan', 'tabel', 'Daftar temuan & tindak lanjut', 'Temuan, rekomendasi dan penanggung jawab', ['temuan']),
    W('hrm-dampak-realisasi', 'keselarasan', 'insight', 'Perkiraan dampak terhadap realisasi investasi', 'Proyeksi dampak ketidakselarasan terhadap realisasi', ['temuan', 'bkpm'], { status: 'approval', bawaan: false, ver: 2, diperbarui: '2026-10-13T15:40', dibuatOleh: 'Analis Harmonisasi' }),
    W('hrm-kpi-lama', 'keselarasan', 'kpi', 'Rata-rata lama penanganan (lama)', 'Versi lama kartu rata-rata lama penanganan', ['temuan'], { status: 'archived', nilai: '52', satuan: 'hari', delta: '' })
  ];

  // ---------- Early Warning System ----------
  // status: active | approval | archived ; review: per bagian (1..4)
  var E = function (o) { return Object.assign({ review: { 1: false, 2: false, 3: false, 4: false }, status: 'active' }, o); };
  var ews = [
    E({ id: 'ews-perda-kudus', level: 'crit', judul: 'Perda Kudus Wajibkan Rekomendasi Daerah sebelum OSS, 41 Permohonan Tertahan',
      cepat: 'Fasilitasi pencabutan Pasal 12 ayat (2) melalui Kemendagri.', akurasi: 'Tinggi', modul: 'keselarasan',
      terdeteksi: '2026-10-14T10:00', diperbarui: '2026-10-16T06:00', berakhir: '2026-10-30', review: { 1: true, 2: true, 3: false, 4: false },
      masalah: [['Perda Kabupaten Kudus No. 1 Tahun 2026 Pasal 12 ayat (2) mensyaratkan rekomendasi daerah sebelum permohonan diajukan melalui OSS.', [1]], ['41 permohonan PB-UMKU sektor industri pengolahan tertahan sejak Agustus 2026.', [2]], ['Persyaratan tidak dikenal dalam PP No. 28 Tahun 2025 tentang perizinan berbasis risiko.', [3]]],
      dampak: [['Nilai rencana investasi tertahan sekitar Rp2,1 triliun, didominasi industri rokok dan tekstil.', [2]], ['Berpotensi ditiru kabupaten sekitar yang sedang menyusun perda serupa.', [4]], ['Menurunkan skor kemudahan berusaha Jawa Tengah pada evaluasi triwulan IV.', [2]]],
      langkah: [['segera', 'Fasilitasi pencabutan Pasal 12 ayat (2) Perda Kudus No. 1/2026.', 'Kemendagri', [3]], ['7', 'Proses permohonan tertahan tanpa rekomendasi daerah melalui mekanisme fiktif positif.', 'Kementerian Investasi/BKPM', [2]], ['30', 'Terbitkan surat edaran larangan persyaratan tambahan di luar OSS.', 'Kemendagri, Kemenko Perekonomian', [3]]],
      sumber: [[1, 'Koleksi Regulasi Investasi', 'JDIH Kab. Kudus · Perda No. 1/2026', 'Valid'], [2, 'Sistem OSS RBA', 'Kementerian Investasi/BKPM · per 15 Okt 2026', 'Valid'], [3, 'PP No. 28 Tahun 2025', 'Koleksi Regulasi Investasi', 'Valid'], [4, 'Notulen Rakor Harmonisasi 2 Okt 2026', 'Data Knowledge', 'Perlu konfirmasi']] }),
    E({ id: 'ews-permen-pp28', level: 'warn', judul: 'Sembilan Permen Pelaksana PP 28/2025 Melewati Tenggat Penetapan',
      cepat: 'Percepat penetapan melalui rapat koordinasi Kemenko Perekonomian.', akurasi: 'Sedang', modul: 'payung',
      terdeteksi: '2026-10-08T04:00', diperbarui: '2026-10-08T08:30', berakhir: '2026-11-07', review: { 1: true, 2: true, 3: true, 4: true },
      masalah: [['Sembilan peraturan menteri pelaksana PP No. 28 Tahun 2025 belum ditetapkan, melewati tenggat enam bulan.', [1]], ['Pelaku usaha masih mengacu standar usaha lama.', [2]]],
      dampak: [['Risiko penolakan permohonan di OSS karena standar belum tersedia.', [2]], ['Ketidakpastian hukum bagi investasi sektor pariwisata dan kesehatan.', [1]]],
      langkah: [['7', 'Inventarisasi status penyusunan sembilan permen pelaksana.', 'Kemenko Perekonomian', [1]], ['30', 'Tetapkan target penetapan per kementerian.', 'Kementerian teknis', [1]]],
      sumber: [[1, 'Koleksi Regulasi Investasi', 'Relasi induk & turunan PP 28/2025', 'Valid'], [2, 'Sistem OSS RBA', 'Kementerian Investasi/BKPM', 'Valid']] }),
    E({ id: 'ews-pkkpr-sla', level: 'info', judul: 'PKKPR Melampaui SLA di 6 Provinsi, Rata-rata 38 Hari',
      cepat: 'Prioritaskan integrasi RDTR digital di 20 kabupaten/kota.', akurasi: 'Sedang', modul: 'perizinan',
      terdeteksi: '2026-10-08T04:00', diperbarui: '2026-10-08T07:00', berakhir: '2026-11-07', review: { 1: true, 2: true, 3: true, 4: true },
      masalah: [['Rata-rata waktu penyelesaian PKKPR 38 hari, melampaui SLA 20 hari di enam provinsi.', [1]], ['Tiga provinsi belum memiliki RDTR digital terintegrasi OSS.', [2]]],
      dampak: [['Proyek manufaktur baru tertunda rata-rata 18 hari.', [1]]],
      langkah: [['30', 'Prioritaskan integrasi RDTR digital di 20 kabupaten/kota.', 'Kementerian ATR/BPN', [2]]],
      sumber: [[1, 'Sistem OSS RBA', 'Kementerian Investasi/BKPM', 'Valid'], [2, 'Status RDTR digital', 'Kementerian ATR/BPN', 'Valid']] }),
    E({ id: 'ews-sulteng-turun', level: 'crit', status: 'approval', judul: 'Realisasi Investasi Sulawesi Tengah Turun 18% pada Triwulan III 2026',
      cepat: 'Verifikasi hambatan lahan dan perizinan smelter di Morowali.', akurasi: 'Tinggi', modul: 'peluang',
      terdeteksi: '2026-10-16T04:00', diperbarui: '2026-10-16T04:00', berakhir: '2026-11-15', diajukan: '2026-10-16T04:05',
      masalah: [['Realisasi PMA Sulawesi Tengah Tw III 2026 turun 18% dibanding Tw II.', [1]], ['Dua proyek smelter tertunda karena persetujuan lingkungan.', [2]]],
      dampak: [['Target realisasi luar Jawa 2026 berisiko tidak tercapai.', [1]]],
      langkah: [['segera', 'Verifikasi hambatan lahan dan perizinan smelter di Morowali.', 'Kementerian Investasi/BKPM', [2]]],
      sumber: [[1, 'Realisasi Investasi PMA & PMDN', 'Kementerian Investasi/BKPM', 'Valid'], [2, 'Sistem OSS RBA', 'Kementerian Investasi/BKPM', 'Valid']] }),
    E({ id: 'ews-tl-lewat', level: 'warn', status: 'approval', judul: '13 Tindak Lanjut Temuan Keselarasan Melewati Target 60 Hari',
      cepat: 'Eskalasi ke instansi penanggung jawab melalui surat Menteri Sekretaris Negara.', akurasi: 'Tinggi', modul: 'keselarasan',
      terdeteksi: '2026-10-16T04:00', diperbarui: '2026-10-16T04:00', berakhir: '2026-11-15', diajukan: '2026-10-16T04:05',
      masalah: [['13 temuan belum selesai ditangani melewati target 60 hari.', [1]]],
      dampak: [['Hambatan regulasi tetap berlaku dan menahan investasi daerah.', [1]]],
      langkah: [['7', 'Eskalasi ke instansi penanggung jawab.', 'Kemensetneg', [1]]],
      sumber: [[1, 'Temuan & Tindak Lanjut Keselarasan', 'Backoffice Harmonisasi', 'Valid']] }),
    E({ id: 'ews-migrasi-kendal', level: 'info', status: 'approval', judul: 'Migrasi Masuk Batang–Kendal Naik 14%, Kebutuhan Perumahan Pekerja Meningkat',
      cepat: 'Masukkan kebutuhan perumahan pekerja dalam perencanaan daerah.', akurasi: 'Sedang', modul: 'demografi',
      terdeteksi: '2026-10-15T22:00', diperbarui: '2026-10-15T22:00', berakhir: '2026-11-14', diajukan: '2026-10-15T22:05',
      masalah: [['Migrasi masuk ke Kabupaten Batang dan Kendal naik 14% yoy.', [1]]],
      dampak: [['Kebutuhan perumahan dan transportasi publik pekerja meningkat.', [1]]],
      langkah: [['30', 'Masukkan kebutuhan perumahan pekerja dalam RPJMD.', 'Pemprov Jawa Tengah', [1]]],
      sumber: [[1, 'Pergerakan Penduduk', 'BPS · inferensi pergerakan', 'Valid']] }),
    E({ id: 'ews-kek-lahan', level: 'warn', status: 'archived', judul: 'Tiga Proyek KEK Gresik Menunggu Kepastian Lahan', cepat: 'Selesaikan status lahan melalui skema PP 43/2021.', akurasi: 'Sedang', modul: 'peluang', terdeteksi: '2026-09-20T10:00', diperbarui: '2026-10-01T10:00', berakhir: '2026-10-20', masalah: [], dampak: [], langkah: [], sumber: [], alasanArsip: 'Kedaluwarsa otomatis' }),
    E({ id: 'ews-ump-banten', level: 'info', status: 'archived', judul: 'Selisih UMP Banten–DKI Mendorong Relokasi Gudang Logistik', cepat: 'Pantau dampaknya ke penyerapan tenaga kerja.', akurasi: 'Rendah', modul: 'demografi', terdeteksi: '2026-09-10T16:00', diperbarui: '2026-09-10T16:00', berakhir: '2026-10-10', masalah: [], dampak: [], langkah: [], sumber: [], alasanArsip: 'Ditolak Approver: sinyal lemah' }),
    E({ id: 'ews-retribusi', level: 'crit', status: 'archived', judul: 'Perda Retribusi Kota Batam Pungut Layanan yang Sudah Dihapus', cepat: 'Fasilitasi perubahan perda.', akurasi: 'Tinggi', modul: 'keselarasan', terdeteksi: '2026-08-30T10:00', diperbarui: '2026-09-28T10:00', berakhir: '2026-09-29', masalah: [], dampak: [], langkah: [], sumber: [], alasanArsip: 'Selesai: perda telah diubah' })
  ];

  var topik = [
    { id: 'TP-1', judul: 'Perda retribusi perizinan baru 2026', ket: 'Pantau perda kabupaten/kota yang menambah retribusi atas layanan perizinan yang sudah dihapus PP 28/2025.', oleh: 'Analis Harmonisasi', tgl: '2026-10-09', lampiran: 1, hasil: 'EWS di Approval (Peringatan): 13 Tindak Lanjut Temuan Keselarasan Melewati Target 60 Hari' },
    { id: 'TP-2', judul: 'Hilirisasi nikel Morowali', ket: 'Pantau realisasi investasi dan hambatan perizinan smelter di Sulawesi Tengah.', oleh: 'Analis Utama', tgl: '2026-10-06', lampiran: 0, hasil: 'EWS di Approval (Kritis): Realisasi Investasi Sulawesi Tengah Turun 18% pada Triwulan III 2026' },
    { id: 'TP-3', judul: 'RDTR digital kabupaten/kota', ket: '', oleh: 'Analis Harmonisasi', tgl: '2026-10-01', lampiran: 0, hasil: null }
  ];

  // ---------- Data Source ----------
  // status: aktif | menunggu | archive ; segar: ok | telat | ganggu
  var DS = function (o) { return Object.assign({ status: 'aktif', segar: 'ok', jadwal: 'harian' }, o); };
  var dataSource = [
    DS({ id: 'regulasi', nama: 'Koleksi Regulasi Investasi', penyedia: 'JDIH Nasional · BPK', record: 290, diperbarui: '2026-10-15T09:00', jadwal: 'manual',
      kolom: [['jenis', 'teks'], ['nomor', 'teks'], ['tahun', 'angka'], ['judul', 'teks'], ['status', 'teks'], ['keselarasan', 'teks']],
      rows: [['Permen', '31', 2025, 'Peraturan Menteri Perdagangan Nomor 31 Tahun 2025 tentang Kebijakan dan Pengaturan Impor', 'Berlaku', 'Selaras'], ['PP', '28', 2025, 'Penyelenggaraan Perizinan Berusaha Berbasis Risiko', 'Berlaku', 'Selaras'], ['UU', '6', 2023, 'Penetapan Perppu No. 2 Tahun 2022 tentang Cipta Kerja menjadi Undang-Undang', 'Berlaku', 'Selaras'], ['Perda', '1', 2026, 'Perda Kabupaten Kudus tentang Penyelenggaraan Penanaman Modal', 'Berlaku', 'Tidak selaras'], ['Perpres', '12', 2025, 'Rencana Pembangunan Jangka Menengah Nasional 2025–2029', 'Berlaku', 'Selaras'], ['Permen', '4', 2026, 'Peraturan Menteri Investasi tentang Pedoman Pengawasan Perizinan Berusaha', 'Berlaku', 'Selaras'], ['Perda', '7', 2025, 'Perda Kota Batam tentang Retribusi Perizinan Tertentu', 'Diubah', 'Tidak selaras'], ['Kepmen', '112', 2025, 'Keputusan Menteri ESDM tentang Wilayah Usaha Pertambangan', 'Berlaku', 'Selaras']] }),
    DS({ id: 'bkpm', nama: 'Realisasi Investasi PMA & PMDN', penyedia: 'Kementerian Investasi dan Hilirisasi/BKPM', record: 48210, diperbarui: '2026-10-15T08:00', jadwal: 'triwulanan',
      kolom: [['periode', 'waktu'], ['provinsi', 'teks'], ['sektor', 'teks'], ['status', 'teks'], ['nilai', 'angka, Rp miliar'], ['proyek', 'angka']],
      rows: [['2026-Q2', 'Jawa Barat', 'Industri Pengolahan', 'PMA', '41.212', 1204], ['2026-Q2', 'Jawa Barat', 'Industri Pengolahan', 'PMDN', '28.901', 2310], ['2026-Q2', 'DKI Jakarta', 'Real Estat', 'PMDN', '22.145', 812], ['2026-Q2', 'Sulawesi Tengah', 'Pertambangan', 'PMA', '19.880', 64], ['2026-Q2', 'Jawa Timur', 'Industri Pengolahan', 'PMA', '17.302', 905], ['2026-Q2', 'Banten', 'Industri Pengolahan', 'PMA', '15.774', 640], ['2026-Q2', 'Riau', 'Industri Pengolahan', 'PMDN', '12.088', 210], ['2026-Q2', 'Kalimantan Timur', 'Pertambangan', 'PMDN', '11.560', 133]] }),
    DS({ id: 'oss', nama: 'Permohonan & Penerbitan Izin (OSS RBA)', penyedia: 'Kementerian Investasi dan Hilirisasi/BKPM', record: 1283400, diperbarui: '2026-10-14T06:00', segar: 'ganggu', galat: 'Koneksi ke API OSS RBA gagal sejak 14 Okt',
      kolom: [['bulan', 'waktu'], ['provinsi', 'teks'], ['jenis_izin', 'teks'], ['permohonan', 'angka'], ['terbit', 'angka'], ['lewat_sla', 'angka']],
      rows: [['2026-09', 'Jawa Barat', 'PKKPR', 3120, 2410, 512], ['2026-09', 'Jawa Barat', 'PBG', 2840, 2290, 301], ['2026-09', 'Jawa Tengah', 'PKKPR', 2205, 1702, 388], ['2026-09', 'Jawa Timur', 'Persetujuan Lingkungan', 1980, 1311, 602], ['2026-09', 'Banten', 'PKKPR', 1450, 1102, 240], ['2026-09', 'Sulawesi Tengah', 'Persetujuan Lingkungan', 312, 140, 121]] }),
    DS({ id: 'pdrb', nama: 'PDRB Provinsi ADHB', penyedia: 'BPS', record: 1520, diperbarui: '2026-09-23T10:00', jadwal: 'mingguan', segar: 'telat', galat: 'Terlambat 23 hari dari jadwal',
      kolom: [['tahun', 'waktu'], ['provinsi', 'teks'], ['lapangan_usaha', 'teks'], ['nilai', 'angka, Rp triliun']],
      rows: [['2025', 'DKI Jakarta', 'Total', '3.632'], ['2025', 'Jawa Timur', 'Total', '3.105'], ['2025', 'Jawa Barat', 'Total', '2.850'], ['2025', 'Jawa Tengah', 'Total', '1.858'], ['2025', 'Sumatera Utara', 'Total', '1.121'], ['2025', 'Riau', 'Total', '1.047']] }),
    DS({ id: 'penduduk', nama: 'Data Statistik Penduduk per Provinsi', penyedia: 'BPS', record: 38, diperbarui: '2026-10-05T12:11', jadwal: 'tahunan',
      kolom: [['provinsi', 'teks'], ['kode', 'teks'], ['penduduk', 'angka, jiwa'], ['kepadatan', 'angka, jiwa/km²'], ['porsi_nasional', 'angka, %']],
      rows: [['DKI Jakarta', '31', '10.669.700', '16.129', '3,72'], ['Jawa Barat', '32', '51.163.900', '1.436', '17,83'], ['Jawa Tengah', '33', '38.200.100', '1.161', '13,31'], ['Jawa Timur', '35', '42.100.400', '879', '14,67'], ['Banten', '36', '12.500.200', '1.293', '4,36'], ['Papua Selatan', '93', '540.100', '5', '0,19']] }),
    DS({ id: 'pergerakan', nama: 'Pergerakan Penduduk (inferensi)', penyedia: 'BPS', record: 15624, diperbarui: '2026-10-15T22:00',
      kolom: [['periode', 'waktu'], ['asal', 'teks'], ['tujuan', 'teks'], ['jenis', 'teks'], ['jumlah', 'angka, orang']],
      rows: [['2026-09', 'Kab. Bogor', 'DKI Jakarta', 'Komuter', '1.204.330'], ['2026-09', 'Kota Bekasi', 'DKI Jakarta', 'Komuter', '988.120'], ['2026-09', 'Kab. Semarang', 'Kab. Kendal', 'Migrasi', '14.208'], ['2026-09', 'DKI Jakarta', 'Kota Bandung', 'Wisata', '602.884']] }),
    DS({ id: 'migrasi', nama: 'Survei Migrasi Risen', penyedia: 'BPS', record: 1444, diperbarui: '2026-10-01T09:00', jadwal: 'tahunan',
      kolom: [['tahun', 'waktu'], ['provinsi', 'teks'], ['migrasi_masuk', 'angka, ribu'], ['migrasi_keluar', 'angka, ribu']],
      rows: [['2025', 'Jawa Barat', '412', '298'], ['2025', 'Banten', '268', '171'], ['2025', 'Kepulauan Riau', '141', '62'], ['2025', 'Nusa Tenggara Timur', '38', '112']] }),
    DS({ id: 'pir', nama: 'Proyek Siap Investasi (PIR)', penyedia: 'Kementerian Investasi dan Hilirisasi/BKPM', record: 128, diperbarui: '2026-10-10T14:20', jadwal: 'bulanan',
      kolom: [['provinsi', 'teks'], ['proyek', 'teks'], ['sektor', 'teks'], ['nilai', 'angka, Rp miliar'], ['status_lahan', 'teks']],
      rows: [['Jawa Timur', 'Kawasan Industri Halal KEK Gresik', 'Industri Pengolahan', '4.200', 'Belum clear'], ['Jawa Barat', 'Kawasan Rebana Majalengka', 'Industri Pengolahan', '6.800', 'Clear'], ['Sumatera Utara', 'Oleokimia KEK Sei Mangkei', 'Industri Pengolahan', '2.950', 'Clear']] }),
    DS({ id: 'temuan', nama: 'Temuan & Tindak Lanjut Keselarasan', penyedia: 'Backoffice Harmonisasi', record: 20, diperbarui: '2026-10-16T06:00', jadwal: 'harian',
      kolom: [['id', 'teks'], ['regulasi', 'teks'], ['jenis', 'teks'], ['status', 'teks'], ['pic', 'teks']],
      rows: [['T-007', 'Perda Kab. Kudus No. 1/2026', 'Hambatan kemudahan berusaha', 'Dalam penanganan', 'Kemendagri'], ['T-006', 'Permen sektoral standar usaha', 'Pertentangan norma', 'Menunggu keputusan', 'Kemenko Perekonomian']] }),
    DS({ id: 'kek', nama: 'Kawasan Ekonomi Khusus & Kawasan Industri', penyedia: 'Dewan Nasional KEK', record: 162, diperbarui: '2026-10-16T09:30', status: 'menunggu', jadwal: 'manual', diunggah: 'Analis Harmonisasi',
      kolom: [['kawasan', 'teks'], ['provinsi', 'teks'], ['jenis', 'teks'], ['luas_ha', 'angka']],
      rows: [['KEK Gresik', 'Jawa Timur', 'KEK', '2.167'], ['KEK Sei Mangkei', 'Sumatera Utara', 'KEK', '1.933'], ['KI Batang', 'Jawa Tengah', 'Kawasan Industri', '4.300']] }),
    DS({ id: 'rpjmn', nama: 'Master Indikator RPJMN 2025–2029', penyedia: 'Bappenas', record: 412, diperbarui: '2026-06-30T10:00', status: 'archive', jadwal: 'manual',
      kolom: [['kode', 'teks'], ['indikator', 'teks'], ['target_2029', 'teks']], rows: [['PN1.3', 'Realisasi investasi', 'Rp 1.900 T'], ['PN1.4', 'Peringkat kemudahan berusaha', 'Top 40']] })
  ];

  // ---------- AI Training Center ----------
  var knowledge = [
    { id: 'KN-1', judul: 'Notulen Rapat Koordinasi Harmonisasi Regulasi Investasi, 2 Oktober 2026', ringkas: 'Rapat membahas perda yang mensyaratkan rekomendasi daerah di luar OSS dan percepatan sembilan permen pelaksana PP 28/2025. Disepakati fasilitasi Kemendagri untuk Kabupaten Kudus.', oleh: 'Analis Harmonisasi', fmt: 'DOCX', tgl: '2026-10-03', def: 'Default EWS' },
    { id: 'KN-2', judul: 'Kajian Internal Hambatan Perda terhadap Kemudahan Berusaha Semester II 2026', ringkas: 'Kajian memetakan 41 perda kabupaten/kota yang menambah persyaratan, retribusi, atau prosedur di luar standar perizinan berbasis risiko.', oleh: 'Analis Utama', fmt: 'PDF', tgl: '2026-10-03', def: 'Default widget' },
    { id: 'KN-3', judul: 'Pedoman Penilaian Keselarasan Regulasi Versi B', ringkas: 'Empat kriteria penilaian: hambatan kemudahan berusaha, tumpang tindih kewenangan, pertentangan norma, dan ketidaksesuaian sasaran pembangunan.', oleh: 'Analis Utama', fmt: 'PDF', tgl: '2026-07-15', def: null },
    { id: 'KN-4', judul: 'Tabel Padanan KBLI 2020 ke KBLI 2025', ringkas: 'Padanan kategori dan golongan pokok untuk klasifikasi sektor regulasi.', oleh: 'Analis Harmonisasi', fmt: 'XLSX', tgl: '2026-07-01', def: null }
  ];
  var saran = ['Buat widget baru terkait regulasi tidak selaras per provinsi', 'Ringkas tren realisasi investasi 6 bulan terakhir', 'Apa penyebab permohonan PKKPR melewati SLA?'];

  // ---------- Dashboard Management ----------
  var versi = [
    { id: 'v1.0', status: 'live', tgl: '2026-08-14T09:00', oleh: 'Sistem', catatan: 'Rilis awal 5 modul Dashboard Harmonisasi Investasi' },
    { id: 'v1.1', status: 'draft', tgl: '2026-10-14T10:20', oleh: 'Analis Harmonisasi', catatan: 'Tambah kartu Tren kemudahan berusaha dan Perkiraan dampak terhadap realisasi investasi' }
  ];

  // ---------- aktivitas tim (seed) ----------
  var aktivitas = [
    ['sistem', 'Diarsipkan otomatis: 1 EWS', '2026-10-20T12:55'],
    ['ai', 'EWS baru di Approval: Realisasi Investasi Sulawesi Tengah Turun 18% pada Triwulan III 2026', '2026-10-16T04:05'],
    ['ai', 'Insight otomatis tayang: 50 kartu', '2026-10-16T06:00'],
    ['analis', 'Widget diajukan: Perkiraan dampak terhadap realisasi investasi', '2026-10-13T15:40'],
    ['ai', 'Pembaruan AI disimpan sebagai Draft revisi: Perda Kudus Wajibkan Rekomendasi Daerah sebelum OSS', '2026-10-16T06:00']
  ];

  var H = D.harmonisasi = D.harmonisasi || {};
  H.ws = { katalog: KATALOG, widgets: widgets, ews: ews, topik: topik, dataSource: dataSource, knowledge: knowledge, saran: saran, versi: versi, aktivitas: aktivitas,
    dataMasuk: '2026-10-16T06:00', presiden: { versiTayang: 'v1.0', tgl: '2026-08-14' } };
})();

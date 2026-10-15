// Data contoh (mock) Backoffice · use case Harmonisasi Investasi.
// Ganti isi window.BO_DATA.harmonisasi dengan respons API yang strukturnya sama.
// - Populasi awal disusun agar indikator BO-01 s.d. BO-15 (Back Office 2026) bernilai sama dengan
//   kolom "Contoh nilai — ILUSTRASI": 20 antrean verifikasi, 80/100 terverifikasi, 72/80 lengkap,
//   600 regulasi, 570/600 metadata lengkap, 15 klasifikasi menunggu, 85/100 ditinjau, 18/20 tindak
//   lanjut lengkap, 8/10 provinsi dikurasi, 12 keluaran AI menunggu, 50/50 keluaran tayang disetujui.
// - Bagian "konten utama" ditulis tangan dan selaras dengan data contoh Dashboard Harmonisasi Investasi.
//   Bagian "pelengkap populasi" dibangkitkan deterministik (seed tetap) hanya untuk mengisi jumlah.
// - Semua nama, angka dan tanggal adalah DATA SIMULASI.
(function () {
  'use strict';

  // ---------- generator deterministik ----------
  let seed = 20261016;
  const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pad = (n, w) => String(n).padStart(w || 3, '0');
  const ts = (d, h, m) => '2026-' + d + 'T' + pad(h, 2) + ':' + pad(m || 0, 2);

  // ---------- kamus ----------
  const modul = [
    ['payung', 'Payung Kebijakan Investasi'],
    ['peluang', 'Peluang Investasi Daerah'],
    ['demografi', 'Demografi & Mobilitas Penduduk'],
    ['perizinan', 'Kemudahan Berusaha & Perizinan'],
    ['keselarasan', 'Keselarasan Regulasi & Tindak Lanjut']
  ];

  // KBLI 2025 (Peraturan BPS No. 7 Tahun 2025): [kode, nama, golongan pokok] — sama dengan dashboard
  const sektor = [
    ['A', 'Pertanian, Kehutanan dan Perikanan', '01–03'],
    ['B', 'Pertambangan dan Penggalian', '05–09'],
    ['C', 'Industri Pengolahan', '10–33'],
    ['D', 'Pengadaan Listrik, Gas, Uap/Air Panas dan Udara Dingin', '35'],
    ['E', 'Pengelolaan Air, Air Limbah, Sampah dan Remediasi', '36–39'],
    ['F', 'Konstruksi', '41–43'],
    ['G', 'Perdagangan Besar dan Eceran', '46–47'],
    ['H', 'Transportasi dan Pergudangan', '49–53'],
    ['I', 'Penyediaan Akomodasi dan Makan Minum', '55–56'],
    ['J', 'Penerbitan, Penyiaran, serta Produksi dan Distribusi Konten', '58–60'],
    ['K', 'Telekomunikasi, Pemrograman Komputer dan Infrastruktur Komputasi', '61–63'],
    ['L', 'Aktivitas Keuangan dan Asuransi', '64–66'],
    ['M', 'Real Estat', '68'],
    ['N', 'Aktivitas Profesional, Ilmiah dan Teknis', '69–75'],
    ['O', 'Penyewaan, Ketenagakerjaan, Agen Perjalanan dan Penunjang Usaha', '77–82'],
    ['P', 'Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib', '84'],
    ['Q', 'Pendidikan', '85'],
    ['R', 'Aktivitas Kesehatan Manusia dan Aktivitas Sosial', '86–88'],
    ['S', 'Kesenian, Hiburan dan Rekreasi', '90–93'],
    ['T', 'Aktivitas Jasa Lainnya', '94–96'],
    ['U', 'Aktivitas Rumah Tangga sebagai Pemberi Kerja', '97–98'],
    ['V', 'Aktivitas Badan Internasional dan Ekstra Internasional', '99'],
    ['X', 'Lintas sektor', '']
  ];

  const jenisIndikasi = [
    ['hambatan', 'Hambatan kemudahan berusaha'],
    ['kewenangan', 'Tumpang tindih kewenangan'],
    ['norma', 'Pertentangan norma'],
    ['sasaran', 'Tidak sesuai sasaran pembangunan']
  ];

  const statusTL = [
    ['belum', 'Belum ditindaklanjuti'],
    ['proses', 'Dalam penanganan'],
    ['tunggu', 'Menunggu keputusan'],
    ['selesai', 'Selesai']
  ];

  const provinsi38 = ['Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi', 'Sumatera Selatan', 'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung', 'DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara', 'Sulawesi Utara', 'Gorontalo', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya', 'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan'];

  // Metadata resmi wajib per regulasi (BO-05)
  const metaWajib = [
    ['jenis', 'Jenis peraturan'], ['nomor', 'Nomor & tahun'], ['judul', 'Judul / tentang'], ['penerbit', 'Instansi penerbit'],
    ['wilayah', 'Cakupan wilayah'], ['status', 'Status keberlakuan'], ['rujukan', 'Rujukan sumber resmi'], ['sektor', 'Sektor KBLI']
  ];

  // Bukti & pertimbangan wajib per hasil penilaian (BO-03)
  const buktiWajib = [
    ['naskah', 'Naskah resmi regulasi yang dinilai'],
    ['pasal', 'Kutipan pasal/ketentuan yang dinilai'],
    ['pembanding', 'Ketentuan pembanding (peraturan acuan)'],
    ['sumber', 'Tautan sumber resmi (JDIH)']
  ];

  // Checklist kurasi profil & indikator provinsi (BO-09)
  const checklistProvinsi = [
    ['profil', 'Ringkasan profil wilayah ditinjau'],
    ['indikator', 'Nilai indikator kesiapan diperiksa terhadap sumber'],
    ['periode', 'Periode data seragam & tercantum'],
    ['proyek', 'Daftar proyek siap investasi dimutakhirkan'],
    ['regulasi', 'Peraturan relevan provinsi ditautkan'],
    ['narasi', 'Narasi peluang & rekomendasi disunting']
  ];

  // =====================================================================
  // 1) Koleksi regulasi (BO-04, BO-05)
  // =====================================================================
  // Regulasi nasional dari koleksi contoh Modul 1 Payung Kebijakan (judul nyata):
  // [jenis, nomor, tahun, judul, penerbit, wilayah, sektor]
  const REG_ACUAN = [
    ["UU","UU No. 25 Tahun 2007",2007,"Penanaman Modal","DPR RI dan Presiden","Nasional",["X"]],
    ["UU","UU No. 6 Tahun 2023",2023,"Penetapan Perppu No. 2 Tahun 2022 tentang Cipta Kerja menjadi Undang-Undang","DPR RI dan Presiden","Nasional",["X"]],
    ["UU","UU No. 1 Tahun 2022",2022,"Hubungan Keuangan antara Pemerintah Pusat dan Pemerintahan Daerah","DPR RI dan Presiden","Nasional",["P"]],
    ["UU","UU No. 3 Tahun 2020",2020,"Perubahan atas UU No. 4 Tahun 2009 tentang Pertambangan Mineral dan Batubara","DPR RI dan Presiden","Nasional",["B"]],
    ["UU","UU No. 7 Tahun 2014",2014,"Perdagangan","DPR RI dan Presiden","Nasional",["G"]],
    ["UU","UU No. 3 Tahun 2014",2014,"Perindustrian","DPR RI dan Presiden","Nasional",["C"]],
    ["UU","UU No. 26 Tahun 2007",2007,"Penataan Ruang","DPR RI dan Presiden","Nasional",["X"]],
    ["UU","UU No. 32 Tahun 2009",2009,"Perlindungan dan Pengelolaan Lingkungan Hidup","DPR RI dan Presiden","Nasional",["E"]],
    ["UU","UU No. 39 Tahun 2014",2014,"Perkebunan","DPR RI dan Presiden","Nasional",["A"]],
    ["UU","UU No. 45 Tahun 2009",2009,"Perubahan atas UU No. 31 Tahun 2004 tentang Perikanan","DPR RI dan Presiden","Nasional",["A"]],
    ["UU","UU No. 30 Tahun 2009",2009,"Ketenagalistrikan","DPR RI dan Presiden","Nasional",["D"]],
    ["UU","UU No. 22 Tahun 2001",2001,"Minyak dan Gas Bumi","DPR RI dan Presiden","Nasional",["B"]],
    ["UU","UU No. 10 Tahun 2009",2009,"Kepariwisataan","DPR RI dan Presiden","Nasional",["I"]],
    ["UU","UU No. 28 Tahun 2002",2002,"Bangunan Gedung","DPR RI dan Presiden","Nasional",["F"]],
    ["UU","UU No. 40 Tahun 2007",2007,"Perseroan Terbatas","DPR RI dan Presiden","Nasional",["X"]],
    ["UU","UU No. 23 Tahun 2014",2014,"Pemerintahan Daerah","DPR RI dan Presiden","Nasional",["P"]],
    ["UU","UU No. 20 Tahun 2008",2008,"Usaha Mikro, Kecil, dan Menengah","DPR RI dan Presiden","Nasional",["X"]],
    ["UU","UU No. 39 Tahun 2009",2009,"Kawasan Ekonomi Khusus","DPR RI dan Presiden","Nasional",["X"]],
    ["UU","UU No. 1 Tahun 2014",2014,"Perubahan atas UU No. 27 Tahun 2007 tentang Pengelolaan Wilayah Pesisir dan Pulau-Pulau Kecil","DPR RI dan Presiden","Nasional",["A"]],
    ["UU","UU No. 7 Tahun 2021",2021,"Harmonisasi Peraturan Perpajakan","DPR RI dan Presiden","Nasional",["P"]],
    ["UU","UU No. 2 Tahun 2012",2012,"Pengadaan Tanah bagi Pembangunan untuk Kepentingan Umum","DPR RI dan Presiden","Nasional",["F"]],
    ["UU","UU No. 5 Tahun 2017",2017,"Pemajuan Kebudayaan","DPR RI dan Presiden","Nasional",["S"]],
    ["PP","PP No. 28 Tahun 2025",2025,"Penyelenggaraan Perizinan Berusaha Berbasis Risiko","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 35 Tahun 2023",2023,"Ketentuan Umum Pajak Daerah dan Retribusi Daerah","Presiden RI","Nasional",["P"]],
    ["PP","PP No. 12 Tahun 2023",2023,"Pemberian Perizinan Berusaha, Kemudahan Berusaha, dan Fasilitas Penanaman Modal bagi Pelaku Usaha di Ibu Kota Nusantara","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 22 Tahun 2021",2021,"Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup","Presiden RI","Nasional",["E"]],
    ["PP","PP No. 21 Tahun 2021",2021,"Penyelenggaraan Penataan Ruang","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 41 Tahun 2021",2021,"Penyelenggaraan Kawasan Perdagangan Bebas dan Pelabuhan Bebas","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 40 Tahun 2021",2021,"Penyelenggaraan Kawasan Ekonomi Khusus","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 16 Tahun 2021",2021,"Peraturan Pelaksanaan UU No. 28 Tahun 2002 tentang Bangunan Gedung","Presiden RI","Nasional",["F"]],
    ["PP","PP No. 18 Tahun 2021",2021,"Hak Pengelolaan, Hak Atas Tanah, Satuan Rumah Susun, dan Pendaftaran Tanah","Presiden RI","Nasional",["M"]],
    ["PP","PP No. 19 Tahun 2021",2021,"Penyelenggaraan Pengadaan Tanah bagi Pembangunan untuk Kepentingan Umum","Presiden RI","Nasional",["F"]],
    ["PP","PP No. 7 Tahun 2021",2021,"Kemudahan, Pelindungan, dan Pemberdayaan Koperasi dan UMKM","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 8 Tahun 2021",2021,"Modal Dasar Perseroan serta Pendaftaran Pendirian, Perubahan, dan Pembubaran Perseroan yang Memenuhi Kriteria UMK","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 6 Tahun 2021",2021,"Penyelenggaraan Perizinan Berusaha di Daerah","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 25 Tahun 2021",2021,"Penyelenggaraan Bidang Energi dan Sumber Daya Mineral","Presiden RI","Nasional",["B","D"]],
    ["PP","PP No. 26 Tahun 2021",2021,"Penyelenggaraan Bidang Pertanian","Presiden RI","Nasional",["A"]],
    ["PP","PP No. 27 Tahun 2021",2021,"Penyelenggaraan Bidang Kelautan dan Perikanan","Presiden RI","Nasional",["A"]],
    ["PP","PP No. 28 Tahun 2021",2021,"Penyelenggaraan Bidang Perindustrian","Presiden RI","Nasional",["C"]],
    ["PP","PP No. 29 Tahun 2021",2021,"Penyelenggaraan Bidang Perdagangan","Presiden RI","Nasional",["G"]],
    ["PP","PP No. 23 Tahun 2021",2021,"Penyelenggaraan Kehutanan","Presiden RI","Nasional",["A"]],
    ["PP","PP No. 96 Tahun 2021",2021,"Pelaksanaan Kegiatan Usaha Pertambangan Mineral dan Batubara","Presiden RI","Nasional",["B"]],
    ["PP","PP No. 34 Tahun 2021",2021,"Penggunaan Tenaga Kerja Asing","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 35 Tahun 2021",2021,"Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 36 Tahun 2021",2021,"Pengupahan","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 42 Tahun 2021",2021,"Kemudahan Proyek Strategis Nasional","Presiden RI","Nasional",["F"]],
    ["PP","PP No. 43 Tahun 2021",2021,"Penyelesaian Ketidaksesuaian Tata Ruang, Kawasan Hutan, Izin, dan/atau Hak Atas Tanah","Presiden RI","Nasional",["X"]],
    ["PP","PP No. 46 Tahun 2021",2021,"Pos, Telekomunikasi, dan Penyiaran","Presiden RI","Nasional",["J","K"]],
    ["PP","PP No. 24 Tahun 2021",2021,"Tata Cara Pengenaan Sanksi Administratif dan PNBP dari Denda Administratif di Bidang Kehutanan","Presiden RI","Nasional",["A"]],
    ["PP","PP No. 9 Tahun 2021",2021,"Perlakuan Perpajakan untuk Mendukung Kemudahan Berusaha","Presiden RI","Nasional",["P"]],
    ["PP","PP No. 78 Tahun 2019",2019,"Fasilitas Pajak Penghasilan untuk Penanaman Modal di Bidang-Bidang Usaha Tertentu dan/atau di Daerah-Daerah Tertentu","Presiden RI","Nasional",["P"]],
    ["PP","PP No. 45 Tahun 2019",2019,"Perubahan atas PP No. 94 Tahun 2010 tentang Penghitungan Penghasilan Kena Pajak dan Pelunasan PPh dalam Tahun Berjalan","Presiden RI","Nasional",["P"]],
    ["PP","PP No. 54 Tahun 2017",2017,"Badan Usaha Milik Daerah","Presiden RI","Nasional",["P"]],
    ["Perpres","Perpres No. 12 Tahun 2025",2025,"Rencana Pembangunan Jangka Menengah Nasional 2025–2029","Presiden RI","Nasional",["X"]],
    ["Perpres","Perpres No. 70 Tahun 2023",2023,"Pengalokasian Lahan bagi Penataan Investasi","Presiden RI","Nasional",["X"]],
    ["Perpres","Perpres No. 40 Tahun 2023",2023,"Percepatan Swasembada Gula Nasional dan Penyediaan Bioetanol sebagai Bahan Bakar Nabati","Presiden RI","Nasional",["A","C"]],
    ["Perpres","Perpres No. 11 Tahun 2023",2023,"Urusan Pemerintahan Konkuren Tambahan di Bidang ESDM pada Subbidang Energi Baru Terbarukan","Presiden RI","Nasional",["D"]],
    ["Perpres","Perpres No. 112 Tahun 2022",2022,"Percepatan Pengembangan Energi Terbarukan untuk Penyediaan Tenaga Listrik","Presiden RI","Nasional",["D"]],
    ["Perpres","Perpres No. 55 Tahun 2022",2022,"Pendelegasian Pemberian Perizinan Berusaha di Bidang Pertambangan Mineral dan Batubara","Presiden RI","Nasional",["B"]],
    ["Perpres","Perpres No. 62 Tahun 2022",2022,"Otorita Ibu Kota Nusantara","Presiden RI","Nasional",["P"]],
    ["Perpres","Perpres No. 63 Tahun 2022",2022,"Perincian Rencana Induk Ibu Kota Nusantara","Presiden RI","Nasional",["X"]],
    ["Perpres","Perpres No. 64 Tahun 2022",2022,"Rencana Tata Ruang Kawasan Strategis Nasional Ibu Kota Nusantara","Presiden RI","Nasional",["X"]],
    ["Perpres","Perpres No. 10 Tahun 2021 jo. 49/2021",2021,"Bidang Usaha Penanaman Modal","Presiden RI","Nasional",["X"]],
    ["Perpres","Perpres No. 87 Tahun 2021",2021,"Percepatan Pembangunan Kawasan Rebana dan Kawasan Jawa Barat Bagian Selatan","Presiden RI","Jawa Barat",["X"]],
    ["Perpres","Perpres No. 98 Tahun 2021",2021,"Penyelenggaraan Nilai Ekonomi Karbon","Presiden RI","Nasional",["E"]],
    ["Perpres","Perpres No. 60 Tahun 2020",2020,"Rencana Tata Ruang Kawasan Perkotaan Jabodetabek-Punjur","Presiden RI","DKI Jakarta",["X"]],
    ["Perpres","Perpres No. 80 Tahun 2019",2019,"Percepatan Pembangunan Ekonomi di Kawasan Gerbangkertosusila, Bromo–Tengger–Semeru, serta Selingkar Wilis dan Lintas Selatan","Presiden RI","Jawa Timur",["X"]],
    ["Perpres","Perpres No. 79 Tahun 2019",2019,"Percepatan Pembangunan Ekonomi Kawasan Kendal–Semarang–Salatiga–Demak–Grobogan, Purworejo–Wonosobo–Magelang–Temanggung, dan Brebes–Tegal–Pemalang","Presiden RI","Jawa Tengah",["X"]],
    ["Perpres","Perpres No. 55 Tahun 2019 jo. 79/2023",2019,"Percepatan Program Kendaraan Bermotor Listrik Berbasis Baterai untuk Transportasi Jalan","Presiden RI","Nasional",["C"]],
    ["Perpres","Perpres No. 39 Tahun 2019",2019,"Satu Data Indonesia","Presiden RI","Nasional",["P"]],
    ["Perpres","Perpres No. 16 Tahun 2018 jo. 12/2021",2018,"Pengadaan Barang/Jasa Pemerintah","Presiden RI","Nasional",["P"]],
    ["Perpres","Perpres No. 95 Tahun 2018",2018,"Sistem Pemerintahan Berbasis Elektronik","Presiden RI","Nasional",["P"]],
    ["Perpres","Perpres No. 91 Tahun 2017",2017,"Percepatan Pelaksanaan Berusaha","Presiden RI","Nasional",["X"]],
    ["Perpres","Perpres No. 59 Tahun 2017",2017,"Pelaksanaan Pencapaian Tujuan Pembangunan Berkelanjutan","Presiden RI","Nasional",["X"]],
    ["Perpres","Perpres No. 3 Tahun 2016 jo. 109/2020",2016,"Percepatan Pelaksanaan Proyek Strategis Nasional","Presiden RI","Nasional",["F"]],
    ["Perpres","Perpres No. 4 Tahun 2016",2016,"Percepatan Pembangunan Infrastruktur Ketenagalistrikan","Presiden RI","Nasional",["D"]],
    ["Perpres","Perpres No. 38 Tahun 2015",2015,"Kerja Sama Pemerintah dengan Badan Usaha dalam Penyediaan Infrastruktur","Presiden RI","Nasional",["F"]],
    ["Perpres","Perpres No. 122 Tahun 2012",2012,"Reklamasi di Wilayah Pesisir dan Pulau-Pulau Kecil","Presiden RI","Nasional",["A"]],
    ["Permen","Permen Investasi dan Hilirisasi/BKPM No. 5 Tahun 2025",2025,"Pedoman dan Tata Cara Penyelenggaraan Perizinan Berusaha Berbasis Risiko dan Fasilitas Penanaman Modal melalui OSS","Kementerian Investasi dan Hilirisasi/BKPM","Nasional",["X"]],
    ["Permen","Permendag No. 36 Tahun 2023",2023,"Kebijakan dan Pengaturan Impor","Kementerian Perdagangan","Nasional",["G"]],
    ["Permen","Permendag No. 23 Tahun 2023",2023,"Kebijakan dan Pengaturan Ekspor","Kementerian Perdagangan","Nasional",["G"]],
    ["Permen","Permen ESDM No. 10 Tahun 2023",2023,"Tata Cara Penyusunan, Penyampaian, dan Persetujuan RKAB serta Pelaporan Kegiatan Usaha Pertambangan","Kementerian ESDM","Nasional",["B"]],
    ["Permen","Permen ATR/BPN No. 13 Tahun 2021",2021,"Pelaksanaan Kesesuaian Kegiatan Pemanfaatan Ruang dan Sinkronisasi Program Pemanfaatan Ruang","Kementerian ATR/BPN","Nasional",["X"]],
    ["Permen","Permen LHK No. 4 Tahun 2021",2021,"Daftar Usaha dan/atau Kegiatan yang Wajib Memiliki Amdal, UKL-UPL atau SPPL","Kementerian Lingkungan Hidup dan Kehutanan","Nasional",["E"]],
    ["Permen","PMK No. 130/PMK.010/2020",2020,"Pemberian Fasilitas Pengurangan Pajak Penghasilan Badan","Kementerian Keuangan","Nasional",["P"]],
    ["Permen","PMK No. 11/PMK.010/2020",2020,"Pelaksanaan PP No. 78 Tahun 2019 tentang Fasilitas Pajak Penghasilan untuk Penanaman Modal","Kementerian Keuangan","Nasional",["P"]],
    ["Kepmen","Kepmen ESDM No. 1827 K/30/MEM/2018",2018,"Pedoman Pelaksanaan Kaidah Teknik Pertambangan yang Baik","Kementerian ESDM","Nasional",["B"]],
    ["Perda","Perda Prov. Jawa Barat No. 9 Tahun 2022",2022,"Rencana Tata Ruang Wilayah Provinsi Jawa Barat 2022–2042","Pemerintah Provinsi Jawa Barat","Jawa Barat",["X"]]
  ];

  // Regulasi yang menjadi objek temuan di contoh Modul 5 Keselarasan
  const REG_TEMUAN = [
    ['Perda', 'Perda Kab. Pulang Pisau No. 1 Tahun 2026', 2026, 'Penyertaan Modal Daerah', 'Pemerintah Kabupaten Pulang Pisau', 'Kalimantan Tengah', ['L']],
    ['Permen', 'Permen KP No. 1 Tahun 2026', 2026, 'Pembinaan Desa Wisata Bahari', 'Kementerian Kelautan dan Perikanan', 'Nasional', ['A', 'I']],
    ['Permen', 'Permendag No. 1 Tahun 2026', 2026, 'Ketentuan Ekspor Karet Alam', 'Kementerian Perdagangan', 'Nasional', ['G', 'C', 'A']],
    ['Permen', 'Permen Kebudayaan No. 1 Tahun 2026', 2026, 'Standar Usaha Bidang Kebudayaan', 'Kementerian Kebudayaan', 'Nasional', ['S']],
    ['Perda', 'Perda Kab. Kudus No. 1 Tahun 2026', 2026, 'Penyelenggaraan Penanaman Modal Daerah', 'Pemerintah Kabupaten Kudus', 'Jawa Tengah', ['X']]
  ];

  const topikDaerah = ['Penyelenggaraan Penanaman Modal', 'Pemberian Insentif dan Kemudahan Investasi', 'Rencana Tata Ruang Wilayah', 'Rencana Detail Tata Ruang', 'Pajak Daerah dan Retribusi Daerah', 'Bangunan Gedung', 'Pengelolaan Kawasan Industri', 'Pengelolaan Pertambangan Rakyat', 'Perlindungan Lahan Pertanian Pangan Berkelanjutan', 'Penyelenggaraan Kepariwisataan', 'Pengelolaan Wilayah Pesisir', 'Ketenagakerjaan', 'Pelayanan Terpadu Satu Pintu', 'Perizinan Berusaha di Daerah', 'Penyertaan Modal pada BUMD', 'Pengelolaan Lingkungan Hidup', 'Penyediaan Infrastruktur Kerja Sama Pemerintah dan Badan Usaha', 'Pengembangan Ekonomi Kreatif'];
  const topikSektor = { 'Penyelenggaraan Penanaman Modal': ['X'], 'Pemberian Insentif dan Kemudahan Investasi': ['X'], 'Rencana Tata Ruang Wilayah': ['X'], 'Rencana Detail Tata Ruang': ['X', 'F'], 'Pajak Daerah dan Retribusi Daerah': ['P'], 'Bangunan Gedung': ['F'], 'Pengelolaan Kawasan Industri': ['C'], 'Pengelolaan Pertambangan Rakyat': ['B'], 'Perlindungan Lahan Pertanian Pangan Berkelanjutan': ['A'], 'Penyelenggaraan Kepariwisataan': ['I', 'S'], 'Pengelolaan Wilayah Pesisir': ['A'], 'Ketenagakerjaan': ['O'], 'Pelayanan Terpadu Satu Pintu': ['P'], 'Perizinan Berusaha di Daerah': ['X'], 'Penyertaan Modal pada BUMD': ['L'], 'Pengelolaan Lingkungan Hidup': ['E'], 'Penyediaan Infrastruktur Kerja Sama Pemerintah dan Badan Usaha': ['F', 'H'], 'Pengembangan Ekonomi Kreatif': ['J', 'S'] };

  const rujukanOf = (jenis, pen, wil) => (wil === 'Nasional' ? (jenis === 'UU' || jenis === 'PP' || jenis === 'Perpres' ? 'JDIH Kemensetneg · peraturan.go.id' : 'JDIH ' + pen.replace('Kementerian ', 'Kementerian ')) : 'JDIH ' + pen.replace('Pemerintah ', 'Pemerintah '));

  const regulasi = [];
  const addReg = (r, status, peran) => {
    const id = 'REG-' + pad(regulasi.length + 1, 4);
    regulasi.push({ id: id, jenis: r[0], nomor: r[1], tahun: r[2], judul: r[3], penerbit: r[4], wilayah: r[5], sektor: r[6].slice(), status: status, peran: peran, rujukan: rujukanOf(r[0], r[4], r[5]), ver: 1, diubah: ts('09-15', 8, 0) });
    return id;
  };
  REG_ACUAN.forEach((r) => addReg(r, 'berlaku', 'acuan'));
  const REG_TEMUAN_ID = REG_TEMUAN.map((r) => addReg(r, 'berlaku', 'objek'));

  // pelengkap populasi: regulasi daerah & sektoral simulasi hingga 600 (515 berlaku, 85 historis/pembanding)
  const kabKota = { 'Jawa Barat': ['Kab. Bekasi', 'Kab. Karawang', 'Kota Bandung', 'Kab. Subang'], 'Jawa Tengah': ['Kab. Batang', 'Kota Semarang', 'Kab. Kendal', 'Kab. Kudus'], 'Jawa Timur': ['Kab. Gresik', 'Kota Surabaya', 'Kab. Pasuruan'], 'Banten': ['Kab. Serang', 'Kota Cilegon', 'Kab. Tangerang'], 'Sumatera Utara': ['Kota Medan', 'Kab. Deli Serdang', 'Kab. Batu Bara'], 'Riau': ['Kota Pekanbaru', 'Kab. Siak', 'Kota Dumai'], 'Kalimantan Timur': ['Kota Balikpapan', 'Kab. Kutai Kartanegara', 'Kota Bontang'], 'Sulawesi Tengah': ['Kab. Morowali', 'Kota Palu', 'Kab. Banggai'], 'Sulawesi Selatan': ['Kota Makassar', 'Kab. Maros', 'Kab. Bantaeng'], 'Kalimantan Tengah': ['Kab. Pulang Pisau', 'Kota Palangka Raya'] };
  const provPrior = Object.keys(kabKota);
  while (regulasi.length < 600) {
    const n = regulasi.length;
    const hist = n >= 515; // 85 terakhir: regulasi historis (dicabut/diubah) atau pembanding
    const prov = rnd() < 0.7 ? pick(provPrior) : pick(provinsi38);
    const kab = kabKota[prov] && rnd() < 0.55 ? pick(kabKota[prov]) : null;
    const topik = pick(topikDaerah);
    const tahun = hist ? int(2009, 2021) : int(2016, 2026);
    const jenis = kab ? pick(['Perda', 'Perda', 'Perkada']) : pick(['Perda', 'Perda', 'Perkada']);
    const no = int(1, 24);
    const nomor = (jenis === 'Perda' ? 'Perda ' : (kab ? (kab.indexOf('Kota') === 0 ? 'Perwal ' : 'Perbup ') : 'Pergub ')) + (kab ? kab : 'Prov. ' + prov) + ' No. ' + no + ' Tahun ' + tahun;
    const pen = 'Pemerintah ' + (kab ? kab.replace('Kab.', 'Kabupaten') : 'Provinsi ' + prov);
    const id = addReg([jenis, nomor, tahun, topik, pen, prov, (topikSektor[topik] || ['X']).slice()], hist ? (rnd() < 0.7 ? 'dicabut' : 'diubah') : 'berlaku', hist ? (rnd() < 0.6 ? 'historis' : 'pembanding') : 'acuan');
    void id;
  }
  // 30 regulasi simulasi dengan metadata resmi belum lengkap (570/600 lengkap = 95%)
  const kosongField = ['rujukan', 'rujukan', 'rujukan', 'penerbit', 'wilayah', 'sektor'];
  for (let i = 0; i < 30; i++) {
    const r = regulasi[100 + i * 16];
    const f = kosongField[i % kosongField.length];
    r[f] = f === 'sektor' ? [] : '';
    if (i % 4 === 0) r.rujukan = '';
  }

  // =====================================================================
  // 2) Hasil penilaian keselarasan (BO-01, BO-02, BO-03)
  // =====================================================================
  // status: menunggu (antrean verifikasi) | terverifikasi | dikembalikan (perlu penilaian ulang)
  // hasil: selaras | tidak (tidak selaras, beserta jenis indikasi)
  const penilaian = [
    {
      id: 'HP-001', regId: REG_TEMUAN_ID[0], temuanId: 'T-001', ver: 3, status: 'terverifikasi', diubah: ts('08-03', 14, 20),
      ai: { hasil: 'tidak', jenis: 'sasaran', yakin: 0.84, alasan: 'Penyertaan modal daerah kepada BUMD ditetapkan tanpa tujuan, indikator kinerja, dan jangka waktu pengembalian yang terukur.' },
      hasil: 'tidak', jenis: 'sasaran', sektor: ['L'],
      ketentuan: 'Penyertaan modal BUMD (Pasal 4–6)',
      pembanding: { reg: 'Perpres No. 12 Tahun 2025 (RPJMN 2025–2029)', teks: 'Belanja dan investasi daerah diarahkan untuk mendukung sasaran pembangunan nasional dan daerah dengan indikator yang terukur.' },
      pertimbangan: 'Tanpa indikator kinerja, penyertaan modal tidak dapat dinilai kontribusinya terhadap sasaran RPJMN dan RPJMD. Pemkab telah menetapkan indikator melalui peraturan bupati pelaksana.',
      bukti: { naskah: true, pasal: true, pembanding: true, sumber: true }, verifikator: 'Analis Harmonisasi'
    },
    {
      id: 'HP-002', regId: REG_TEMUAN_ID[1], temuanId: 'T-002', ver: 2, status: 'terverifikasi', diubah: ts('08-21', 10, 5),
      ai: { hasil: 'tidak', jenis: 'kewenangan', yakin: 0.78, alasan: 'Pembinaan desa wisata bahari diatur KKP, padahal pembinaan desa wisata merupakan kewenangan kementerian bidang pariwisata.' },
      hasil: 'tidak', jenis: 'kewenangan', sektor: ['A', 'I'],
      ketentuan: 'Pembinaan desa wisata bahari (Pasal 3 dan 9)',
      pembanding: { reg: 'UU No. 10 Tahun 2009 tentang Kepariwisataan', teks: 'Pemerintah menyelenggarakan pembinaan destinasi pariwisata melalui kementerian yang menyelenggarakan urusan pemerintahan di bidang kepariwisataan.' },
      pertimbangan: 'Irisan kewenangan terjadi pada pembinaan dan sertifikasi. Kedua kementerian perlu menyepakati pembagian peran melalui nota kesepahaman atau perubahan peraturan menteri.',
      bukti: { naskah: true, pasal: true, pembanding: true, sumber: true }, verifikator: 'Analis Harmonisasi'
    },
    {
      id: 'HP-003', regId: REG_TEMUAN_ID[2], temuanId: 'T-004', ver: 2, status: 'terverifikasi', diubah: ts('09-02', 9, 40),
      ai: { hasil: 'tidak', jenis: 'norma', yakin: 0.81, alasan: 'Spesifikasi teknis ekspor karet alam berbeda dengan parameter SNI yang ditetapkan sebagai acuan mutu.' },
      hasil: 'tidak', jenis: 'norma', sektor: ['G', 'C', 'A'],
      ketentuan: 'Spesifikasi teknis ekspor (Lampiran I)',
      pembanding: { reg: 'SNI Karet Spesifikasi Teknis (acuan mutu)', teks: 'Parameter mutu karet spesifikasi teknis ditetapkan dalam SNI dan diberlakukan sebagai acuan pengujian.' },
      pertimbangan: 'Perbedaan parameter kadar kotoran berpotensi menimbulkan dua standar pengujian bagi eksportir. Perlu penyesuaian lampiran dengan SNI terbaru.',
      bukti: { naskah: true, pasal: true, pembanding: true, sumber: false }, verifikator: 'Analis Harmonisasi'
    },
    {
      id: 'HP-004', regId: REG_TEMUAN_ID[3], temuanId: 'T-006', ver: 2, status: 'terverifikasi', diubah: ts('09-10', 15, 0),
      ai: { hasil: 'tidak', jenis: 'hambatan', yakin: 0.88, alasan: 'Peraturan menetapkan standar usaha tambahan yang tidak tercantum dalam PP No. 28 Tahun 2025.' },
      hasil: 'tidak', jenis: 'hambatan', sektor: ['S'],
      ketentuan: 'Standar usaha tambahan bidang kebudayaan (Pasal 7)',
      pembanding: { reg: 'PP No. 28 Tahun 2025 tentang Penyelenggaraan Perizinan Berusaha Berbasis Risiko', teks: 'Standar usaha dan standar produk ditetapkan dalam lampiran peraturan pemerintah dan tidak dapat ditambah di luar ketentuan tersebut.' },
      pertimbangan: 'Penambahan standar di luar PP 28/2025 menambah persyaratan bagi pelaku usaha dan berpotensi menghambat penerbitan izin melalui OSS.',
      bukti: { naskah: true, pasal: true, pembanding: true, sumber: true }, verifikator: 'Analis Harmonisasi'
    },
    {
      id: 'HP-005', regId: REG_TEMUAN_ID[4], temuanId: 'T-007', ver: 1, status: 'menunggu', diubah: ts('10-14', 7, 30),
      ai: { hasil: 'tidak', jenis: 'hambatan', yakin: 0.73, alasan: 'Perda mensyaratkan rekomendasi daerah sebelum permohonan perizinan diajukan melalui OSS, yang tidak dikenal dalam PP No. 28 Tahun 2025.' },
      hasil: 'tidak', jenis: 'hambatan', sektor: ['X'],
      ketentuan: 'Rekomendasi daerah sebagai persyaratan tambahan (Pasal 12 ayat 2)',
      pembanding: { reg: 'PP No. 28 Tahun 2025 tentang Penyelenggaraan Perizinan Berusaha Berbasis Risiko', teks: 'Persyaratan perizinan berusaha dipenuhi melalui Sistem OSS; pemerintah daerah tidak menetapkan persyaratan di luar yang diatur.' },
      pertimbangan: '',
      bukti: { naskah: true, pasal: true, pembanding: false, sumber: false }, verifikator: null
    }
  ];

  const alasanSelaras = ['Ketentuan perizinan merujuk PP No. 28 Tahun 2025 tanpa menambah persyaratan di luar standar.', 'Kewenangan yang diatur sesuai pembagian urusan dalam UU No. 23 Tahun 2014.', 'Insentif daerah mengikuti batas yang diatur PP No. 35 Tahun 2023.', 'Tata ruang yang diatur konsisten dengan RTRW provinsi yang berlaku.', 'Norma tidak bertentangan dengan peraturan yang lebih tinggi.', 'Sasaran pengaturan mendukung RPJMN 2025–2029.'];
  const alasanTidak = {
    hambatan: ['Mensyaratkan izin/rekomendasi tambahan di luar Sistem OSS.', 'Menetapkan retribusi atas layanan yang tidak lagi dipungut.', 'Menambah persyaratan dokumen di luar standar usaha.'],
    kewenangan: ['Mengatur urusan yang menjadi kewenangan pemerintah pusat.', 'Pembinaan usaha beririsan dengan kewenangan kementerian teknis lain.'],
    norma: ['Ketentuan sanksi berbeda dengan peraturan yang lebih tinggi.', 'Definisi kegiatan usaha tidak konsisten dengan KBLI 2025.'],
    sasaran: ['Insentif belum dikaitkan dengan indikator sasaran pembangunan daerah.', 'Prioritas kawasan tidak sejalan dengan RTRW dan RPJMD.']
  };
  const pembandingPool = ['PP No. 28 Tahun 2025 tentang Penyelenggaraan Perizinan Berusaha Berbasis Risiko', 'UU No. 23 Tahun 2014 tentang Pemerintahan Daerah', 'PP No. 35 Tahun 2023 tentang Ketentuan Umum Pajak Daerah dan Retribusi Daerah', 'PP No. 21 Tahun 2021 tentang Penyelenggaraan Penataan Ruang', 'Perpres No. 12 Tahun 2025 (RPJMN 2025–2029)', 'PP No. 6 Tahun 2021 tentang Penyelenggaraan Perizinan Berusaha di Daerah'];
  const jenisKeys = jenisIndikasi.map((j) => j[0]);
  // pelengkap populasi: 95 hasil penilaian (total 100). Indeks 5–23 menunggu (19 + HP-005 = 20);
  // sisanya terverifikasi (4 utama + 76 = 80). 8 hasil terverifikasi belum lengkap bukti/pertimbangan (72/80).
  for (let i = 5; i < 100; i++) {
    const reg = regulasi[100 + i * 4];
    const tidak = rnd() < 0.18;
    const jn = tidak ? pick(jenisKeys) : null;
    const menunggu = i < 24;
    const kurang = !menunggu && (i % 10 === 0) && i <= 90; // 9 kandidat → dipangkas di bawah
    const al = tidak ? pick(alasanTidak[jn]) : pick(alasanSelaras);
    const yakin = Math.round((0.62 + rnd() * 0.34) * 100) / 100;
    penilaian.push({
      id: 'HP-' + pad(i + 1), regId: reg.id, temuanId: null, ver: menunggu ? int(1, 2) : int(1, 3), status: menunggu ? 'menunggu' : 'terverifikasi',
      diubah: menunggu ? ts('10-' + pad(int(8, 15), 2), int(7, 17), int(0, 59)) : ts('09-' + pad(int(1, 30), 2), int(8, 16), int(0, 59)),
      ai: { hasil: tidak ? 'tidak' : 'selaras', jenis: jn, yakin: yakin, alasan: al },
      hasil: tidak ? 'tidak' : 'selaras', jenis: jn, sektor: reg.sektor.length ? reg.sektor.slice() : ['X'],
      ketentuan: 'Ketentuan pokok ' + reg.judul.toLowerCase(),
      pembanding: { reg: pick(pembandingPool), teks: 'Ketentuan pembanding sebagaimana tercantum dalam peraturan acuan.' },
      pertimbangan: menunggu ? '' : (kurang ? '' : al + ' Dinilai berdasarkan naskah resmi dan peraturan acuan.'),
      bukti: menunggu ? { naskah: true, pasal: rnd() < 0.6, pembanding: rnd() < 0.5, sumber: rnd() < 0.5 } : { naskah: true, pasal: true, pembanding: !kurang, sumber: true },
      verifikator: menunggu ? null : 'Analis Harmonisasi'
    });
  }
  // pastikan tepat 8 hasil terverifikasi belum lengkap (72/80 = 90%)
  (function () {
    const ver = penilaian.filter((p) => p.status === 'terverifikasi');
    const isLengkap = (p) => !!p.pertimbangan && Object.keys(p.bukti).every((k) => p.bukti[k]);
    let kurang = ver.filter((p) => !isLengkap(p));
    while (kurang.length > 8) { const p = kurang.pop(); p.pertimbangan = p.ai.alasan + ' Dinilai berdasarkan naskah resmi dan peraturan acuan.'; p.bukti = { naskah: true, pasal: true, pembanding: true, sumber: true }; }
    let j = ver.length - 1;
    while (kurang.length < 8 && j >= 0) { const p = ver[j--]; if (isLengkap(p) && !p.temuanId) { p.bukti.sumber = false; kurang.push(p); } }
  })();

  // =====================================================================
  // 3) Hasil klasifikasi sektor otomatis (BO-06, BO-07)
  // =====================================================================
  // status: menunggu | ditinjau ; putusan: sesuai | koreksi
  const klasifikasi = [];
  const sekKeys = sektor.map((s) => s[0]).filter((k) => k !== 'X');
  for (let i = 0; i < 100; i++) {
    const reg = regulasi[i < 5 ? 88 + i : 3 + i * 6];
    const menunggu = i >= 85;
    const asli = reg.sektor.length ? reg.sektor : ['X'];
    const salah = rnd() < (menunggu ? 0.35 : 0.08);
    const usul = salah ? [pick(sekKeys)] : asli.slice(0, 2);
    const yakin = Math.round((menunggu ? 0.48 + rnd() * 0.3 : 0.7 + rnd() * 0.28) * 100) / 100;
    klasifikasi.push({
      id: 'KS-' + pad(i + 1), regId: reg.id, ver: 1,
      ai: { kode: usul, yakin: yakin, dasar: 'Kata kunci pada judul dan pasal ruang lingkup: "' + reg.judul.split(' ').slice(0, 4).join(' ').toLowerCase() + '…"', model: 'klasifikasi-kbli-2025:v1.3' },
      status: menunggu ? 'menunggu' : 'ditinjau',
      putusan: menunggu ? null : (salah ? 'koreksi' : 'sesuai'),
      final: menunggu ? null : asli.slice(0, 2),
      catatan: menunggu ? '' : (salah ? 'Dikoreksi mengikuti ruang lingkup pengaturan pada naskah.' : ''),
      peninjau: menunggu ? null : 'Analis Harmonisasi',
      diubah: menunggu ? ts('10-' + pad(int(10, 15), 2), int(6, 9), int(0, 59)) : ts('09-' + pad(int(1, 30), 2), int(8, 16), int(0, 59))
    });
  }

  // =====================================================================
  // 4) Tindak lanjut (BO-08)
  // =====================================================================
  const tl = (id, temuanId, judul, regIdx, jenis, status, pic, unit, pembina, mulai, target, riwayat) => ({ id: id, temuanId: temuanId, judul: judul, regId: regIdx, jenis: jenis, status: status, pic: pic, unit: unit, pembina: pembina, mulai: mulai, target: target, ver: 1, riwayat: riwayat || [] });
  const tindakLanjut = [
    tl('TL-001', 'T-001', 'Penyertaan modal BUMD belum dikaitkan dengan sasaran pembangunan', REG_TEMUAN_ID[0], 'sasaran', 'selesai', 'Pemerintah Kabupaten Pulang Pisau', 'Bagian Perekonomian Setda Kab. Pulang Pisau', 'Kemendagri (Ditjen Bina Keuangan Daerah)', '2026-08-04', '2026-09-01',
      [['2026-08-04', 'Surat permintaan klarifikasi dikirim ke Pemkab'], ['2026-08-20', 'Rancangan perbup pelaksana disusun'], ['2026-09-01', 'Perbup pelaksana ditetapkan · tindak lanjut selesai']]),
    tl('TL-002', 'T-002', 'Pembinaan desa wisata bahari beririsan dengan kewenangan pariwisata', REG_TEMUAN_ID[1], 'kewenangan', 'tunggu', 'Kementerian Kelautan dan Perikanan', 'Ditjen Pengelolaan Kelautan · KKP', 'Kemenpar', '2026-08-22', '2026-10-31',
      [['2026-08-22', 'Rapat koordinasi KKP–Kemenpar'], ['2026-09-18', 'Draf nota kesepahaman disampaikan untuk keputusan pimpinan']]),
    tl('TL-003', 'T-004', 'Spesifikasi teknis ekspor karet berbeda dengan SNI', REG_TEMUAN_ID[2], 'norma', 'proses', 'Kementerian Perdagangan', 'Ditjen Perdagangan Luar Negeri · Kemendag', 'Kemenperin · BSN', '2026-09-03', '2026-11-15',
      [['2026-09-03', 'Temuan disampaikan ke Kemendag'], ['2026-09-25', 'Penyusunan perubahan lampiran dimulai']]),
    tl('TL-004', 'T-006', 'Standar usaha tambahan di luar PP 28/2025', REG_TEMUAN_ID[3], 'hambatan', 'proses', 'Kementerian Kebudayaan', 'Biro Hukum · Kementerian Kebudayaan', 'Kementerian Investasi dan Hilirisasi/BKPM', '2026-09-11', '2026-11-30',
      [['2026-09-11', 'Temuan disampaikan ke Kementerian Kebudayaan'], ['2026-10-02', 'Kajian pencabutan pasal standar tambahan']]),
    tl('TL-005', 'T-007', 'Rekomendasi daerah sebagai persyaratan tambahan sebelum OSS', REG_TEMUAN_ID[4], 'hambatan', 'belum', null, '', 'Kemendagri · Kementerian Investasi dan Hilirisasi/BKPM', '2026-10-14', '', [])
  ];
  // pelengkap populasi: 15 tindak lanjut simulasi (total 20). Satu lagi tanpa PIC resmi → 18/20 lengkap.
  const instansiTL = ['Pemerintah Provinsi Jawa Barat', 'Pemerintah Kabupaten Morowali', 'Pemerintah Kota Batam', 'Kementerian ESDM', 'Kementerian ATR/BPN', 'Pemerintah Provinsi Banten', 'Pemerintah Kabupaten Gresik', 'Kementerian Pertanian', 'Pemerintah Provinsi Riau', 'Kementerian Perindustrian', 'Pemerintah Kota Balikpapan', 'Pemerintah Kabupaten Batang', 'Kementerian Pariwisata', 'Pemerintah Provinsi Sulawesi Selatan', 'Pemerintah Kabupaten Siak'];
  const judulTL = ['Retribusi persetujuan bangunan melebihi batas tarif', 'Kewajiban rekomendasi camat untuk izin usaha mikro', 'Insentif pajak daerah belum mengacu PP 35/2023', 'Persyaratan RKAB tambahan di tingkat provinsi', 'RDTR belum terintegrasi dengan Sistem OSS', 'Kewajiban mitra lokal untuk penanaman modal asing', 'Izin lingkungan daerah di luar ketentuan Amdal', 'Pembatasan alih fungsi lahan tanpa dasar RTRW', 'Pungutan sumbangan pihak ketiga untuk investor', 'Kewenangan kawasan industri tumpang tindih', 'Jangka waktu layanan izin melebihi SLA OSS', 'Persyaratan domisili usaha ganda', 'Standar usaha pariwisata berbeda dengan PP 28/2025', 'Prioritas kawasan tidak selaras RPJMD', 'Kewajiban rekomendasi teknis dinas sebelum OSS'];
  const stTL = ['proses', 'proses', 'belum', 'tunggu', 'selesai', 'proses', 'belum', 'selesai', 'proses', 'tunggu', 'proses', 'selesai', 'proses', 'belum', 'proses'];
  for (let i = 0; i < 15; i++) {
    const n = i + 6;
    const st = stTL[i];
    const mulai = '2026-' + pad(int(6, 10), 2) + '-' + pad(int(1, 28), 2);
    tindakLanjut.push(tl('TL-' + pad(n), 'T-' + pad(n + 2), judulTL[i], regulasi[140 + i * 17].id, pick(jenisKeys), st, i === 11 ? null : instansiTL[i], i === 11 ? '' : 'Unit hukum · ' + instansiTL[i].replace('Pemerintah ', ''), 'Kemendagri', mulai, st === 'selesai' ? '2026-10-10' : '2026-12-' + pad(int(1, 20), 2),
      [[mulai, 'Temuan disampaikan ke instansi penanggung jawab']].concat(st === 'belum' ? [] : [['2026-10-0' + int(1, 9), st === 'selesai' ? 'Perubahan peraturan ditetapkan · selesai' : 'Penanganan berjalan sesuai rencana']])));
  }

  // =====================================================================
  // 5) Profil & indikator kesiapan provinsi (BO-09) — subset 10 provinsi dalam cakupan
  // =====================================================================
  const prov = (id, nama, pdrb, realisasi, pend, kep, proyek, kawasan, selesai, ringkas) => ({
    id: id, nama: nama, ver: selesai ? 3 : 2, status: selesai ? 'selesai' : 'proses',
    ringkasan: ringkas,
    indikator: [
      { k: 'pdrb', l: 'PDRB ADHB', v: pdrb, sat: 'Rp triliun', sumber: 'BPS', periode: '2025' },
      { k: 'realisasi', l: 'Realisasi investasi PMA + PMDN', v: realisasi, sat: 'Rp triliun', sumber: 'Kementerian Investasi dan Hilirisasi/BKPM', periode: 'Jan–Sep 2026' },
      { k: 'penduduk', l: 'Jumlah penduduk', v: pend, sat: 'juta jiwa', sumber: 'BPS · Proyeksi Penduduk', periode: '2025' },
      { k: 'kepadatan', l: 'Kepadatan penduduk', v: kep, sat: 'jiwa/km²', sumber: 'BPS', periode: '2025' },
      { k: 'proyek', l: 'Proyek siap investasi', v: proyek, sat: 'proyek', sumber: 'Pemerintah Provinsi · PIR', periode: 'Okt 2026' },
      { k: 'kawasan', l: 'KEK & kawasan industri', v: kawasan, sat: 'kawasan', sumber: 'Dewan Nasional KEK · Kemenperin', periode: '2026' }
    ],
    checklist: selesai ? { profil: true, indikator: true, periode: true, proyek: true, regulasi: true, narasi: true } : null,
    kurator: selesai ? 'Analis Harmonisasi' : null, diubah: selesai ? ts('09-' + pad(int(10, 28), 2), int(8, 16), 0) : ts('10-' + pad(int(10, 15), 2), int(8, 16), 0)
  });
  const provinsi = [
    prov('dki', 'DKI Jakarta', 3632, 172.4, 10.7, 16144, 9, 2, true, 'Pusat jasa keuangan dan perdagangan dengan realisasi investasi tertinggi pada sektor jasa dan properti.'),
    prov('jabar', 'Jawa Barat', 2850, 211.5, 50.8, 1436, 21, 9, true, 'Basis industri pengolahan nasional; kawasan Rebana dan Jabar Selatan menjadi koridor pertumbuhan baru.'),
    prov('jatim', 'Jawa Timur', 3105, 108.7, 42.1, 879, 18, 7, true, 'Pusat industri dan logistik kawasan timur dengan KEK Gresik dan Singhasari.'),
    prov('jateng', 'Jawa Tengah', 1858, 79.6, 38.2, 1161, 16, 6, true, 'Upah kompetitif dan kawasan industri Batang–Kendal menarik relokasi industri padat karya.'),
    prov('banten', 'Banten', 911, 92.9, 12.5, 1293, 11, 5, true, 'Industri kimia, baja, dan logistik di koridor Serang–Cilegon–Tangerang.'),
    prov('sumut', 'Sumatera Utara', 1121, 41.8, 15.6, 214, 12, 3, true, 'Hilirisasi perkebunan dan KEK Sei Mangkei sebagai pusat oleokimia.'),
    prov('riau', 'Riau', 1047, 56.3, 6.9, 77, 8, 2, true, 'Investasi hilirisasi sawit dan pulp; Dumai sebagai simpul ekspor.'),
    prov('kaltim', 'Kalimantan Timur', 896, 63.1, 4.0, 31, 10, 3, true, 'Penyangga Ibu Kota Nusantara dengan KEK Maloy dan transisi dari ekonomi batu bara.'),
    prov('sulteng', 'Sulawesi Tengah', 402, 88.4, 3.2, 52, 6, 2, false, 'Pusat hilirisasi nikel di Morowali; perlu penguatan aspek lingkungan dan tenaga kerja lokal.'),
    prov('sulsel', 'Sulawesi Selatan', 671, 24.2, 9.4, 202, 9, 2, false, 'Simpul logistik kawasan timur dengan potensi agroindustri dan perikanan.')
  ];
  provinsi[8].checklist = { profil: true, indikator: true, periode: false, proyek: true, regulasi: false, narasi: false };
  provinsi[9].checklist = { profil: true, indikator: false, periode: false, proyek: false, regulasi: true, narasi: false };

  // =====================================================================
  // 6) Keluaran AI / narasi (BO-10, BO-11)
  // =====================================================================
  // status: review (menunggu tinjauan analis) | approval (menunggu persetujuan) | published (tayang) | taken (ditarik)
  // disetujuiVer: versi yang disetujui. Konten tayang hanya sah jika disetujuiVer === ver.
  const ai = (id, mdl, widget, cakupan, judul, teks, st, yakin, at, extra) => Object.assign({
    id: id, modul: mdl, widget: widget, cakupan: cakupan, ver: 1, status: st, yakin: yakin, dibuat: at,
    ai: { judul: judul, teks: teks }, ed: null, disetujuiVer: st === 'published' ? 1 : null,
    prompt: 'harmonisasi-' + mdl + ':v2', sumber: []
  }, extra || {});
  const keluaranAI = [
    ai('AI-001', 'payung', 'Saran Untuk Presiden', 'Nasional', 'Tetapkan pedoman tunggal standar usaha sektoral',
      'Arahkan kementerian teknis untuk menghentikan penambahan standar usaha di luar lampiran PP No. 28 Tahun 2025, dan tetapkan pedoman tunggal penyusunan standar usaha yang dikoordinasikan Kementerian Investasi dan Hilirisasi/BKPM.',
      'review', 0.82, ts('10-15', 6, 10), { sumber: ['Koleksi regulasi Modul 1', 'Temuan T-006'] }),
    ai('AI-002', 'peluang', 'Ringkasan', 'Jawa Barat', 'Jawa Barat memimpin realisasi investasi, didorong industri pengolahan',
      'Realisasi investasi Jawa Barat mencapai Rp211,5 triliun pada Januari–September 2026, tertinggi secara nasional. Industri pengolahan menyumbang porsi terbesar, terkonsentrasi di Bekasi dan Karawang, sementara kawasan Rebana mulai menarik relokasi industri.',
      'review', 0.79, ts('10-15', 6, 20), { sumber: ['Kementerian Investasi dan Hilirisasi/BKPM', 'BPS'] }),
    ai('AI-003', 'perizinan', 'Insight kemudahan berusaha', 'Nasional', 'Permohonan tertahan terkonsentrasi pada persetujuan lingkungan',
      'Sebanyak 42% permohonan tertahan lebih dari SLA berada pada tahap persetujuan lingkungan dan PKKPR. Percepatan integrasi RDTR digital di 20 kabupaten/kota prioritas berpotensi memangkas waktu penyelesaian rata-rata 9 hari.',
      'review', 0.74, ts('10-15', 6, 30), { sumber: ['Sistem OSS RBA', 'Kementerian ATR/BPN'] }),
    ai('AI-004', 'keselarasan', 'Rekomendasi & penanggung jawab', 'Jawa Tengah', 'Cabut kewajiban rekomendasi daerah sebelum OSS di Kabupaten Kudus',
      'Pemerintah Kabupaten Kudus perlu mencabut Pasal 12 ayat (2) Perda No. 1 Tahun 2026 yang mensyaratkan rekomendasi daerah sebelum permohonan diajukan melalui OSS. Kemendagri melakukan fasilitasi perubahan perda.',
      'review', 0.71, ts('10-14', 8, 0), { sumber: ['Temuan T-007', 'PP No. 28 Tahun 2025'] }),
    ai('AI-005', 'demografi', 'Insight mobilitas untuk investasi', 'Nasional', 'Arus masuk pekerja ke koridor industri Jawa Tengah meningkat',
      'Migrasi masuk ke Kabupaten Batang dan Kendal naik 14% dibanding tahun lalu, sejalan dengan beroperasinya kawasan industri. Kebutuhan perumahan pekerja dan transportasi publik perlu masuk perencanaan daerah.',
      'review', 0.68, ts('10-15', 5, 50), { sumber: ['BPS · Survei Migrasi', 'Dukcapil'] }),
    ai('AI-006', 'peluang', 'Poin Penting', 'Jawa Timur', 'Tiga proyek siap investasi Jawa Timur menunggu kepastian lahan',
      'Dari 18 proyek siap investasi di Jawa Timur, tiga proyek di KEK Gresik masih menunggu penyelesaian status lahan. Penyelesaian melalui skema PP No. 43 Tahun 2021 dapat membuka nilai investasi sekitar Rp12 triliun.',
      'review', 0.76, ts('10-15', 6, 40), { sumber: ['Pemerintah Provinsi Jawa Timur', 'Kementerian ATR/BPN'] }),
    ai('AI-007', 'payung', 'Dampak', 'Nasional', 'Regulasi turunan PP 28/2025 belum seluruhnya diterbitkan',
      'Sembilan peraturan menteri pelaksana PP No. 28 Tahun 2025 belum ditetapkan, sehingga sebagian pelaku usaha masih mengacu standar lama dan berisiko mengalami penolakan permohonan di OSS.',
      'review', 0.8, ts('10-15', 7, 0), { sumber: ['Koleksi regulasi Modul 1'] }),
    ai('AI-008', 'perizinan', 'Saran Untuk Presiden', 'Nasional', 'Tegaskan penerapan fiktif positif pada izin yang melewati SLA',
      'Instruksikan kementerian/lembaga dan pemerintah daerah menerapkan ketentuan fiktif positif secara otomatis di OSS untuk permohonan yang melewati SLA, disertai pemantauan bulanan oleh Kementerian Investasi dan Hilirisasi/BKPM.',
      'review', 0.77, ts('10-15', 7, 10), { sumber: ['Sistem OSS RBA', 'PP No. 28 Tahun 2025'] }),
    ai('AI-009', 'keselarasan', 'Ringkasan Informasi', 'Nasional', '13 regulasi tidak selaras, didominasi hambatan kemudahan berusaha',
      'Dari 284 regulasi yang dinilai, 13 terindikasi tidak selaras. Hambatan kemudahan berusaha menjadi jenis indikasi terbanyak (7 temuan), terutama persyaratan tambahan di luar OSS pada peraturan daerah.',
      'approval', 0.86, ts('10-13', 9, 0), { ed: { judul: '13 regulasi tidak selaras, didominasi hambatan kemudahan berusaha', teks: 'Dari 284 regulasi yang telah dinilai, 13 regulasi terindikasi tidak selaras. Hambatan kemudahan berusaha menjadi jenis indikasi terbanyak (7 temuan), terutama persyaratan tambahan di luar Sistem OSS pada peraturan daerah.' }, ver: 2, diajukan: 'Analis Harmonisasi', sumber: ['Hasil penilaian keselarasan', 'Daftar temuan Modul 5'] }),
    ai('AI-010', 'peluang', 'Saran Untuk Presiden', 'Banten', 'Percepat penataan kawasan industri kimia Serang–Cilegon',
      'Dorong Pemprov Banten dan Kemenperin menyusun rencana induk kawasan industri kimia terpadu Serang–Cilegon untuk menampung ekspansi petrokimia, termasuk kepastian pasokan air baku.',
      'approval', 0.73, ts('10-12', 10, 0), { diajukan: 'Analis Harmonisasi', sumber: ['Pemerintah Provinsi Banten', 'Kemenperin'] }),
    ai('AI-011', 'demografi', 'Ringkasan Informasi', 'Nasional', 'Bonus demografi terkonsentrasi di Pulau Jawa',
      'Sebanyak 56% penduduk usia produktif berada di Pulau Jawa. Provinsi dengan arus keluar tertinggi—NTT dan Sumatera Barat—berpotensi menjadi pemasok tenaga kerja bagi kawasan industri baru.',
      'approval', 0.81, ts('10-12', 14, 0), { ed: { judul: 'Penduduk usia produktif terkonsentrasi di Pulau Jawa', teks: 'Sebanyak 56% penduduk usia produktif berada di Pulau Jawa. Provinsi dengan arus keluar tertinggi—NTT dan Sumatera Barat—berpotensi menjadi pemasok tenaga kerja bagi kawasan industri baru.' }, ver: 2, diajukan: 'Analis Harmonisasi', sumber: ['BPS · Proyeksi Penduduk'] }),
    ai('AI-012', 'payung', 'Poin Penting', 'Nasional', 'UU Cipta Kerja tetap menjadi payung utama kemudahan berusaha',
      'UU No. 6 Tahun 2023 bersama PP No. 28 Tahun 2025 menjadi acuan utama perizinan berbasis risiko; 31 peraturan pemerintah sektoral pelaksana telah diselaraskan.',
      'approval', 0.83, ts('10-11', 9, 30), { diajukan: 'Analis Harmonisasi', sumber: ['Koleksi regulasi Modul 1'] }),
    ai('AI-013', 'perizinan', 'Poin Penting', 'Nasional', 'Rata-rata waktu izin PKKPR melampaui SLA di 6 provinsi',
      'Waktu penyelesaian PKKPR melampaui standar SLA di enam provinsi; tiga di antaranya belum memiliki RDTR digital yang terintegrasi dengan OSS.',
      'taken', 0.7, ts('10-05', 9, 0), { disetujuiVer: 1, alasanTarik: 'Data waktu layanan diperbarui; menunggu angka revisi dari OSS.', sumber: ['Sistem OSS RBA'] })
  ];
  // pelengkap populasi: 50 keluaran AI tayang (semua disetujui sesuai versi → 50/50 = 100%)
  const widgetPool = { payung: ['Ringkasan', 'Poin Penting', 'Dampak', 'Saran Untuk Presiden'], peluang: ['Ringkasan', 'Poin Penting', 'Peluang & rekomendasi arah kebijakan', 'Saran Untuk Presiden'], demografi: ['Ringkasan Informasi', 'Insight mobilitas untuk investasi'], perizinan: ['Ringkasan', 'Insight kemudahan berusaha', 'Dampak', 'Saran Untuk Presiden'], keselarasan: ['Ringkasan Informasi', 'Perkiraan dampak terhadap realisasi investasi', 'Rekomendasi & penanggung jawab'] };
  const cakupanPool = { payung: ['Nasional'], peluang: provinsi.map((p) => p.nama), demografi: ['Nasional'].concat(provinsi.slice(0, 5).map((p) => p.nama)), perizinan: ['Nasional', 'Sektor C · Industri Pengolahan', 'Sektor B · Pertambangan', 'Sektor I · Akomodasi'], keselarasan: ['Nasional'].concat(['Jawa Tengah', 'Kalimantan Tengah', 'Sektor G · Perdagangan']) };
  const kalimat = {
    payung: (c) => ['Regulasi investasi ' + c.toLowerCase() + ' stabil pada 2026', 'Jumlah regulasi investasi berlaku tidak berubah signifikan; perubahan terbesar ada pada peraturan menteri pelaksana perizinan berbasis risiko.'],
    peluang: (c) => ['Peluang investasi ' + c + ' terfokus pada hilirisasi dan kawasan industri', 'Profil ' + c + ' menunjukkan kesiapan lahan dan infrastruktur yang memadai; proyek siap investasi diprioritaskan pada sektor dengan nilai tambah tinggi.'],
    demografi: (c) => ['Struktur penduduk ' + c + ' mendukung kebutuhan tenaga kerja', 'Proporsi penduduk usia produktif ' + c + ' tetap tinggi; mobilitas pekerja mengikuti lokasi kawasan industri.'],
    perizinan: (c) => ['Kinerja layanan perizinan ' + c + ' membaik', 'Rata-rata waktu penyelesaian izin ' + c + ' turun dibanding triwulan sebelumnya, meski sebagian permohonan masih tertahan pada tahap verifikasi persyaratan dasar.'],
    keselarasan: (c) => ['Tindak lanjut temuan keselarasan ' + c + ' berjalan', 'Temuan keselarasan regulasi pada cakupan ' + c + ' sedang ditangani instansi penanggung jawab sesuai rencana tindak lanjut.']
  };
  const mods = modul.map((m) => m[0]);
  for (let i = 0; i < 50; i++) {
    const m = mods[i % mods.length];
    const c = cakupanPool[m][Math.floor(i / mods.length) % cakupanPool[m].length];
    const w = widgetPool[m][i % widgetPool[m].length];
    const k = kalimat[m](c);
    const v = int(1, 3);
    keluaranAI.push(ai('AI-' + pad(i + 14), m, w, c, k[0], k[1], 'published', Math.round((0.72 + rnd() * 0.24) * 100) / 100, ts('09-' + pad(int(1, 30), 2), int(6, 18), int(0, 59)),
      { ver: v, disetujuiVer: v, ed: v > 1 ? { judul: k[0], teks: k[1] } : null, disetujuiOleh: 'Analis Utama', sumber: ['Data Modul ' + (mods.indexOf(m) + 1)] }));
  }

  // =====================================================================
  // 7) CMS (BO-12 s.d. BO-15)
  // =====================================================================
  const cms = {
    // BO-12 — label versi masih placeholder: nilai/versi aktual ditetapkan pimpinan
    masterSektor: {
      versiAktif: 'Versi A', dasar: 'KBLI 2025 (Peraturan BPS No. 7 Tahun 2025)', ditetapkan: '2026-07-01', placeholder: true,
      riwayat: [['Versi A', 'KBLI 2025 · 22 kategori + lintas sektor', '2026-07-01', 'aktif'], ['Versi A-0', 'KBLI 2020 · 21 kategori', '2024-01-15', 'arsip']],
      aktif: sektor.map((s) => s[0])
    },
    kriteria: {
      versiAktif: 'Versi B', ditetapkan: '2026-07-15', placeholder: true,
      riwayat: [['Versi B', '4 kriteria · bukti wajib diperluas', '2026-07-15', 'aktif'], ['Versi B-0', '3 kriteria awal', '2025-11-03', 'arsip']],
      items: [
        { k: 'hambatan', l: 'Hambatan kemudahan berusaha', uji: 'Apakah regulasi menambah persyaratan, prosedur, biaya, atau waktu di luar standar perizinan berbasis risiko?', acuan: 'PP No. 28 Tahun 2025', aktif: true },
        { k: 'kewenangan', l: 'Tumpang tindih kewenangan', uji: 'Apakah regulasi mengatur urusan yang menjadi kewenangan instansi atau tingkat pemerintahan lain?', acuan: 'UU No. 23 Tahun 2014', aktif: true },
        { k: 'norma', l: 'Pertentangan norma', uji: 'Apakah norma bertentangan dengan peraturan yang lebih tinggi atau setingkat?', acuan: 'UU No. 12 Tahun 2011 jo. UU No. 13 Tahun 2022', aktif: true },
        { k: 'sasaran', l: 'Tidak sesuai sasaran pembangunan', uji: 'Apakah pengaturan tidak sejalan atau tidak terukur terhadap sasaran RPJMN dan RPJMD?', acuan: 'Perpres No. 12 Tahun 2025', aktif: true }
      ]
    },
    // BO-13 — KAK tidak menentukan nilai ambang. Nilai dibiarkan kosong sampai ditetapkan.
    ambang: [
      { id: 'AM-01', modul: 'keselarasan', l: 'Lama penanganan temuan', sat: 'hari', nilai: null, dasar: '', status: 'belum' },
      { id: 'AM-02', modul: 'perizinan', l: 'Waktu penyelesaian izin melampaui SLA', sat: '% dari SLA', nilai: null, dasar: '', status: 'belum' },
      { id: 'AM-03', modul: 'perizinan', l: 'Jumlah permohonan tertahan per provinsi', sat: 'permohonan', nilai: null, dasar: '', status: 'belum' },
      { id: 'AM-04', modul: 'peluang', l: 'Penurunan realisasi investasi triwulanan', sat: '%', nilai: null, dasar: '', status: 'belum' },
      { id: 'AM-05', modul: 'payung', l: 'Regulasi pelaksana belum terbit setelah tenggat', sat: 'hari', nilai: null, dasar: '', status: 'belum' },
      { id: 'AM-06', modul: 'demografi', l: 'Lonjakan migrasi masuk kawasan industri', sat: '% yoy', nilai: null, dasar: '', status: 'belum' }
    ],
    // BO-14
    layer: [
      { id: 'LY-01', modul: 'demografi', l: 'Kepadatan penduduk', tipe: 'Koroplet provinsi', sumber: 'BPS · Proyeksi Penduduk', cakupan: '38 provinsi', periode: '2025', aktif: true },
      { id: 'LY-02', modul: 'demografi', l: 'Arus migrasi masuk/keluar', tipe: 'Garis alur', sumber: 'BPS · Survei Migrasi', cakupan: '38 provinsi', periode: '2025', aktif: true },
      { id: 'LY-03', modul: 'peluang', l: 'Realisasi investasi PMA & PMDN', tipe: 'Koroplet provinsi', sumber: 'Kementerian Investasi dan Hilirisasi/BKPM', cakupan: '38 provinsi', periode: 'Jan–Sep 2026', aktif: true },
      { id: 'LY-04', modul: 'peluang', l: 'Batas kab/kota Top 5 PDRB', tipe: 'Poligon kab/kota', sumber: 'BIG · Batas Wilayah', cakupan: '5 provinsi', periode: '2024', aktif: true },
      { id: 'LY-05', modul: 'peluang', l: 'Proyek siap investasi', tipe: 'Titik', sumber: 'Pemerintah Provinsi · PIR', cakupan: '10 provinsi', periode: 'Okt 2026', aktif: true },
      { id: 'LY-06', modul: 'peluang', l: 'KEK & kawasan industri', tipe: 'Titik', sumber: 'Dewan Nasional KEK · Kemenperin', cakupan: 'Nasional', periode: '2026', aktif: false },
      { id: 'LY-07', modul: 'perizinan', l: 'Permohonan izin tertahan', tipe: 'Koroplet provinsi', sumber: 'Sistem OSS RBA', cakupan: '38 provinsi', periode: 'Sep 2026', aktif: true }
    ],
    // BO-15 — status: tayang | menunggu (versi baru menunggu persetujuan) | draf | ditarik
    penayangan: [
      ['PN-01', 'provinsi', 'DKI Jakarta', 'peluang', 3, 3, 'tayang'],
      ['PN-02', 'provinsi', 'Jawa Barat', 'peluang', 4, 5, 'menunggu'],
      ['PN-03', 'provinsi', 'Jawa Timur', 'peluang', 3, 3, 'tayang'],
      ['PN-04', 'provinsi', 'Jawa Tengah', 'peluang', 2, 2, 'tayang'],
      ['PN-05', 'provinsi', 'Banten', 'peluang', 2, 3, 'menunggu'],
      ['PN-06', 'provinsi', 'Sumatera Utara', 'peluang', 2, 2, 'tayang'],
      ['PN-07', 'provinsi', 'Riau', 'peluang', 1, 1, 'tayang'],
      ['PN-08', 'provinsi', 'Kalimantan Timur', 'peluang', 2, 2, 'tayang'],
      ['PN-09', 'provinsi', 'Sulawesi Tengah', 'peluang', null, 1, 'draf'],
      ['PN-10', 'provinsi', 'Sulawesi Selatan', 'peluang', null, 1, 'draf'],
      ['PN-11', 'sektor', 'C · Industri Pengolahan', 'keselarasan', 2, 2, 'tayang'],
      ['PN-12', 'sektor', 'B · Pertambangan dan Penggalian', 'keselarasan', 2, 2, 'tayang'],
      ['PN-13', 'sektor', 'A · Pertanian, Kehutanan dan Perikanan', 'keselarasan', 1, 2, 'menunggu'],
      ['PN-14', 'sektor', 'I · Penyediaan Akomodasi dan Makan Minum', 'keselarasan', 1, 1, 'tayang'],
      ['PN-15', 'sektor', 'G · Perdagangan Besar dan Eceran', 'keselarasan', 1, 1, 'ditarik']
    ].map((r) => ({ id: r[0], jenis: r[1], cakupan: r[2], modul: r[3], verTayang: r[4], verTerbaru: r[5], status: r[6], disetujui: r[4] ? 'Analis Utama' : null, diubah: ts('10-' + pad(int(1, 15), 2), int(8, 17), 0) }))
  };

  // =====================================================================
  // 8) Riwayat audit awal (aksi sebelum sesi simulasi dimulai)
  // =====================================================================
  const audit = [
    ['2026-10-15T07:00', 'Sistem AI', 'sistem', 'keluaranAI', 'AI-007', 'Draf dibuat oleh AI', '—', 'Menunggu tinjauan', 'Pembaruan harian modul Payung'],
    ['2026-10-15T06:10', 'Sistem AI', 'sistem', 'keluaranAI', 'AI-001', 'Draf dibuat oleh AI', '—', 'Menunggu tinjauan', 'Pembaruan harian modul Payung'],
    ['2026-10-14T08:00', 'Sistem AI', 'sistem', 'keluaranAI', 'AI-004', 'Draf dibuat oleh AI', '—', 'Menunggu tinjauan', 'Temuan baru T-007'],
    ['2026-10-14T07:30', 'Sistem AI', 'sistem', 'penilaian', 'HP-005', 'Hasil penilaian otomatis dibuat', '—', 'Menunggu verifikasi', 'Regulasi baru masuk koleksi'],
    ['2026-10-13T11:20', 'Analis Harmonisasi', 'analis', 'keluaranAI', 'AI-009', 'Diajukan untuk persetujuan', 'Menunggu tinjauan · v2', 'Menunggu persetujuan · v2', 'Penyuntingan redaksional selesai'],
    ['2026-10-12T15:00', 'Analis Harmonisasi', 'analis', 'keluaranAI', 'AI-011', 'Diajukan untuk persetujuan', 'Menunggu tinjauan · v2', 'Menunggu persetujuan · v2', 'Judul disesuaikan istilah BPS'],
    ['2026-10-10T09:15', 'Analis Utama', 'approver', 'keluaranAI', 'AI-013', 'Ditarik dari dashboard', 'Tayang · v1', 'Ditarik', 'Data waktu layanan diperbarui; menunggu angka revisi dari OSS.'],
    ['2026-10-09T14:00', 'Analis Utama', 'approver', 'penayangan', 'PN-15', 'Analisis ditarik dari dashboard', 'Tayang · v1', 'Ditarik', 'Data ekspor diperbarui Kemendag'],
    ['2026-10-02T10:30', 'Analis Harmonisasi', 'analis', 'tindakLanjut', 'TL-004', 'Status tindak lanjut diperbarui', 'Belum ditindaklanjuti', 'Dalam penanganan', 'Kajian pencabutan pasal dimulai'],
    ['2026-09-28T16:00', 'Analis Harmonisasi', 'analis', 'provinsi', 'jabar', 'Kurasi profil provinsi selesai', 'Dalam kurasi · v2', 'Selesai dikurasi · v3', 'Checklist lengkap'],
    ['2026-09-10T15:00', 'Analis Harmonisasi', 'analis', 'penilaian', 'HP-004', 'Hasil penilaian diverifikasi', 'Menunggu verifikasi · v2', 'Terverifikasi · v2', 'Pertimbangan & bukti lengkap'],
    ['2026-07-15T09:00', 'Analis Utama', 'approver', 'kriteria', 'Versi B', 'Kriteria penilaian ditetapkan', 'Versi B-0', 'Versi B', 'Penambahan kriteria sasaran pembangunan'],
    ['2026-07-01T09:00', 'Analis Utama', 'approver', 'masterSektor', 'Versi A', 'Master sektor ditetapkan', 'Versi A-0 (KBLI 2020)', 'Versi A (KBLI 2025)', 'Peraturan BPS No. 7 Tahun 2025 berlaku']
  ].map((a, i) => ({ id: 'AU-' + pad(i + 1, 4), at: a[0], aktor: a[1], peran: a[2], ent: a[3], obj: a[4], aksi: a[5], sebelum: a[6], sesudah: a[7], alasan: a[8], uc: 'harmonisasi' }));

  const D = window.BO_DATA = window.BO_DATA || {};
  D.harmonisasi = {
    meta: { acuan: '2026-10-16', diperbarui: '16 Okt 2026, 06.00 WIB', label: 'Data simulasi · per 16 Oktober 2026' },
    modul: modul, sektor: sektor, jenisIndikasi: jenisIndikasi, statusTL: statusTL, provinsi38: provinsi38,
    metaWajib: metaWajib, buktiWajib: buktiWajib, checklistProvinsi: checklistProvinsi,
    regulasi: regulasi, penilaian: penilaian, klasifikasi: klasifikasi, tindakLanjut: tindakLanjut,
    provinsi: provinsi, keluaranAI: keluaranAI, cms: cms, audit: audit
  };
})();

# Backoffice Sitroom · Harmonisasi Investasi (Vercel)
**Badan Teknologi, Data dan Informasi — Kementerian Sekretariat Negara Republik Indonesia**

Prototipe backoffice statis (HTML + JS, tanpa build step) untuk use case **Harmonisasi Investasi**, mengikuti struktur dan gaya **Backoffice Sitroom** (`sitroom-dashboard-id.vercel.app/backoffice`). Semua use case dibungkus dalam satu backoffice; analis melihat backoffice untuk use case-nya. Di prototipe ini hanya **Harmonisasi** yang berisi; use case lain tampil sebagai daftar (terkunci).

Seluruh data adalah **simulasi**. Perubahan tersimpan di `localStorage` peramban.

**Login demo:** username `admin`, password `admin`.

---

## 🧭 Struktur Menu (sama dengan Backoffice Sitroom)

| Grup | Menu | Isi untuk Harmonisasi |
|---|---|---|
| — | **Dashboard** | Perlu Tindakan (Untuk saya/Semua), Status Pengajuan Saya, Use Case Saya, tabel Dashboard Presiden |
| AI Center | **Workspace** › Harmonisasi | Sub-menu per use case: |
| | · Dashboard | Perlu Tindakan, Tayang di Dashboard Presiden, Aktivitas Tim, Kesegaran Data (donut) |
| | · Widget | 30+ widget dari 5 modul dashboard (KPI, Insight, Peta, Tabel); tab Active/Draft/Approval/Archived; Widget Baru; detail + pratinjau |
| | · Early Warning System | EWS Kritis/Peringatan/Informasi; review per bagian (4 bagian + daftar periksa); Approval; Topik pantauan |
| | · Data Source | Regulasi (JDIH), realisasi BKPM, OSS RBA, PDRB, penduduk, pergerakan, migrasi, PIR, temuan; detail tabel mentah; Unggah Data Baru (3 langkah) |
| | · AI Training Center | Obrolan dengan jawaban simulasi + rujukan; Data Knowledge |
| | **Dashboard Management** | Daftar dashboard semua use case; Harmonisasi: versi Live/Draft, komposisi widget per modul, ajukan → setujui publikasi |
| | **Approvals** | Antrean lintas jenis (Dashboard, Widget, Data Source, EWS, Narasi AI) + riwayat keputusan |
| Operation | **Harmonisasi** | Halaman kerja khusus Harmonisasi (indikator BO-01 s.d. BO-15): Ringkasan, Verifikasi Penilaian, Koleksi Regulasi, Klasifikasi Sektor, Tindak Lanjut, Kurasi Profil Provinsi, Tinjauan Narasi AI, CMS (Master Sektor & Kriteria, Ambang Batas, Lapisan Peta, Penayangan), Audit Trail, Notifikasi |
| User | **User Management**, **Role & Permission** | Daftar pengguna Harmonisasi; matriks hak Analyst vs Approver |

Menu pengguna (pojok kanan atas): ganti peran **Analyst/Approver**, Notifikasi, Audit Trail, tema, Keluar. Tombol bulan di header mengganti tema **gelap (bawaan) / terang**.

## 📁 Struktur Proyek

```
backoffice-harmonisasi-vercel/
├── index.html                 # Shell: login, header, sidebar global, kolom Workspace, router hash, host iframe
├── assets/
│   ├── bo-theme.css           # Token warna Sitroom (gelap/terang) + komponen; dipakai semua halaman
│   ├── bo-store.js            # State bersama (localStorage), peran, tema, sesi login demo, audit
│   ├── bo-ui.js               # Ikon, render ulang halaman, logika Workspace (Perlu Tindakan, approvals, kesegaran)
│   ├── bo-usecases.js         # Menu Operation › Harmonisasi
│   ├── uc-harmonisasi.js      # Rumus indikator BO-01 s.d. BO-15, label audit
│   └── dc-runtime.js, react*  # Runtime halaman Operation (sama dengan dashboard)
├── data/
│   ├── harmonisasi-data.js    # Data Operation (regulasi, penilaian, klasifikasi, narasi AI, CMS, audit)
│   └── harmonisasi-ws.js      # Data Workspace (katalog use case, widget, EWS, data source, knowledge, versi)
└── pages/
    ├── app/                   # dashboard, dm, dm-detail, approvals, users, roles
    ├── ws/                    # dashboard, widgets, widget, ews, ews-detail, ews-topik, data-source,
    │                          # data-detail, unggah, assistant, knowledge, segera (use case lain)
    ├── harmonisasi/           # 11 halaman Operation › Harmonisasi
    └── shared/                # audit.html, notifikasi.html
```

## 🔗 Tautan Langsung (hash)

- `/#dashboard`, `/#approvals`, `/#dashboard-management/harmonisasi`
- `/#workspace/harmonisasi`, `/#workspace/harmonisasi/widgets/hrm-sebaran-puu`, `/#workspace/harmonisasi/ews/ews-perda-kudus`, `/#workspace/harmonisasi/data-source/oss`, `/#workspace/harmonisasi/assistant`
- `/#harmonisasi/verifikasi`, `/#harmonisasi/narasi-ai/AI-001`, `/#harmonisasi/audit`

## 🔁 Alur & Peran

- **Analyst**: review EWS (tandai 4 bagian, revisi isi), buat/sunting widget lalu ajukan, unggah data source, buat draft dashboard, kerjakan antrean Operation.
- **Approver**: setujui/tolak EWS, widget, data source, narasi AI, dan publikasi versi dashboard (alasan wajib saat menolak).
- Setiap aksi tercatat di **Audit Trail** dan muncul di **Aktivitas Tim**. Tombol **Atur ulang data simulasi** di bawah sidebar mengembalikan data awal.

## 🛠️ Menjalankan Secara Lokal

```bash
python -m http.server 3000
# atau
npx serve .
```

Buka `http://localhost:3000` (harus lewat server HTTP, bukan `file://`).

## 🌐 Deploy di Vercel

Framework Preset **Other**, Build Command kosong, Output Directory `.`. Bisa juga `npx vercel --prod`. `vercel.json` sudah memuat security headers, `noindex`, dan aturan cache.

# Backoffice Dashboard Presiden · Harmonisasi Investasi (Vercel)
**Badan Teknologi, Data dan Informasi — Kementerian Sekretariat Negara Republik Indonesia**

Prototipe backoffice statis (HTML + JS, tanpa build step) untuk mengelola konten Dashboard Presiden. Satu backoffice menampung beberapa use case, sama seperti dashboard: **Eksekutif**, **Ekonomi**, dan **Harmonisasi Investasi**. Saat ini hanya Harmonisasi Investasi yang dibangun penuh; dua use case lainnya tampil sebagai "Segera".

Backoffice ini **tidak terhubung** ke `harmonisasi-investasi-vercel`. Istilah, modul, dan data contohnya diselaraskan dengan dashboard, tetapi seluruh data adalah simulasi.

Acuan isi: **Back Office 2026.html** (indikator operasional BO-01 s.d. BO-15, KAK 2026). Pola antarmuka mengikuti Backoffice Eksekutif.

---

## 📁 Struktur Proyek

```
backoffice-harmonisasi-vercel/
├── index.html                    # Shell: header, pemilih use case, peran, sidebar, router hash, host iframe
├── assets/
│   ├── dc-runtime.js, react*.js  # Runtime yang sama dengan dashboard (disalin, bukan ditautkan)
│   ├── inter.css                 # Tipografi Inter (sama dengan dashboard)
│   ├── bo-theme.css              # Komponen halaman: kartu KPI, tabel, pill status, tombol, form, timeline
│   ├── bo-store.js               # State bersama (localStorage): patch data, audit, peran, notifikasi
│   ├── bo-usecases.js            # Registry use case & menu sidebar
│   └── uc-harmonisasi.js         # Logika domain + rumus indikator BO-01 s.d. BO-15
├── data/
│   └── harmonisasi-data.js       # Data contoh (mock), siap diganti respons API dengan struktur sama
└── pages/
    ├── harmonisasi/              # 11 halaman use case Harmonisasi Investasi
    └── shared/                   # audit.html, notifikasi.html, segera.html (lintas use case)
```

## 🧭 Menu Harmonisasi ↔ Indikator Back Office 2026

| Grup | Halaman | Indikator | Konten dashboard yang dikelola |
|---|---|---|---|
| Ruang Kerja Analis | Ringkasan | semua | Ringkasan antrean & aktivitas |
| | Verifikasi Penilaian | BO-01, BO-02, BO-03 | Modul 5 · temuan & dasar penilaian |
| | Koleksi Regulasi | BO-04, BO-05 | Modul 1 · daftar regulasi & metadata resmi |
| | Klasifikasi Sektor | BO-06, BO-07 | KBLI 2025 untuk grafik sektor |
| | Tindak Lanjut | BO-08 | Modul 5 · status, PIC, riwayat |
| | Kurasi Profil Provinsi | BO-09 | Modul 2 & 3 · profil & indikator kesiapan |
| | Tinjauan Narasi AI | BO-10, BO-11 | Ringkasan, Poin Penting, Dampak, Saran untuk Presiden |
| CMS Harmonisasi | Master Sektor & Kriteria | BO-12 | Master sektor & kriteria penilaian (berversi) |
| | Ambang Batas Peringatan | BO-13 | Ambang EWS. Kosong sampai ditetapkan, tanpa angka karangan |
| | Lapisan Peta & Indikator | BO-14 | Layer peta, sumber, cakupan, periode |
| | Penayangan Analisis | BO-15 | Status/versi tayang per provinsi & sektor |
| Administrasi | Audit Trail · Notifikasi | – | Lintas use case |

Nilai awal semua indikator sama dengan kolom "Contoh nilai — ILUSTRASI" pada guideline (20; 80%; 90%; 600; 95%; 15; 85%; 90%; 80%; 12; 100%). Nilai tersebut berubah ketika analis bertindak. Setiap kartu menampilkan rumus dan "cara membaca" dari guideline.

## 🔁 Alur & Peran

- **Peran simulasi** dapat diganti di header: *Analis* atau *Approver*.
- Narasi AI: **Menunggu tinjauan → Menunggu persetujuan → Tayang → Ditarik**. Hasil asli AI tetap read-only, dan setiap suntingan disimpan sebagai versi baru. Konten hanya tayang bila versi yang disetujui sama dengan versi terkini (BO-11).
- Hitungan antrean selalu memakai **versi terbaru**. Membuka ulang verifikasi atau kurasi akan menaikkan versi.
- Setiap aksi tercatat di **Audit Trail** (aktor, peran, waktu, objek, sebelum → sesudah, alasan). Aksi oleh peran lain atau oleh sistem muncul sebagai **Notifikasi**.
- Perubahan disimpan di `localStorage` peramban (kunci `bo.sim.v1`). Gunakan tombol **Atur ulang data simulasi** di sidebar untuk kembali ke data awal.

## 🔗 Tautan Langsung (hash)

- `/#harmonisasi/overview`, `/#harmonisasi/verifikasi`, `/#harmonisasi/narasi-ai/AI-001`, dst.
- Filter dari kartu KPI: `/#harmonisasi/verifikasi/f:menunggu`, `/#harmonisasi/regulasi/f:kurang`
- Use case lain: `/#eksekutif`, `/#ekonomi`

## ➕ Menambah Use Case

1. Lengkapi entri use case di `assets/bo-usecases.js` (grup menu) dan ubah `status` menjadi `aktif`.
2. Buat `data/<key>-data.js` yang mengisi `window.BO_DATA.<key>`.
3. Buat `assets/uc-<key>.js` (label, indikator, badge sidebar) dengan pola `uc-harmonisasi.js`.
4. Buat halaman di `pages/<key>/`, lalu muat file data/uc tersebut di `index.html` dan di halaman shared.

## 🛠️ Menjalankan Secara Lokal

```bash
python -m http.server 3000
# atau
npx serve .
```

Buka `http://localhost:3000`. Halaman perlu dibuka lewat server HTTP, bukan `file://`, agar iframe dan localStorage satu origin.

## 🌐 Deploy di Vercel

Framework Preset **Other**, Build Command kosong, Output Directory `.`. Bisa juga dengan `npx vercel --prod`. `vercel.json` sudah memuat security headers, `noindex`, dan aturan cache.

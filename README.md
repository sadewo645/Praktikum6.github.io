# IoT Neon Dashboard (React + Vite)

Dashboard monitoring sensor berbasis Google Apps Script + Google Sheet dengan tampilan dark futuristic neon glow.

## Fitur utama
- UI premium dark mode + glow effect + glassmorphism
- Summary card: total data, ADC terbaru, kelembaban terbaru, status terbaru
- Grafik tren ADC, tren kelembaban, dan distribusi status
- Tabel data terbaru (sorting newest first)
- Filter status dan rentang tanggal
- Export CSV
- Notifikasi jika status terbaru `warning` / `bahaya`
- Loading skeleton, empty state, error state
- Auto refresh default 15 detik

## Struktur project

```bash
.
├── docs/
│   └── apps-script.gs         # Backend Google Apps Script (insert + getData)
├── src/
│   ├── components/
│   │   ├── ChartsPanel.jsx
│   │   ├── DataTable.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── StatusBadge.jsx
│   │   └── SummaryCard.jsx
│   ├── services/
│   │   └── api.js             # Fetch + normalisasi data API
│   ├── utils/
│   │   └── format.js          # Formatter tanggal, status class, export CSV
│   ├── App.jsx
│   ├── config.js              # Endpoint dan interval refresh
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── index.html
├── package.json
└── tailwind.config.js
```

## A. Backend Google Apps Script (versi diperbaiki)
Gunakan file `docs/apps-script.gs`.

### Mode API
1. **Insert data**
   - Trigger jika ada salah satu parameter `adc`, `kelembaban`, `status`
   - Atau explicit: `?mode=insert&adc=...&kelembaban=...&status=...`

2. **Get data JSON**
   - Trigger jika tidak ada parameter input
   - Atau explicit: `?mode=getData`

### Contoh URL
- Insert:
  - `https://script.google.com/macros/s/AKfycbwQ68p78OrkbVzLWX9sfZN7k7bZ6Isjps3EI8HvFMwKrT9kjXs-s6Dk74SyOWNvU9CN/exec?adc=640&kelembaban=57&status=warning`
- Get data:
  - `https://script.google.com/macros/s/AKfycbwQ68p78OrkbVzLWX9sfZN7k7bZ6Isjps3EI8HvFMwKrT9kjXs-s6Dk74SyOWNvU9CN/exec?mode=getData`

### Format response JSON getData
```json
{
  "success": true,
  "mode": "getData",
  "meta": {
    "total": 120,
    "generatedAt": "2026-04-13T08:00:00.000Z",
    "sheet": "DataSensor"
  },
  "data": [
    {
      "waktu": "2026-04-13T07:59:00.000Z",
      "adc": 640,
      "kelembaban": 57,
      "status": "warning"
    }
  ]
}
```

> Catatan CORS: Web App Apps Script umumnya bisa diakses frontend publik via `fetch` GET jika deploy sebagai **Anyone**. Jika frontend Anda domain-restricted dan butuh header CORS kustom, letakkan proxy backend tambahan (Cloud Functions / Worker) karena Apps Script terbatas untuk custom response header murni.

## B. Frontend lengkap
Sudah tersedia pada folder `src/`.

## C. Integrasi frontend-backend
1. Frontend memanggil endpoint:
   - `${VITE_APP_SCRIPT_URL}?mode=getData`
2. Parser aman di `src/services/api.js`:
   - normalisasi `waktu`, `adc`, `kelembaban`, `status`
   - fallback bila payload berupa array langsung
3. Data diurutkan terbaru di atas.
4. `App.jsx` menampilkan summary + charts + tabel + filter + export.

## D. Langkah deploy

### 1) Deploy Google Apps Script
1. Buka Apps Script project Anda.
2. Ganti kode dengan isi `docs/apps-script.gs`.
3. **Deploy > New deployment > Web app**.
4. Execute as: **Me**.
5. Who has access: **Anyone** (atau sesuai kebutuhan).
6. Simpan URL `/exec` hasil deploy.

### 2) Jalankan frontend
```bash
npm install
cp .env.example .env
# edit .env dan isi VITE_APP_SCRIPT_URL
npm run dev
```

### 3) Build production
```bash
npm run build
npm run preview
```

### 4) Deploy frontend
- Bisa ke Vercel/Netlify/GitHub Pages.
- Pastikan environment variable `VITE_APP_SCRIPT_URL` di-set ke URL Web App Apps Script terbaru.

## Cara mengganti endpoint jika URL Apps Script berubah
1. Update `.env`:
   - `VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/NEW_ID/exec`
2. Rebuild app (`npm run build`) lalu redeploy.

## Catatan kualitas
- Tidak ada hardcoded data dummy.
- Seluruh data realtime dari endpoint Apps Script.
- Arsitektur modular dan mudah dirawat.

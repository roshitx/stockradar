# Panduan Konfigurasi Google OAuth Supabase untuk StockRadar

Dokumen ini menjelaskan langkah-langkah untuk mengkonfigurasi autentikasi Google OAuth di Supabase untuk aplikasi StockRadar.

## 1. Google Cloud Console Setup

Ikuti langkah-langkah berikut di [Google Cloud Console](https://console.cloud.google.com):

1. **Buat Proyek Baru**: Jika belum ada, buat proyek baru di Google Cloud Console.
2. **Configure OAuth Consent Screen**:
   - Buka menu **APIs & Services > OAuth consent screen**.
   - Pilih User Type **External**.
   - Isi informasi aplikasi yang diperlukan (App name, User support email, Developer contact info).
   - Klik **Save and Continue** sampai selesai.
3. **Buat OAuth Client ID**:
   - Buka menu **APIs & Services > Credentials**.
   - Klik **Create Credentials** dan pilih **OAuth client ID**.
   - Pilih Application type: **Web application**.
   - Masukkan nama Client (misal: `StockRadar Auth`).
   - Tambahkan **Authorized redirect URIs**. Anda bisa mendapatkan URL ini dari Supabase Dashboard (lihat bagian selanjutnya). Formatnya adalah: `https://[PROJECT_REF].supabase.co/auth/v1/callback`.
   - Klik **Create**.
4. **Catat Credentials**: Simpan **Client ID** dan **Client Secret** yang muncul.

## 2. Supabase Dashboard Configuration

Konfigurasi provider Google di [Supabase Dashboard](https://supabase.com/dashboard):

1. Buka proyek Supabase Anda.
2. Navigasi ke menu **Authentication > Providers**.
3. Temukan dan klik provider **Google**.
4. Aktifkan (Toggle ON) **Enable Google provider**.
5. Isi **Client ID** dan **Client Secret** yang didapatkan dari Google Cloud Console.
6. Copy **Redirect URL** yang disediakan oleh Supabase dan masukkan ke dalam **Authorized redirect URIs** di Google Cloud Console jika belum dilakukan.
7. Klik **Save**.

## 3. Environment Variables

Pastikan file `.env.local` Anda memiliki variabel lingkungan berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Ganti nilai di atas dengan URL dan Anon Key yang bisa ditemukan di **Project Settings > API** pada Supabase Dashboard.

## Troubleshooting

- **Error: redirect_uri_mismatch**: Pastikan URL callback di Google Cloud Console sama persis dengan yang ada di Supabase Dashboard.
- **Error: Access Blocked**: Pastikan OAuth Consent Screen sudah di-publish atau email pengetes sudah didaftarkan jika masih dalam mode Testing.
- **Local Development**: Untuk development lokal, pastikan redirect URL di logic aplikasi mengarah ke `http://localhost:3000/auth/callback`.

# Ice Breaking Tebak Gambar SENASTIK 2026 — Firebase edition

## File
- `index.html`: halaman permainan
- `style.css`: tampilan
- `script.js`: soal, Firebase, penyimpanan skor, leaderboard
- `firestore.rules`: aturan awal Firestore

## 1. Lengkapi konfigurasi Firebase
Buka `script.js`, cari `const firebaseConfig`, lalu ganti placeholder:
- `apiKey`
- `storageBucket`
- `messagingSenderId`
- `appId`

Ambil nilainya dari Firebase Console → Project settings → Your apps → SDK setup and configuration → Config. Project ID dan authDomain sudah diisi berdasarkan proyek pengguna; pastikan cocok dengan console.

## 2. Aktifkan Anonymous Authentication
Firebase Console → Build → Authentication → Get started → Sign-in method → Anonymous → Enable → Save.

## 3. Pasang Firestore Rules
Firebase Console → Firestore Database → Rules. Ganti isi rules dengan isi `firestore.rules`, lalu klik Publish.

Rules ini membolehkan publik membaca leaderboard dan user anonim mengirim dokumen skor baru saja. Update dan delete ditolak. Namun skor masih dihitung di browser, sehingga orang yang paham JavaScript bisa memalsukan skor. Ini cocok untuk ice-breaking nonkompetitif, bukan kompetisi berhadiah/penilaian resmi. Untuk skor resmi, validasi jawaban dan skor di backend tepercaya (misalnya Cloud Functions/Cloud Run) dan batasi submit per sesi.

## 4. Jalankan dan uji
Jalankan melalui VS Code Live Server atau situs GitHub Pages (gunakan HTTPS). Modul Firebase berbasis CDN perlu koneksi internet.
Uji: masukkan nama → mainkan sampai selesai → pastikan status skor berhasil dikirim → buka halaman dari browser lain untuk melihat leaderboard.

## 5. Publikasikan perubahan ke GitHub
Upload/commit file `index.html`, `style.css`, `script.js`, dan `firestore.rules` ke repository. `firestore.rules` adalah file referensi; rules juga harus dipublikasikan melalui Firebase Console secara terpisah.

## Catatan
Firebase Web config bukan rahasia server, tetapi jangan pernah memasukkan service-account key atau kredensial admin ke file web. Pantau pemakaian dan batas gratis Firebase.

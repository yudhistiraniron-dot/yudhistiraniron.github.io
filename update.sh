#!/bin/bash

echo "=========================================="
echo "  MEMULAI SINKRONISASI & UPDATE PORTOFOLIO"
echo "=========================================="

# 1. Cek status git
git status

# 2. Amankan perubahan lokal dengan git stash (mencegah error unstaged changes)
echo -e "\n[1/5] Menyimpan perubahan lokal sementara (stash)..."
git stash

# 3. Tarik update terbaru dari GitHub dengan rebase (mencegah error non-fast-forward)
echo -e "\n[2/5] Mengambil data terbaru dari GitHub..."
git pull origin main --rebase

# 4. Kembalikan perubahan lokal yang tadi disimpan
echo -e "\n[3/5] Mengembalikan perubahan lokal..."
git stash pop

# 5. Tambahkan seluruh file yang diubah
echo -e "\n[4/5] Menyiapkan file untuk dikirim (git add)..."
git add .

# 6. Minta pesan commit otomatis atau gunakan default
read -p "Masukkan pesan commit (tekan Enter untuk default 'Update mandiri'): " commit_msg
if [ -z "$commit_msg" ]; then
  commit_msg="Update mandiri portofolio"
fi

git commit -m "$commit_msg" || echo "Tidak ada file baru yang perlu di-commit."

# 7. Kirim ke GitHub
echo -e "\n[5/5] Mengirim perubahan ke GitHub (git push)..."
git push origin main

echo "=========================================="
echo "  SELESAI! SITUS ANDA SUKSES DISINKRONKAN"
echo "=========================================="
import os
import json
from PIL import Image

# Folder tempat Anda menyimpan 46 karya
IMAGE_FOLDER = "KARYA"
OUTPUT_JSON = "content/gallery.json"

# Buat folder jika belum ada
os.makedirs("content", exist_ok=True)
os.makedirs(IMAGE_FOLDER, exist_ok=True)

valid_extensions = (".jpg", ".jpeg", ".png", ".webp", ".gif")
gallery_items = []

print("Memulai pemindaian gambar otomatis...")

for filename in sorted(os.listdir(IMAGE_FOLDER)):
    if filename.lower().endswith(valid_extensions):
        filepath = os.path.join(IMAGE_FOLDER, filename)
        
        try:
            with Image.open(filepath) as img:
                width, height = img.size
                
                # Deteksi rasio otomatis berdasarkan ukuran asli piksel
                ratio = width / height
                if ratio > 1.15:
                    orientation = "landscape"
                elif ratio < 0.85:
                    orientation = "portrait"
                else:
                    orientation = "square"
                
                # Bersihkan nama file untuk dijadikan judul otomatis
                clean_title = os.path.splitext(filename)[0].replace("-", " ").replace("_", " ").title()
                
                gallery_items.append({
                    "title": clean_title,
                    "image": f"{IMAGE_FOLDER}/{filename}",
                    "orientation": orientation,
                    "width": width,
                    "height": height,
                    "badge": "Artwork",
                    "description": ""
                })
                print(f"[BERHASIL] {filename} -> {orientation} ({width}x{height})")
        except Exception as e:
            print(f"[ERROR] Gagal membaca {filename}: {e}")

# Simpan ke JSON
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump({"items": gallery_items}, f, indent=2, ensure_ascii=False)

print(f"\nSelesai! Total {len(gallery_items)} karya berhasil dicatat ke '{OUTPUT_JSON}'.")
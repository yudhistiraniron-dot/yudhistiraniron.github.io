document.addEventListener("DOMContentLoaded", () => {
  loadHomeData();
});

async function loadHomeData() {
  try {
    const response = await fetch("content/home.json");
    if (!response.ok) return;
    const data = await response.json();

    // 1. Render Gambar Utama Hero (Portrait Samping)
    const heroImgEl = document.getElementById("home-hero-img") || document.querySelector("#hero .hero-featured-image img");
    if (heroImgEl && data.hero_image) {
      heroImgEl.src = data.hero_image;
    }

    // 2. Render 5 Etalase Karya di Bawah Beranda
    const showcaseContainer = document.getElementById("showcase-container") || document.querySelector("#portfolio-highlights .projects-list");
    if (showcaseContainer && data.showcase_items && data.showcase_items.length > 0) {
      showcaseContainer.innerHTML = ""; // Bersihkan placeholder lama

      data.showcase_items.forEach((item) => {
        const article = document.createElement("article");
        article.className = `project-card orientation-${item.orientation || "landscape"}`;

        article.innerHTML = `
          <figure>
            <img src="${item.image}" alt="${item.title || "Artwork"}" loading="lazy">
          </figure>
          <div class="project-info">
            ${item.badge ? `<span class="badge">${item.badge}</span>` : ""}
            ${item.title ? `<h3><a href="portfolio.html">${item.title}</a></h3>` : ""}
            ${item.description ? `<p class="project-excerpt">${item.description}</p>` : ""}
          </div>
        `;
        showcaseContainer.appendChild(article);
      });
    }
  } catch (error) {
    console.error("Gagal memuat data home.json:", error);
  }

  const fs = require('fs');
const path = require('path');

const imageDir = './KARYA'; // Ganti dengan nama folder karya Anda
const outputJson = './content/gallery.json';

const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

if (!fs.existsSync('content')) {
  fs.mkdirSync('content', { recursive: true });
}

console.log("Memindai folder karya...");

fs.readdir(imageDir, (err, files) => {
  if (err) {
    console.error("Gagal membaca folder (pastikan nama folder sudah benar):", err);
    return;
  }

  const galleryItems = files
    .filter(file => validExtensions.includes(path.extname(file).toLowerCase()))
    .map(file => {
      const cleanTitle = path.basename(file, path.extname(file))
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      return {
        title: cleanTitle,
        image: `${imageDir}/${file}`,
        orientation: "landscape", // Default aman
        badge: "Artwork",
        description: ""
      };
    });

  fs.writeFileSync(outputJson, JSON.stringify({ items: galleryItems }, null, 2), 'utf-8');
  console.log(`Selesai! Total ${galleryItems.length} karya berhasil dicatat ke '${outputJson}'.`);
});
}
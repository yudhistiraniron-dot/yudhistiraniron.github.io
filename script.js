document.addEventListener("DOMContentLoaded", () => {
  // Jalankan pemuatan data sesuai halaman
  if (document.getElementById("gallery-container")) {
    loadGalleryData();
  }
  if (document.querySelector("#hero")) {
    loadHomeData();
  }
});

// Fungsi memuat data untuk gallery.html
async function loadGalleryData() {
  const container = document.getElementById("gallery-container");
  if (!container) return;

  try {
    const response = await fetch("content/gallery.json");
    if (!response.ok) throw new Error("Gagal mengambil file gallery.json");
    
    const data = await response.json();
    container.innerHTML = ""; // Bersihkan placeholder

    data.items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "gallery-card";

      // Sesuaikan penentuan kelas orientasi
      let aspectClass = "aspect-landscape";
      if (item.orientation === "portrait") aspectClass = "aspect-vertical";
      else if (item.orientation === "square") aspectClass = "aspect-square";

      card.innerHTML = `
        <figure class="card-media ${aspectClass}">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </figure>
        <div class="card-caption">
          <span class="card-tag">${item.badge || "Artwork"}</span>
          <h3>${item.title}</h3>
          ${item.width && item.height ? `<p class="card-meta">${item.width}×${item.height} px</p>` : ""}
          ${item.description ? `<p class="card-excerpt">${item.description}</p>` : ""}
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading gallery:", error);
    container.innerHTML = `<p style="color: var(--color-sand);">Gagal memuat arsip karya.</p>`;
  }
}

// Fungsi memuat data untuk index.html (Home)
async function loadHomeData() {
  try {
    const response = await fetch("content/home.json");
    if (!response.ok) return;
    const data = await response.json();

    const heroImgEl = document.getElementById("home-hero-img") || document.querySelector("#hero .hero-featured-image img");
    if (heroImgEl && data.hero_image) {
      heroImgEl.src = data.hero_image;
    }

    const showcaseContainer = document.getElementById("showcase-container") || document.querySelector("#portfolio-highlights .projects-list");
    if (showcaseContainer && data.showcase_items && data.showcase_items.length > 0) {
      showcaseContainer.innerHTML = "";

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

  // Contoh cuplikan render kartu galeri di frontend web Anda
itemHtml = `
  <a href="${item.external_link || '#'}" target="_blank" class="gallery-card">
    <img src="${item.image}" alt="${item.title}">
    <div class="card-info">
      <span class="badge">${item.badge}</span>
      <h3>${item.ai_title_suggestion}</h3>
      <p class="temporary-title">Judul Arsip: ${item.title}</p>
      <p>${item.description}</p>
    </div>
  </a>
`;
}
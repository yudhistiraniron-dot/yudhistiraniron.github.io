document.addEventListener("DOMContentLoaded", () => {
  // Jalankan pemuatan data sesuai elemen yang ada di halaman
  if (document.getElementById("gallery-container")) {
    loadGalleryData();
  }
  if (document.querySelector("#hero")) {
    loadHomeData();
  }
});

// 1. Fungsi memuat data untuk gallery.html
async function loadGalleryData() {
  const container = document.getElementById("gallery-container");
  if (!container) return;

  try {
    const response = await fetch("content/gallery.json");
    if (!response.ok) throw new Error("Gagal mengambil file gallery.json");
    
    const data = await response.json();
    container.innerHTML = ""; // Bersihkan placeholder

    // Tangani jika data.items ada
    const items = data.items || data;

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "gallery-card";

      // Penentuan kelas orientasi gambar
      let aspectClass = "aspect-landscape";
      if (item.orientation === "portrait") aspectClass = "aspect-vertical";
      else if (item.orientation === "square") aspectClass = "aspect-square";

      // Gunakan rekomendasi judul AI jika ada, atau gunakan judul bawaan/sementara
      const displayTitle = item.ai_title_suggestion || item.title || "Tanpa Judul";
      const cardContent = `
        <figure class="card-media ${aspectClass}">
          <img src="${item.image}" alt="${displayTitle}" loading="lazy">
        </figure>
        <div class="card-caption">
          <span class="card-tag">${item.badge || "Artwork"}</span>
          <h3>${displayTitle}</h3>
          ${item.title && item.ai_title_suggestion ? `<p class="temporary-title" style="font-size: 0.8em; opacity: 0.7;">Arsip: ${item.title}</p>` : ""}
          ${item.width && item.height ? `<p class="card-meta">${item.width}×${item.height} px</p>` : ""}
          ${item.description ? `<p class="card-excerpt">${item.description}</p>` : ""}
        </div>
      `;

      // Jika ada tautan eksternal (misal artikel Floresa), bungkus dengan tautan <a>
      if (item.external_link) {
        card.innerHTML = `<a href="${item.external_link}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">${cardContent}</a>`;
      } else {
        card.innerHTML = cardContent;
      }

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading gallery:", error);
    container.innerHTML = `<p style="color: var(--color-sand);">Gagal memuat arsip karya.</p>`;
  }
}

// 2. Fungsi memuat data untuk index.html (Home)
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
  document.addEventListener("DOMContentLoaded", () => {
  
  // --- 1. LOGIKA MENU NAVIGASI MOBILE (HP) ---
  const menuToggle = document.querySelector('.menu-toggle'); // Sesuaikan class tombol menu Anda
  const navMenu = document.querySelector('.nav-menu');       // Sesuaikan class kontainer menu Anda

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // --- 2. LOGIKA PEMUATAN GALERI KARYA ---
  const galleryWrapper = document.getElementById('gallery-wrapper');

  // Jalankan logika galeri HANYA jika halaman memiliki elemen #gallery-wrapper
  if (galleryWrapper) {
    fetch('content/gallery.json')
      .then(response => response.json())
      .then(data => {
        galleryWrapper.innerHTML = ''; // Bersihkan kontainer

        // Filter unik berdasarkan ID agar tidak ada duplikasi
        const uniqueItems = Array.from(new Map(data.items.map(item => [item.id, item])).values());

        const landscapeItems = uniqueItems.filter(item => item.orientation === 'landscape');
        const squareItems = uniqueItems.filter(item => item.orientation === 'square');
        const portraitItems = uniqueItems.filter(item => item.orientation === 'portrait');

        function renderGroup(items, gridClass, titleText) {
          if (items.length === 0) return;

          const section = document.createElement('section');
          section.className = 'gallery-section';
          
          let html = `<div class="gallery-grid ${gridClass}">`;
          
          items.forEach(item => {
            html += `
              <div class="gallery-card" id="${item.id}">
                <div class="img-wrapper">
                  <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="card-info">
                  <h3>${item.ai_title_suggestion || item.title}</h3>
                  <span class="badge">${item.badge}</span>
                  <p>${item.description}</p>
                </div>
              </div>
            `;
          });

          html += `</div>`;
          section.innerHTML = html;
          galleryWrapper.appendChild(section);
        }

        renderGroup(landscapeItems, 'landscape-grid', 'Landscape Works');
        renderGroup(squareItems, 'square-grid', 'Square Works');
        renderGroup(portraitItems, 'portrait-grid', 'Portrait Works');
      })
      .catch(err => console.error("Gagal memuat galeri:", err));
  }
});
}
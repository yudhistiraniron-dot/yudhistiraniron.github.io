document.addEventListener("DOMContentLoaded", () => {
  // 1. Inisialisasi Navigasi Mobile (HP)
  initMobileMenu();

  // 2. Jalankan pemuatan data sesuai kontainer halaman yang aktif
  if (document.getElementById("gallery-wrapper") || document.getElementById("gallery-container")) {
    loadGalleryData();
  }

  if (document.getElementById("projects-container")) {
    loadPortfolioData();
  }

  if (document.querySelector("#hero")) {
    loadHomeData();
  }
});

// --- FUNGSI MENU NAVIGASI HP (DIBERSIHKAN & DIPERTINGGI RESPONSIFNYA) ---
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle-btn') || document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.site-nav') || document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      // Menggunakan toggle 'is-open' dan 'active' agar cocok dengan semua aturan CSS
      navMenu.classList.toggle('is-open');
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Menutup menu jika mengeklik di luar area navigasi
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('is-open');
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }
}

// --- FUNGSI LOAD GALLERY (gallery.html) ---
async function loadGalleryData() {
  const galleryWrapper = document.getElementById('gallery-wrapper') || document.getElementById('gallery-container');
  if (!galleryWrapper) return;

  galleryWrapper.innerHTML = '<p style="text-align:center; padding:2rem;">Memuat arsip karya...</p>';

  try {
    const response = await fetch('content/gallery.json');
    if (!response.ok) throw new Error('Gagal mengambil file gallery.json');

    const data = await response.json();
    galleryWrapper.innerHTML = '';

    const rawItems = data.items || data;
    if (!rawItems || rawItems.length === 0) {
      galleryWrapper.innerHTML = '<p style="text-align:center; padding:2rem;">Belum ada karya di galeri.</p>';
      return;
    }

    const visibleItems = rawItems.filter(item => item.is_visible !== false);
    const uniqueItems = Array.from(new Map(visibleItems.map(item => [item.id || item.image, item])).values());

    const gridContainer = document.createElement('div');
    gridContainer.className = 'gallery-flexible-grid';

    uniqueItems.forEach(item => {
      const displayTitle = item.ai_title_suggestion || item.title || "Tanpa Judul";
      const card = document.createElement('div');
      card.className = 'gallery-card';
      card.id = item.id || '';

      card.innerHTML = `
        <div class="img-wrapper">
          <img src="${item.image}" alt="${displayTitle}" loading="lazy">
        </div>
        <div class="card-info">
          <span class="badge">${item.badge || "Artwork"}</span>
          <h3>${displayTitle}</h3>
          ${item.description ? `<p class="single-line-excerpt">${item.description}</p>` : ''}
        </div>
      `;

      card.addEventListener('click', () => {
        openGalleryModal(item, displayTitle);
      });

      gridContainer.appendChild(card);
    });

    galleryWrapper.appendChild(gridContainer);

  } catch (err) {
    console.error("Gagal memuat galeri:", err);
    galleryWrapper.innerHTML = `<p style="text-align:center; color:red; padding:2rem;">Gagal memuat arsip karya.</p>`;
  }
}

// --- FUNGSI LOAD PORTFOLIO OTOMATIS (portfolio.html) ---
async function loadPortfolioData() {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer) return;

  projectsContainer.innerHTML = '<p style="text-align:center; padding:2rem; color: var(--color-sand);">Memuat proyek portofolio...</p>';

  try {
    const response = await fetch('content/gallery.json');
    if (!response.ok) throw new Error('Gagal mengambil file gallery.json');

    const data = await response.json();
    const items = data.items || [];

    // Hanya ambil karya yang dicentang in_portfolio: true dan aktif (is_visible)
    const portfolioItems = items.filter(item => item.in_portfolio === true && item.is_visible !== false);

    if (portfolioItems.length === 0) {
      projectsContainer.innerHTML = '<p style="color: var(--color-sand); padding: 2rem 0; text-align:center;">Belum ada proyek pilihan yang dimasukkan ke Portofolio.</p>';
      return;
    }

    let html = '';
    portfolioItems.forEach((item, index) => {
      const client = item.client || 'Proyek Mandiri / Riset Visual';
      const year = item.year || '2026';
      const role = item.role || 'Visual Artist / Illustrator';
      const medium = item.medium || 'Digital Drawing / Mixed Technique';
      const description = item.description || 'Studi kasus dan dokumentasi eksplorasi karya visual.';
      const displayTitle = item.title || 'Tanpa Judul';

      html += `
        <article class="project-item" id="project-${item.id}">
          <div class="project-media">
            <figure>
              <img src="${item.image}" alt="${displayTitle}" loading="lazy">
            </figure>
          </div>

          <div class="project-details">
            <span class="badge">${item.badge || 'Portfolio Project'}</span>
            <h2>${displayTitle}</h2>
            
            <ul class="project-meta">
              <li><strong>Klien / Media:</strong> ${client}</li>
              <li><strong>Tahun:</strong> ${year}</li>
              <li><strong>Peran:</strong> ${role}</li>
              <li><strong>Medium:</strong> ${medium}</li>
            </ul>

            <div class="project-description">
              <p>${description}</p>
            </div>
          </div>
        </article>
        ${index < portfolioItems.length - 1 ? '<hr>' : ''}
      `;
    });

    projectsContainer.innerHTML = html;

  } catch (err) {
    console.error("Gagal memuat portofolio:", err);
    projectsContainer.innerHTML = `<p style="text-align:center; color:red; padding:2rem;">Gagal memuat data portofolio.</p>`;
  }
}

// FUNGSI POP-UP MODAL BACA LENGKAP
function openGalleryModal(item, title) {
  let modal = document.getElementById('gallery-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.className = 'lightbox-modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal" onclick="closeGalleryModal()">&times;</button>
      <div class="modal-body">
        <div class="modal-image-container">
          <img src="${item.image}" alt="${title}">
        </div>
        <div class="modal-text-container">
          <span class="badge">${item.badge || "Artwork"}</span>
          <h2>${title}</h2>
          <hr style="margin: 1rem 0; border-color: var(--border-sand-faint);">
          <div class="full-description">
            <p>${item.description || "Tidak ada deskripsi tambahan."}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeGalleryModal();
  });
}

function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// --- FUNGSI LOAD HOME (index.html) ---
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
}
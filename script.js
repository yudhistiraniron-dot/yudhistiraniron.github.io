document.addEventListener("DOMContentLoaded", () => {
  // 1. Inisialisasi Navigasi Mobile (HP)
  initMobileMenu();

  // 2. Jalankan pemuatan data sesuai kontainer yang ada di halaman
  if (document.getElementById("gallery-wrapper") || document.getElementById("gallery-container")) {
    loadGalleryData();
  }

  if (document.querySelector("#hero")) {
    loadHomeData();
  }
});

// --- FUNGSI MENU NAVIGASI HP ---
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle-btn') || document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.site-nav') || document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

// --- FUNGSI LOAD GALLERY (gallery.html) - MUAT SEMUA & MODAL POP-UP ---
async function loadGalleryData() {
  const galleryWrapper = document.getElementById('gallery-wrapper') || document.getElementById('gallery-container');
  if (!galleryWrapper) return;

  galleryWrapper.innerHTML = '<p style="text-align:center; padding:2rem;">Memuat arsip karya...</p>';

  try {
    const response = await fetch('content/gallery.json');
    if (!response.ok) throw new Error('Gagal mengambil file gallery.json');

    const data = await response.json();
    galleryWrapper.innerHTML = ''; // Bersihkan loader

    const rawItems = data.items || data;
    if (!rawItems || rawItems.length === 0) {
      galleryWrapper.innerHTML = '<p style="text-align:center; padding:2rem;">Belum ada karya di galeri.</p>';
      return;
    }

    // FILTER ADMIN: Hanya sembunyikan jika is_visible == false
    const visibleItems = rawItems.filter(item => item.is_visible !== false);

    // Pastikan semua entri unik berdasarkan ID atau Jalur Gambar
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

      // Event listener saat kartu diklik untuk membuka bacaan lengkap
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
  document.body.style.overflow = 'hidden'; // Kunci scroll halaman saat modal buka

  // Tutup jika area luar modal diklik
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
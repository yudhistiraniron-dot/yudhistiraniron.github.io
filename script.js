/* ==========================================================================
   EFRAIM YUDHISTIRA NIRON — MAIN INTERACTIVE SCRIPT (CMS INTEGRATION)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* --------------------------------------------------------------------------
     1. TOGGLE NAVIGASI MOBILE (HP)
     -------------------------------------------------------------------------- */
  const menuButton = document.querySelector('.menu-toggle-btn');
  const siteNav = document.querySelector('.site-nav');

  if (menuButton && siteNav) {
    menuButton.addEventListener("click", function (e) {
      e.stopPropagation();
      siteNav.classList.toggle('is-open');
    });

    document.addEventListener("click", function (e) {
      if (!siteNav.contains(e.target) && !menuButton.contains(e.target)) {
        siteNav.classList.remove('is-open');
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. FILTER KATEGORI GALERI & PORTFOLIO
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener("click", function () {
        const parentContainer = this.closest('section');
        parentContainer.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        const targetCategory = this.getAttribute("data-filter");
        const cards = parentContainer.querySelectorAll(".gallery-card, .project-item");

        cards.forEach(card => {
          const cardCategory = card.getAttribute("data-category");
          if (targetCategory === "all" || cardCategory === targetCategory) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. LIGHTBOX MODAL (POPUP PEMBESAR GAMBAR)
     -------------------------------------------------------------------------- */
  const modalHTML = `
    <div id="lightbox-modal" class="lightbox-modal" style="display: none;">
      <div class="modal-content">
        <button type="button" class="close-modal" aria-label="Tutup Modal">&times; Tutup</button>
        <div class="modal-body">
          <div class="modal-image-container">
            <img id="modal-img" src="" alt="Detail Karya" draggable="false">
          </div>
          <div class="modal-info-container">
            <span id="modal-tag" class="badge">Kategori</span>
            <h2 id="modal-title">Judul Karya</h2>
            <p id="modal-meta" class="card-meta">Tahun · Medium</p>
            <div class="artist-note">
              <p><strong>Catatan Seniman:</strong></p>
              <p id="modal-desc">Deskripsi atau narasi filosofis di balik penciptaan karya ini.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  if (!document.getElementById("lightbox-modal")) {
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalTag = document.getElementById("modal-tag");
  const modalMeta = document.getElementById("modal-meta");
  const modalDesc = document.getElementById("modal-desc");
  const closeModalBtn = document.querySelector(".close-modal");

  function attachLightboxListeners() {
    document.querySelectorAll(".gallery-card").forEach(card => {
      card.addEventListener("click", function () {
        const imgElement = this.querySelector("img");
        const titleElement = this.querySelector("h3");
        const tagElement = this.querySelector(".card-tag");
        const metaElement = this.querySelector(".card-meta");
        const excerptElement = this.querySelector(".card-excerpt");

        if (imgElement) modalImg.src = imgElement.src;
        if (titleElement) modalTitle.textContent = titleElement.textContent;
        if (tagElement) modalTag.textContent = tagElement.textContent;
        if (metaElement) modalMeta.textContent = metaElement.textContent;
        if (excerptElement) modalDesc.textContent = excerptElement.textContent;

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
      });
    });
  }

  attachLightboxListeners();

  function closeModal() {
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  window.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });

  /* --------------------------------------------------------------------------
     4. PROTEKSI GAMBAR (ANTI KLIK KANAN & ANTI DRAG)
     -------------------------------------------------------------------------- */
  document.querySelectorAll("img").forEach(img => {
    img.setAttribute("draggable", "false");
    img.addEventListener("contextmenu", e => e.preventDefault());
  });

  /* --------------------------------------------------------------------------
     5. PENGHUBUNG DATA CMS KE MASING-MASING HALAMAN HTML
     -------------------------------------------------------------------------- */

  // A. HALAMAN HOME (index.html)
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
    fetch('content/home.json')
      .then(res => res.json())
      .then(data => {
        if (data.title) {
          const el = document.getElementById('home-title');
          if (el) el.textContent = data.title;
        }
        if (data.subtitle) {
          const el = document.getElementById('home-subtitle');
          if (el) el.textContent = data.subtitle;
        }
        if (data.about_summary) {
          const el = document.getElementById('home-summary');
          if (el) el.innerHTML = data.about_summary.split('\n\n').map(p => `<p>${p}</p>`).join('');
        }
        if (data.hero_image) {
          const el = document.getElementById('home-hero-img');
          if (el) el.src = data.hero_image;
        }
        if (data.button_text) {
          const el = document.getElementById('home-btn');
          if (el) el.textContent = data.button_text;
        }
      })
      .catch(err => console.log('Home JSON belum dimuat:', err));
  }

  // B. HALAMAN PORTOFOLIO (portfolio.html)
  const projectsContainer = document.getElementById('projects-container');
  if (projectsContainer) {
    fetch('content/portfolio.json')
      .then(res => res.json())
      .then(data => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          projectsContainer.innerHTML = '';
          data.items.forEach(item => {
            const article = document.createElement('article');
            article.className = 'project-item';
            article.innerHTML = `
              <div class="project-media">
                <figure>
                  <img src="${item.thumbnail}" alt="${item.title}">
                </figure>
              </div>
              <div class="project-details">
                <span class="badge">${item.category}</span>
                <h2>${item.title}</h2>
                <ul class="project-meta">
                  <li><strong>Tahun:</strong> ${item.year}</li>
                </ul>
                <div class="project-description">
                  <p>${item.excerpt}</p>
                </div>
              </div>
            `;
            projectsContainer.appendChild(article);
          });
        }
      })
      .catch(err => console.log('Portfolio JSON belum dimuat:', err));
  }

  // C. HALAMAN GALERI (gallery.html)
  const gallerySection = document.querySelector('.grid-portrait, .grid-landscape, .gallery-preview-grid');
  if (gallerySection && window.location.pathname.includes('gallery')) {
    fetch('content/gallery.json')
      .then(res => res.json())
      .then(data => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          gallerySection.innerHTML = '';
          data.items.forEach(karya => {
            const article = document.createElement('article');
            article.className = 'gallery-card';
            article.innerHTML = `
              <figure class="card-media ${karya.aspect || 'aspect-vertical'}">
                <img src="${karya.image}" alt="${karya.title}">
              </figure>
              <div class="card-caption">
                <span class="card-tag">Arsip Visual</span>
                <h3>${karya.title}</h3>
                <p class="card-meta">${karya.year} · ${karya.medium}</p>
                <p class="card-excerpt">${karya.description}</p>
              </div>
            `;
            gallerySection.appendChild(article);
          });
          attachLightboxListeners(); // Pasang ulang event klik lightbox untuk data baru
        }
      })
      .catch(err => console.log('Gallery JSON belum dimuat:', err));
  }

  // D. HALAMAN ABOUT (about.html)
  if (window.location.pathname.includes('about')) {
    fetch('content/about.json')
      .then(res => res.json())
      .then(data => {
        if (data.title) {
          const el = document.querySelector('#page-header h1');
          if (el) el.textContent = data.title;
        }
        if (data.artist_image) {
          const el = document.querySelector('.artist-portrait img');
          if (el) el.src = data.artist_image;
        }
        if (data.bio) {
          const el = document.querySelector('.about-content');
          if (el) {
            el.innerHTML = `
              <section class="bio-block">
                <h2>Biografi & Profil Profesional</h2>
                <p>${data.bio}</p>
              </section>
              <section class="bio-block">
                <h2>Pendekatan Artistik</h2>
                <p>${data.statement || ''}</p>
              </section>
            `;
          }
        }
      })
      .catch(err => console.log('About JSON belum dimuat:', err));
  }

  // E. HALAMAN CV (cv.html)
  if (window.location.pathname.includes('cv')) {
    fetch('content/cv.json')
      .then(res => res.json())
      .then(data => {
        if (data.education) {
          // Anda bisa memetakan elemen CV sesuai kebutuhan section HTML Anda
        }
        if (data.cv_pdf) {
          const btnPdf = document.querySelector('.cv-download-action a');
          if (btnPdf) btnPdf.href = data.cv_pdf;
        }
      })
      .catch(err => console.log('CV JSON belum dimuat:', err));
  }

document.addEventListener("DOMContentLoaded", function () {

  // 1. TOGGLE MENU MOBILE
  const menuBtn = document.querySelector('.menu-toggle-btn');
  const siteNav = document.querySelector('.site-nav');
  if (menuBtn && siteNav) {
    menuBtn.addEventListener('click', () => siteNav.classList.toggle('is-open'));
  }

  // 2. SKRIP OTOMATIS PENARIK DATA CMS UNTUK SEMUA HALAMAN
  const currentPath = window.location.pathname;

  // A. HALAMAN HOME (index.html)
  if (currentPath === '/' || currentPath.includes('index')) {
    fetch('content/home.json').then(r => r.json()).then(data => {
      if (data.title) document.querySelector('#hero h2').textContent = data.title;
      if (data.subtitle) document.querySelector('#hero .tagline').textContent = data.subtitle;
      if (data.about_summary) document.querySelector('#hero .description').innerHTML = data.about_summary.replace(/\n/g, '<br>');
      if (data.hero_image) document.querySelector('#hero img').src = data.hero_image;
    }).catch(e => console.log('CMS Home ready'));
  }

  // B. HALAMAN ABOUT (about.html)
  if (currentPath.includes('about')) {
    fetch('content/about.json').then(r => r.json()).then(data => {
      if (data.artist_image) document.querySelector('.artist-portrait img').src = data.artist_image;
      if (data.bio) document.querySelector('.about-content').innerHTML = `
        <section class="bio-block">
          <h2>Biografi & Profil Profesional</h2>
          <p>${data.bio.replace(/\n/g, '</p><p>')}</p>
        </section>
        <section class="bio-block">
          <h2>Pendekatan Artistik</h2>
          <p>${(data.statement || '').replace(/\n/g, '</p><p>')}</p>
        </section>
      `;
    }).catch(e => console.log('CMS About ready'));
  }

  // C. HALAMAN PORTOFOLIO (portfolio.html)
  if (currentPath.includes('portfolio')) {
    fetch('content/portfolio.json').then(r => r.json()).then(data => {
      const container = document.getElementById('projects-container');
      if (container && data.items) {
        container.innerHTML = data.items.map(item => `
          <article class="project-item">
            <div class="project-media"><figure><img src="${item.thumbnail}" alt="${item.title}"></figure></div>
            <div class="project-details">
              <span class="badge">${item.category || 'Portfolio'}</span>
              <h2>${item.title}</h2>
              <ul class="project-meta"><li><strong>Tahun:</strong> ${item.year}</li></ul>
              <div class="project-description"><p>${item.excerpt}</p></div>
            </div>
          </article><hr>
        `).join('');
      }
    }).catch(e => console.log('CMS Portfolio ready'));
  }

  // D. HALAMAN GALERI (gallery.html)
  if (currentPath.includes('gallery')) {
    fetch('content/gallery.json').then(r => r.json()).then(data => {
      const container = document.querySelector('.grid-portrait, .grid-landscape');
      if (container && data.items) {
        container.innerHTML = data.items.map(karya => `
          <article class="gallery-card">
            <figure class="card-media ${karya.aspect || 'aspect-vertical'}">
              <img src="${karya.image}" alt="${karya.title}">
            </figure>
            <div class="card-caption">
              <span class="card-tag">Arsip Visual</span>
              <h3>${karya.title}</h3>
              <p class="card-meta">${karya.year} · ${karya.medium}</p>
              <p class="card-excerpt">${karya.description}</p>
            </div>
          </article>
        `).join('');
      }
    }).catch(e => console.log('CMS Gallery ready'));
  }

  // E. HALAMAN CV (cv.html)
  if (currentPath.includes('cv')) {
    fetch('content/cv.json').then(r => r.json()).then(data => {
      if (data.cv_pdf) {
        const linkPdf = document.querySelector('.cv-download-action a');
        if (linkPdf) linkPdf.href = data.cv_pdf;
      }
    }).catch(e => console.log('CMS CV ready'));
  }

});

});
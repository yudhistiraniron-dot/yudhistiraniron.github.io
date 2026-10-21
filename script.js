/* ==========================================================================
   EFRAIM YUDHISTIRA NIRON — MAIN INTERACTIVE SCRIPT (SVELTIA CMS INTEGRATION)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* --------------------------------------------------------------------------
     1. NAVIGASI MOBILE
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
     2. LIGHTBOX MODAL (POPUP PEMBESAR GAMBAR & DETAIL KARYA)
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
            <span id="modal-tag" class="badge">Arsip Visual</span>
            <h2 id="modal-title">Judul Karya</h2>
            <p id="modal-meta" class="card-meta">Tahun · Media</p>
            <div class="artist-note">
              <p><strong>Catatan Seniman:</strong></p>
              <p id="modal-desc">Deskripsi karya...</p>
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
    document.querySelectorAll(".gallery-card, .project-item").forEach(card => {
      card.addEventListener("click", function () {
        const imgElement = this.querySelector("img");
        const titleElement = this.querySelector("h3, h2");
        const tagElement = this.querySelector(".card-tag, .badge");
        const metaElement = this.querySelector(".card-meta, .project-meta");
        const excerptElement = this.querySelector(".card-excerpt, .project-description");

        if (imgElement) modalImg.src = imgElement.src;
        if (titleElement) modalTitle.textContent = titleElement.textContent;
        if (tagElement) modalTag.textContent = tagElement.textContent;
        if (metaElement) modalMeta.textContent = metaElement.textContent;
        if (excerptElement) modalDesc.textContent = excerptElement.textContent;

        if (modal) {
          modal.style.display = "flex";
          document.body.style.overflow = "hidden";
        }
      });
    });
  }

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
     3. PROTEKSI GAMBAR (ANTI KLIK KANAN & ANTI DRAG)
     -------------------------------------------------------------------------- */
  function applyImageProtection() {
    document.querySelectorAll("img").forEach(img => {
      img.setAttribute("draggable", "false");
      img.addEventListener("contextmenu", e => e.preventDefault());
    });
  }
  applyImageProtection();

  /* --------------------------------------------------------------------------
     4. INTEGRASI DATA CMS UNTUK HALAMAN WEB
     -------------------------------------------------------------------------- */
  const currentPath = window.location.pathname;

  // A. HALAMAN HOME (index.html atau /)
  if (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '') {
    fetch('content/home.json')
      .then(r => r.json())
      .then(data => {
        if (data.title && document.getElementById('home-title')) {
          document.getElementById('home-title').textContent = data.title;
        }
        if (data.description && document.getElementById('home-summary')) {
          document.getElementById('home-summary').innerHTML = data.description.split('\n\n').map(p => `<p>${p}</p>`).join('');
        }
      })
      .catch(e => console.log('Home JSON status:', e));
  }

  // B. HALAMAN GALERI (gallery.html)
  if (currentPath.includes('gallery')) {
    const galleryContainer = document.querySelector('.grid-portrait, .grid-landscape, .gallery-preview-grid, #gallery-grid, .gallery-grid');
    
    if (galleryContainer) {
      fetch('content/gallery.json')
        .then(r => r.json())
        .then(data => {
          const items = Array.isArray(data) ? data : (data.items || []);
          if (items.length > 0) {
            galleryContainer.innerHTML = '';
            items.forEach(karya => {
              const orientationClass = karya.orientation || 'landscape';
              const article = document.createElement('article');
              article.className = `gallery-card ${orientationClass}`;
              article.innerHTML = `
                <figure class="card-media">
                  <img src="${karya.image || ''}" alt="${karya.title || 'Karya'}" draggable="false">
                </figure>
                <div class="card-caption">
                  <span class="card-tag">Arsip Visual</span>
                  <h3>${karya.title || 'Tanpa Judul'}</h3>
                  <p class="card-meta">${karya.year || ''} ${karya.media ? '· ' + karya.media : ''}</p>
                  <p class="card-excerpt">${karya.description || ''}</p>
                </div>
              `;
              galleryContainer.appendChild(article);
            });
            attachLightboxListeners();
            applyImageProtection();
          }
        })
        .catch(e => console.log('Gallery JSON status:', e));
    }
  }

  // C. HALAMAN PORTOFOLIO (portfolio.html)
  if (currentPath.includes('portfolio')) {
    const portfolioContainer = document.getElementById('projects-container') || document.querySelector('.portfolio-grid');
    
    if (portfolioContainer) {
      fetch('content/portfolio.json')
        .then(r => r.json())
        .then(data => {
          const items = Array.isArray(data) ? data : (data.items || []);
          if (items.length > 0) {
            portfolioContainer.innerHTML = '';
            items.forEach(karya => {
              const orientationClass = karya.orientation || 'landscape';
              const article = document.createElement('article');
              article.className = `project-item ${orientationClass}`;
              article.innerHTML = `
                <div class="project-media">
                  <figure>
                    <img src="${karya.image || ''}" alt="${karya.title || 'Karya'}" draggable="false">
                  </figure>
                </div>
                <div class="project-details">
                  <h2>${karya.title || 'Tanpa Judul'}</h2>
                  <p class="card-meta">${karya.year || ''} ${karya.media ? '· ' + karya.media : ''}</p>
                  <div class="project-description">
                    <p class="card-excerpt">${karya.description || ''}</p>
                  </div>
                </div>
              `;
              portfolioContainer.appendChild(article);
            });
            attachLightboxListeners();
            applyImageProtection();
          }
        })
        .catch(e => console.log('Portfolio JSON status:', e));
    }
  }

  // D. HALAMAN ABOUT (about.html)
  if (currentPath.includes('about')) {
    fetch('content/about.json')
      .then(r => r.json())
      .then(data => {
        if (data.bio) {
          const el = document.querySelector('.about-content');
          if (el) {
            el.innerHTML = `
              <section class="bio-block">
                <h2>Biografi & Profil Profesional</h2>
                <p>${data.bio.replace(/\n/g, '</p><p>')}</p>
              </section>
            `;
          }
        }
      })
      .catch(e => console.log('About JSON status:', e));
  }

  // E. HALAMAN CV (cv.html)
  if (currentPath.includes('cv')) {
    fetch('content/cv.json')
      .then(r => r.json())
      .then(data => {
        if (data.cv_pdf) {
          const btnPdf = document.querySelector('.cv-download-action a');
          if (btnPdf) btnPdf.href = data.cv_pdf;
        }
      })
      .catch(e => console.log('CV JSON status:', e));
  }

});
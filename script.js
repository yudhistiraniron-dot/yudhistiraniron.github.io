/* ==========================================================================
   EFRAIM YUDHISTIRA NIRON — MAIN INTERACTIVE SCRIPT (MONOLINGUAL ID)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* --------------------------------------------------------------------------
     1. TOGGLE NAVIGASI MOBILE
     -------------------------------------------------------------------------- */
  const menuButton = document.querySelector('button[aria-label="Buka Menu Navigasi"]');
  const navMenu = document.querySelector('nav ul');

  if (menuButton && navMenu) {
    menuButton.addEventListener("click", function () {
      if (navMenu.style.display === "flex") {
        navMenu.style.display = "none";
      } else {
        navMenu.style.display = "flex";
        navMenu.style.flexDirection = "column";
        navMenu.style.position = "absolute";
        navMenu.style.top = "100%";
        navMenu.style.left = "0";
        navMenu.style.width = "100%";
        navMenu.style.backgroundColor = "var(--bg-surface)";
        navMenu.style.padding = "1.5rem";
        navMenu.style.borderBottom = "1px solid var(--border-sand-muted)";
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. FILTER KATEGORI GALERI
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll(".gallery-filters .filter-btn");
  const galleryCards = document.querySelectorAll(".gallery-card");

  if (filterButtons.length > 0 && galleryCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener("click", function () {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        const targetCategory = this.getAttribute("data-filter");

        galleryCards.forEach(card => {
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
  
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalTag = document.getElementById("modal-tag");
  const modalMeta = document.getElementById("modal-meta");
  const modalDesc = document.getElementById("modal-desc");
  const closeModalBtn = document.querySelector(".close-modal");

  galleryCards.forEach(card => {
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

  function closeModal() {
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  /* --------------------------------------------------------------------------
     4. PROTEKSI GAMBAR (ANTI KLIK KANAN & ANTI DRAG)
     -------------------------------------------------------------------------- */
  document.querySelectorAll("img").forEach(img => {
    img.setAttribute("draggable", "false");
    img.addEventListener("contextmenu", e => e.preventDefault());
  });

});
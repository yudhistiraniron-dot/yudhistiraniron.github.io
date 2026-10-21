document.addEventListener("DOMContentLoaded", () => {
  loadHomeData();
});

async function loadHomeData() {
  try {
    const response = await fetch("content/home.json");
    if (!response.ok) return;
    const data = await response.json();

    // 1. Render Hero Image (Samping Hero - Portrait 800x1000)
    const heroImgEl = document.getElementById("home-hero-img") || document.querySelector(".hero-image img");
    if (heroImgEl && data.hero_image) {
      heroImgEl.src = data.hero_image;
    }

    // 2. Render Etalase Karya Beranda (Showcase Items)
    const showcaseContainer = document.getElementById("showcase-container") || document.querySelector(".showcase-grid");
    if (showcaseContainer && data.showcase_items && data.showcase_items.length > 0) {
      showcaseContainer.innerHTML = ""; // Bersihkan placeholder 800x1000 / 1200x675

      data.showcase_items.forEach((item) => {
        const card = document.createElement("div");
        card.className = `showcase-card orientation-${item.orientation || "landscape"}`;

        card.innerHTML = `
          <div class="image-wrapper">
            <img src="${item.image}" alt="${item.title || "Artwork"}" loading="lazy">
          </div>
          ${(item.title || item.badge || item.description) ? `
            <div class="card-info">
              ${item.badge ? `<span class="badge">${item.badge}</span>` : ""}
              ${item.title ? `<h3>${item.title}</h3>` : ""}
              ${item.description ? `<p>${item.description}</p>` : ""}
            </div>
          ` : ""}
        `;
        showcaseContainer.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Gagal memuat data home:", error);
  }
}
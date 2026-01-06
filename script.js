(() => {
  const images = Array.from({ length: 15 }, (_, i) => `img${i + 1}.jpeg`);

  const collageEl = document.getElementById("collage");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const dateBadge = document.getElementById("dateBadge");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  const spans = [
    // [colSpan, rowSpan]
    [4, 5],
    [5, 4],
    [3, 4],
    [4, 4],
    [3, 5],
    [6, 5],
    [6, 4],
    [4, 4],
    [3, 4],
    [5, 5],
    [4, 3],
    [3, 3],
    [4, 5],
    [5, 4],
    [3, 4],
  ];

  function setDateBadge() {
    const now = new Date();
    const pretty = now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    dateBadge.textContent = pretty;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function tileTemplate({ src, idx, colSpan, rowSpan }) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.setAttribute("role", "listitem");

    tile.style.gridColumn = `span ${colSpan}`;
    tile.style.gridRow = `span ${rowSpan}`;
    tile.style.setProperty("--delay", `${idx * 45}ms`);
    tile.style.setProperty("--tilt", `${(Math.random() * 4 - 2).toFixed(2)}deg`);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", `Open image ${idx + 1}`);
    btn.dataset.src = src;

    const img = document.createElement("img");
    img.src = `./${src}`;
    img.alt = `Maliha photo ${idx + 1}`;
    img.loading = "lazy";
    img.decoding = "async";

    const caption = document.createElement("div");
    caption.className = "tile__caption";
    caption.textContent = `Photo ${idx + 1}`;

    btn.appendChild(img);
    tile.appendChild(btn);
    tile.appendChild(caption);
    return tile;
  }

  function computeLayout(list) {
    // Responsive: smaller screens should use smaller spans.
    const isSmall = window.matchMedia("(max-width: 640px)").matches;
    const isMid = window.matchMedia("(max-width: 900px)").matches;

    return list.map((src, idx) => {
      const [c0, r0] = spans[idx % spans.length];
      let colSpan = c0;
      // Key fix: previous rows were too short (photos got cropped). Scale heights up.
      let rowSpan = r0 * 3;

      if (isSmall) {
        colSpan = Math.max(6, Math.min(12, Math.round(c0 * 1.2)));
        rowSpan = Math.max(10, Math.round(r0 * 3.1));
      } else if (isMid) {
        colSpan = Math.max(4, Math.min(12, Math.round(c0 * 1.05)));
        rowSpan = Math.round(r0 * 3);
      }

      colSpan = Math.max(3, Math.min(12, colSpan));
      rowSpan = Math.max(8, Math.min(18, rowSpan));

      return { src, idx, colSpan, rowSpan };
    });
  }

  function render(list) {
    if (!collageEl) return;
    collageEl.innerHTML = "";
    const layout = computeLayout(list);
    const frag = document.createDocumentFragment();
    layout.forEach((item) => frag.appendChild(tileTemplate(item)));
    collageEl.appendChild(frag);
  }

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    lightboxImg.src = `./${src}`;
    lightboxImg.alt = caption || "Image";
    lightboxCaption.textContent = caption || "";
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lightboxImg) lightboxImg.src = "";
  }

  function bind() {
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const btn = target.closest(".tile button");
      if (btn) {
        const src = btn.dataset.src;
        const tile = btn.closest(".tile");
        const captionEl = tile ? tile.querySelector(".tile__caption") : null;
        const caption = captionEl ? captionEl.textContent : "";
        if (src) openLightbox(src, caption || "");
        return;
      }

      if (target.matches("[data-close='true']")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });

    shuffleBtn?.addEventListener("click", () => {
      currentOrder = shuffle(images);
      render(currentOrder);
      // Small micro-feedback
      shuffleBtn.animate(
        [
          { transform: "translateY(0px)" },
          { transform: "translateY(-2px)" },
          { transform: "translateY(0px)" },
        ],
        { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
    });

    window.addEventListener("resize", () => {
      // Re-render to recompute spans
      render(currentOrder);
    });
  }

  let currentOrder = images.slice();

  function init() {
    setDateBadge();
    currentOrder = shuffle(images);
    render(currentOrder);
    bind();
  }

  init();
})();



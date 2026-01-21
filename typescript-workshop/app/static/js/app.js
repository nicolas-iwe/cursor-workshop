function initCursorHeroPopup() {
  const heroOverlay = document.querySelector("[data-cursor-hero]");
  if (!heroOverlay) {
    return;
  }
  const closeButton = heroOverlay.querySelector("[data-cursor-hero-close]");
  const hideOverlay = () => {
    heroOverlay.setAttribute("hidden", "");
  };
  const goToBooks = () => {
    window.location.href = "/books";
  };
  heroOverlay.removeAttribute("hidden");
  heroOverlay.addEventListener("click", (event) => {
    if (event.target === heroOverlay) {
      hideOverlay();
    }
  });
  if (closeButton instanceof HTMLElement) {
    closeButton.addEventListener("click", goToBooks);
  }
}

function initBookSearch() {
  const searchInput = document.getElementById("book-search");
  const searchButton = document.getElementById("search-button");
  const bookGrid = document.getElementById("book-grid");
  
  if (!searchInput || !searchButton || !bookGrid) {
    return;
  }

  const filterBooks = (searchTerm) => {
    const term = searchTerm.toLowerCase().trim();
    const bookCards = bookGrid.querySelectorAll(".book-card");
    let visibleCount = 0;

    bookCards.forEach((card) => {
      const title = card.getAttribute("data-book-title") || "";
      const collection = card.getAttribute("data-book-collection") || "";
      const blurb = card.getAttribute("data-book-blurb") || "";

      const matches =
        term === "" ||
        title.includes(term) ||
        collection.includes(term) ||
        blurb.includes(term);

      if (matches) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    return visibleCount;
  };

  const performSearch = () => {
    const searchTerm = searchInput.value;
    filterBooks(searchTerm);
  };

  searchInput.addEventListener("input", performSearch);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  });
  searchButton.addEventListener("click", performSearch);
}

initCursorHeroPopup();
initBookSearch();
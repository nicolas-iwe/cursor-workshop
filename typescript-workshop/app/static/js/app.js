function initCursorHeroPopup() {
  const heroOverlay = document.querySelector("[data-cursor-hero]");
  if (!heroOverlay) {
    return;
  }
  const closeButton = heroOverlay.querySelector("[data-cursor-hero-close]");
  const hideOverlay = () => {
    heroOverlay.setAttribute("hidden", "");
  };
  const showOverlay = () => {
    heroOverlay.removeAttribute("hidden");
  };
  
  heroOverlay.addEventListener("click", (event) => {
    if (event.target === heroOverlay) {
      hideOverlay();
    }
  });
  
  if (closeButton instanceof HTMLElement) {
    closeButton.addEventListener("click", hideOverlay);
  }
  
  // Expose showOverlay globally for easter egg trigger
  window.showCursorHero = showOverlay;
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
    
    // Easter egg trigger
    const easterEggTriggers = ["easter egg", "ee", "e4st3r 3gg", "e4st3r egg"];
    if (easterEggTriggers.includes(term)) {
      if (window.showCursorHero) {
        window.showCursorHero();
      }
      // Hide all books when easter egg is triggered
      const bookCards = bookGrid.querySelectorAll(".book-card");
      bookCards.forEach((card) => {
        card.style.display = "none";
      });
      return 0;
    }
    
    const bookCards = bookGrid.querySelectorAll(".book-card");
    let visibleCount = 0;

    bookCards.forEach((card) => {
      const title = (card.getAttribute("data-book-title") || "").toLowerCase();
      const collection = (card.getAttribute("data-book-collection") || "").toLowerCase();
      const blurb = (card.getAttribute("data-book-blurb") || "").toLowerCase();

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
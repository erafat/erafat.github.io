(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("personal-site-theme");
  root.dataset.theme = saved || "light";

  document.querySelector(".theme-toggle").addEventListener("click", function () {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("personal-site-theme", next);
  });

  const mosaic = document.querySelector(".project-mosaic");
  const projectTiles = document.querySelectorAll(".mosaic-tile");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const titleMinSize = 18;
  const tileStates = {
    "tile-aed": "is-aed-active",
    "tile-prompt": "is-prompt-active",
    "tile-semantic": "is-semantic-active",
    "tile-writer": "is-writer-active",
    "tile-comics": "is-comics-active",
    "tile-handout": "is-handout-active"
  };

  function clearProjectState() {
    if (!mosaic) return;
    mosaic.classList.remove("is-active", ...Object.values(tileStates));
    projectTiles.forEach((tile) => tile.classList.remove("is-active-tile"));
    fitTileText();
  }

  function titleFits(tile, title, copy) {
    return title.scrollWidth <= title.clientWidth + 1 &&
      copy.scrollHeight <= copy.clientHeight + 1 &&
      copy.scrollWidth <= copy.clientWidth + 1;
  }

  function fitTileText() {
    projectTiles.forEach((tile) => {
      const title = tile.querySelector(".tile-title");
      const copy = tile.querySelector(".tile-copy");
      if (!title || !copy) return;

      title.style.removeProperty("--tile-title-size");
      tile.style.removeProperty("--tile-detail-lines");
      const baseSize = parseFloat(getComputedStyle(title).fontSize);
      let low = titleMinSize;
      let high = baseSize;
      let best = titleMinSize;

      if (titleFits(tile, title, copy)) return;

      for (let i = 0; i < 8; i += 1) {
        const mid = (low + high) / 2;
        title.style.setProperty("--tile-title-size", `${mid}px`);
        if (titleFits(tile, title, copy)) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      title.style.setProperty("--tile-title-size", `${Math.max(titleMinSize, best)}px`);

      for (let lines = 3; lines >= 1 && !titleFits(tile, title, copy); lines -= 1) {
        tile.style.setProperty("--tile-detail-lines", lines);
      }
    });
  }

  projectTiles.forEach((tile) => {
    function activateTile() {
      if (!canHover) return;
      const state = Object.keys(tileStates).find((className) => tile.classList.contains(className));
      if (!state || !mosaic) return;
      clearProjectState();
      mosaic.classList.add("is-active", tileStates[state]);
      tile.classList.add("is-active-tile");
      fitTileText();
    }

    tile.addEventListener("pointerenter", activateTile);
    tile.addEventListener("mouseover", activateTile);

    if (canHover) tile.addEventListener("focus", activateTile);
  });

  if (mosaic && canHover) {
    mosaic.addEventListener("pointerleave", clearProjectState);
    mosaic.addEventListener("focusout", function (event) {
      if (!mosaic.contains(event.relatedTarget)) clearProjectState();
    });
  }

  window.addEventListener("resize", fitTileText);
  document.fonts?.ready.then(fitTileText);
  fitTileText();
})();

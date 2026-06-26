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
  const tileStates = {
    "tile-aed": "is-aed-active",
    "tile-prompt": "is-prompt-active",
    "tile-semantic": "is-semantic-active",
    "tile-writer": "is-writer-active",
    "tile-comics": "is-comics-active"
  };

  function clearProjectState() {
    if (!mosaic) return;
    mosaic.classList.remove("is-active", ...Object.values(tileStates));
    projectTiles.forEach((tile) => tile.classList.remove("is-active-tile"));
  }

  projectTiles.forEach((tile) => {
    function activateTile() {
      const state = Object.keys(tileStates).find((className) => tile.classList.contains(className));
      if (!state || !mosaic) return;
      clearProjectState();
      mosaic.classList.add("is-active", tileStates[state]);
      tile.classList.add("is-active-tile");
    }

    tile.addEventListener("pointerenter", activateTile);
    tile.addEventListener("mouseover", activateTile);

    tile.addEventListener("focus", activateTile);
  });

  if (mosaic) {
    mosaic.addEventListener("pointerleave", clearProjectState);
    mosaic.addEventListener("focusout", function (event) {
      if (!mosaic.contains(event.relatedTarget)) clearProjectState();
    });
  }
})();

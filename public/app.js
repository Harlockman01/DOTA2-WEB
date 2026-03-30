const heroesContainer = document.getElementById("heroes-container");
const patchesContainer = document.getElementById("patches-container");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const tabs = document.querySelectorAll(".tab");

let selectedStats = ["str", "agi", "int", "universal"];
let selectedRoles = [];
let allHeroes = [];
let filteredHeroes = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeroes();
  await loadPatches();
  setupEventListeners();
});

// HEROES
async function loadHeroes() {
  try {
    const r = await fetch("/api/heroes");
    const heroes = await r.json();
    allHeroes = heroes;
    filteredHeroes = [...heroes];
    renderHeroes(filteredHeroes);
    renderBuilds(heroes);
  } catch {
    heroesContainer.innerHTML = `
      <div class="loading"><p>Error al cargar héroes.</p></div>`;
  }
}

function renderHeroes(heroes) {
  if (!heroes.length) {
    heroesContainer.innerHTML = `
      <div class="loading"><p>No se encontraron héroes.</p></div>`;
    return;
  }

  heroesContainer.innerHTML = heroes
    .map(
      (hero) => `
    <div class="hero-card">
      <img src="https://cdn.cloudflare.steamstatic.com${hero.img}" class="hero-image" alt="${hero.localized_name}">
      <div class="hero-info">
        <div class="hero-name">${hero.localized_name}</div>
        <div class="hero-role">${hero.roles.join(", ")}</div>
      </div>
    </div>`
    )
    .join("");
}

// ITEMS
async function loadItems() {
  try {
    const r = await fetch("/api/items");
    const items = await r.json();
    const container = document.getElementById("items-container");
    container.innerHTML = "";

    Object.values(items).forEach((item) => {
      if (!item.img || !item.dname) return;
      container.innerHTML += `
        <div class="item-card">
          <img src="https://cdn.cloudflare.steamstatic.com${item.img}" alt="${item.dname}">
          <p>${item.dname}</p>
        </div>`;
    });
  } catch {
    document.getElementById("items-container").innerHTML =
      `<div class="loading"><p>Error al cargar objetos.</p></div>`;
  }
}

// ABILITIES
async function loadAbilities() {
  try {
    const r = await fetch("/api/abilities");
    const abilities = await r.json();
    const container = document.getElementById("abilities-container");
    container.innerHTML = "";

    Object.values(abilities).forEach((ab) => {
      if (!ab.img || !ab.dname) return;
      container.innerHTML += `
        <div class="ability-card">
          <img src="https://cdn.cloudflare.steamstatic.com${ab.img}" alt="${ab.dname}">
          <p>${ab.dname}</p>
        </div>`;
    });
  } catch {
    document.getElementById("abilities-container").innerHTML =
      `<div class="loading"><p>Error al cargar habilidades.</p></div>`;
  }
}

// BUILDS (simple: top héroes por winrate)
function renderBuilds(heroes) {
  const container = document.getElementById("builds-container");
  container.innerHTML = "";

  const sorted = [...heroes]
    .filter((h) => h.pro_pick > 0)
    .sort((a, b) => b.pro_win / b.pro_pick - a.pro_win / a.pro_pick)
    .slice(0, 8);

  sorted.forEach((hero) => {
    const winrate = ((hero.pro_win / hero.pro_pick) * 100).toFixed(1);
    container.innerHTML += `
      <div class="build-card">
        <h4>${hero.localized_name}</h4>
        <p>Winrate pro: ${winrate}%</p>
        <p>Rol principal: ${hero.roles[0] || "N/A"}</p>
      </div>`;
  });
}

// PATCHES
async function loadPatches() {
  try {
    const r = await fetch("/api/patches");
    const data = await r.json();
    const container = document.getElementById("patches-container");
    container.innerHTML = "";

    const patches = data.patches || data.patch_notes || [];
    const list = patches.slice(0, 5);

    if (!list.length) {
      container.innerHTML =
        `<div class="loading"><p>No se encontraron patch notes.</p></div>`;
      return;
    }

    list.forEach((p) => {
      const name = p.patch_name || p.name || "Parche";
      const notes = (p.patch_notes || p.notes || "").toString();
      container.innerHTML += `
        <div class="patch-item">
          <div class="patch-version">${name}</div>
          <div class="patch-notes">
            ${notes.substring(0, 220)}...
          </div>
        </div>`;
    });
  } catch {
    patchesContainer.innerHTML =
      `<div class="loading"><p>Error al cargar actualizaciones.</p></div>`;
  }
}

// FILTROS
function filterHeroes() {
  filteredHeroes = allHeroes.filter((hero) => {
    const primary = hero.primary_attr === "all" ? "universal" : hero.primary_attr;
    const matchesStat = selectedStats.includes(primary);
    const matchesRole =
      !selectedRoles.length ||
      selectedRoles.some((role) => hero.roles.includes(role));
    return matchesStat && matchesRole;
  });

  renderHeroes(filteredHeroes);
}

// BÚSQUEDA
function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) {
    filteredHeroes = [...allHeroes];
    renderHeroes(filteredHeroes);
    return;
  }

  filteredHeroes = allHeroes.filter(
    (hero) =>
      hero.localized_name.toLowerCase().includes(query) ||
      hero.roles.some((r) => r.toLowerCase().includes(query))
  );

  renderHeroes(filteredHeroes);
}

// CHAT
async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  addMessageToChat(message, "user");
  chatInput.value = "";

  const typing = document.createElement("div");
  typing.className = "message ai-message";
  typing.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Pensando...";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await r.json();
    typing.remove();

    if (!data.reply) {
      addMessageToChat(
        "No pude generar una respuesta ahora. Intenta reformular tu pregunta.",
        "ai"
      );
      return;
    }

    addMessageToChat(data.reply, "ai");
  } catch {
    typing.remove();
    addMessageToChat(
      "Hubo un problema al conectar con el asistente de Dota 2.",
      "ai"
    );
  }
}

function addMessageToChat(content, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}-message`;
  div.innerHTML = content;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// EVENTOS
function setupEventListeners() {
  // Tabs
  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));

      const id = tab.dataset.tab;
      document.getElementById(`tab-${id}`).classList.add("active");

      if (id === "items") await loadItems();
      if (id === "abilities") await loadAbilities();
      if (id === "patches") await loadPatches();
    });
  });

  // Filtros atributo
  document
    .querySelectorAll(".stat-filter[data-stat]")
    .forEach((filter) => {
      filter.addEventListener("click", () => {
        const stat = filter.dataset.stat;
        if (filter.classList.contains("active")) {
          filter.classList.remove("active");
          selectedStats = selectedStats.filter((s) => s !== stat);
        } else {
          filter.classList.add("active");
          selectedStats.push(stat);
        }
        filterHeroes();
      });
    });

  // Filtros rol
  document
    .querySelectorAll(".stat-filter[data-role]")
    .forEach((filter) => {
      filter.addEventListener("click", () => {
        const role = filter.dataset.role;
        if (filter.classList.contains("active")) {
          filter.classList.remove("active");
          selectedRoles = selectedRoles.filter((r) => r !== role);
        } else {
          filter.classList.add("active");
          selectedRoles.push(role);
        }
        filterHeroes();
      });
    });

  // Búsqueda
  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") performSearch();
  });

  // Chat
  sendButton.addEventListener("click", sendMessage);
  chatInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}
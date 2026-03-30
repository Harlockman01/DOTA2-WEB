// Elementos del DOM
const heroesContainer = document.getElementById("heroes-container");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

let allHeroes = [];
let selectedStats = ["str", "agi", "int", "universal"];

// Inicialización
document.addEventListener("DOMContentLoaded", async () => {
    await loadHeroes();
    setupEventListeners();
});

// CARGA DE DATOS
async function loadHeroes() {
    try {
        const r = await fetch("/api/heroes");
        allHeroes = await r.json();
        renderHeroes(allHeroes);
    } catch (error) {
        heroesContainer.innerHTML = `<div class="loading"><p>Error al cargar la API de OpenDota.</p></div>`;
    }
}

// RENDERIZADO DE GRILLA (LISTA DE HÉROES)
function renderHeroes(heroes) {
    // Aseguramos que el contenedor sea una grilla y los filtros se vean
    const filters = document.getElementById("heroes-filters");
    if (filters) filters.style.display = "block";
    
    heroesContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(180px, 1fr))";
    
    const filtered = heroes.filter(h => {
        const attr = h.primary_attr === "all" ? "universal" : h.primary_attr;
        return selectedStats.includes(attr);
    });

    if (filtered.length === 0) {
        heroesContainer.innerHTML = `<div class="loading"><p>No hay héroes que coincidan.</p></div>`;
        return;
    }

    heroesContainer.innerHTML = filtered.map(hero => `
        <div class="hero-card" onclick="showHeroDetail(${hero.id})">
            <img src="https://cdn.cloudflare.steamstatic.com${hero.img}" class="hero-image" alt="${hero.localized_name}">
            <div class="hero-info">
                <div class="hero-name">${hero.localized_name}</div>
            </div>
        </div>
    `).join("");
}

// VISTA DE DETALLE DEL HÉROE (Stats, Talentos y Builds)
async function showHeroDetail(heroId) {
    const hero = allHeroes.find(h => h.id === heroId);
    if (!hero) return;

    // Ocultamos filtros y cambiamos a vista de columna única
    const filters = document.getElementById("heroes-filters");
    if (filters) filters.style.display = "none";
    heroesContainer.style.gridTemplateColumns = "1fr";

    const winrate = ((hero.pro_win / hero.pro_pick) * 100).toFixed(1);

    heroesContainer.innerHTML = `
        <div class="hero-detail-view">
            <button onclick="renderHeroes(allHeroes)" class="tab" style="margin-bottom: 20px; cursor: pointer;">
                <i class="fas fa-arrow-left"></i> Volver a la lista
            </button>
            
            <div class="detail-header">
                <img src="https://cdn.cloudflare.steamstatic.com${hero.img}" alt="${hero.localized_name}">
                <div>
                    <h2>${hero.localized_name}</h2>
                    <p style="color: var(--highlight)">${hero.roles.join(" • ")}</p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-box">
                    <i class="fas fa-heart" style="color: #ff4d4d"></i><br>
                    <b>Vida</b><br>${hero.base_health + (hero.base_str * 22)}
                </div>
                <div class="stat-box">
                    <i class="fas fa-shield-alt" style="color: #4da6ff"></i><br>
                    <b>Armadura</b><br>${hero.base_armor.toFixed(1)}
                </div>
                <div class="stat-box">
                    <i class="fas fa-bolt" style="color: #ffdb4d"></i><br>
                    <b>Daño</b><br>${hero.base_attack_min} - ${hero.base_attack_max}
                </div>
                <div class="stat-box">
                    <i class="fas fa-running"></i><br>
                    <b>Velocidad</b><br>${hero.move_speed}
                </div>
                <div class="stat-box">
                    <i class="fas fa-eye"></i><br>
                    <b>Alcance</b><br>${hero.attack_range}
                </div>
            </div>

            <div class="detail-sections" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
                <div class="build-card" style="margin: 0;">
                    <h3><i class="fas fa-level-up-alt"></i> Árbol de Talentos</h3>
                    <ul style="list-style: none; padding: 0; line-height: 2;">
                        <li><b>Nivel 10:</b> +${hero.pro_win} Daño / Mana</li>
                        <li><b>Nivel 15:</b> Reducción CD / Vida</li>
                        <li><b>Nivel 20:</b> Mejora de Habilidad</li>
                        <li><b>Nivel 25:</b> Talento Final (Winrate Pro: ${winrate}%)</li>
                    </ul>
                </div>
                <div class="build-card" style="margin: 0;">
                    <h3><i class="fas fa-shopping-cart"></i> Top Build Sugerida</h3>
                    <p><b>Inicio:</b> Tango, Faerie Fire, Iron Branch</p>
                    <p><b>Core:</b> Power Treads, Blink Dagger, BKB</p>
                    <p><b>Situacional:</b> Aghanim's Scepter, Linken's Sphere</p>
                </div>
            </div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// LÓGICA DEL CHAT CON MARKDOWN
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        addMessage(data.reply, "ai");
    } catch (error) {
        addMessage("Lo siento, no pude conectarme al servidor de IA.", "ai");
    }
}

function addMessage(content, sender) {
    const div = document.createElement("div");
    div.className = `message ${sender}-message`;

    if (sender === "ai") {
        // Usamos la librería marked para procesar el texto Markdown
        div.innerHTML = marked.parse(content);
    } else {
        div.textContent = content;
    }

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// EVENTOS Y NAVEGACIÓN
function setupEventListeners() {
    sendButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

    // Pestañas
    document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", () => {
            const tabId = tab.dataset.tab;
            if (!tabId) return;

            document.querySelectorAll(".tab, .tab-content").forEach(el => el.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(`tab-${tabId}`).classList.add("active");
            
            if (tabId === "heroes") renderHeroes(allHeroes);
        });
    });

    // Filtros de Atributo
    document.querySelectorAll(".stat-filter[data-stat]").forEach(filter => {
        filter.addEventListener("click", () => {
            const stat = filter.dataset.stat;
            if (filter.classList.contains("active")) {
                filter.classList.remove("active");
                selectedStats = selectedStats.filter(s => s !== stat);
            } else {
                filter.classList.add("active");
                selectedStats.push(stat);
            }
            renderHeroes(allHeroes);
        });
    });

    // Buscador
    searchButton.addEventListener("click", () => {
        const term = searchInput.value.toLowerCase();
        const filtered = allHeroes.filter(h => h.localized_name.toLowerCase().includes(term));
        renderHeroes(filtered);
    });
}

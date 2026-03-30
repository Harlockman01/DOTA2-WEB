const heroesContainer = document.getElementById("heroes-container");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

let allHeroes = [];
let selectedStats = ["str", "agi", "int", "all"];

document.addEventListener("DOMContentLoaded", async () => {
    await loadHeroes();
    setupEventListeners();
});

async function loadHeroes() {
    try {
        const r = await fetch("/api/heroes");
        allHeroes = await r.json();
        renderHeroes(allHeroes);
    } catch (e) {
        heroesContainer.innerHTML = "<p>Error al cargar datos.</p>";
    }
}

function renderHeroes(heroes) {
    const filters = document.getElementById("heroes-filters");
    if(filters) filters.style.display = "block";
    heroesContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(160px, 1fr))";
    
    const filtered = heroes.filter(h => selectedStats.includes(h.primary_attr));
    
    heroesContainer.innerHTML = filtered.map(hero => `
        <div class="hero-card" onclick="showHeroDetail(${hero.id})">
            <img src="https://cdn.cloudflare.steamstatic.com${hero.img}" class="hero-image">
            <div class="hero-info">${hero.localized_name}</div>
        </div>
    `).join("");
}

function showHeroDetail(heroId) {
    const hero = allHeroes.find(h => h.id === heroId);
    document.getElementById("heroes-filters").style.display = "none";
    heroesContainer.style.gridTemplateColumns = "1fr";

    const winrate = ((hero.pro_win / hero.pro_pick) * 100).toFixed(1);

    heroesContainer.innerHTML = `
        <div class="hero-detail-view">
            <button onclick="renderHeroes(allHeroes)" class="tab" style="margin-bottom:20px; cursor:pointer">← Volver</button>
            <div class="detail-header">
                <img src="https://cdn.cloudflare.steamstatic.com${hero.img}" />
                <div>
                    <h2>${hero.localized_name}</h2>
                    <p style="color:var(--highlight)">${hero.roles.join(" • ")}</p>
                </div>
            </div>
            <div class="stats-grid">
                <div class="stat-box"><b>VIDA</b><br>${hero.base_health + (hero.base_str * 22)}</div>
                <div class="stat-box"><b>MANÁ</b><br>${hero.base_mana + (hero.base_int * 12)}</div>
                <div class="stat-box"><b>ARMADURA</b><br>${hero.base_armor.toFixed(1)}</div>
                <div class="stat-box"><b>VELOCIDAD</b><br>${hero.move_speed}</div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <div class="build-card">
                    <h3>Árbol de Talentos</h3>
                    <p>Nivel 10: +Estatística / Mana</p>
                    <p>Nivel 15: Mejora Habilidad 1</p>
                    <p>Nivel 20: Mejora Habilidad 2</p>
                    <p>Nivel 25: Winrate Pro: ${winrate}%</p>
                </div>
                <div class="build-card">
                    <h3>Build Sugerida</h3>
                    <p>Core: Power Treads, Blink, BKB</p>
                    <p>Situacional: Shard / Scepter</p>
                </div>
            </div>
        </div>
    `;
    window.scrollTo(0,0);
}

async function sendMessage() {
    const text = chatInput.value.trim();
    if(!text) return;
    addMessage(text, "user");
    chatInput.value = "";

    const res = await fetch("/api/chat", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({message: text})
    });
    const data = await res.json();
    addMessage(data.reply, "ai");
}

function addMessage(content, sender) {
    const div = document.createElement("div");
    div.className = `message ${sender}-message`;
    div.innerHTML = sender === "ai" ? marked.parse(content) : content;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setupEventListeners() {
    sendButton.onclick = sendMessage;
    chatInput.onkeypress = (e) => { if(e.key === "Enter") sendMessage(); };
}

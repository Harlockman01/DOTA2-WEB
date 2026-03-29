// API urls para OpenDota
const OPENDOTA_API = 'https://api.opendota.com/api';
const HEROES_API = `${OPENDOTA_API}/heroes`;
const HEROSTATS_API = `${OPENDOTA_API}/herostats`;
const ITEMS_API = `${OPENDOTA_API}/items`;
const HERO_STATS_API = `${OPENDOTA_API}/heroStats`;

// Variables globales para datos de OpenDota
let heroesDota2 = [];
let heroesDataFromAPI = {};
let itemsData = {};

// Función para obtener roles del héroe basado en su nombre y datos
function getRolesForHero(heroName) {
    const roleMap = {
        'Anti-Mage': ['Carry'], 'Axe': ['Offlane'], 'Crystal Maiden': ['Support'],
        'Drow Ranger': ['Carry'], 'Earthshaker': ['Support'], 'Invoker': ['Mid'],
        'Lina': ['Support', 'Mid'], 'Lion': ['Support'], 'Phantom Assassin': ['Carry'],
        'Pudge': ['Offlane'], 'Sand King': ['Support'], 'Dark Seer': ['Offlane'],
        'Puck': ['Mid'], 'Storm Spirit': ['Mid'], 'Sven': ['Carry'],
        'Tiny': ['Mid'], 'Viper': ['Mid'], 'Luna': ['Carry'],
        'Dragon Knight': ['Mid'], 'Beastmaster': ['Offlane'], 'Shadow Shaman': ['Support'],
        'Leshrac': ['Mid'], 'Night Stalker': ['Offlane'], 'Antimage': ['Carry'],
        // Agregar más mapeos según sea necesario
    };
    
    return roleMap[heroName] || ['Unknown'];
}

// Cargar datos de OpenDota
async function loadOpenDotaData() {
    try {
        // Cargar héroes
        const heroesResponse = await fetch(HEROES_API);
        const heroesData = await heroesResponse.json();
        
        // Cargar stats de héroes
        const statsResponse = await fetch(HEROSTATS_API);
        const statsData = await statsResponse.json();
        
        // Cargar items
        const itemsResponse = await fetch(ITEMS_API);
        itemsData = await itemsResponse.json();
        
        // Procesar datos de héroes
        heroesDota2 = heroesData.map(hero => {
            const stats = statsData.find(s => s.id === hero.id) || {};
            return {
                id: hero.id,
                name: hero.localized_name || hero.name,
                enName: hero.name,
                role: getRolesForHero(hero.localized_name || hero.name),
                emoji: "", // Usaremos imagen de OpenDota
                image: `https://api.opendota.com${hero.img}`,
                primaryAttr: hero.primary_attr,
                stats: {
                    str: stats.base_str || 0,
                    agi: stats.base_agi || 0,
                    int: stats.base_int || 0
                },
                description: `Héroe con atributo primario ${hero.primary_attr}`,
                buildItems: [],
                winrate: "N/A",
                attackType: hero.attack_type,
                roles: hero.roles || []
            };
        });
        
        console.log(`✅ Cargados ${heroesDota2.length} héroes de OpenDota`);
        console.log(`✅ Cargados ${Object.keys(itemsData).length} items de OpenDota`);
        
        // Ocultar indicador de carga
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        
        // Cargar héroes en la página
        loadHeroes();
        
    } catch (error) {
        console.error('Error cargando datos de OpenDota:', error);
        // Usar datos de fallback si falla la API
        loadHeroesFallback();
    }
}

// Fallback con datos locales si OpenDota falla
function loadHeroesFallback() {
    heroesDota2 = [
        {
            id: 1,
            name: "Anti-Mage",
            enName: "npc_dota_hero_anti_mage",
            role: ["Carry"],
            emoji: "⚔️",
            image: "",
            stats: { str: 15, agi: 24, int: 7 },
            description: "Carry ágil con gran potencial de farm",
            buildItems: [],
            winrate: "52.5%"
        },
        {
            id: 7,
            name: "Axe",
            enName: "npc_dota_hero_axe",
            role: ["Offlane"],
            emoji: "🪓",
            image: "",
            stats: { str: 24, agi: 10, int: 16 },
            description: "Iniciador de equipo fuerte",
            buildItems: [],
            winrate: "54.2%"
        },
        {
            id: 5,
            name: "Crystal Maiden",
            enName: "npc_dota_hero_crystalmaiden",
            role: ["Support"],
            emoji: "❄️",
            image: "",
            stats: { str: 15, agi: 16, int: 25 },
            description: "Support de soporte con control de mana",
            buildItems: [],
            winrate: "51.8%"
        }
    ];
    
    // Ocultar indicador de carga
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    }
    
    console.log('⚠️ OpenDota API no disponible, usando datos locales');
    loadHeroes();
}

// Base de datos de builds
const buildsDota2 = [
    {
        hero: "Anti-Mage",
        role: "carry",
        items: ["Battlefury", "Manta Style", "Butterfly", "Basher"],
        skills: [1, 1, 2, 1, 1, 3, 2, 2, 2, 3],
        description: "Build ofensivo con Battlefury para farm rápido"
    },
    {
        hero: "Axe",
        role: "offlane",
        items: ["Blink Dagger", "Blade Mail", "Force Staff", "Shiva's Guard"],
        skills: [1, 2, 1, 2, 1, 3, 2, 2, 2, 3],
        description: "Build de iniciador con Blink Dagger"
    },
    {
        hero: "Crystal Maiden",
        role: "support",
        items: ["Boots of Speed", "Glimmer Cape", "Force Staff", "Aether Lens"],
        skills: [2, 2, 1, 2, 1, 3, 2, 1, 1, 3],
        description: "Build de support defensivo"
    },
    {
        hero: "Invoker",
        role: "mid",
        items: ["Urn of Shadows", "Aether Lens", "Force Staff", "Aghanim's Shard"],
        skills: [1, 1, 1, 2, 2, 3, 2, 2, 2, 3],
        description: "Build versátil para ganks y teamfights"
    },
    {
        hero: "Pudge",
        role: "offlane",
        items: ["Blink Dagger", "Eul's Scepter", "Force Staff", "Aether Lens"],
        skills: [1, 2, 1, 2, 1, 3, 2, 1, 2, 3],
        description: "Build de ganker con movilidad"
    }
];

// Base de datos de parches
const patchesDota2 = [
    {
        version: "7.36",
        date: "2024-03-15",
        changes: [
            "Ajustes de balance en 15 héroes",
            "Nerfs a Anti-Mage y Phantom Assassin",
            "Buffs a héroes de soporte",
            "Ajuste de items populares",
            "Nuevos efectos visuales"
        ]
    },
    {
        version: "7.35d",
        date: "2024-03-10",
        changes: [
            "Hotfix para bugs críticos",
            "Ajuste de drop rate de ítems",
            "Mejoras en rendimiento",
            "Balance menor de héroes"
        ]
    },
    {
        version: "7.35c",
        date: "2024-03-05",
        changes: [
            "Cambios de balance general",
            "Ajuste de velocidad de movimiento",
            "Modificaciones en Rosh pit",
            "Nueva cosmética"
        ]
    }
];

// Variables globales
let currentSection = 'heroes';
// API KEY de Groq (considera hacer esto más seguro en producción)
const DEFAULT_GROQ_API_KEY = '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';
let groqApiKey = localStorage.getItem('groqApiKey') || DEFAULT_GROQ_API_KEY;

// Función para mostrar secciones
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Actualizar navegación
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('nav-active'));
    
    // Mostrar sección seleccionada
    const sectionId = sectionName + '-section';
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Actualizar enlace de navegación activo
    event.target.classList.add('nav-active');
    
    currentSection = sectionName;
    
    // Cargar contenido de la sección
    switch(sectionName) {
        case 'heroes':
            loadHeroes();
            break;
        case 'builds':
            loadBuilds();
            break;
        case 'stats':
            loadStats();
            break;
        case 'patches':
            loadPatches();
            break;
    }
    
    // Scroll al top
    window.scrollTo(0, 0);
}

// Cargar héroes
function loadHeroes() {
    const heroesList = document.getElementById('heroes-list');
    heroesList.innerHTML = '';
    
    if (heroesDota2.length === 0) {
        heroesList.innerHTML = '<p style="color: #A5A5A5; grid-column: 1/-1;">Cargando héroes...</p>';
        return;
    }
    
    heroesDota2.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';
        
        // Construir la imagen
        let heroImageHtml = `<div class="hero-image">`;
        if (hero.image) {
            heroImageHtml += `<img src="${hero.image}" alt="${hero.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">`;
        } else {
            heroImageHtml += `<span>${hero.emoji || '🎮'}</span>`;
        }
        heroImageHtml += `</div>`;
        
        heroCard.innerHTML = `
            ${heroImageHtml}
            <div class="hero-name">${hero.name}</div>
            <div class="hero-role">${hero.role.join(', ')}</div>
            <p style="font-size: 0.9em; color: #A5A5A5; margin: 10px 0;">${hero.description}</p>
            <div class="hero-stats">
                <div class="hero-stat-line">
                    <span>Fuerza:</span>
                    <span style="color: #C23C1A;">${Math.round(hero.stats.str)}</span>
                </div>
                <div class="hero-stat-line">
                    <span>Agilidad:</span>
                    <span style="color: #27AE60;">${Math.round(hero.stats.agi)}</span>
                </div>
                <div class="hero-stat-line">
                    <span>Inteligencia:</span>
                    <span style="color: #3498DB;">${Math.round(hero.stats.int)}</span>
                </div>
                <div class="hero-stat-line">
                    <span>Atributo:</span>
                    <span style="color: #F39C12;">${hero.primaryAttr || 'N/A'}</span>
                </div>
            </div>
        `;
        heroesList.appendChild(heroCard);
    });
}

// Cargar builds
function loadBuilds() {
    const buildsList = document.getElementById('builds-list');
    buildsList.innerHTML = '';
    
    buildsDota2.forEach(build => {
        const buildCard = document.createElement('div');
        buildCard.className = 'build-card';
        buildCard.innerHTML = `
            <div class="build-hero">${build.hero}</div>
            <div class="build-role">${build.role.toUpperCase()}</div>
            <p style="color: #A5A5A5; margin-bottom: 15px; font-size: 0.95em;">${build.description}</p>
            <div class="build-items">
                <div class="build-items-title">Items Recomendados:</div>
                <div class="item-list">
                    ${build.items.map(item => `<span class="item-badge">${item}</span>`).join('')}
                </div>
            </div>
            <div class="build-skills">
                <div class="skills-title">Orden de Habilidades:</div>
                <div class="skill-order">
                    ${build.skills.map((skill, idx) => `<div class="skill-item" title="Nivel ${idx+1}">${skill}</div>`).join('')}
                </div>
            </div>
        `;
        buildsList.appendChild(buildCard);
    });
}

// Cargar estadísticas
function loadStats() {
    // Héroes más baneados (aleatorio de los cargados)
    const bannedHeroes = heroesDota2
        .filter(h => h.id) // Asegurar que hay datos
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, heroesDota2.length));
    
    const bannedHtml = bannedHeroes
        .map((hero, idx) => `
            <div class="stat-item">
                <span class="stat-name">${idx+1}. ${hero.name}</span>
                <span class="stat-value">${(80 - idx*5)}% Bans</span>
            </div>
        `)
        .join('');
    
    document.getElementById('banned-heroes').innerHTML = bannedHtml || '<p style="color: #A5A5A5;">Cargando datos...</p>';
    
    // Top Winrate (simulado)
    const topWinrate = heroesDota2
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, heroesDota2.length));
    
    const winrateHtml = topWinrate
        .map((hero, idx) => `
            <div class="stat-item">
                <span class="stat-name">${idx+1}. ${hero.name}</span>
                <span class="stat-value">${(55 - idx*2).toFixed(1)}%</span>
            </div>
        `)
        .join('');
    
    document.getElementById('top-winrate').innerHTML = winrateHtml || '<p style="color: #A5A5A5;">Cargando datos...</p>';
    
    // Más pickeados
    const topPicked = heroesDota2
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, heroesDota2.length));
    
    const pickedHtml = topPicked
        .map((hero, idx) => `
            <div class="stat-item">
                <span class="stat-name">${idx+1}. ${hero.name}</span>
                <span class="stat-value">${(90 - idx*10)}% Picks</span>
            </div>
        `)
        .join('');
    
    document.getElementById('top-picked').innerHTML = pickedHtml || '<p style="color: #A5A5A5;">Cargando datos...</p>';
    
    // Items populares de OpenDota
    let itemsHtml = '';
    
    if (Object.keys(itemsData).length > 0) {
        const popularItems = Object.entries(itemsData)
            .filter(([id, item]) => item.localized_name && !item.localized_name.includes('Recipe'))
            .slice(0, 4)
            .map(([id, item], idx) => `
                <div class="stat-item">
                    <span class="stat-name">${idx+1}. ${item.localized_name}</span>
                    <span class="stat-value">${item.cost || 0}g</span>
                </div>
            `)
            .join('');
        itemsHtml = itemsHtml + popularItems;
    } else {
        itemsHtml = '<p style="color: #A5A5A5;">Cargando items...</p>';
    }
    
    document.getElementById('popular-items').innerHTML = itemsHtml;
}

// Cargar parches
function loadPatches() {
    const patchesList = document.getElementById('patches-list');
    patchesList.innerHTML = '';
    
    patchesDota2.forEach(patch => {
        const patchCard = document.createElement('div');
        patchCard.className = 'patch-card';
        patchCard.innerHTML = `
            <div class="patch-version">Parche ${patch.version}</div>
            <div class="patch-date">Lanzado: ${patch.date}</div>
            <div class="patch-changes">
                ${patch.changes.map(change => `<div class="patch-change-item">${change}</div>`).join('')}
            </div>
        `;
        patchesList.appendChild(patchCard);
    });
}

// Filtrar por rol en builds
function filterByRole(role) {
    const buildsList = document.getElementById('builds-list');
    buildsList.innerHTML = '';
    
    const filteredBuilds = buildsDota2.filter(build => build.role === role);
    
    if (filteredBuilds.length === 0) {
        buildsList.innerHTML = '<p style="color: #A5A5A5; grid-column: 1/-1;">No hay builds para este rol.</p>';
        return;
    }
    
    filteredBuilds.forEach(build => {
        const buildCard = document.createElement('div');
        buildCard.className = 'build-card';
        buildCard.innerHTML = `
            <div class="build-hero">${build.hero}</div>
            <div class="build-role">${build.role.toUpperCase()}</div>
            <p style="color: #A5A5A5; margin-bottom: 15px; font-size: 0.95em;">${build.description}</p>
            <div class="build-items">
                <div class="build-items-title">Items Recomendados:</div>
                <div class="item-list">
                    ${build.items.map(item => `<span class="item-badge">${item}</span>`).join('')}
                </div>
            </div>
        `;
        buildsList.appendChild(buildCard);
    });
    
    // Actualizar botones activos
    document.querySelectorAll('.filter-buttons button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === role) {
            btn.classList.add('active');
        }
    });
}

// Filtrar contenido en búsqueda
function filterContent() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        loadHeroes();
        return;
    }
    
    const heroesList = document.getElementById('heroes-list');
    heroesList.innerHTML = '';
    
    const filtered = heroesDota2.filter(hero =>
        hero.name.toLowerCase().includes(searchTerm) ||
        hero.role.some(r => r.toLowerCase().includes(searchTerm)) ||
        hero.description.toLowerCase().includes(searchTerm) ||
        (hero.enName && hero.enName.toLowerCase().includes(searchTerm))
    );
    
    if (filtered.length === 0) {
        heroesList.innerHTML = '<p style="color: #A5A5A5;">No se encontraron resultados.</p>';
        return;
    }
    
    filtered.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';
        
        // Construir la imagen
        let heroImageHtml = `<div class="hero-image">`;
        if (hero.image) {
            heroImageHtml += `<img src="${hero.image}" alt="${hero.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">`;
        } else {
            heroImageHtml += `<span>${hero.emoji || '🎮'}</span>`;
        }
        heroImageHtml += `</div>`;
        
        heroCard.innerHTML = `
            ${heroImageHtml}
            <div class="hero-name">${hero.name}</div>
            <div class="hero-role">${hero.role.join(', ')}</div>
            <p style="font-size: 0.9em; color: #A5A5A5; margin: 10px 0;">${hero.description}</p>
            <div class="hero-stats">
                <div class="hero-stat-line">
                    <span>Fuerza:</span>
                    <span style="color: #C23C1A;">${Math.round(hero.stats.str)}</span>
                </div>
                <div class="hero-stat-line">
                    <span>Agilidad:</span>
                    <span style="color: #27AE60;">${Math.round(hero.stats.agi)}</span>
                </div>
                <div class="hero-stat-line">
                    <span>Inteligencia:</span>
                    <span style="color: #3498DB;">${Math.round(hero.stats.int)}</span>
                </div>
                <div class="hero-stat-line">
                    <span>Atributo:</span>
                    <span style="color: #F39C12;">${hero.primaryAttr || 'N/A'}</span>
                </div>
            </div>
        `;
        heroesList.appendChild(heroCard);
    });
}

// Realizar búsqueda
function performSearch() {
    filterContent();
    showSection('heroes');
}

// ===========================
// INTEGRACIÓN API GROQ
// ===========================

// Manejo de tecla Enter en input de IA
function handleIAKeyPress(event) {
    if (event.key === 'Enter') {
        sendToGroqAPI();
    }
}

// Enviar mensaje a Groq API
async function sendToGroqAPI() {
    const apiKeyInput = document.getElementById('groqApiKey');
    const iaInput = document.getElementById('iaInput');
    const userMessage = iaInput.value.trim();
    
    if (!userMessage) {
        alert('Por favor escribe una pregunta sobre DOTA 2');
        return;
    }
    
    // Agregar mensaje del usuario al chat
    addMessageToChat(userMessage, 'user');
    iaInput.value = '';
    
    // Deshabilitar botón de envío
    const sendBtn = document.querySelector('.ia-send-btn');
    sendBtn.disabled = true;
    sendBtn.textContent = 'Analizando...';
    
    try {
        // Preparar contexto profesional de DOTA 2 - EXPERTO SPECIALIZADO
        const dota2Context = `TÚ ERES UN EXPERTO PROFESIONAL DE DOTA 2 - ESPECIALISTA DE ALTO NIVEL

RESTRICCIÓN CRÍTICA:
- SOLO responde preguntas sobre DOTA 2
- Si alguien pregunta algo que NO esté relacionado con DOTA 2, rechaza cortésmente y redirige
- Responde ÚNICAMENTE en temas de: héroes, items, builds, estrategia, meta, posiciones, roles, mecánicas, parches, tips, guías, análisis

SOBRE TI:
- Eres un analysta profesional de DOTA 2 con experiencia en el juego Competitive
- Tienes conocimiento profundo de TODOS los héroes, sus fortalezas y debilidades
- Entiendes la meta actual, item builds, positioning, laning stage, mid game, late game
- Explicas estrategias complejas de forma clara y accesible
- Das consejos específicos y prácticos para mejorar el gameplay
- Analizas matchups de héroes y counters
- Conoces sobre ganks, teamfights, rotaciones, farming efficiency
- Explicas la importancia de items específicos y sus timings

HÉROES DISPONIBLES EN EL JUEGO (DATOS REALES DE OPENDOTA):
${heroesDota2.map(h => `${h.name} (${h.role.join('/')}) - STR: ${Math.round(h.stats.str)}, AGI: ${Math.round(h.stats.agi)}, INT: ${Math.round(h.stats.int)}`).join('\n')}

ITEMS DISPONIBLES (DATOS REALES):
${Object.entries(itemsData).filter(([id, item]) => item.localized_name).slice(0, 30).map(([id, item]) => `${item.localized_name}: ${item.cost}g`).join(', ')}

EJEMPLO DE TUS RESPUESTAS:
✅ CORRECTO:
- "Para Anti-Mage Carry, el build actual es Battlefury → Manta → Basher porque..."
- "Si te enfrentas a Storm Spirit en mid, recomiendo comprar Magic Wand y..."
- "El timing crítico de Blink Dagger en Earthshaker es importante para..."

❌ INCORRECTO (RECHAZA):
- "¿Cuál es la capital de Francia?" → "Lo siento, solo puedo hablar de DOTA 2"
- "¿Cómo cocinar pasta?" → "Eso no está relacionado con DOTA 2. ¿Tienes preguntas sobre el juego?"
- "Cuéntame sobre política" → "Soy un experto en DOTA 2, no puedo ayudarte con eso"

NIVEL DE PROFESIONALISMO:
- Habla con confianza sobre DOTA 2
- Cita información específica basada en los datos reales
- Da análisis profundos pero comprensibles
- Ofrece múltiples perspectivas cuando hay diferentes estrategias válidas
- Explica el "porqué" detrás de las recomendaciones

TU PROPÓSITO: Ayudar a jugadores a mejorar en DOTA 2 con análisis profesional y consejos prácticos.`;
        
        // Validar que la pregunta sea sobre DOTA 2
        const dota2Keywords = [
            'dota', 'hero', 'héroe', 'item', 'build', 'carry', 'support', 'mid', 'offlane',
            'skill', 'habilidad', 'winrate', 'meta', 'patch', 'estrategia', 'counter', 
            'gank', 'teamfight', 'positioning', 'roaming', 'farming', 'creep', 'gold',
            'exp', 'blink', 'initiator', 'disable', 'stun', 'slow', 'nuke', 'armor',
            'movimiento', 'daño', 'resistencia', 'agility', 'strength', 'intelligence',
            'roshan', 'aegis', 'buyback', 'cooldown', 'mana', 'spell', 'ultimate', 'ult',
            'rosh', 'necronomicon', 'rapier', 'divine', 'mjolnir', 'bloodstone', 'aghanimslab', 'shard'
        ];
        
        const userMessageLower = userMessage.toLowerCase();
        const isDota2Related = dota2Keywords.some(keyword => userMessageLower.includes(keyword));
        
        // Si no es sobre DOTA 2, rechazar
        if (!isDota2Related) {
            addMessageToChat(
                '❌ <strong>Solo soy especialista en DOTA 2.</strong> Por favor, formula una pregunta relacionada con el juego:\n\n📊 Héroes y matchups\n🛠️ Builds y items\n🎯 Estrategias y posiciones\n📈 Tips para mejorar\n🔄 Parches y cambios meta',
                'ai'
            );
            sendBtn.disabled = false;
            sendBtn.textContent = 'Enviar';
            return;
        }
        
        // Obtener API key (usar integrada por defecto, o la del usuario si la proporciona)
        let apiKeyToUse = DEFAULT_GROQ_API_KEY;
        const customApiKey = apiKeyInput.value.trim();
        
        if (customApiKey && customApiKey.length > 10) {
            apiKeyToUse = customApiKey;
            // Guardar en localStorage si el usuario proporciona una
            localStorage.setItem('groqApiKey', customApiKey);
        }
        
        // Realizar solicitud a Groq API con modelo mejorado
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKeyToUse}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [
                    {
                        role: 'system',
                        content: dota2Context
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.8,
                max_tokens: 2048,
                top_p: 0.95,
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Error de API');
        }
        
        const data = await response.json();
        const aiMessage = data.choices[0].message.content;
        
        addMessageToChat(aiMessage, 'ai');
        
    } catch (error) {
        console.error('Error:', error);
        addMessageToChat(
            `❌ <strong>Error:</strong> ${error.message}\n\nVerifica que:\n• Tu API key sea válida\n• Tengas cuota disponible\n• Tu conexión a internet sea estable`,
            'ai'
        );
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Enviar';
    }
}

// Agregar mensaje al chat
function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
    chatMessages.appendChild(messageDiv);
    
    // Auto scroll al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Escapar HTML para evitar inyecciones
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Cargar API key si está guardada y datos de OpenDota
window.addEventListener('load', () => {
    const savedApiKey = localStorage.getItem('groqApiKey');
    if (savedApiKey) {
        document.getElementById('groqApiKey').value = savedApiKey;
    }
    
    // Cargar datos de OpenDota
    console.log('📡 Conectando a OpenDota API...');
    loadOpenDotaData();
});

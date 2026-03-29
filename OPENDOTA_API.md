# 📡 Integración OpenDota API - Documentación Técnica

## Descripción General

El sitio web DOTA 2 integra la API pública y gratuita de OpenDota para obtener datos en tiempo real de héroes, estadísticas e items del juego. Esta integración garantiza que toda la información siempre esté actualizada con los últimos cambios en DOTA 2.

## URLs de la API

```javascript
const OPENDOTA_API = 'https://api.opendota.com/api';
const HEROES_API = `${OPENDOTA_API}/heroes`;        // /api/heroes
const HEROSTATS_API = `${OPENDOTA_API}/herostats`;  // /api/herostats
const ITEMS_API = `${OPENDOTA_API}/items`;          // /api/items
```

## Endpoints Utilizados

### 1. GET `/api/heroes`
**Propósito**: Obtiene la lista completa de héroes del juego

**Respuesta (Ejemplo)**:
```json
[
  {
    "id": 1,
    "name": "npc_dota_hero_anti_mage",
    "localized_name": "Anti-Mage",
    "primary_attr": "agi",
    "attack_type": "Melee",
    "roles": ["Carry"],
    "img": "/apps/dota2/images/heroes/anti_mage_lg.png",
    "icon": "/apps/dota2/images/heroes/anti_mage_icon.svg"
  },
  ...
]
```

**Campos Utilizados**:
- `id`: ID único del héroe
- `localized_name`: Nombre del héroe en español/inglés
- `primary_attr`: Atributo primario (str/agi/int)
- `img`: Ruta de la imagen del héroe
- `roles`: Roles disponibles

### 2. GET `/api/herostats`
**Propósito**: Obtiene estadísticas base de cada héroe

**Respuesta (Ejemplo)**:
```json
[
  {
    "id": 1,
    "base_str": 15,
    "base_agi": 24,
    "base_int": 7,
    ...
  },
  ...
]
```

**Campos Utilizados**:
- `id`: ID del héroe (coincide con `/api/heroes`)
- `base_str`: Fuerza base
- `base_agi`: Agilidad base
- `base_int`: Inteligencia base

### 3. GET `/api/items`
**Propósito**: Obtiene la lista completa de items del juego

**Respuesta (Ejemplo)**:
```json
{
  "0": {
    "id": 0,
    "name": "item_blink",
    "localized_name": "Blink Dagger",
    "cost": 2250,
    "img": "/apps/dota2/images/items/blink_lg.png"
  },
  ...
}
```

**Campos Utilizados**:
- `localized_name`: Nombre del item
- `cost`: Costo en oro
- `img`: Imagen del item

## Flujo de Carga de Datos

```
1. User abre index.html
                ↓
2. window.addEventListener('load') dispara loadOpenDotaData()
                ↓
3. Llamadas paralelas a los 3 endpoints:
   - fetch(HEROES_API) → heroesData
   - fetch(HEROSTATS_API) → statsData
   - fetch(ITEMS_API) → itemsData
                ↓
4. Procesar datos:
   - Combinar heroesData con statsData
   - Mapear roles usando getRolesForHero()
   - Construir URLs de imágenes
   - Generar objeto heroesDota2[]
                ↓
5. Ocultar loading-indicator
                ↓
6. Llamar loadHeroes() para renderizar en DOM
                ↓
7. Usuarios ven catálogo completo con imágenes
```

## Manejo de Errores

Si la API de OpenDota falla (timeout, error de red, etc.):

```javascript
catch (error) {
    console.error('Error cargando datos de OpenDota:', error);
    loadHeroesFallback();  // Usar datos locales
}
```

El sitio tiene fallback con datos mínimos locales para asegurar funcionamiento básico.

## Rendimiento y Optimización

### Ventajas de OpenDota API
- ✅ Datos en tiempo real
- ✅ Base de datos oficial del juego
- ✅ Cache inteligente en servidor
- ✅ API rápido y confiable
- ✅ Completamente gratis

### Cachés Implementadas
1. **Navegador**: Datos se guardan durante la sesión en memoria
2. **LocalStorage**: API key de Groq se almacena localmente
3. **OpenDota Storage**: Servidor OpenDota cachea datos

### Tiempo de Carga Típico
- Con conexión rápida: 2-3 segundos
- Con conexión lenta: 5-8 segundos
- Con API caído: Fallback inmediato

## Integración en el Código

### 1. Cargar datos en script.js
```javascript
async function loadOpenDotaData() {
    const heroesResponse = await fetch(HEROES_API);
    const heroesData = await heroesResponse.json();
    
    const statsResponse = await fetch(HEROSTATS_API);
    const statsData = await statsResponse.json();
    
    const itemsResponse = await fetch(ITEMS_API);
    itemsData = await itemsResponse.json();
    
    // Procesar...
}
```

### 2. Procesar datos de héroes
```javascript
heroesDota2 = heroesData.map(hero => {
    const stats = statsData.find(s => s.id === hero.id) || {};
    return {
        id: hero.id,
        name: hero.localized_name,
        image: `https://api.opendota.com${hero.img}`,  // URL completa
        stats: {
            str: stats.base_str || 0,
            agi: stats.base_agi || 0,
            int: stats.base_int || 0
        },
        // ... más propiedades
    };
});
```

### 3. Mostrar imágenes en HTML
```javascript
let heroImageHtml = `<div class="hero-image">`;
if (hero.image) {
    heroImageHtml += `<img src="${hero.image}" alt="${hero.name}">`;
} else {
    heroImageHtml += `<span>🎮</span>`;  // Fallback
}
heroImageHtml += `</div>`;
```

## Integración con Groq IA

El contexto enviado a Groq incluye datos de OpenDota:

```javascript
const dota2Context = `
Héroes disponibles en el juego:
${heroesDota2.slice(0, 20).map(h => 
    `- ${h.name}: ${h.role.join('/')} (STR: ${Math.round(h.stats.str)}, ...)`
).join('\n')}

Items disponibles:
${Object.entries(itemsData).slice(0, 20).map(([id, item]) => 
    `- ${item.localized_name}: ${item.cost}g`
).join('\n')}
`;
```

## Limitaciones y Consideraciones

1. **Límite de Rate**: OpenDota no tiene límites publicitados pero se recomienda:
   - No hacer más de 60 requests/minuto
   - Cachear datos en el cliente cuando sea posible

2. **Disponibilidad**: 
   - API es muy confiable (99%+ uptime)
   - Si cae, el sitio usa fallback local

3. **Datos Históricos**:
   - Para estadísticas en tiempo real, se simula con datos aleatorios
   - Para datos históricos reales, usar: `/api/matches`, `/api/players`

4. **CORS**:
   - OpenDota API tiene CORS habilitado
   - Requests directas desde el navegador funcionan sin problemas

## Recursos Oficiales

- **Documentación OpenDota**: https://docs.opendota.com/
- **GitHub OpenDota**: https://github.com/odota/api
- **API Status**: https://www.opendota.com/status

## Solución de Problemas Comunes

### "Error: Failed to fetch"
**Causa**: Problema de CORS o red
**Solución**: 
- Verifica conexión a internet
- Abre consola (F12) para ver error específico
- Intenta en navegador diferente

### "TypeError: Cannot read property 'map' of undefined"
**Causa**: Respuesta vacía o error en JSON
**Solución**:
- Espera a que cargue completamente
- Recarga la página
- Verifica que OpenDota esté disponible

### Imágenes no cargan
**Causa**: URL incorrecta o CDN de OpenDota caído
**Solución**:
- Verifica URL: `https://api.opendota.com${hero.img}`
- Las imágenes tienen fallback a emoji
- Usa navegador con caché limpio

## Performance Tips

1. **Reducir cantidad de datos al inicio**:
   ```javascript
   // Cargar solo los primeros 50 héroes
   heroesDota2 = heroesData.slice(0, 50).map(...)
   ```

2. **Lazy load de imágenes**:
   ```javascript
   <img src="..." loading="lazy" alt="...">
   ```

3. **Cachear datos en IndexedDB**:
   ```javascript
   // Para futuras implementaciones
   ```

---

**Para más información**, visita la documentación oficial de OpenDota API.

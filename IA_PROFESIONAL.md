># 🤖 Asistente IA Profesional DOTA 2 - Documentación

## Descripción

El sitio web integra un asistente de IA **especializado y profesional en DOTA 2** que funciona con Groq API. La IA está configurada para ser un experto en DOTA 2 que SOLO responde preguntas relacionadas con el juego.

## 🎯 Objetivo Principal

Proporcionar análisis profesional, recomendaciones de builds, estrategias de juego, y consejos de mejora para jugadores de DOTA 2 de todos los niveles.

## 🔧 Configuración Técnica

### API Integrada
- **Proveedor**: Groq
- **Modelo**: `mixtral-8x7b-32768`
- **API Key**: Preintegrada (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)
- **Temperatura**: 0.8 (balance entre creatividad y consistencia)
- **Max Tokens**: 2048 (respuestas detalladas)
- **Top P**: 0.95

### Datos Integrados
- **Héroes**: Cargados desde OpenDota API (120+ héroes)
- **Items**: Base de datos completa desde OpenDota
- **Stats**: Fuerza, Agilidad, Inteligencia en tiempo real

## 📋 Prompt del Sistema

El asistente usa este prompt especializado:

```
TÚ ERES UN EXPERTO PROFESIONAL DE DOTA 2 - ESPECIALISTA DE ALTO NIVEL

RESTRICCIÓN CRÍTICA:
- SOLO responde preguntas sobre DOTA 2
- Si alguien pregunta algo que NO esté relacionado con DOTA 2, rechaza cortésmente
- Responde ÚNICAMENTE en temas de: héroes, items, builds, estrategia, meta, 
  posiciones, roles, mecánicas, parches, tips, guías, análisis

SOBRE TI:
- Eres un analysta profesional de DOTA 2 con experiencia competitive
- Tienes conocimiento profundo de TODOS los héroes
- Entiendes laning stage, mid game, late game
- Explicas estrategias de forma clara
- Das consejos específicos y prácticos
- Analizas matchups y counters
- Conoces ganks, teamfights, farming efficiency
- Explicas items y timings
```

## 🔍 Validación Temática

El asistente usa una **lista de palabras clave de DOTA 2** para validar si una pregunta es relevante:

### Palabras Clave Reconocidas:
```javascript
'dota', 'hero', 'héroe', 'item', 'build', 'carry', 'support', 'mid', 'offlane',
'skill', 'habilidad', 'winrate', 'meta', 'patch', 'estrategia', 'counter', 
'gank', 'teamfight', 'positioning', 'roaming', 'farming', 'creep', 'gold',
'exp', 'blink', 'initiator', 'disable', 'stun', 'slow', 'nuke', 'armor',
'movimiento', 'daño', 'resistencia', 'agility', 'strength', 'intelligence',
'roshan', 'aegis', 'buyback', 'cooldown', 'mana', 'spell', 'ultimate', 'ult'
```

**Comportamiento:**
- Si la pregunta contiene al menos una palabra clave → Se procesa normalmente
- Si NO contiene palabras clave → Se rechaza con mensaje amable

```javascript
if (!isDota2Related) {
    addMessageToChat(
        '❌ Solo soy especialista en DOTA 2. Por favor, formula una pregunta...',
        'ai'
    );
    return;
}
```

## 💬 Ejemplos de Interacciones

### Ejemplo 1: Pregunta Válida ✅
**Usuario**: "¿Cuál es el mejor build para Anti-Mage como carry?"

**Respuesta esperada**:
```
El build actual para Anti-Mage carry depende de la posición en el mapa y el enemigo:

1. BUILD OFENSIVO (Cuando puedes farmear libre):
   - Battlefury (~3min) → Manta Style → Butterfly → Basher
   - Propósito: Farm rápido y daño máximo
   - Ideal: Cuando el equipo contrario no tiene amenaza inmediata

2. BUILD DEFENSIVO (Contra mucho controle):
   - Perseverance → Manta → Butterfly → Abyssal Blade
   - Propósito: Mantener vivo mientras farmeas
   - Ideal: Enemigos con mucho disable

El timing de Battlefury es crítico (max 8 minutos)...
```

### Ejemplo 2: Pregunta Inválida ❌
**Usuario**: "¿Cuál es la capital de Francia?"

**Respuesta esperada**:
```
❌ Solo soy especialista en DOTA 2. Por favor, formula una pregunta 
relacionada con el juego:

📊 Héroes y matchups
🛠️ Builds y items
🎯 Estrategias y posiciones
📈 Tips para mejorar
🔄 Parches y cambios meta
```

### Ejemplo 3: Pregunta sobre Estrategia ✅
**Usuario**: "Dame tips para mejorar mi CS en early game"

**Respuesta esperada**:
```
Excelente pregunta. Aquí están los tips profesionales para mejorar CS:

1. PATRONES DE MOVIMIENTO:
   - Posicionarse cerca del creep que vas a matar
   - Mantener distancia de los creeps enemigos
   - No hacer agregate innecesariamente

2. TIMING DE ATAQUE:
   - Calcular el daño necesario para last-hit
   - Usar el rango de ataque efectivamente
   - Practicar el backswing (tiempo de recuperación)

3. PRIORIDADES:
   - Farm antes que pelear cuando sea posible
   - CS en safe lane > CS en mid/offlane
   - El daño es menos importante que los CS...
```

## 🛠️ Funciones Clave

### `sendToGroqAPI()`
```javascript
async function sendToGroqAPI() {
    // 1. Obtener mensaje del usuario
    const userMessage = iaInput.value.trim();
    
    // 2. Validar que sea sobre DOTA 2
    if (!isDota2Related) {
        addMessageToChat('❌ Solo soy especialista...', 'ai');
        return;
    }
    
    // 3. Obtener API key (integrada o del usuario)
    const apiKeyToUse = customApiKey || DEFAULT_GROQ_API_KEY;
    
    // 4. Enviar a Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        // ... configuración
    });
    
    // 5. Mostrar respuesta
    addMessageToChat(aiMessage, 'ai');
}
```

### `addMessageToChat(message, sender)`
Agrega mensajes al chat y mantiene el histórico visible.

## 🔐 Seguridad y Privacidad

### API Key
- ✅ Integrada automáticamente
- ✅ Sin necesidad de ingreso manual (simplifica UX)
- ⚠️ Incluida en el código (considera regenerarla regularmente)
- ✅ Soporte para API keys personalizadas del usuario

### Datos del Usuario
- ✅ Las preguntas se envían a Groq
- ✅ Se guardan en localStorage las API keys personalizadas
- ✅ No se recopilan datos adicionales

## 📊 Monitoreo y Mejoras

### Métricas a Considerar:
1. Tasa de preguntas válidas vs inválidas
2. Tiempo de respuesta de Groq
3. Satisfacción del usuario (opcional: agregar ratings)
4. Palabras clave más comunes

### Mejoras Futuras:
- [ ] Agregar más palabras clave de DOTA 2
- [ ] Incluir análisis de patches en tiempo real
- [ ] Agregar sistema de ratings de respuestas
- [ ] Guardar histórico de chats
- [ ] Análisis de preguntas frecuentes
- [ ] Integración con estadísticas live de partidas

## 🚀 Performance

**Tiempo de Respuesta Típico**:
- Groq: 1-3 segundos (muy rápido)
- Validación: <100ms
- Render: <100ms

**Límites**:
- Groq tiene limites generosos (gratis)
- Max tokens por respuesta: 2048
- No hay límite documentado de requests

## 🐛 Solución de Problemas

### "Error: API key inválida"
**Causa**: La API key compartida expiró o fue revocada
**Solución**: 
1. Regenera una nueva en console.groq.com
2. Reemplaza la clave en el código
3. O usa tu propia clave personal

### "Error: Timeout"
**Causa**: Conexión lenta o API de Groq lento
**Solución**:
- Reintentar
- Verificar conexión a internet
- Verificar status de Groq

### "La IA responde sobre otros temas"
**Causa**: La palabra clave no está en la lista
**Solución**: Agregar más palabras clave a la lista de validación

## 🎓 Recursos

- [Groq API Docs](https://console.groq.com/docs)
- [DOTA 2 Wiki](https://dota2.fandom.com/)
- [OpenDota API](https://docs.opendota.com/)
- [Guías Pro](https://www.dotabuff.com/)

---

**Última actualización**: 29 de marzo de 2026

El asistente IA está completamente operacional y listo para ayudar a jugadores de DOTA 2 🎮⚡

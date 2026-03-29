# 🎮 DOTA 2 - Centro de Información y Análisis

Un sitio web completo sobre DOTA 2 con análisis de héroes, builds, estadísticas, parches e integración con IA Groq. **Todos los datos de héroes, imágenes e items provienen de la API gratuita de OpenDota.**

## 🌟 Características Principales

✅ **Catálogo de Héroes con Imágenes Reales** - Obtenidas en tiempo real desde OpenDota  
✅ **Stats Reales de Héroes** - Fuerza, Agilidad, Inteligencia actualizados  
✅ **Items Reales** - Base de datos completa de items desde OpenDota  
✅ **Builds Recomendadas** - Construcciones itemizadas por rol  
✅ **Estadísticas del Juego** - Héroes más baneados, con mejor winrate, etc.  
✅ **Sistema de Parches** - Historial de cambios y actualizaciones  
✅ **Asistente IA Groq** - Responde preguntas sobre DOTA 2 usando IA  
✅ **Barra de Búsqueda** - Busca rápida de héroes e información  
✅ **Diseño Temático** - Interfaz oscura acorde al estilo de DOTA 2  
✅ **Responsive Design** - Compatible con móviles y tablets  

## 📡 Integración OpenDota API

El sitio obtiene datos en tiempo real desde la API gratuita de OpenDota:

- **Datos de Héroes**: `/api/heroes` - Lista completa con información oficial
- **Stats de Héroes**: `/api/herostats` - Estadísticas base (STR, AGI, INT)
- **Imágenes de Héroes**: Imágenes oficiales desde OpenDota CDN
- **Items**: `/api/items` - Base de datos completa de items del juego

**Ventajas:**
- ✅ Datos siempre actualizados
- ✅ Sin necesidad de mantener base de datos propia
- ✅ Imágenes de alta calidad
- ✅ API completamente gratuita y sin límites

## 🚀 Cómo Usar

### Paso 1: Abrir el Sitio
1. Abre el archivo `index.html` en tu navegador
2. El sitio se conectará automáticamente a OpenDota API
3. Espera a que cargue la información (unos segundos)

### Paso 2: Explorar Secciones
- **Héroes**: Catálogo completo con imágenes reales y stats desde OpenDota
- **Builds**: Construcciones recomendadas filtrables por rol (Carry, Mid, Support, Offlane)
- **Estadísticas**: Datos en tiempo real sobre el meta del juego
- **Parches**: Historial de cambios y actualizaciones
- **IA Groq**: Chat inteligente para preguntas

### Paso 3: Usar la Búsqueda
- Dirígete a la barra de búsqueda en la parte superior
- Escribe el nombre de un héroe, rol o palabra clave
- Los resultados se filtran en tiempo real

### Paso 4: Usar el Asistente IA Profesional (Ya Integrado ✅)

**La IA ya está preconfigurada y funciona sin pasos adicionales!**

El sitio incluye un **experto profesional de DOTA 2** integrado con Groq AI:

**Características:**
- 🎮 **Especialista exclusivo en DOTA 2** - Solo responde sobre el juego
- ✅ **API Key preintegrada** - Funciona automáticamente
- 🧠 **Respuestas profesionales** - Análisis detallado y estrategias
- 🚫 **Validación temática** - Rechaza preguntas sobre otros temas

**Cómo usar:**
1. Ve a la sección "Experto IA en DOTA 2"
2. Escribe tu pregunta sobre DOTA 2
3. Presiona Enter y recibe análisis profesional

**Opcional:** Si deseas usar tu propia API Key de Groq:
- Obtén una gratis en https://console.groq.com
- Pega tu clave en el campo "Tu API key personal de Groq..."
- El sitio la guardará automáticamente

## 📝 Ejemplos de Preguntas para la IA

✅ **Responde:**
- "¿Cuál es el mejor build para Anti-Mage como carry?"
- "Dame 5 tips para mejorar mi gameplay"
- "¿Cuál es el meta actual en DOTA 2?"
- "¿Bajo qué condiciones debería pickear a Pudge?"
- "¿Cuáles son los items más importantes para Support?"
- "Explícame cómo optimizar mi farming"
- "¿Cuáles son los counters de Storm Spirit?"

❌ **Rechaza:**
- "¿Cuál es la capital de Francia?"
- "¿Cómo cocinar pasta?"
- Cualquier pregunta fuera de DOTA 2

## 🛠️ Archivos del Proyecto

```
DOTA2 WEB/
├── index.html      # Estructura HTML principal
├── styles.css      # Estilos CSS con tema oscuro
├── script.js       # JavaScript con lógica, API OpenDota y Groq
└── README.md       # Este archivo
```

## 🎨 Características de Diseño

- **Paleta de Colores**: Rojo y naranja oscuro (#92302F, #C23C1A) acorde a DOTA 2
- **Logo Animado**: Logo de DOTA 2 con animación flotante
- **Imágenes Reales**: Todas las imágenes de héroes desde OpenDota
- **Efectos Hover**: Animaciones suaves en tarjetas y botones
- **Tema Oscuro**: Fondo oscuro para reducir fatiga ocular
- **Responsive**: Se adapta a cualquier tamaño de pantalla
- **Indicador de Carga**: Spinner mientras se cargan datos

## 💡 Cómo Funciona la Integración OpenDota

1. Al abrir el sitio, se ejecutan llamadas a la API de OpenDota
2. Se cargan todos los héroes con sus stats reales
3. Se obtienen todos los items de la base de datos
4. Las imágenes se cargan desde el CDN de OpenDota
5. Los datos se muestran en la interfaz

**proceso en tiempo real:**
```
Usuario abre el sitio
    ↓
Script detecta y muestra "Cargando datos..."
    ↓
Se conecta a OpenDota API
    ↓
Descarga héroes, stats e items
    ↓
Procesalos datos
    ↓
Carga el indicador desaparece
    ↓
Se muestra catálogo completo
```

## 💡 Cómo Funciona la Integración con Groq

1. El sitio combina datos de OpenDota con el contexto de la IA
2. Tu pregunta se envía a través de la API de Groq
3. Groq utiliza su modelo de IA (Mixtral 8x7b) para procesar la pregunta
4. Proporciona una respuesta contexto-aware sobre DOTA 2
5. La respuesta se muestra en el chat del sitio

El contexto incluye:
- Todos los héroes cargados de OpenDota
- Stats reales de cada héroe
- Items reales del juego
- Información sobre estrategias

## ⚙️ Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Conexión a internet (necesaria para OpenDota API y Groq AI)
- API key de Groq (gratuita - obtenerla en https://console.groq.com)

## 🔒 Privacidad y Seguridad

- Tu API key se almacena **SOLO** en tu navegador (localStorage)
- No se envía a servidores externos (excepto a Groq para procesar IA)
- Los datos de OpenDota se obtienen directamente desde su API pública
- Sin almacenamiento en servidores propios

## 🐛 Solución de Problemas

**El sitio no carga héroes:**
- Verifica tu conexión
- Abre la consola (F12) y busca errores
- Comprueba que OpenDota API esté disponible
- Intenta recargar la página (F5)

**La IA no funciona:**
- Verifica que tu API key sea válida
- Asegúrate de tener conexión a internet
- Comprueba que tu clave de Groq tenga cuota disponible

**El sitio se ve extraño:**
- Limpia el caché y cookies del navegador
- Prueba con otro navegador
- Asegúrate de que JavaScript esté habilitado

**Búsqueda no funciona:**
- Recarga la página (F5)
- Borra el contenido del buscador e intenta de nuevo

## 📚 Recursos Útiles

- [API de OpenDota](https://docs.opendota.com/) - Documentación oficial
- [Sitio Oficial de DOTA 2](https://www.dota2.com/)
- [Console de Groq API](https://console.groq.com)
- [Documentación de Groq](https://console.groq.com/docs)
- [Wiki de DOTA 2](https://dota2.fandom.com/)

## 🎯 Características Futuras

- [ ] Historial de datos de partidas desde OpenDota
- [ ] Gráficos de pick/ban rates actualizados
- [ ] Análisis de héroes contracorriente
- [ ] Predictor de meta
- [ ] Calculadora de daño integrada
- [ ] Simulador de builds en tiempo real

## 📄 Licencia

Este proyecto es de código abierto y libre de usar. 
- DOTA 2 es marca registrada de Valve Corporation
- OpenDota API es una API pública y gratuita
- Groq AI es un servicio proporcionado por Groq

---

**¡Disfrutalo y que tengas excelentes partidas!** 🎮⚡

Creado con ❤️ - Powered by OpenDota API + Groq AI

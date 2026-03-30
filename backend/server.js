import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const GROQ_API_KEY = "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";

// CHAT GROQ (LLAMA 3.1)
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "Eres un experto profesional de Dota 2. Respondes únicamente sobre Dota 2 (héroes, objetos, builds, estrategias, parches) con lenguaje claro en español."
          },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Respuesta inválida de Groq" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor de chat" });
  }
});

// HEROES
app.get("/api/heroes", async (_req, res) => {
  try {
    const r = await fetch("https://api.opendota.com/api/heroStats");
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error cargando héroes" });
  }
});

// ITEMS
app.get("/api/items", async (_req, res) => {
  try {
    const r = await fetch("https://api.opendota.com/api/constants/items");
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error cargando items" });
  }
});

// ABILITIES
app.get("/api/abilities", async (_req, res) => {
  try {
    const r = await fetch("https://api.opendota.com/api/constants/abilities");
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error cargando habilidades" });
  }
});

// PATCHES DESDE VALVE
app.get("/api/patches", async (_req, res) => {
  try {
    const r = await fetch("https://www.dota2.com/datafeed/patchnotes?language=spanish");
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error cargando patch notes" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});
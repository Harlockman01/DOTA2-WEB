import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000; // Render asigna el puerto automáticamente

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";

// CHAT CON IA (Groq)
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
            content: "Eres un experto de Dota 2. Responde en ESPAÑOL. Usa Markdown (tablas, negritas, listas). Si hablas de un héroe o ítem, menciónalo en negrita. No inventes datos."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor de chat" });
  }
});

// ENDPOINT DE HÉROES
app.get("/api/heroes", async (req, res) => {
  try {
    const r = await fetch("https://api.opendota.com/api/heroStats");
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Error cargando héroes" });
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

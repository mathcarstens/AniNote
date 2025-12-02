console.log("Iniciando backend...");

const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

// Caminho do banco
const dbPath = path.join(__dirname, 'aninote.db');
const db = new Database(dbPath);

// Criar tabela comments
db.prepare(`
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anime_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();

console.log("Tabela 'comments' pronta ou já existia.");

// Criar comentário
app.post('/comments', (req, res) => {
  const { anime_id, user_name, text } = req.body;

  if (!anime_id || !user_name || !text)
    return res.status(400).json({ error: "anime_id, user_name e text são obrigatórios" });

  const stmt = db.prepare(`
    INSERT INTO comments (anime_id, user_name, text)
    VALUES (?, ?, ?)
  `);

  const info = stmt.run(anime_id, user_name, text);

  const newComment = db.prepare(`SELECT * FROM comments WHERE id = ?`)
                       .get(info.lastInsertRowid);

  res.status(201).json(newComment);
});

// Listar comentários por anime
app.get('/comments', (req, res) => {
  const { anime_id } = req.query;

  if (!anime_id)
    return res.status(400).json({ error: "anime_id é obrigatório" });

  const rows = db.prepare(`
    SELECT * FROM comments
    WHERE anime_id = ?
    ORDER BY created_at DESC
  `).all(anime_id);

  res.json(rows);
});

// INICIAR SERVIDOR
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

console.log("Chegou no final do arquivo!");

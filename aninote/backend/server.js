console.log("Iniciando backend...");

const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

//cria o servidor e permite requisições de outros domínios
const app = express();
app.use(cors());
app.use(express.json());

// conexão com o banco
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

/* ==========================
        CREATE
========================== */
app.post('/comments', (req, res) => {
  const { anime_id, user_name, text } = req.body;

  if (!anime_id || !user_name || !text)
    return res.status(400).json({ error: "anime_id, user_name e text são obrigatórios" });

  // Recebe um comentário do frontend.
  // Valida se veio anime_id, user_name e text.
  // Insere no banco de dados:

  const stmt = db.prepare(`
    INSERT INTO comments (anime_id, user_name, text)
    VALUES (?, ?, ?)
  `);
  // Retorna o comentário recém-criado para o frontend.

  const info = stmt.run(anime_id, user_name, text);

  const newComment = db.prepare(`SELECT * FROM comments WHERE id = ?`)
                       .get(info.lastInsertRowid);

  res.status(201).json(newComment);
});

/* ==========================
          READ
========================== */
app.get('/comments', (req, res) => {
  const { anime_id } = req.query;

  if (!anime_id)
    return res.status(400).json({ error: "anime_id é obrigatório" });

  // Recebe o anime_id pela URL.
  // Busca todos os comentários daquele anime:

  const rows = db.prepare(`
    SELECT * FROM comments
    WHERE anime_id = ?
    ORDER BY created_at DESC
  `).all(anime_id);

  // retorna para o frontend

  res.json(rows);
});

/* ==========================
          UPDATE
========================== */
app.put('/comments/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Texto atualizado é obrigatório" });
  }

  const stmt = db.prepare(`UPDATE comments SET text = ? WHERE id = ?`);
  const result = stmt.run(text, id);

  if (result.changes === 0)
    return res.status(404).json({ error: "Comentário não encontrado" });

  const updated = db.prepare("SELECT * FROM comments WHERE id = ?").get(id);
  res.json(updated);
});

/* ==========================
          DELETE
========================== */
app.delete('/comments/:id', (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare(`DELETE FROM comments WHERE id = ?`);
  const result = stmt.run(id);

  // Recebe o id do comentário pela URL.

  if (result.changes === 0)
    return res.status(404).json({ error: "Comentário não encontrado" });

  res.json({ message: "Comentário removido com sucesso" });
});

/* ==========================
       INICIAR SERVIDOR
========================== */
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

console.log("Chegou no final do arquivo!");

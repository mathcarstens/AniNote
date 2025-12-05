import { useState, useEffect } from "react"; // Importa hooks do React
import { useParams } from "react-router-dom"; // Pega o ID da URL (rota dinâmica)

export default function AnimeDetails() {
  const { id } = useParams(); // Obtém o ID do anime pela URL

  const [anime, setAnime] = useState(null); // Guarda os dados do anime puxado da API

  const [name, setName] = useState(""); // Nome do usuário no formulário
  const [comment, setComment] = useState(""); // Comentário digitado no formulário

  const [comments, setComments] = useState([]); // Lista de comentários do backend

  // Controle da edição de comentários
  const [editingId, setEditingId] = useState(null); // ID do comentário que está sendo editado
  const [editingText, setEditingText] = useState(""); // Texto editado

  // --------------------------- FETCH DO ANIME ---------------------------
  useEffect(() => {
    // Chama a API Jikan para buscar os dados do anime
    fetch(`https://api.jikan.moe/v4/anime/${id}`)
      .then((res) => res.json())
      .then((data) => setAnime(data.data)); // Salva os dados recebidos
  }, [id]); // Atualiza quando o ID mudar

  // --------------------------- CARREGAR COMENTÁRIOS ---------------------------
  function loadComments() {
    // Faz GET no backend passando anime_id como filtro
    fetch(`http://localhost:4000/comments?anime_id=${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data)); // Salva a lista de comentários
  }

  useEffect(() => {
    loadComments(); // Carrega comentários ao abrir a página
  }, [id]);

  // --------------------------- CRIAR COMENTÁRIO (POST) ---------------------------
  async function sendComment(e) {
    e.preventDefault(); // Evita recarregar a página

    if (!name.trim() || !comment.trim()) return; // Evita enviar campos vazios

    // Envia novo comentário para o backend (POST)
    await fetch("http://localhost:4000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anime_id: id,   // Relaciona o comentário ao anime
        user_name: name,
        text: comment,
      }),
    });

    setName(""); // Limpa campo nome
    setComment(""); // Limpa campo de texto

    loadComments(); // Recarrega a lista
  }

  // --------------------------- SALVAR EDIÇÃO (PUT) ---------------------------
  async function saveEdit(commentId) {
    // Atualiza somente o texto do comentário
    await fetch(`http://localhost:4000/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editingText }),
    });

    setEditingId(null); // Sai do modo de edição
    setEditingText(""); // Limpa textarea
    loadComments(); // Recarrega lista atualizada
  }

  // --------------------------- EXCLUIR COMENTÁRIO (DELETE) ---------------------------
  async function deleteComment(commentId) {
    await fetch(`http://localhost:4000/comments/${commentId}`, {
      method: "DELETE", // Requisição de exclusão
    });

    loadComments(); // Atualiza lista
  }

  // Caso o anime ainda esteja carregando:
  if (!anime) return <div className="text-white p-4">Carregando...</div>;

  // --------------------------- RENDERIZAÇÃO ---------------------------
  return (
    <div style={{
      padding: "20px",
      maxWidth: "900px",
      margin: "0 auto",
      color: "white",
      fontFamily: "Arial"
    }}>
      
      {/* Título do anime */}
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>{anime.title}</h1>

      {/* Área da imagem + sinopse */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "30px"
      }}>
        {/* Capa */}
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          style={{
            width: "240px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
          }}
        />

        {/* Sinopse */}
        <p style={{ flex: 1, lineHeight: "1.6", color: "#cfcfcf" }}>
          {anime.synopsis}
        </p>
      </div>

      {/* FORMULÁRIO DE COMENTÁRIO */}
      <div style={{
        background: "#1f1f1f",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #333",
        marginBottom: "30px"
      }}>
        <h2 style={{ marginBottom: "15px", fontSize: "22px" }}>
          Deixe seu Comentário
        </h2>

        {/* Campo nome */}
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)} // Atualiza estado nome
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #555",
            marginBottom: "10px",
            background: "#2c2c2c",
            color: "white"
          }}
        />

        {/* Campo comentário */}
        <textarea
          placeholder="Seu comentário..."
          value={comment}
          onChange={(e) => setComment(e.target.value)} // Atualiza texto
          style={{
            width: "100%",
            padding: "12px",
            minHeight: "120px",
            borderRadius: "6px",
            border: "1px solid #555",
            background: "#2c2c2c",
            color: "white"
          }}
        />

        {/* Botão enviar */}
        <button
          onClick={sendComment}
          style={{
            marginTop: "12px",
            background: "#4f46e5",
            color: "white",
            padding: "12px 22px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            border: "none",
            transition: "0.2s"
          }}
        >
          Enviar Comentário
        </button>
      </div>

      {/* Título da lista de comentários */}
      <h2 style={{ marginBottom: "10px", fontSize: "22px" }}>Comentários</h2>

      {/* Caso não tenha comentários */}
      {comments.length === 0 && (
        <p style={{ color: "#aaa" }}>Nenhum comentário ainda.</p>
      )}

      {/* Lista de comentários */}
      {comments.map((c) => (
        <div
          key={c.id} // ID único
          style={{
            background: "#2a2a2a",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #444",
            marginBottom: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        >
          {/* Nome do usuário */}
          <strong style={{ fontSize: "18px" }}>{c.user_name}</strong>

          {/* MODO DE EDIÇÃO */}
          {editingId === c.id ? (
            <>
              {/* Campo de texto editável */}
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #666",
                  background: "#333",
                  color: "white"
                }}
              />

              {/* Botão salvar edição */}
              <button
                onClick={() => saveEdit(c.id)}
                style={{
                  marginTop: "10px",
                  background: "green",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "10px"
                }}
              >
                Salvar
              </button>

              {/* Cancelar edição */}
              <button
                onClick={() => {
                  setEditingId(null); // Sai do modo edição
                }}
                style={{
                  marginTop: "10px",
                  background: "gray",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              {/* Comentário normal */}
              <p style={{ margin: "8px 0", color: "#ddd" }}>{c.text}</p>

              {/* Data/Hora */}
              <small style={{ color: "#888" }}>
                {new Date(c.created_at).toLocaleString()}
              </small>

              <br />

              {/* Botão que ativa modo edição */}
              <button
                onClick={() => {
                  setEditingId(c.id);    // Guarda ID sendo editado
                  setEditingText(c.text); // Coloca texto atual no textarea
                }}
                style={{
                  marginTop: "10px",
                  background: "#4f46e5",
                  color: "white",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "10px"
                }}
              >
                Editar
              </button>

              {/* Botão excluir */}
              <button
                onClick={() => deleteComment(c.id)} // Chama DELETE
                style={{
                  marginTop: "10px",
                  background: "red",
                  color: "white",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Excluir
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
} // react + VITE

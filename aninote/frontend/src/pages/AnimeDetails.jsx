import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const [comments, setComments] = useState([]);

  // Buscar dados do anime
  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/anime/${id}`)
      .then((res) => res.json())
      .then((data) => setAnime(data.data));
  }, [id]);

  // Buscar comentários do backend
  function loadComments() {
    fetch(`http://localhost:4000/comments?anime_id=${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }

  useEffect(() => {
    loadComments();
  }, [id]);

  // Enviar comentário
  async function sendComment(e) {
    e.preventDefault();

    if (!name.trim() || !comment.trim()) return;

    await fetch("http://localhost:4000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anime_id: id,
        user_name: name,
        text: comment,
      }),
    });

    setName("");
    setComment("");

    loadComments(); // recarregar lista
  }

  if (!anime) return <div className="text-white p-4">Carregando...</div>;

  return (
  <div style={{
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
    color: "white",
    fontFamily: "Arial"
  }}>
    
    {/* Título */}
    <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>{anime.title}</h1>

    {/* Imagem + Sinopse */}
    <div style={{
      display: "flex",
      gap: "20px",
      marginBottom: "30px"
    }}>
      <img
        src={anime.images.jpg.large_image_url}
        alt={anime.title}
        style={{
          width: "240px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
        }}
      />

      <p style={{ flex: 1, lineHeight: "1.6", color: "#cfcfcf" }}>
        {anime.synopsis}
      </p>
    </div>

    {/* Formulário */}
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

      <input
        type="text"
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
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

      <textarea
        placeholder="Seu comentário..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
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

    {/* Lista de comentários */}
    <h2 style={{ marginBottom: "10px", fontSize: "22px" }}>Comentários</h2>

    {comments.length === 0 && (
      <p style={{ color: "#aaa" }}>Nenhum comentário ainda.</p>
    )}

    {comments.map((c) => (
      <div
        key={c.id}
        style={{
          background: "#2a2a2a",
          padding: "15px",
          borderRadius: "8px",
          border: "1px solid #444",
          marginBottom: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
        }}
      >
        <strong style={{ fontSize: "18px" }}>{c.user_name}</strong>
        <p style={{ margin: "8px 0", color: "#ddd" }}>{c.text}</p>
        <small style={{ color: "#888" }}>
          {new Date(c.created_at).toLocaleString()}
        </small>
      </div>
    ))}
  </div>
);
}
// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [topAnimes, setTopAnimes] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  // Carregar top animes
  useEffect(() => {
    fetch("https://api.jikan.moe/v4/top/anime")
      .then((res) => res.json())
      .then((data) => setTopAnimes(data.data || []))
      .catch(() => setTopAnimes([]));
  }, []);

  // Buscar animes digitados (debounce simples)
  useEffect(() => {
    if (search.length === 0) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(search)}&limit=24`)
        .then((res) => res.json())
        .then((data) => setResults(data.data || []))
        .catch(() => setResults([]));
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const list = search.length > 0 ? results : topAnimes;

  return (
    <div className="home-container">
      <h1 className="home-title">{search.length > 0 ? "Resultados da busca" : "Top Animes"}</h1>

      <input
        type="text"
        placeholder="Pesquisar anime..."
        className="home-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="anime-grid">
        {list.map((anime) => (
          <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`} className="anime-link">
            <div className="anime-card">
              <div className="anime-thumb">
                <img src={anime.images?.jpg?.image_url} alt={anime.title} />
              </div>
              <div className="anime-info">
                <div className="anime-title">{anime.title}</div>
                <div className="anime-year">{anime.year ?? "Ano descon."}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
// Possui links que levam para a página de detalhes
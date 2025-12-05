function Header() { // cabeçalho do site // possui o titulo
  return (
    <header style={{ background: "#111", color: "white", padding: "16px 20px" }}>
      <h1 style={{ margin: 0 }}>AniNote</h1>
      <div style={{ fontSize: "0.9rem", color: "#ddd" }}>Rastreie animes e deixe suas reviews</div>
    </header>
  );
}

export default Header;
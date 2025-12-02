import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav style={{ display: "flex", gap: "12px", padding: "10px 20px", background: "#222" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
    </nav>
  );
}

export default NavBar;

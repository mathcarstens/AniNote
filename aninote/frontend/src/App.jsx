import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnimeDetails from "./pages/AnimeDetails";
import Header from "./components/Header";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <Header />
      <NavBar />

      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
// Define as rotas do site
// Importa componentes globais ex: header e navbar
// Renderiza as páginas conforme o endereço da URL


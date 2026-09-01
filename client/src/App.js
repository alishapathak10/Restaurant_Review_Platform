import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import RestaurantDetail from "./components/RestaurantDetail";
import OwnerDashboard from "./components/OwnerDashboard";
import AuthPage from "./components/AuthPage";
import "./styles.css";

function Nav() {

  return (
    <nav className="nav">
      <Link to="/">Restaurant Review Platform</Link>
      <div className="nav-links">

      <Link to="/login">Log in / Register</Link>

      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import RestaurantDetail from "./components/RestaurantDetail";
import OwnerDashboard from "./components/OwnerDashboard";
import AuthPage from "./components/AuthPage";
import { getCurrentUser, clearSession } from "./api";
import "./styles.css";

function Nav() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <Link to="/">Restaurant Review Platform</Link>
      <div className="nav-links">
        {user && user.role === "owner" && <Link to="/owner">My Dashboard</Link>}
        {user ? (
          <button
            onClick={() => {
              clearSession();
              navigate("/");
              window.location.reload();
            }}
          >
            Log out ({user.name})
          </button>
        ) : (
          <Link to="/login">Log in / Register</Link>
        )}
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

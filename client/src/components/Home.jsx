import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Home() {
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState(null); 
  const [error, setError] = useState("");

  async function runSearch(q) {
    try {
      setError("");
      const results = await api.searchRestaurants(q);
      setRestaurants(results);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    runSearch("");
  }, []);

  return (
    <div className="page">
      <h1>Find a restaurant</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
      >
        <input
          type="text"
          placeholder="Search restaurants / cuisine..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      {restaurants === null && <p>Loading...</p>}

      {restaurants && restaurants.length === 0 && (
        <div className="empty-state">No restaurants match your search.</div>
      )}

      <div className="card-list">
        {restaurants &&
          restaurants.map((r) => (
            <Link to={`/restaurants/${r._id}`} className="card" key={r._id}>
              <h3>{r.name}</h3>
              <p>{r.cuisine} - {r.location}</p>
              <p>
                {r.averageRating ? `★ ${r.averageRating}` : "No ratings yet"}{" "}
                ({r.reviews.length} reviews)
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
}

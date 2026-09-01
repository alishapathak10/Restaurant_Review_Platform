import { useEffect, useState } from "react";
import { api, getCurrentUser } from "../api";

export default function OwnerDashboard() {
  const user = getCurrentUser();
  const [restaurant, setRestaurant] = useState(null);
  const [form, setForm] = useState({ name: "", cuisine: "", location: "", openingHours: "", description: "" });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);


  const restaurantId = localStorage.getItem("myRestaurantId");

  useEffect(() => {
    if (restaurantId) {
      api.getRestaurant(restaurantId).then(setRestaurant).catch((e) => setError(e.message));
    }
  }, [restaurantId]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      const created = await api.createRestaurant(form);
      localStorage.setItem("myRestaurantId", created._id);
      setRestaurant(created);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    try {
      const updated = await api.updateRestaurant(restaurant._id, restaurant);
      setRestaurant(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRespond(reviewId, responseText) {
    try {
      const updatedReview = await api.respondToReview(restaurant._id, reviewId, responseText);
      setRestaurant((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) => (r._id === reviewId ? { ...r, ownerResponse: updatedReview.ownerResponse } : r)),
      }));
    } catch (err) {
      setError(err.message);
    }
  }

  if (!user || user.role !== "owner") return <p>Log in as a restaurant owner to view this page.</p>;

  if (!restaurant) {
    return (
      <div className="page">
        <h1>Create your restaurant listing</h1>
        <form onSubmit={handleCreate}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Cuisine" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} required />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <input placeholder="Opening hours" value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {error && <p className="error">{error}</p>}
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>My Restaurant Listing</h1>
      <form onSubmit={handleUpdate}>
        <input value={restaurant.name} onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })} />
        <input value={restaurant.cuisine} onChange={(e) => setRestaurant({ ...restaurant, cuisine: e.target.value })} />
        <input value={restaurant.location} onChange={(e) => setRestaurant({ ...restaurant, location: e.target.value })} />
        <input value={restaurant.openingHours} onChange={(e) => setRestaurant({ ...restaurant, openingHours: e.target.value })} />
        <textarea value={restaurant.description} onChange={(e) => setRestaurant({ ...restaurant, description: e.target.value })} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Save</button>
        {saved && <span className="success-toast">Saved!</span>}
      </form>

      <h3>Reviews to respond to</h3>
      {restaurant.reviews.length === 0 && <div className="empty-state">No reviews yet.</div>}
      <ul className="review-list">
        {restaurant.reviews.map((r) => (
          <OwnerReviewRow key={r._id} review={r} onRespond={(text) => handleRespond(r._id, text)} />
        ))}
      </ul>
    </div>
  );
}

function OwnerReviewRow({ review, onRespond }) {
  const [text, setText] = useState(review.ownerResponse || "");
  return (
    <li className="review-item">
      <p>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} - {review.dinerName}</p>
      <p>{review.comment}</p>
      <input
        placeholder="Write a response..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={() => onRespond(text)} disabled={!text.trim()}>Reply</button>
    </li>
  );
}

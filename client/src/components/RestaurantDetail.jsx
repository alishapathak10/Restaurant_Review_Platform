import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, getCurrentUser } from "../api";
import ReviewForm from "./ReviewForm";


export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const user = getCurrentUser();

  async function load() {
    try {
      const data = await api.getRestaurant(id);
      setRestaurant(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleReviewSubmitted(newReview) {
    setRestaurant((prev) => ({ ...prev, reviews: [...prev.reviews, newReview] }));
    setSuccessMessage("Review posted - thank you for your feedback!");
    setTimeout(() => setSuccessMessage(""), 4000);
  }

  if (error) return <p className="error">{error}</p>;
  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="page">
      <h1>{restaurant.name}</h1>
      <p>{restaurant.cuisine} - {restaurant.location}</p>
      <p>{restaurant.openingHours}</p>
      <p>{restaurant.description}</p>
      <p>
        {restaurant.averageRating ? `★ ${restaurant.averageRating} / 5` : "No ratings yet"}{" "}
        ({restaurant.reviews.length} reviews)
      </p>

      {user && user.role === "diner" && (
        <ReviewForm restaurantId={restaurant._id} onSubmitted={handleReviewSubmitted} />
      )}
      {!user && <p><em>Log in as a diner to leave a review.</em></p>}

      {successMessage && <div className="success-toast">{successMessage}</div>}

      <h3>Reviews</h3>
      {restaurant.reviews.length === 0 && (
        <div className="empty-state">Be the first to review this restaurant.</div>
      )}
      <ul className="review-list">
        {restaurant.reviews.map((r) => (
          <li key={r._id} className="review-item">
            <p>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)} - {r.dinerName}</p>
            <p>{r.comment}</p>
            {r.ownerResponse && (
              <p className="owner-response"><strong>Owner reply:</strong> {r.ownerResponse}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

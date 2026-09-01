import { useState } from "react";
import { api } from "../api";

export default function ReviewForm({ restaurantId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a comment before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const saved = await api.submitReview(restaurantId, { rating, comment });
      setComment("");
      setRating(0);
      onSubmitted(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4>Leave a review</h4>
      <div className="star-input">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            className={n <= rating ? "star filled" : "star"}
            onClick={() => setRating(n)}
            aria-label={`${n} star`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

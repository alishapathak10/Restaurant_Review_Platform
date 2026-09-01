const express = require("express");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const { requireAuth, requireRole, requireRestaurantOwnership } = require("../middleware/auth");

const router = express.Router();


router.post("/:restaurantId/reviews", requireAuth, requireRole("diner"), async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {

      return res.status(400).json({ message: "rating must be an integer between 1 and 5" });
    }
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "comment is required" });
    }

    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const diner = await User.findById(req.user.id);

    restaurant.reviews.push({
      diner: diner._id,
      dinerName: diner.name,
      rating: numericRating,
      comment: comment.trim(),
    });
    await restaurant.save();

    const savedReview = restaurant.reviews[restaurant.reviews.length - 1];

    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review", error: err.message });
  }
});

router.put("/:restaurantId/reviews/:reviewId", requireAuth, requireRole("diner"), async (req, res) => {
  const { rating, comment } = req.body;
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

  const review = restaurant.reviews.id(req.params.reviewId);
  if (!review) return res.status(404).json({ message: "Review not found" });

  if (review.diner.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can only edit your own review" });
  }

  if (rating !== undefined) {
    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "rating must be an integer between 1 and 5" });
    }
    review.rating = numericRating;
  }
  if (comment !== undefined) {
    if (!comment.trim()) return res.status(400).json({ message: "comment cannot be empty" });
    review.comment = comment.trim();
  }

  await restaurant.save();
  res.json(review);
});

router.delete("/:restaurantId/reviews/:reviewId", requireAuth, requireRole("diner"), async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

  const review = restaurant.reviews.id(req.params.reviewId);
  if (!review) return res.status(404).json({ message: "Review not found" });

  if (review.diner.toString() !== req.user.id) {
    return res.status(403).json({ message: "You can only delete your own review" });
  }

  review.deleteOne();
  await restaurant.save();
  res.status(204).send();
});

router.post(
  "/:restaurantId/reviews/:reviewId/response",
  requireAuth,
  requireRole("owner"),
  requireRestaurantOwnership, 
  async (req, res) => {
    const { response } = req.body;
    if (!response || !response.trim()) {
      return res.status(400).json({ message: "response text is required" });
    }

    const review = req.restaurant.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.ownerResponse = response.trim();
    await req.restaurant.save();
    res.json(review);
  }
);

module.exports = router;

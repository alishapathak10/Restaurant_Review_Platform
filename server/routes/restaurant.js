const express = require("express");
const Restaurant = require("../models/Restaurant");
const { requireAuth, requireRole, requireRestaurantOwnership } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const { query } = req.query;
  const filter = query
    ? { $or: [
        { name: new RegExp(query, "i") },
        { cuisine: new RegExp(query, "i") },
        { location: new RegExp(query, "i") },
      ] }
    : {};

  const restaurants = await Restaurant.find(filter).select("-reviews.comment -reviews.ownerResponse");

  res.json(restaurants);
});

router.get("/:id", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate("owner", "name");
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
  res.json(restaurant);
});

router.post("/", requireAuth, requireRole("owner"), async (req, res) => {
  try {
    const { name, cuisine, location, openingHours, description } = req.body;
    if (!name || !cuisine || !location) {
      return res.status(400).json({ message: "name, cuisine and location are required" });
    }
    const restaurant = await Restaurant.create({
      owner: req.user.id,
      name,
      cuisine,
      location,
      openingHours,
      description,
    });
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: "Failed to create restaurant", error: err.message });
  }
});

router.put(
  "/:restaurantId",
  requireAuth,
  requireRole("owner"),
  requireRestaurantOwnership, 
  async (req, res) => {
    const { name, cuisine, location, openingHours, description } = req.body;
    const restaurant = req.restaurant;

    if (name) restaurant.name = name;
    if (cuisine) restaurant.cuisine = cuisine;
    if (location) restaurant.location = location;
    if (openingHours !== undefined) restaurant.openingHours = openingHours;
    if (description !== undefined) restaurant.description = description;

    await restaurant.save();
    res.json(restaurant);
  }
);

module.exports = router;

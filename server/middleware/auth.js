const jwt = require("jsonwebtoken");
const Restaurant = require("../models/Restaurant");


function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Only ${role}s can perform this action` });
    }
    next();
  };
}

async function requireRestaurantOwnership(req, res, next) {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not own this restaurant" });
    }
    req.restaurant = restaurant; 
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid restaurant id" });
  }
}

module.exports = { requireAuth, requireRole, requireRestaurantOwnership };

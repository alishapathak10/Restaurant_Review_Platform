const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema(
  {
    diner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dinerName: { type: String, required: true }, 
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
    ownerResponse: { type: String, trim: true, maxlength: 1000, default: null },
  },
  { timestamps: true }
);

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    openingHours: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

restaurantSchema.virtual("averageRating").get(function () {
  if (!this.reviews.length) return null;
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});

restaurantSchema.set("toJSON", { virtuals: true });
restaurantSchema.index({ name: "text", cuisine: "text", location: "text" });

module.exports = mongoose.model("Restaurant", restaurantSchema);

const mongoose = require("mongoose")

// ── Sub-schema for individual reviews ────────────────────────────────────────
const ReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required for a review"]
        },
        name: {
            type: String,
            default: "Anonymous"
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot be greater than 5"]
        },
        comment: {
            type: String,
            required: [true, "Comment is required"],
            trim: true
        }
    },
    { timestamps: true }   // gives createdAt / updatedAt per review
)

// ── Main Product schema ───────────────────────────────────────────────────────
const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product Name Is Mandatory"],
            trim: true
        },
        maincategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Maincategory",
            required: [true, "Select Maincategory"]
        },
        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory",
            required: [true, "Select Subcategory"]
        },
        resturent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resturent",
            required: [true, "Select Resturent"]
        },
        pic: {
            type: String,
            required: [true, "Product Pic Is Mandatory"]
        },
        basePrice: {
            type: Number,
            required: [true, "Base Price Is Mandatory"]
        },
        discount: {
            type: Number,
            required: [true, "Discount Is Mandatory"],
            default: 0
        },
        finalPrice: {
            type: Number,
            required: [true, "Final Price Is Mandatory"]
        },
        description: {
            type: String,
            required: [true, "Description Of Dish Is Mandatory"],
            trim: true
        },

        // ── Average rating (auto-computed on every review save) ───────────────
        rating: {
            type: Number,
            default: 0,
            min: [0, "Rating cannot be negative"],
            max: [5, "Rating cannot be greater than 5"]
        },

        availability: {
            type: Boolean,
            default: true
        },
        active: {
            type: Boolean,
            default: true
        },

        // ── Reviews array using the sub-schema ────────────────────────────────
        reviews: {
            type: [ReviewSchema],
            default: []
        }
    },
    { timestamps: true }
)

// ── Helper: recalculate average rating from reviews array ─────────────────────
ProductSchema.methods.recalcRating = function () {
    if (!this.reviews || this.reviews.length === 0) {
        this.rating = 0
    } else {
        const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0)
        this.rating = Math.round((sum / this.reviews.length) * 10) / 10  // 1 decimal
    }
}

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product
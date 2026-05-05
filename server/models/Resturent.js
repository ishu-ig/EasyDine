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
    { timestamps: true }
)

// ── Main Resturent schema ─────────────────────────────────────────────────────
const ResturentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, "Resturent Name Is Mandatory"],
            trim: true
        },
        pic: {
            type: String,
            required: [true, "Resturent Pic Is Mandatory"]
        },
        phone: {
            type: Number,
            required: [true, "Contact Number Is Mandatory"]
        },
        seatAvailable: {
            type: Number,
            required: [true, "Number Of Seats Available Is Mandatory"]
        },
        reservationPrice: {
            type: Number,
            required: [true, "Reservation Price Is Mandatory"]
        },
        discount: {
            type: Number,
            required: [true, "Discount Is Mandatory"]
        },
        finalPrice: {
            type: Number,
            required: [true, "Final Price is Mandatory"]
        },
        address: {
            type: String,
            required: [true, "Address Is Mandatory"]
        },

        // ── Average rating (auto-computed from reviews) ───────────────────────
        rating: {
            type: Number,
            default: 0,
            min: [0, "Rating cannot be negative"],
            max: [5, "Rating cannot be greater than 5"]
        },

        openTime: {
            type: String,
            required: [true, "Open Time Is Mandatory"]
        },
        closeTime: {
            type: String,
            required: [true, "Close Time Is Mandatory"]
        },
        status: {
            type: Boolean,
            default: true
        },
        active: {
            type: Boolean,
            default: true
        },

        // ── Reviews array ─────────────────────────────────────────────────────
        reviews: {
            type: [ReviewSchema],
            default: []
        }
    },
    { timestamps: true }
)

// ── Helper: recalculate average rating from reviews ───────────────────────────
ResturentSchema.methods.recalcRating = function () {
    if (!this.reviews || this.reviews.length === 0) {
        this.rating = 0
    } else {
        const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0)
        this.rating = Math.round((sum / this.reviews.length) * 10) / 10
    }
}

const Resturent = mongoose.model("Resturent", ResturentSchema)

module.exports = Resturent
const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Name Is Mendatory"]
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
        required: [true, "Product Pic Is Mendatory"]
    },
    basePrice: {
        type: Number,
        required: [true, "Base Price Is Mendatory"]
    },
    discount: {
        type: Number,
        required: [true, "Base Price Is Mendatory"]
    },
    finalPrice: {
        type: Number,
        required: [true, "Base Price Is Mendatory"]
    },
    description: {
        type: String,
        required: [true, "Description Of Dish Is Mendatory"]
    },
    rating: {
        type: Number,
        required: [true, "Rating Is Mendatory"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be greater than 5"]
    },
    availability: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Product = new mongoose.model("Product", ProductSchema)

module.exports = Product 
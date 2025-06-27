const mongoose = require("mongoose")

const CheckoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Is Mendatory"]
    },
    orderStatus: {
        type: String,
        default: "Order Is Placed"
    },
    paymentMode: {
        type: String,
        default: "COD"
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
    subtotal: {
        type: Number,
        required: [true, "Subtotal Feild is Mendatory"]
    },
    deliveryCharge: {
        type: Number,
        required: [true, "Shipping Feild is Mendatory"]
    },
    total: {
        type: Number,
        required: [true, "Total Feild is Mendatory"]
    },
    rppid: {
        type: String,
        default: ""
    },
    products: []
}, { timestamps: true })

const Checkout = new mongoose.model("Checkout", CheckoutSchema)

module.exports = Checkout 
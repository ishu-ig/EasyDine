const mongoose = require("mongoose")

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Is Mendatory"]
    },
    resturent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resturent",
        required: [true, "Resturent Id Is Mendatory"]
    },
    paymentMode: {
        type: String,
        default: "COD"
    },
    paymentStatus: {
        type: String,
        default: "Pending"
    },
    bookingStatus: {
        type: String,
        default: true
    },
    date: {
        type: String,
        required: [true, "Date Is Mendatory"]
    },
    time: {
        type: String,
        required: [true, "Times Is Mendatory"]
    },
    seats: {
        type: Number,
        required: [true, "Number of Seats Is Mendatory"]
    },
    rppid: {
        type: String,
        default: "-258964"
    },
    total: {
        type: Number,
        required: [true, "Price Is Mendatory"]
    },
},{timestamps:true})

const Booking = new mongoose.model("Booking", BookingSchema)

module.exports = Booking 
const mongoose = require("mongoose")

const ResturentSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Resturent Name Is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Resturent Pic Is Mendatory"]
    },
    phone: {
        type: Number,
        required: [true, "Contact Number Is Mendatory"]
    },
    seatAvailable: {
        type: Number,
        required: [true, "Number Of Seats Available Is Mendatory"]
    },
    reservationPrice: {
        type: Number,
        required: [true, "Reservation Price Is Mendatory"]
    },
    discount: {
        type: Number,
        required: [true, "Discount Is Mendatory"]
    },
    finalPrice: {
        type: Number,
        required: [true, "Final Price is Mendatory"]
    },
    address: {
        type: String,
        required: [true, "Address Is Mendatory"]
    },
    rating: {
        type: Number,
        required: [true, "Rating Is Mendatory"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be greater than 5"]
    },
    openTime: {
        type: String,
        required: [true, "Open Time Is Mendatory"]
    },
    closeTime: {
        type: String,
        required: [true, "Close Time Is Mendatory"]
    },
    status: {
        type: Boolean,
        default: true
    },
    active: {
        type: Boolean,
        default: true
    }
},{ timestamps: true })

const Resturent = new mongoose.model("Resturent", ResturentSchema)

module.exports = Resturent 
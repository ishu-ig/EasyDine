const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full Name Is Mendatory"]
    },
    username: {
        type: String,
        unique: true,
        required: [true, "Username Is Mendatory"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email Address Is Mendatory"]
    },
    phone: {
        type: Number,
        required: [true, "Contact Number Is Mendatory"]
    },
    password: {
        type: String,
        required: [true, "Password Is Mendatory"]
    },
    role: {
        type: String,
        default: "Buyer"
    },
    pic: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    pin: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: "-234567"
    },
    active: {
        type: Boolean,
        default: true
    }
})

const User = new mongoose.model("User", UserSchema)

module.exports = User 
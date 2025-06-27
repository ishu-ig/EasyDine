const mongoose = require("mongoose")

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Feild Is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Testimonial Pic Is Mendatory"]
    },
    message: {
        type: String,
        required: [true, "Message Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
},{ timestamps: true })

const Testimonial = new mongoose.model("Testimonial", TestimonialSchema)

module.exports = Testimonial 
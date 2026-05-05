const Resturent = require("../models/Resturent")
const fs = require("fs")

// ── Shared helper: extract Mongoose validation messages ───────────────────────
function extractValidationErrors(error) {
    const fields = [
        "name", "pic", "phone", "seatAvailable", "reservationPrice",
        "discount", "finalPrice", "address", "rating", "openTime", "closeTime"
    ]
    const errorMessage = {}
    if (error.keyValue) errorMessage.name = "Resturent Already Exists"
    fields.forEach(field => {
        if (error.errors?.[field]) {
            errorMessage[field] = error.errors[field].message
        }
    })
    return errorMessage
}

// ── CREATE ────────────────────────────────────────────────────────────────────
async function createRecord(req, res) {
    try {
        let data = new Resturent(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        res.status(201).send({ result: "Done", data })

    } catch (error) {
        if (req.file) {
            try { fs.unlinkSync(req.file.path) } catch (_) {}
        }

        const errorMessage = extractValidationErrors(error)

        if (Object.keys(errorMessage).length === 0) {
            console.error("createRecord error:", error)
            return res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        }
        res.status(400).send({ result: "Fail", reason: errorMessage })
    }
}

// ── GET ALL ───────────────────────────────────────────────────────────────────
async function getRecord(req, res) {
    try {
        let data = await Resturent.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data })

    } catch (error) {
        console.error("getRecord error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ── GET SINGLE ────────────────────────────────────────────────────────────────
async function getSingleRecord(req, res) {
    try {
        let data = await Resturent.findById(req.params._id)
            .populate("reviews.user", ["name", "email"])

        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }
        res.send({ result: "Done", data })

    } catch (error) {
        console.error("getSingleRecord error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ── UPDATE (admin — full update with optional pic) ────────────────────────────
async function updateRecord(req, res) {
    try {
        let data = await Resturent.findById(req.params._id)
        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }

        // Update fields
        data.name             = req.body.name             ?? data.name
        data.phone            = req.body.phone            ?? data.phone
        data.seatAvailable    = req.body.seatAvailable    ?? data.seatAvailable
        data.reservationPrice = req.body.reservationPrice ?? data.reservationPrice
        data.finalPrice       = req.body.finalPrice       ?? data.finalPrice
        data.discount         = req.body.discount         ?? data.discount
        data.address          = req.body.address          ?? data.address
        data.openTime         = req.body.openTime         ?? data.openTime
        data.closeTime        = req.body.closeTime        ?? data.closeTime
        data.status           = req.body.status           ?? data.status
        data.active           = req.body.active           ?? data.active
        // NOTE: rating is excluded — managed by reviews only

        // Handle pic update BEFORE saving to avoid stale path issues
        if (req.file) {
            try { fs.unlinkSync(data.pic) } catch (_) {}
            data.pic = req.file.path
        }

        await data.save()
        res.send({ result: "Done", data })

    } catch (error) {
        if (req.file) {
            try { fs.unlinkSync(req.file.path) } catch (_) {}
        }

        const errorMessage = extractValidationErrors(error)

        if (Object.keys(errorMessage).length === 0) {
            console.error("updateRecord error:", error)
            return res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        }
        res.status(400).send({ result: "Fail", reason: errorMessage })
    }
}

// ── UPDATE SINGLE (user — only seatAvailable) ─────────────────────────────────
async function updateSingleRecord(req, res) {
    try {
        let data = await Resturent.findById(req.params._id)
        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }

        data.seatAvailable = req.body.seatAvailable ?? data.seatAvailable
        await data.save()
        res.send({ result: "Done", data })

    } catch (error) {
        console.error("updateSingleRecord error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
async function deleteRecord(req, res) {
    try {
        let data = await Resturent.findById(req.params._id)
        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }

        if (data.pic) {
            try { fs.unlinkSync(data.pic) } catch (_) {}
        }
        await data.deleteOne()
        res.send({ result: "Done", data })

    } catch (error) {
        console.error("deleteRecord error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ── ADD REVIEW ────────────────────────────────────────────────────────────────
async function addReview(req, res) {
    try {
        const { rating, comment } = req.body

        // ── Validate inputs ───────────────────────────────────────────────────
        if (!comment || comment.trim() === "") {
            return res.status(400).send({ result: "Fail", reason: "Comment is required" })
        }

        const parsedRating = Number(rating)
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).send({ result: "Fail", reason: "Rating must be a number between 1 and 5" })
        }

        // ── Find resturent (was wrongly using Product.findOne before!) ─────────
        let data = await Resturent.findById(req.params._id)
        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Resturent Not Found" })
        }

        // ── Resolve user from middleware or body fallback ─────────────────────
        const userId   = (req.user?._id || req.body.user)?.toString()
        const userName = req.user?.name || req.body.name || "Anonymous"

        if (!userId) {
            return res.status(401).send({ result: "Fail", reason: "User identification is required to post a review" })
        }

        // ── Prevent duplicate review from the same user ───────────────────────
        const alreadyReviewed = data.reviews.some(r => r.user?.toString() === userId)
        if (alreadyReviewed) {
            return res.status(400).send({ result: "Fail", reason: "You have already reviewed this resturent" })
        }

        // ── Push new review ───────────────────────────────────────────────────
        data.reviews.push({
            user:    userId,
            name:    userName,
            rating:  parsedRating,
            comment: comment.trim()
        })

        // ── Recalculate average rating ────────────────────────────────────────
        data.recalcRating()

        await data.save()

        res.status(201).send({
            result:        "Done",
            reviewCount:   data.reviews.length,
            averageRating: data.rating,
            reviews:       data.reviews
        })

    } catch (error) {
        console.error("addReview error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ── DELETE REVIEW (owner or admin) ────────────────────────────────────────────
async function deleteReview(req, res) {
    try {
        const { _id, reviewId } = req.params

        let data = await Resturent.findById(_id)
        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Resturent Not Found" })
        }

        const reviewIndex = data.reviews.findIndex(r => r._id.toString() === reviewId)
        if (reviewIndex === -1) {
            return res.status(404).send({ result: "Fail", reason: "Review Not Found" })
        }

        const requesterId = (req.user?._id || req.body.user)?.toString()
        const isOwner = data.reviews[reviewIndex].user?.toString() === requesterId
        const isAdmin = req.user?.role === "admin"

        if (!isOwner && !isAdmin) {
            return res.status(403).send({ result: "Fail", reason: "Not authorized to delete this review" })
        }

        data.reviews.splice(reviewIndex, 1)
        data.recalcRating()
        await data.save()

        res.send({
            result:        "Done",
            reviewCount:   data.reviews.length,
            averageRating: data.rating,
            reviews:       data.reviews
        })

    } catch (error) {
        console.error("deleteReview error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ── GET REVIEWS ───────────────────────────────────────────────────────────────
async function getReviews(req, res) {
    try {
        let data = await Resturent.findById(req.params._id)
            .select("reviews rating")
            .populate("reviews.user", ["name", "email"])

        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Resturent Not Found" })
        }

        res.send({
            result:        "Done",
            reviewCount:   data.reviews.length,
            averageRating: data.rating,
            reviews:       data.reviews
        })

    } catch (error) {
        console.error("getReviews error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    updateSingleRecord,
    deleteRecord,
    addReview,
    deleteReview,
    getReviews
}
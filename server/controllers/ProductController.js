const Product = require("../models/Product")
const { deleteFromCloudinary } = require("../cloudinaryMethods");

// ── Shared helper: extract Mongoose validation messages ───────────────────────
function extractValidationErrors(error) {
    const fields = [
        "name", "pic", "maincategory", "subcategory",
        "resturent", "basePrice", "finalPrice", "discount",
        "description", "rating"
    ]
    const errorMessage = {}
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
        let data = new Product(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()

        let finalData = await Product.findById(data._id)
            .populate("maincategory", ["name"])
            .populate("subcategory",  ["name"])
            .populate("resturent",    ["name"])

        res.status(201).send({ result: "Done", data: finalData })

    } catch (error) {
        // Delete uploaded file if save failed
        if (req.file) await deleteFromCloudinary(req.file.path);

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
        // Optional query filters: ?active=true&availability=true&maincategory=<id>
        const filter = {}
        if (req.query.active        !== undefined) filter.active        = req.query.active === "true"
        if (req.query.availability  !== undefined) filter.availability  = req.query.availability === "true"
        if (req.query.maincategory)                filter.maincategory  = req.query.maincategory
        if (req.query.subcategory)                 filter.subcategory   = req.query.subcategory
        if (req.query.resturent)                   filter.resturent     = req.query.resturent

        let data = await Product.find(filter)
            .sort({ _id: -1 })
            .populate("maincategory", ["name"])
            .populate("subcategory",  ["name"])
            .populate("resturent",    ["name"])

        res.send({ result: "Done", count: data.length, data })

    } catch (error) {
        console.error("getRecord error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ── GET SINGLE ────────────────────────────────────────────────────────────────
async function getSingleRecord(req, res) {
    try {
        let data = await Product.findById(req.params._id)
            .populate("maincategory",    ["name"])
            .populate("subcategory",     ["name"])
            .populate("resturent",       ["name"])
            .populate("reviews.user",    ["name", "email"])   // populate reviewer info

        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }

        res.send({ result: "Done", data })

    } catch (error) {
        console.error("getSingleRecord error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
async function updateRecord(req, res) {
    try {
        let existing = await Product.findById(req.params._id).lean()

        if (!existing) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }

        // Normalize pic — guard against legacy corrupted array data
        let currentPic = Array.isArray(existing.pic)
            ? existing.pic[existing.pic.length - 1]
            : existing.pic

        let updatePayload = {
            name:         req.body.name         ?? existing.name,
            maincategory: req.body.maincategory  ?? existing.maincategory,
            subcategory:  req.body.subcategory   ?? existing.subcategory,
            resturent:    req.body.resturent     ?? existing.resturent,
            basePrice:    req.body.basePrice     ?? existing.basePrice,
            discount:     req.body.discount      ?? existing.discount,
            finalPrice:   req.body.finalPrice    ?? existing.finalPrice,
            description:  req.body.description   ?? existing.description,
            availability: req.body.availability  ?? existing.availability,
            active:       req.body.active        ?? existing.active,
            pic:          currentPic,
        }
        // NOTE: rating is intentionally excluded — it is managed by addReview

        if (req.file) {
            await deleteFromCloudinary(updatePayload.pic);
            updatePayload.pic = req.file.path
        }

        let finalData = await Product.findByIdAndUpdate(
            req.params._id,
            updatePayload,
            { new: true, runValidators: true }
        )
            .populate("maincategory", ["name"])
            .populate("subcategory",  ["name"])
            .populate("resturent",    ["name"])

        res.send({ result: "Done", data: finalData })

    } catch (error) {
        if (req.file) await deleteFromCloudinary(req.file.path);

        const errorMessage = extractValidationErrors(error)

        if (Object.keys(errorMessage).length === 0) {
            console.error("updateRecord error:", error)
            return res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        }
        res.status(400).send({ result: "Fail", reason: errorMessage })
    }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
async function deleteRecord(req, res) {
    try {
        let data = await Product.findById(req.params._id)

        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }

        // Remove image from disk
        if (data.pic) await deleteFromCloudinary(data.pic);

        await data.deleteOne()
        res.send({ result: "Done", data })

    } catch (error) {
        console.error("deleteRecord error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ── ADD REVIEW ────────────────────────────────────────────────────────────────
// Expects: req.user._id (set by verifyBoth middleware), body: { rating, comment }
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

        // ── Find product ──────────────────────────────────────────────────────
        let data = await Product.findById(req.params._id)
        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Product Not Found" })
        }

        // ── Resolve user from middleware (req.user) or body fallback ─────────
        const userId   = (req.user?._id || req.body.user)?.toString()
        const userName = req.user?.name || req.body.name || "Anonymous"

        if (!userId) {
            return res.status(401).send({ result: "Fail", reason: "User identification is required to post a review" })
        }

        // ── Prevent duplicate review from the same user ───────────────────────
        const alreadyReviewed = data.reviews.some(r => r.user?.toString() === userId)
        if (alreadyReviewed) {
            return res.status(400).send({ result: "Fail", reason: "You have already reviewed this product" })
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
            result:       "Done",
            reviewCount:  data.reviews.length,
            averageRating: data.rating,
            reviews:      data.reviews
        })

    } catch (error) {
        console.error("addReview error:", error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ── DELETE REVIEW (admin or review owner) ─────────────────────────────────────
async function deleteReview(req, res) {
    try {
        const { _id, reviewId } = req.params

        let data = await Product.findById(_id)
        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Product Not Found" })
        }

        const reviewIndex = data.reviews.findIndex(r => r._id.toString() === reviewId)
        if (reviewIndex === -1) {
            return res.status(404).send({ result: "Fail", reason: "Review Not Found" })
        }

        // Only the review owner OR an admin can delete
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

// ── GET REVIEWS for a product ─────────────────────────────────────────────────
async function getReviews(req, res) {
    try {
        let data = await Product.findById(req.params._id)
            .select("reviews rating")
            .populate("reviews.user", ["name", "email"])

        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Product Not Found" })
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
    deleteRecord,
    addReview,
    deleteReview,
    getReviews
}
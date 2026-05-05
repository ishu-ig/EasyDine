const ProductRouter = require("express").Router()
const { productUploader } = require("../middleware/fileuploader")
const { verifyAdmin, verifyBoth } = require("../middleware/authorization")

const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
    addReview,
    deleteReview,
    getReviews,
} = require("../controllers/ProductController")

// ── Product CRUD ──────────────────────────────────────────────────────────────
ProductRouter.post(   "",      verifyAdmin, productUploader.single("pic"), createRecord)
ProductRouter.get(    "",                                                   getRecord)
ProductRouter.get(    "/:_id",                                              getSingleRecord)
ProductRouter.put(    "/:_id", verifyAdmin, productUploader.single("pic"), updateRecord)
ProductRouter.delete( "/:_id", verifyAdmin,                                deleteRecord)

// ── Review routes  ────────────────────────────────────────────────────────────
// GET    /product/:_id/review          → list all reviews for a product (public)
// POST   /product/:_id/review          → add a review       (logged-in users)
// DELETE /product/:_id/review/:reviewId → delete a review   (owner or admin)
ProductRouter.get(    "/:_id/review",             getReviews)
ProductRouter.post(   "/:_id/review", verifyBoth, addReview)
ProductRouter.delete( "/:_id/review/:reviewId", verifyBoth, deleteReview)

module.exports = ProductRouter
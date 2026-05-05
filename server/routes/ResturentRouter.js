const ResturentRouter = require("express").Router()
const { resturentUploader } = require("../middleware/fileuploader")
const { verifyAdmin, verifyBoth } = require("../middleware/authorization")

const { createRecord,
    getRecord,
    updateRecord,
    getSingleRecord,
    deleteRecord,
    updateSingleRecord,
    addReview,
    getReviews,
    deleteReview,
} = require("../controllers/ResturentController")



ResturentRouter.post("", verifyAdmin, resturentUploader.single("pic"), createRecord)
ResturentRouter.get("", getRecord)
ResturentRouter.get("/:_id", getSingleRecord)
ResturentRouter.put("/user/:_id",verifyBoth, updateSingleRecord)
ResturentRouter.put("/:_id", verifyAdmin, resturentUploader.single("pic"), updateRecord)
ResturentRouter.delete("/:_id", verifyAdmin, deleteRecord)
ResturentRouter.get(    "/:_id/review",             getReviews)
ResturentRouter.post(   "/:_id/review", verifyBoth, addReview)
ResturentRouter.delete( "/:_id/review/:reviewId", verifyBoth, deleteReview)

module.exports = ResturentRouter
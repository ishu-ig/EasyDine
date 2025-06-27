const TestimonialRouter = require("express").Router()
const { testimonialUploader } = require("../middleware/fileuploader")
const { verifyBoth, verifyAdmin } = require("../middleware/authorization")

const { createRecord,
    getRecord,
    updateRecord,
    getSingleRecord,
    deleteRecord,
} = require("../controllers/TestimonialController")



TestimonialRouter.post("", verifyBoth, testimonialUploader.single("pic"), createRecord)
TestimonialRouter.get("", getRecord)
TestimonialRouter.get("/:_id", getSingleRecord)
TestimonialRouter.put("/:_id", verifyAdmin, testimonialUploader.single("pic"), updateRecord)
TestimonialRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = TestimonialRouter
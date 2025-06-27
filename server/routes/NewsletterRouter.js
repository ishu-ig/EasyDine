const NewsletterRouter = require("express").Router()

const { createRecord,
    getRecord,
    updateRecord,
    getSingleRecord,
    deleteRecord,
} = require("../controllers/NewsletterController")
const { verifyAdmin, verifyBoth } = require("../middleware/authorization")


NewsletterRouter.post("", verifyBoth, createRecord)
NewsletterRouter.get("", verifyAdmin, getRecord)
NewsletterRouter.get("/:_id", verifyAdmin, getSingleRecord)
NewsletterRouter.put("/:_id", verifyAdmin, updateRecord)
NewsletterRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = NewsletterRouter
const ContactUsRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/authorization")

const { createRecord,
    getRecord,
    updateRecord,
    getSingleRecord,
    deleteRecord,
} = require("../controllers/ContactUsController")



ContactUsRouter.post("", createRecord)
ContactUsRouter.get("", verifyAdmin, getRecord)
ContactUsRouter.get("/:_id", verifyAdmin, getSingleRecord)
ContactUsRouter.put("/:_id", verifyAdmin, updateRecord)
ContactUsRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = ContactUsRouter
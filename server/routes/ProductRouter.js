const ProductRouter = require("express").Router()
const { productUploader } = require("../middleware/fileuploader")
const { verifyAdmin } = require("../middleware/authorization")

const { createRecord,
    getRecord,
    updateRecord,
    getSingleRecord,
    deleteRecord,
} = require("../controllers/ProductController")



ProductRouter.post("", verifyAdmin, productUploader.single("pic"), createRecord)
ProductRouter.get("", getRecord)
ProductRouter.get("/:_id", getSingleRecord)
ProductRouter.put("/:_id", verifyAdmin, productUploader.single("pic"), updateRecord)
ProductRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = ProductRouter
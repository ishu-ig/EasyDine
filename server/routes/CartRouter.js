const CartRouter = require("express").Router()
const { verifyBoth } = require("../middleware/authorization")

const { createRecord,
    getRecord,
    updateRecord,
    getSingleRecord,
    deleteRecord,
} = require("../controllers/CartController")



CartRouter.post("", verifyBoth, createRecord)
CartRouter.get("/:userid", verifyBoth, getRecord)
CartRouter.get("/:_id", verifyBoth, getSingleRecord)
CartRouter.put("/:_id", verifyBoth, updateRecord)
CartRouter.delete("/:_id", verifyBoth, deleteRecord)

module.exports = CartRouter
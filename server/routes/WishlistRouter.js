const WishlistRouter = require("express").Router()
const { verifyBoth } = require("../middleware/authorization")

const { createRecord,
    getRecord,
    updateRecord,
    getSingleRecord,
    deleteRecord,
} = require("../controllers/WishlistController")



WishlistRouter.post("",verifyBoth, createRecord)
WishlistRouter.get("/:userid",verifyBoth, getRecord)
WishlistRouter.get("/:_id",verifyBoth, getSingleRecord)
WishlistRouter.delete("/:_id",verifyBoth, deleteRecord)

module.exports = WishlistRouter
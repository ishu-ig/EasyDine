const BookingRouter = require("express").Router()
const { verifyAdmin, verifyBoth } = require("../middleware/authorization")

const { createRecord,
    getRecord,
    updateRecord,
    getSingleRecord,
    deleteRecord,
    getUserRecord,
    order,
    verifyOrder
} = require("../controllers/BookingController");



BookingRouter.post("" ,createRecord);
BookingRouter.get("", verifyAdmin, getRecord);
BookingRouter.get("/user/:userid", verifyBoth, getUserRecord);
BookingRouter.get("/single/:_id", getSingleRecord);
BookingRouter.put("/:_id", verifyBoth, updateRecord);
BookingRouter.delete("/:_id", verifyBoth, deleteRecord);
BookingRouter.post("/order", verifyBoth, order);
BookingRouter.post("/verify", verifyBoth, verifyOrder);

module.exports = BookingRouter
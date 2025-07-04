const Checkout = require("../models/Checkout")
const Razorpay = require("razorpay")
const mailer = require("../mailer/index")

//Payment API
async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR"
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}

async function verifyOrder(req, res) {
    try {
        var check = await Checkout.findOne({ _id: req.body.checkid })
        check.rppid = req.body.razorpay_payment_id
        check.paymentStatus = "Done"
        check.paymentMode = "Net Banking"
        await check.save()
        res.send({ result: "Done", message: "Payment SuccessFull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}
async function createRecord(req, res) {
    try {
        let data = new Checkout(req.body)
        await data.save()
        let finalData = await Checkout.findOne({ _id: data._id })
            .populate("user", ["name", "username", "email", "phone", "state", "city", "pin", "address"])
            .populate({
                path: "products.product",
                select: "name mincategory resturent basePrice pic",
                populate: [
                    {
                        path: "maincategory",
                        select: "-_id name"
                    },
                    {
                        path: "resturent",
                        select: "-_id name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({
            result: "Done",
            data: finalData
        })
    } catch (error) {


        let errorMessage = {}
        error.errors?.user ? errorMessage.user = error.errors.user.message : null
        error.errors?.subtotal ? errorMessage.subtotal = error.errors.subtotal.message : null
        error.errors?.shipping ? errorMessage.shipping = error.errors.shipping.message : null
        error.errors?.total ? errorMessage.total = error.errors.total.message : null

        if (Object.values(errorMessage).length === 0) {
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            })
        }
        else {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
            })
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await Checkout.find().sort({ _id: -1 })
            .populate("user", ["name", "username", "email", "phone", "state", "city", "pin", "address"])
            .populate({
                path: "products.product",
                select: "name mincategory resturent basePrice pic",
                populate: [
                    {
                        path: "maincategory",
                        select: "-_id name"
                    },
                    {
                        path: "resturent",
                        select: "-_id name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({
            result: "Done",
            count: data.length,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getUserRecord(req, res) {
    try {
        let data = await Checkout.find({ user: req.params.userid }).sort({ _id: -1 })
            .populate("user", ["name", "username", "email", "phone", "address", "pin", "city", "state"])
            .populate({
                path: "products.product",
                select: "name mincategory resturent basePrice pic",
                populate: [
                    {
                        path: "maincategory",
                        select: "-_id name"
                    },
                    {
                        path: "resturent",
                        select: "-_id name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        res.send({
            result: "Done",
            count: data.length,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
            .populate("user", ["name", "username", "email", "phone", "state", "city", "pin", "address"])
            .populate({
                path: "products.product",
                select: "name mincategory resturent basePrice pic",
                populate: [
                    {
                        path: "maincategory",
                        select: "-_id name"
                    },
                    {
                        path: "resturent",
                        select: "-_id name"
                    }
                ],
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
        if (data) {
            let previousOrderStatus = data.orderStatus
            data.orderStatus = req.body.orderStatus ?? data.orderStatus
            data.paymentMode = req.body.paymentMode ?? data.paymentMode
            data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus
            data.rppid = req.body.rppid ?? data.rppid
            await data.save()

            let finalData = await Checkout.findOne({ _id: data._id })
                .populate("user", ["name", "username", "email", "phone", "state", "city", "pin", "address"])
                .populate({
                    path: "products.product",
                    select: "name mincategory resturent basePrice pic",
                    populate: [
                        {
                            path: "maincategory",
                            select: "-_id name"
                        },
                        {
                            path: "resturent",
                            select: "-_id name"
                        }
                    ],
                    options: {
                        slice: {
                            pic: 1
                        }
                    }
                })
                if (req.body.orderStatus && req.body.orderStatus !== previousOrderStatus) {
                    let statusMessage = "";
    
                    // Customize email message based on the order status
                    switch (req.body.orderStatus.toLowerCase()) {
                        case "order is under Process":
                            statusMessage = "Your order will be packed soon. It will reach you soon!";
                            break;
                        case "order is placed":
                            statusMessage = "Your order has been shipped. It will reach you soon!";
                            break;
                        case "order is packed":
                            statusMessage = "Your order has been packed. It will reach you soon!";
                            break;
                        case "out for delivery":
                            statusMessage = "Your order is out for delivery. Please be ready to receive it.";
                            break;
                        case "delivered":
                            statusMessage = "Your order has been successfully delivered. Thank you for choosing us!";
                            break;
                        default:
                            statusMessage = `Your order status has been updated to: ${req.body.orderStatus}.`;
                            break;
                    }
                    mailer.sendMail({
                        from: process.env.MAIL_SENDER,
                        to: finalData.user.email,
                        subject: `Order Status Updated - Team ${process.env.SITE_NAME}`,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                                <h2 style="color: #28a745;">Hello,</h2>
                                <p style="color: #555;">
                                ${statusMessage}
                                </p>
                                <p style="color: #555;">
                                    If you have any questions, please <a href="${process.env.SERVER}/contact" style="color: #007bff;">contact us</a>.
                                </p>
                                <p style="color: #555;">Best Regards, <br> Team ${process.env.SITE_NAME}</p>
                            </div>
                        `,
                    }, (error) => {
                        if (error) console.log("Error sending email:", error);
                        // else console.log("Order status update email sent successfully.");
                    });
    
                }
            res.send({
                result: "Done",
                data: finalData
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {

        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    getUserRecord: getUserRecord,
    deleteRecord: deleteRecord,
    order:order,
    verifyOrder : verifyOrder
}
const Product = require("../models/Product")
const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Product(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        let finalData = await Product.findOne({ _id: data._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("resturent", ["name"])
        res.send({
            result: "Done",
            data: finalData
        })
    } catch (error) {

        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null
        error.errors?.maincategory ? errorMessage.maincategory = error.errors.maincategory.message : null
        error.errors?.subcateory ? errorMessage.subcateory = error.errors.subcateory.message : null
        error.errors?.resturent ? errorMessage.resturent = error.errors.resturent.message : null
        error.errors?.basePrice ? errorMessage.basePrice = error.errors.basePrice.message : null
        error.errors?.finalPrice ? errorMessage.finalPrice = error.errors.finalPrice.message : null
        error.errors?.discount ? errorMessage.discount = error.errors.discount.message : null
        error.errors?.description ? errorMessage.description = error.errors.description.message : null
        error.errors?.rating ? errorMessage.rating = error.errors.rating.message : null
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
        let data = await Product.find().sort({ _id: -1 })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("resturent", ["name"])
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
        let data = await Product.findOne({ _id: req.params._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("resturent", ["name"])
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
        // Use lean findOne to avoid Mongoose casting the corrupted pic array
        let existing = await Product.findOne({ _id: req.params._id }).lean()

        if (!existing) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" })
        }

        // Normalize pic in case it's stored as an array (corrupted data fix)
        let currentPic = Array.isArray(existing.pic) ? existing.pic[existing.pic.length - 1] : existing.pic

        let updatePayload = {
            name:         req.body.name         ?? existing.name,
            maincategory: req.body.maincategory  ?? existing.maincategory,
            subcategory:  req.body.subcategory   ?? existing.subcategory,   // ← was data.Product (bug!)
            resturent:    req.body.resturent      ?? existing.resturent,
            basePrice:    req.body.basePrice      ?? existing.basePrice,
            discount:     req.body.discount       ?? existing.discount,
            finalPrice:   req.body.finalPrice     ?? existing.finalPrice,
            description:  req.body.description    ?? existing.description,
            rating:       req.body.rating         ?? existing.rating,
            availability: req.body.availability   ?? existing.availability,
            active:       req.body.active         ?? existing.active,
            pic:          currentPic,             // keep existing pic (string) by default
        }

        // If a new file was uploaded, delete the old one and use the new path
        if (req.file) {
            try { fs.unlinkSync(currentPic) } catch (_) {}
            updatePayload.pic = req.file.path
        }

        let finalData = await Product.findOneAndUpdate(
            { _id: req.params._id },
            updatePayload,
            { new: true, runValidators: true }
        )
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("resturent", ["name"])

        res.send({ result: "Done", data: finalData })

    } catch (error) {
        try { fs.unlinkSync(req.file.path) } catch (_) {}
        console.log(error)
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
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
    deleteRecord: deleteRecord
}
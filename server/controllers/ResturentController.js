const Resturent = require("../models/Resturent")
const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Resturent(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {

        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Resturent Already Exist" : null
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null
        error.errors?.seatAvailable ? errorMessage.seatAvailable = error.errors.seatAvailable.message : null
        error.errors?.reservationPrice ? errorMessage.reservationPrice = error.errors.reservationPrice.message : null
        error.errors?.discount ? errorMessage.discount = error.errors.discount.message : null
        error.errors?.address ? errorMessage.address = error.errors.address.message : null
        error.errors?.rating ? errorMessage.rating = error.errors.rating.message : null
        error.errors?.openTime ? errorMessage.openTime = error.errors.openTime.message : null
        error.errors?.closeTime ? errorMessage.closeTime = error.errors.closeTime.message : null

        if (Object.values(errorMessage).length === 0) {
            console.log(error)
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
        let data = await Resturent.find().sort({ _id: -1 })
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
        let data = await Resturent.findOne({ _id: req.params._id })
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
        let data = await Resturent.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.phone = req.body.phone ?? data.phone
            data.seatAvailable = req.body.seatAvailable ?? data.seatAvailable
            data.reservationPrice = req.body.reservationPrice ?? data.reservationPrice
            data.finalPrice = req.body.finalPrice ?? data.finalPrice
            data.discount = req.body.discount ?? data.discount
            data.address = req.body.address ?? data.address
            data.rating = req.body.rating ?? data.rating
            data.openTime = req.body.openTime ?? data.openTime
            data.closeTime = req.body.closeTime ?? data.closeTime
            data.status = req.body.status ?? data.status
            data.active = req.body.active ?? data.active
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
                await data.save()
            }
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
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }
        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Resturent already Exist" : null

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

async function updateSingleRecord(req, res) {
    try {
        let data = await Resturent.findOne({ _id: req.params._id })
        if (data) {
            data.seatAvailable = req.body.seatAvailable ?? data.seatAvailable
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
                await data.save()
            }
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
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }
        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Resturent already Exist" : null

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

async function deleteRecord(req, res) {
    try {
        let data = await Resturent.findOne({ _id: req.params._id })
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
    updateSingleRecord:updateSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord
}
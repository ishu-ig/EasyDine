require("mongoose")
    .connect("mongodb+srv://ishaangupta124:ishaan1234@cluster0.s6twihx.mongodb.net/EasyDine")
    .then(() => {
        console.log("Dabata Base is Connected")
    })
    .catch(error => {
        console.log(error)
    })
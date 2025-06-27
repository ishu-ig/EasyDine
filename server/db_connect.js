require("mongoose")
    .connect(process.env.DB_KEY)
    .then(() => {
        console.log("Dabata Base is Connected")
        console.log(process.env.DB_KEY)
    })
    .catch(error => {
        console.log(error)
    })
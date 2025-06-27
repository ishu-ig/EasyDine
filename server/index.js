const express = require("express")
const cors = require("cors")
require("dotenv").config()
require("./db_connect")
const app = express()

const Router = require("./routes/index")
var whitelist = ['http://localhost:4000', 'http://localhost:8000', 'http://localhost:5000']
var corsOptions = {
    origin: function (origin, callback) {
        // console.log("Origin", origin)
        if (whitelist.includes(origin) !== -1)
            callback(null, true)
        else
            callback(new Error('CORS Error, You Are not authenciated to access this api'))
    }
}

app.use(cors(corsOptions))
app.use(express.json())                     //used to parse incomming json data
app.use("/public", express.static("public"))

app.use("/api", Router)

let port = process.env.PORT || 8000
app.listen(port, console.log(`Server is Running at http://localhost:8000`))
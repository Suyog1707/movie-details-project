import express from "express"
import cookieparser from "cookie-parser"
import cors from "cors"
import http from "http"
import routes from "./routes/index.js"

const app = express()

app.use(cors())
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(
    "/",
    (req,res) => {
        res.send("Server is Running Properly")
    })
app.use("api/v1", routes)

export const server = http.createServer(app)

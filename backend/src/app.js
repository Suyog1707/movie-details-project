import express from "express"
import cookieparser from "cookie-parser"
import cors from "cors"
import http from "http"

const app = express()

app.use(cors())
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

export const server = http.createServer(app)

import express from "express"
import cookieparser from "cookie-parser"
import cors from "cors"
import http from "http"
import routes from "./routes/index.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(
  cors({
    origin: [
      "https://cineverse-swart.vercel.app",
      "http://localhost:5173",
      "http://localhost"
    ],
    credentials: true,
  })
);
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get(
  "/",
  (req, res) => {
    res.send("Server is Running Properly")
  })
app.use("/api/v1", routes)

export const server = http.createServer(app)

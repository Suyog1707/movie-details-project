import express from "express"
import userRouter from "./user.router.js"
import mediaRouter from "./media.router.js"
import personRouter from "./person.router.js"
import reviewRouter from "./review.router.js"

const router = express.Router()

router.use("/user", userRouter)
router.use("/person", personRouter)
router.use("/reviews", reviewRouter)
router.use("/:mediaType", mediaRouter)

export default router
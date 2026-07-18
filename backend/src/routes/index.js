import express from "express"
import userRouter from "./user.router.js"
import mediaRouter from "./media.router.js"
import personRouter from "./person.router.js"
import reviewRouter from "./review.router.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.use("/user", userRouter)
router.use(
    "/person",
    verifyJWT,
    personRouter
)
router.use(
    "/reviews",
    verifyJWT,
    reviewRouter
)
router.use(
    "/:mediaType",
    verifyJWT,
    mediaRouter
)

export default router
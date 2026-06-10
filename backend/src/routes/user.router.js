import express from "express"
import { body } from "express-validator"
import favoriteController from "../controllers/favorite.controller.js"
import userController from "../controllers/user.controller.js"
import requestHandler from "../handlers/request.handler.js"
import User from "../models/user.model.js"
import tokenMiddleware from "../middleware/token.middleware.js"

const router = express.Router()

router.post(
    "/signup",
    body("userName")
        .exists().withMessage("Username is required")
        .isLength({ min: 8 }).withMessage("Username minimum 8 charaters")
        .custom(async value => {
            const user = await User.findOne({ userName: value })

            if (user)
                return Promise.reject("Username already used")
        }),
    body("password")
        .exists().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password minimum 8 charaters"),
    body("confirmPassword")
        .exists().withMessage("confirm password is required")
        .isLength({ min: 8 }).withMessage("Confirm password minimum 8 charaters")
        .custom(async (value, { req }) => {
            if (value !== req.body.password)
                throw new Error("confirm password doesn't match")
            return true
        }),
    body("displayName")
        .exists().withMessage("Display name is required")
        .isLength({ min: 8 }).withMessage("Display name minimum 8 charaters"),
    requestHandler.validate,
    userController.signUp
)

router.post(
    "/signin",
    body("userName")
        .exists().withMessage("Username is required")
        .isLength({ min: 8 }).withMessage("Username minimum 8 charaters"),
    body("password")
        .exists().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password minimum 8 charaters"),
    requestHandler.validate,
    userController.signIn
)

router.put(
    "/update-password",
    tokenMiddleware.auth,
    body("password")
        .exists().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password minimum 8 charaters"),
    body("newPassword")
        .exists().withMessage("New password is required")
        .isLength({ min: 8 }).withMessage("New password minimum 8 charaters"),
    body("confirmNewPassword")
        .exists().withMessage("Confirm new password is required")
        .isLength({ min: 8 }).withMessage("Confirm new password minimum 8 charaters")
        .custom(async (value, { req }) => {
            if (value !== req.body.newPassword)
                throw new Error("confirm new password doesn't match")
            return true
        }),
    requestHandler.validate,
    userController.updatePassword
)

router.get(
    "/info",
    tokenMiddleware.auth,
    userController.getInfo
)

router.get(
    "/favorites",
    tokenMiddleware.auth,
    favoriteController.getFavoritesOfUser
)

router.post(
    "/favorites",
    tokenMiddleware.auth,
    body("mediatype")
        .exists().withMessage("mediatype password is required")
        .custom(type => ["movie", "tv"].includes(type)).withMessage("mediatype invalid"),
    body("mediaId")
        .exists().withMessage("mediaId is required")
        .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
    body("mediaTitle")
        .exists().withMessage("mediaTitle is required"),
    body("mediaPoster")
        .exists().withMessage("mediaPoster is required"),
    body("mediaRate")
        .exists().withMessage("mediaRate is required"),
    requestHandler.validate,
    favoriteController.addFavorite
)

router.delete(
    "/favorites/:favoriteId",
    tokenMiddleware.auth,
    favoriteController.removeFavorite
)

export default router
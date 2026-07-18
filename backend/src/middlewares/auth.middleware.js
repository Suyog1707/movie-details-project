import responseHandler from "../handlers/response.handler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return responseHandler.unauthorize(res)
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findOne({ userName: decodedToken.userName });

        if (!user) {
            return responseHandler.badrequest(res, "Invalid Access Token")
        }

        req.user = user

        next()
    } catch (error) {
        console.error(error);
        return responseHandler.unauthorize(res);
    }
}
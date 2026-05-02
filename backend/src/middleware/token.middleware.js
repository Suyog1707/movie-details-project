import jsonwebtoken from "jsonwebtoken"
import {ApiResponce} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"

const tokenDecode = (req) => {
    try {
        const bearerHeader = req.header["authorization"]

        if(bearerHeader) {
            const token = bearerHeader.split(" ")[1]

            return jsonwebtoken.verify(
                token,
                process.env.TOKEN_SECRET
            )
        }

        return false
    } catch (error) {
        return false
    }
}

const auth = async(req, res, next) => {
    const tokenDecoded = tokenDecode(req)

    if (!tokenDecode) {
        throw new ApiError(401, "Unauthorized Request");
    }

    const user = await User.findById(tokenDecoded.data)

    if (!user) {
        throw new ApiError(401, "Unauthorized Request")
    }

    req.user = user

    next()
}

export default {
    auth,
    tokenDecode
}
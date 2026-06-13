import User from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signUp = async (req, res) => {
    try {
        const { userName, displayName, password, confirmPassword } = req.body

        if (!userName || !displayName || !password || !confirmPassword)
            return responseHandler.badrequest(res, "All fields are required")

        if (!(password === confirmPassword))
            return responseHandler.badrequest(res, "Password and Confirm password should be same")

        const checkUser = await User.findOne({ userName })

        if (checkUser) {
            return responseHandler.badrequest(res, "userName already exsist")
        }

        const user = new User()

        user.userName = userName
        user.displayName = displayName
        user.setPassword(password)

        await user.save()

        const token = jsonwebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expiresIn: "24h" }
        )

        responseHandler.created(res, {
            token,
            ...user._doc,
            id: user.id
        })

    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const signIn = async (req, res) => {
    try {
        const { userName, password } = req.body

        const user = await User.findOne({ userName }).select("userName password salt id displayName")

        if (!user)
            return responseHandler.badrequest(res, "userName dosen't exsist")

        if (!user.validPassword(password))
            return responseHandler.badrequest(res, "Password incorrect")

        const token = jsonwebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expiresIn: "24h" }
        )

        user.password = undefined
        user.salt = undefined

        responseHandler.created(res, {
            token,
            ...user._doc,
            id: user.id
        })

    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const updatePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body

        const user = await User.findById(req.user.id).select("password id salt")

        if (!user)
            return responseHandler.unauthorize(res)

        if (!user.validPassword(password))
            return responseHandler.badrequest(res, "Passsword incorrect")

        user.setPassword(newPassword)

        await user.save()

        responseHandler.ok(res)
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const getInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user)
            return responseHandler.notFound(res)

        return responseHandler.ok(res, user)
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

export default {
    signUp,
    signIn,
    updatePassword,
    getInfo
}
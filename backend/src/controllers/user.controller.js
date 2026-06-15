import User from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save(
            { validateBeforeSave: false }
        )

        return { accessToken, refreshToken }
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

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

        responseHandler
            .created(res, {
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

        user.password = undefined
        user.salt = undefined

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id)

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }

        responseHandler
            .ok(
                res.cookie("accessToken", accessToken, options)
                    .cookie("refreshToken", refreshToken, options),
                {
                    ...user._doc,
                    id: user.id
                }
            )


    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const signOut = async (req, res) => {

    try {
        await User.findByIdAndUpdate(
            req.user.id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }

        return responseHandler.ok(res, "User sign-out successfully")
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)

    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const refreshAccessToken = async (req, res) => {
    const inComingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!inComingRefreshToken) {
        return responseHandler.unauthorize(res)
    }

    const decodedToken = jsonwebtoken.verify(inComingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?.id)

    if (!user) {
        return responseHandler.badrequest(res, "Invalid refresh token")
    }

    if (inComingRefreshToken !== user.refreshToken) {
        return responseHandler.badrequest(res, "Refresh Token is expired or used")
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user.id)

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return responseHandler
        .ok(
            res.cookie("accessToken", newAccessToken, options)
                .cookie("refreshToken", newRefreshToken, options),
            `Access Token refreshed accessToken: ${newAccessToken} refreshToken: ${newRefreshToken}`
        )
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

const updateProfile = async (req, res) => {
    try {
        const { displayName, bio } = req.body

        if (!displayName && !bio)
            return responseHandler.badrequest(res, "all fields are required")

        const user = await User.findByIdAndUpdate(
            req.user?.id,
            {
                $set: {
                    displayName: displayName,
                    bio: bio
                }
            },
            { new: true }
        ).select("-password -refreshToken")

        responseHandler.ok(res, "details changed successfully")

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
    generateAccessAndRefreshToken,
    signUp,
    signIn,
    signOut,
    refreshAccessToken,
    updateProfile,
    updatePassword,
    getInfo
}
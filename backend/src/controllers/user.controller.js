import { User } from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const signUp = async (req, res) => {
    try {
        const { userName, fullName, password, confirmPassword } = req.body

        if (!userName || !fullName || !password || !confirmPassword) {
            throw new ApiError(401, "All fields are required")
        }

        if (!(password === confirmPassword)) {
            throw new ApiError(401, "Password and ConfirmPassword should be same")
        }

        const checkUser = await User.findOne(userName)

        if (checkUser) {
            throw new ApiError(401, "User already exist")
        }

        let avaterImageLocalPath;

        if (req.files && Array.isArray(req.files.avaterImage) && req.files.avaterImage.length > 0) {
            avaterImageLocalPath = req.files.avaterImage[0].path
        }

        const avaterImage = await uploadOnCloudinary(avaterImageLocalPath, "avater")

        const user = await User.create({
            userName,
            fullName,
            avaterImage: {
                url: avaterImage?.secure_url,
                public_id: avaterImage?.public_id
            } || {
                url: "https://res.cloudinary.com/spidyboy-1707/image/upload/v1777763508/avaterImage.png",
                public_id: avaterImage
            },
            password
        })

        const createdUser = await User.findById(user.id)

        if (!createdUser) {
            throw new ApiError(500, "somthing went wrong while creating user")
        }

        const token = jsonwebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expiresIn: "24h" }
        )

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        token,
                        user: createdUser._doc,
                        id: user.id
                    }
                )
            )
    } catch (error) {
        throw new ApiError(500, "Somthing went Wrong")
    }
}
import mongoose from "mongoose";
import modelOptions from "./model.options.js";
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
}, modelOptions)

userSchema.method.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex")

    this.password = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        'sha512'
    ).toString("hex")
}

userSchema.method.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        'sha512'
    ).toString("hex")

    return this.password === hash
}

const User = mongoose.model("User", userSchema)

export default User
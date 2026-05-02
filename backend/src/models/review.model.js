import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

const reviewSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        enum: ["tv", "movie"],
        required: true
    },
    mediaID: {
        type: String,
        required: true
    },
    mediaPoster: {
        type: String,
        required: true
    },
    mediaTitle: {
        type: String,
        required: true
    },
}, modelOptions)

export const Review = mongoose.model("Review", reviewSchema)
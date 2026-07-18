import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

const favoriteSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mediaId: {
    type: Number,
    required: true
  },
},
  modelOptions)

export const Favorite = mongoose.model("Favorite", favoriteSchema)
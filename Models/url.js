import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  longURL: {
    type: String,
    required: true,
    trim: true,
  },
  shortId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clicks: {
    type: Number,
    default: 0,
  },
});

export const URLs = mongoose.model("URL", urlSchema);

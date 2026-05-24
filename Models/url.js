import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  longURL: {
    type: String,
    required: [true, "longURL is required"],
    trim: true,
  },
  shortId: {
    type: String,
    required: [true, "shortId is required"],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster lookups on shortId
urlSchema.index({ shortId: 1 });

const URL = mongoose.model("URL", urlSchema);

export default URL;

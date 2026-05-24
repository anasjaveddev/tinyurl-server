import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    longURL: {
        type: String,
        required: true,
        trim: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    clicks: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        default: null
    }
});

// Index for faster lookups
urlSchema.index({ shortCode: 1 });
urlSchema.index({ longURL: 1 });

export const URLs = mongoose.model("URL", urlSchema);
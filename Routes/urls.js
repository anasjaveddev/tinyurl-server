import express from "express";
import SaveURL from "../Controllers/SaveURL.js";
import RedirectURL from "../Controllers/RedirectURL.js";

const router = express.Router();

// POST /save - Create short URL
router.post("/save", SaveURL);

// GET /:shortId - Redirect to original URL
router.get("/:shortId", RedirectURL);

export default router;

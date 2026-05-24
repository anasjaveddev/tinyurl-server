import express from "express";
import { SaveURL, checkDuplicate } from "../Controllers/SaveURL.js";
import { RedirectURL } from "../Controllers/RedirectURL.js";

const router = express.Router();

// TinyURL ki tarah POST /shorten (ya /save)
router.post("/shorten", SaveURL);
router.post("/save", SaveURL);  // dono kaam karenge

// Redirect GET /:code
router.get("/:shortCode", RedirectURL);

// Check karo same URL pehle se hai kya (TinyURL feature)
router.post("/check", checkDuplicate);

export default router;
import { URLs } from "../Models/url.js";
import { generateShortId } from "../Utils/Keys.js";

export const SaveURL = async (req, res) => {
  const { longURL } = req.body;

  // Validate URL
  if (!longURL || !longURL.trim()) {
    return res.status(400).json({ 
      ok: false, 
      error: "URL is required" 
    });
  }

  // Validate URL format
  try {
    const url = new URL(longURL);
    if (!url.protocol || !url.hostname) {
      throw new Error();
    }
  } catch {
    return res.status(400).json({ 
      ok: false, 
      error: "Invalid URL format. Please include http:// or https://" 
    });
  }

  try {
    // Check if same URL already exists
    const existing = await URLs.findOne({ longURL: longURL.trim() });
    if (existing) {
      const baseURL = process.env.BASE_URL || "http://localhost:5050";
      return res.status(200).json({
        ok: true,
        shortURL: `${baseURL}/${existing.shortId}`,
        shortId: existing.shortId,
        message: "URL already shortened"
      });
    }

    // Generate unique shortId
    let shortId = generateShortId(6);
    console.log("Generated shortId:", shortId); // Debug log
    
    // Ensure shortId is not null/undefined
    if (!shortId) {
      shortId = generateShortId(6);
    }
    
    // Check if shortId already exists
    let exists = await URLs.findOne({ shortId });
    while (exists) {
      shortId = generateShortId(6);
      exists = await URLs.findOne({ shortId });
    }

    // Create new URL document
    const newURL = new URLs({
      longURL: longURL.trim(),
      shortId: shortId
    });

    await newURL.save();

    const baseURL = process.env.BASE_URL || "http://localhost:5050";
    const shortURL = `${baseURL}/${shortId}`;

    res.status(200).json({
      ok: true,
      shortURL: shortURL,
      shortId: shortId,
      longURL: longURL.trim()
    });

  } catch (err) {
    console.error("SaveURL Error:", err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(500).json({ 
        ok: false, 
        error: "Duplicate key. Please try again." 
      });
    }
    
    // Handle validation error
    if (err.name === "ValidationError") {
      return res.status(400).json({
        ok: false,
        error: "Validation failed: " + err.message
      });
    }
    
    res.status(500).json({ 
      ok: false, 
      error: "Internal server error: " + err.message
    });
  }
};

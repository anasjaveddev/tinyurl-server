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
      error: "Please enter a valid URL with http:// or https://" 
    });
  }

  try {
    // Check if the same longURL already exists
    const existingUrl = await URLs.findOne({ longURL: longURL.trim() });
    if (existingUrl) {
      const baseURL = process.env.BASE_URL || "http://localhost:5050";
      return res.status(200).json({
        ok: true,
        shortURL: `${baseURL}/${existingUrl.shortId}`,
        shortId: existingUrl.shortId,
        message: "URL already shortened",
      });
    }

    // Generate unique shortId (ensure not null and unique)
    let shortId = generateShortId(7);
    let existing = await URLs.findOne({ shortId });
    
    // Keep generating until unique
    while (existing) {
      shortId = generateShortId(7);
      existing = await URLs.findOne({ shortId });
    }

    // Create new URL document
    const newURL = new URLs({ 
      longURL: longURL.trim(), 
      shortId: shortId,
      createdAt: new Date(),
    });
    
    await newURL.save();
    
    const baseURL = process.env.BASE_URL || "http://localhost:5050";
    const shortURL = `${baseURL}/${shortId}`;
    
    res.status(200).json({
      ok: true,
      shortURL: shortURL,
      shortId: shortId,
      longURL: longURL.trim(),
    });
  } catch (err) {
    console.error("SaveURL Error:", err);
    
    // Handle duplicate key error (MongoDB E11000)
    if (err.code === 11000) {
      // Retry once more on duplicate key
      try {
        let shortId = generateShortId(7);
        let existing = await URLs.findOne({ shortId });
        while (existing) {
          shortId = generateShortId(7);
          existing = await URLs.findOne({ shortId });
        }
        
        const newURL = new URLs({ 
          longURL: longURL.trim(), 
          shortId: shortId,
        });
        await newURL.save();
        
        const baseURL = process.env.BASE_URL || "http://localhost:5050";
        return res.status(200).json({
          ok: true,
          shortURL: `${baseURL}/${shortId}`,
        });
      } catch (retryErr) {
        console.error("Retry SaveURL Error:", retryErr);
        return res.status(500).json({ 
          ok: false, 
          error: "Failed to generate unique code. Please try again." 
        });
      }
    }
    
    res.status(500).json({ 
      ok: false, 
      error: "Internal server error. Please try again." 
    });
  }
};

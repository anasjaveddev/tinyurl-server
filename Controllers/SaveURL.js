import URL from "../Models/url.js";
import { generateShortId } from "../Utils/Keys.js";
import { setCache } from "../Utils/redis.js";

const SaveURL = async (req, res) => {
  try {
    const { longURL } = req.body;

    // Validate longURL
    if (!longURL) {
      console.log("❌ SaveURL Error: longURL is missing in request body");
      return res.status(400).json({
        success: false,
        message: "longURL is required in request body",
      });
    }

    // Basic URL validation
    try {
      new URL(longURL);
    } catch (_) {
      console.log(`❌ SaveURL Error: Invalid URL format - ${longURL}`);
      return res.status(400).json({
        success: false,
        message: "Invalid URL format. Please provide a valid URL.",
      });
    }

    // Generate unique shortId (retry if collision)
    let shortId;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      shortId = generateShortId(7);
      const existing = await URL.findOne({ shortId });
      if (!existing) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      console.log("❌ SaveURL Error: Could not generate unique shortId after 5 attempts");
      return res.status(500).json({
        success: false,
        message: "Server error: Could not generate unique short ID",
      });
    }

    // Save to MongoDB
    const newURL = await URL.create({ longURL, shortId });
    console.log(`✅ URL Saved - shortId: ${shortId} → ${longURL}`);

    // Cache in Redis (fire and forget)
    const BASE_URL = process.env.BASE_URL || "http://localhost:5050";
    await setCache(shortId, { longURL, shortId });

    const shortURL = `${BASE_URL}/${shortId}`;

    return res.status(201).json({
      success: true,
      shortId: newURL.shortId,
      shortURL,
      longURL: newURL.longURL,
      createdAt: newURL.createdAt,
    });
  } catch (error) {
    console.log(`❌ SaveURL Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default SaveURL;

import URL from "../Models/url.js";
import { getCache, setCache } from "../Utils/redis.js";

const RedirectURL = async (req, res) => {
  try {
    const { shortId } = req.params;

    if (!shortId) {
      console.log("❌ RedirectURL Error: shortId is missing");
      return res.status(400).json({
        success: false,
        message: "shortId is required",
      });
    }

    // 1️⃣ Check Redis cache first
    const cached = await getCache(shortId);
    if (cached) {
      console.log(`⚡ Redis Cache Hit - shortId: ${shortId} → ${cached.longURL}`);
      return res.redirect(cached.longURL);
    }

    // 2️⃣ Fallback: query MongoDB
    const urlDoc = await URL.findOne({ shortId });

    if (!urlDoc) {
      console.log(`❌ RedirectURL: shortId not found - ${shortId}`);
      return res.status(404).json({
        success: false,
        message: `Short URL '${shortId}' not found`,
      });
    }

    console.log(`✅ MongoDB Hit - shortId: ${shortId} → ${urlDoc.longURL}`);

    // Store in Redis for next time
    await setCache(shortId, { longURL: urlDoc.longURL, shortId });

    return res.redirect(urlDoc.longURL);
  } catch (error) {
    console.log(`❌ RedirectURL Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default RedirectURL;

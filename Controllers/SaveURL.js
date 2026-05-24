import { URLs } from "../Models/url.js";
import { generateShortId } from "../Utils/Keys.js";

export const SaveURL = async (req, res) => {
  const { longURL } = req.body;

  // Validate URL
  if (!longURL || !longURL.trim()) {
    return res.status(400).json({ ok: false, error: "URL is required" });
  }

  try {
    const shortId = generateShortId(7);
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
    });
  } catch (err) {
    console.log("SaveURL Error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
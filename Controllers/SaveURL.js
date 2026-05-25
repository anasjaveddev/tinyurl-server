import { URLs } from "../Models/url.js";

const generateShortId = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const SaveURL = async (req, res) => {
  const { longURL } = req.body;

  if (!longURL) {
    return res.status(400).json({ ok: false, error: "URL required" });
  }

  try {
    let shortId = generateShortId();
    let existing = await URLs.findOne({ shortId });
    while (existing) {
      shortId = generateShortId();
      existing = await URLs.findOne({ shortId });
    }

    const newURL = new URLs({ longURL, shortId });
    await newURL.save();

    const baseURL = process.env.BASE_URL || "http://localhost:5050";
    res.json({ ok: true, shortURL: `${baseURL}/${shortId}` });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

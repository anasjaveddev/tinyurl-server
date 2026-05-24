import { URLs } from "../Models/url.js";

export const RedirectURL = async (req, res) => {
  const { shortId } = req.params;

  try {
    const url = await URLs.findOne({ shortId: shortId });
    
    if (url) {
      return res.redirect(url.longURL);
    } else {
      return res.status(404).json({ error: "URL not found" });
    }
  } catch (err) {
    console.log("RedirectURL Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
import { URLs } from "../Models/url.js";

export const RedirectURL = async (req, res) => {
    const { shortCode } = req.params;

    if (!shortCode) {
        return res.status(400).json({ error: "Invalid short URL" });
    }

    try {
        // Find by shortCode
        const urlEntry = await URLs.findOne({ shortCode });

        if (!urlEntry) {
            return res.status(404).json({ 
                error: "Short URL not found",
                message: "This link doesn't exist or may have been deleted"
            });
        }

        // TinyURL ki tarah 301 redirect (permanent)
        // ya 302 (temporary) - dono sahi hai
        // Increment click count (analytics ke liye)
        await URLs.updateOne(
            { shortCode }, 
            { $inc: { clicks: 1 } }
        );

        // Make sure URL has protocol
        let redirectUrl = urlEntry.longURL;
        if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
            redirectUrl = 'https://' + redirectUrl;
        }

        // 301 Moved Permanently (TinyURL uses this)
        return res.redirect(301, redirectUrl);

    } catch (err) {
        console.error("RedirectURL Error:", err);
        return res.status(500).json({ 
            error: "Internal server error",
            message: "Something went wrong. Please try again."
        });
    }
};
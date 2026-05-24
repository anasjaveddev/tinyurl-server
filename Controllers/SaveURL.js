import { URLs } from "../Models/url.js";
import { generateShortCode, isValidUrl } from "../Utils/Keys.js";

// Save new URL (TinyURL jaisa)
export const SaveURL = async (req, res) => {
    const { longURL, customCode } = req.body;

    // Validate URL
    if (!longURL || !isValidUrl(longURL)) {
        return res.status(400).json({ 
            ok: false, 
            error: "Invalid URL. Please include http:// or https://" 
        });
    }

    try {
        let shortCode = customCode;
        let isCustom = false;

        // Agar custom code diya hai toh check karo
        if (customCode && customCode.trim()) {
            shortCode = customCode.trim();
            isCustom = true;
            
            // Check agar custom code already exists
            const existing = await URLs.findOne({ shortCode });
            if (existing) {
                return res.status(400).json({
                    ok: false,
                    error: "Custom code already taken. Please choose another."
                });
            }
            
            // Custom code length limit (TinyURL: 5-20 chars)
            if (shortCode.length < 3 || shortCode.length > 20) {
                return res.status(400).json({
                    ok: false,
                    error: "Custom code must be 3-20 characters"
                });
            }
        } else {
            // Auto-generate unique code
            let isUnique = false;
            while (!isUnique) {
                shortCode = generateShortCode(6);
                const existing = await URLs.findOne({ shortCode });
                if (!existing) isUnique = true;
            }
        }

        // Check agar same longURL pehle se hai toh wahi code return karo (TinyURL feature)
        const existingUrl = await URLs.findOne({ longURL });
        if (existingUrl && !isCustom) {
            const baseURL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5050}`;
            return res.status(200).json({
                ok: true,
                shortURL: `${baseURL}/${existingUrl.shortCode}`,
                shortCode: existingUrl.shortCode,
                message: "URL already shortened"
            });
        }

        // Save to database
        const newURL = new URLs({
            longURL,
            shortCode,
            createdAt: new Date(),
            clicks: 0
        });

        await newURL.save();

        const baseURL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5050}`;
        const shortURL = `${baseURL}/${shortCode}`;

        res.status(200).json({
            ok: true,
            shortURL: shortURL,
            shortCode: shortCode,
            longURL: longURL
        });

    } catch (err) {
        console.error("SaveURL Error:", err);
        res.status(500).json({ 
            ok: false, 
            error: "Internal server error" 
        });
    }
};

// Check duplicate URL (TinyURL feature)
export const checkDuplicate = async (req, res) => {
    const { longURL } = req.body;

    if (!longURL) {
        return res.status(400).json({ ok: false, error: "URL required" });
    }

    try {
        const existing = await URLs.findOne({ longURL });
        if (existing) {
            const baseURL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5050}`;
            return res.status(200).json({
                ok: true,
                exists: true,
                shortURL: `${baseURL}/${existing.shortCode}`,
                shortCode: existing.shortCode
            });
        }
        res.status(200).json({ ok: true, exists: false });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
};
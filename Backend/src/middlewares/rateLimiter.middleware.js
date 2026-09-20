const rateLimit = require('express-rate-limit');

// 1. Global Limiter (Saare normal routes ke liye: e.g. 15 mins me max 100 requests)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes window
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Boht zyada requests bhej di hain! Please 15 minutes baad try karein."
    }
});

// 2. Strict Auth Limiter (Login / Register / Sensitive endpoints ke liye)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 10, // Max 10 attempts allowed per 15 minutes per IP
    standardHeaders: true,
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Boht zyada login attempts hue hain. Security reason ki wajah se 15 min tak block kar diya gaya hai."
    }
});

module.exports = {
    globalLimiter,
    authLimiter
};
const rateLimit = require('express-rate-limit');

// Create a limiter that allows 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = limiter; 
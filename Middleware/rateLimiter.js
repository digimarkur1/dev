const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute time window
  max: 5, // allow only 10 requests per window per IP
  message: {
    status: 429,
    message: "Too many requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
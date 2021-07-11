module.exports = (config) => {
    const rateLimit = require("express-rate-limit");
    const defaultRateLimiter = rateLimit({
                windowMs: 15 * 60 * 1000, 
                max: 1000
            });
    return {
        getRegisterRateLimiter: () => {
            if(config.ratelimiter && config.rateLimiter.register) {
                return config.ratelimiter.register;
            }
            return defaultRateLimiter;
        },

        getLoginRateLimiter: () => {
            if(config.ratelimiter && config.rateLimiter.login) {
                return config.ratelimiter.login;
            }
            return defaultRateLimiter;
        }
    };
};
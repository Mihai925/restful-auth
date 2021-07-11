module.exports = (config) => {
    const rateLimit = require("express-rate-limit");
    const defaultRateLimiter = rateLimit({
                windowMs: 15 * 60 * 1000, 
                max: 1000
            });
    return {
        getRegisterRateLimiter: () => {
            if(config.rateLimiter && config.rateLimiter.register) {
                return config.rateLimiter.register;
            }
            return defaultRateLimiter;
        },

        getLoginRateLimiter: () => {
            if(config.rateLimiter && config.rateLimiter.login) {
                return config.rateLimiter.login;
            }
            return defaultRateLimiter;
        },

        getLogoutRateLimiter: () => {
            if(config.rateLimiter && config.rateLimiter.logout) {
                return config.rateLimiter.logout;
            }
            return defaultRateLimiter;
        }
    };
};
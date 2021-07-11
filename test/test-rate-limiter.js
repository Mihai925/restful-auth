const chai = require("chai");
const expect = chai.expect;

describe("rate-limiter", () => {
    const rateLimiterFactory = require("../rate-limiter");

    it("should return default rate limiters with no config", () => {
        const rateLimiter = rateLimiterFactory({});
        const loginRateLimiter = rateLimiter.getLoginRateLimiter();
        const registerRateLimiter = rateLimiter.getRegisterRateLimiter();
        expect(loginRateLimiter.name).to.equal("rateLimit");
        expect(registerRateLimiter.name).to.equal("rateLimit");
    });

    
    it("should return default rate limiters with no specific config", () => {
        const rateLimiter = rateLimiterFactory({
            rateLimiter: {}
        });
        const loginRateLimiter = rateLimiter.getLoginRateLimiter();
        const registerRateLimiter = rateLimiter.getRegisterRateLimiter();
        expect(loginRateLimiter.name).to.equal("rateLimit");
        expect(registerRateLimiter.name).to.equal("rateLimit");
    });    

    it("should return given rate limiter when it gets them", () => {
        const actualLoginRateLimiter = () => {};
        const actualRegisterRateLimiter = () => {};
        const rateLimiter = rateLimiterFactory({
            rateLimiter: {
                register: actualRegisterRateLimiter,
                login: actualLoginRateLimiter
            }
        });
        const loginRateLimiter = rateLimiter.getLoginRateLimiter();
        const registerRateLimiter = rateLimiter.getRegisterRateLimiter();
        expect(loginRateLimiter.name).to.equal("rateLimit");
        expect(registerRateLimiter.name).to.equal("rateLimit");
    });  
});
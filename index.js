module.exports = (app, config) => {
  const validator = require("./validator")();
  validator.validate(config.type, config.db);

  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const User = require("./models/" + config.type + "/user")(config.db);

  const UserWrapper = require("./models/user-wrapper")(User, config.type);
  const JWTSecret = require("./config/jwtConfig");
  const jwt = require("jsonwebtoken");

  const rateLimiter = require("./rate-limiter")(config);
  const registerRateLimiter = rateLimiter.getRegisterRateLimiter();
  const loginRateLimiter = rateLimiter.getLoginRateLimiter();
  const logoutRateLimiter = rateLimiter.getLogoutRateLimiter();

  app.use(passport.initialize());

  //Create passports
  require("./passports/register")(passport, LocalStrategy, UserWrapper);
  require("./passports/login")(passport, LocalStrategy, UserWrapper);

  //Create routes
  require("./api/register")(app, registerRateLimiter, passport);
  require("./api/login")(app, loginRateLimiter, passport, JWTSecret, UserWrapper, jwt);
  require("./api/logout")(app, logoutRateLimiter);

};

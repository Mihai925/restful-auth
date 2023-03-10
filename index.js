module.exports = (app, config) => {
  const validator = require("./validator")();
  validator.validate(config.type, config.db);

  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const User = require("./models/" + config.type + "/user")(config.db);
  const ResetToken = require("./models/" + config.type + "/resetToken")(config.db, User);

  const UserWrapper = require("./models/userWrapper")(User, config.type);
  const TokenWrapper = require("./models/resetTokenWrapper")(ResetToken, config.type);
  const TokenCreationHelper = require("./helpers/tokenCreationHelper")(UserWrapper, TokenWrapper, config.type);
  const Middlewares = require("./helpers/middlewares");
  const JWTSecret = require("./config/jwtConfig");
  const jwt = require("jsonwebtoken");
  const session = require('express-session');

  const rateLimiter = require("./rate-limiter")(config);
  const registerRateLimiter = rateLimiter.getRegisterRateLimiter();
  const loginRateLimiter = rateLimiter.getLoginRateLimiter();
  const logoutRateLimiter = rateLimiter.getLogoutRateLimiter();
  const resetTokenRateLimiter = rateLimiter.getLogoutRateLimiter();

  app.use(session({ secret: JWTSecret.secret }));
  app.use(passport.initialize());

  //Create passports
  require("./passports/register")(passport, LocalStrategy, UserWrapper);
  require("./passports/login")(passport, LocalStrategy, UserWrapper);

  //Create routes
  require("./api/register")(app, registerRateLimiter, passport);
  require("./api/login")(app, loginRateLimiter, passport, JWTSecret, UserWrapper, jwt);
  require("./api/logout")(app, logoutRateLimiter);
  require("./api/reset")(app, resetTokenRateLimiter, TokenWrapper, UserWrapper);
  return {
    CreateResetToken: TokenCreationHelper.CreateResetToken,
    middlewares: {
      HasRole: Middlewares.role,
      IsLoggedIn: Middlewares.login
    }
  };
};
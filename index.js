module.exports = (app, config) => {
  const validator = require("./validator")();
  validator.validate(config.type, config.db);

  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const User = require("./models/" + config.type + "/user")(config.db);

  const UserWrapper = require("./models/user-wrapper")(User, config.type);
  const JWTSecret = require("./config/jwtConfig");
  const jwt = require("jsonwebtoken");

  app.use(passport.initialize());

  //Create passports
  require("./passports/register")(passport, LocalStrategy, UserWrapper);
  require("./passports/login")(passport, LocalStrategy, UserWrapper);

  //Create routes
  require("./api/register")(app, passport);
  require("./api/login")(app, passport, JWTSecret, UserWrapper, jwt);

};

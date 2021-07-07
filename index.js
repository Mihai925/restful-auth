module.exports = (app, config) => {
  if (!["dynamoose", "sequelize", "mongoose"].includes(config.type)) {
    throw new Error("Database library type is not supported: " + config.type);
  }
  const db = config.db;

  if (config.type === "dynamoose" && (typeof db !== "object" || !db.aws)) {
    throw new Error("Please provide a valid dynamoose instance");
  }

  if (config.type === "sequelize" && (typeof db != "object" || !db.getQueryInterface)) {
    throw new Error('Please provide a valid sequelize instance');
  }

  if (config.type === "mongoose" && (typeof db != "object" || !db.mongo)) {
    throw new Error('Please provide a valid mongoose instance');
  }

  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;
  const User = require("./models/" + config.type + "/user")(db);

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

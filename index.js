
module.exports = (app, config) => {
  if(config.dialect != 'dynamodb') {
    throw new Error('Your database dialect is not supported');
  }
  const db = config.db;

  if(typeof db != 'object' || !db.aws) {
    throw new Error('Please provide a valid dynamoose instance');
  }
  const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  JWTStrategy = require('passport-jwt').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJwt,
  User = require('./models/ddb/user')(config.db);
  JWTSecret = require('./config/jwtConfig');
  jwt = require('jsonwebtoken');

  app.use(passport.initialize());

  //Create passports
  require('./passports/jwt')(ExtractJWT, JWTStrategy, JWTSecret, passport, User);
  require('./passports/register')(passport, LocalStrategy, User);
  require('./passports/login')(passport, LocalStrategy, User);

  //Create routes
  require('./api/register')(app, passport);
  require('./api/login')(app, passport, JWTSecret, User, jwt);

};

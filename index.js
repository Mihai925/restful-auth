
module.exports = (app, config) => {
  if (!['dynamoose', 'sequelize'].includes(config.type)) {
    throw new Error('Database library type is not supported: ' + config.type);
  }
  const db = config.db;

  if (config.type === 'dynamoose' && (typeof db != 'object' || !db.aws)) {
    throw new Error('Please provide a valid dynamoose instance');
  }

  if (config.type === 'sequelize' && (typeof db != 'object' || !db.getQueryInterface)) {
    throw new Error('Please provide a valid sequelize instance');
  }
  const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  JWTStrategy = require('passport-jwt').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJwt,
  User = require('./models/' + config.type + '/user')(config.db);
  if(config.type === 'sequelize' && process.env.RA_SYNC_SQL === "true") {
    User.sync();
  }
  UserWrapper = require('./models/user-wrapper')(User, config.type);
  JWTSecret = require('./config/jwtConfig');
  jwt = require('jsonwebtoken');

  app.use(passport.initialize());

  //Create passports
  require('./passports/jwt')(ExtractJWT, JWTStrategy, JWTSecret, passport, UserWrapper);
  require('./passports/register')(passport, LocalStrategy, UserWrapper);
  require('./passports/login')(passport, LocalStrategy, UserWrapper);

  //Create routes
  require('./api/register')(app, passport);
  require('./api/login')(app, passport, JWTSecret, UserWrapper, jwt);

};

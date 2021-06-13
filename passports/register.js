const BCRYPT_SALT_ROUNDS = 5;
const bcrypt = require("bcrypt");

module.exports =
  (passport, LocalStrategy, UserWrapper) => {
    passport.use(
      'register',
      new LocalStrategy(
        {
          usernameField: 'username',
          passwordField: 'password',
          passReqToCallback: true
        },
        async (req, username, password, done) => {
          try {
            const userNameMatch = await UserWrapper.get(username);
            if(userNameMatch != undefined) {
              return done(null, false, {message: 'username and/or email already exists'});
            }

            var userGroup = req.body.group;
            if(userGroup === undefined) {
              userGroup = "standard";
            }

            bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(async (hashedPassword) => {
                const userData = {
                  "username": username,
                  "password": hashedPassword,
                  "group": userGroup
                };
                const newUser = await UserWrapper.create(userData);
                return done(null, newUser);
              }
            );
          } catch (err) {
            done(err);
          }
        }
      )
    );
};

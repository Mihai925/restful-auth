const bcrypt = require("bcrypt");
module.exports =
  (passport, LocalStrategy, UserWrapper) => {
    passport.use(
        'login',
        new LocalStrategy(
          {
            usernameField: 'username',
            passwordField: 'password',
            session: false,
          },
          async (username, password, done) => {
            try {

              const user = await UserWrapper.get(username);
              if(user === undefined) {
                return done(null, false, {message: "Authentication failed"});
              }
              const passwordMatch = bcrypt.compareSync(password, user.password);
              if(!passwordMatch) {
                return done(null, false, {message: "Authentication failed"});
              }
              return done(null, user);
            } catch(err) {
              done(err);
            }
          }
        )
    );
  };

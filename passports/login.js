const bcrypt = require("bcrypt");
module.exports =
  (passport, LocalStrategy, UserWrapper) => {
    passport.use(
        "login",
        new LocalStrategy(
          {
            usernameField: "id",
            passwordField: "password",
            session: false,
          },
          async (id, password, done) => {
            try {
              const user = await UserWrapper.get({id});
              if(typeof user === "undefined" || user === null) {
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

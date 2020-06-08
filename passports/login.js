const bcrypt = require("bcrypt");
module.exports =
  (passport, LocalStrategy, User) => {
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

              const user = await User.get({"username": username});
              if(user === null) {
                console.log("Authentication failed");
                return done(null, false, {message: "Authentication failed"});
              }
              const passwordMatch = bcrypt.compareSync(password, user.password);
              if(!passwordMatch) {
                console.log("Authentication failed");
                return done(null, false, {message: "Authentication failed"});
              }
              return done(null, user);
            } catch(err) {
              done(err);
            }
          }
        )
    )
  };

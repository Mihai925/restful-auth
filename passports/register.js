const BCRYPT_SALT_ROUNDS = 5;
const bcrypt = require("bcrypt");

module.exports =
  (passport, LocalStrategy, UserWrapper) => {
    passport.use(
      "register",
      new LocalStrategy(
        {
          usernameField: "id",
          passwordField: "password",
          passReqToCallback: true
        },
        async (req, id, password, done) => {
          try {
            const idMatch = await UserWrapper.get({id});
            if(typeof idMatch !== "undefined") {
              return done(null, false, {code: 409, message: 'id and/or email already exists'});
            }

            var role = req.body.role;
            if(typeof role === "undefined") {
              role = "standard";
            }

            bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(async (hashedPassword) => {
                const userData = {
                  id,
                  "password": hashedPassword,
                  role
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

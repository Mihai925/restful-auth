const BCRYPT_SALT_ROUNDS = 5;
const bcrypt = require("bcrypt");

module.exports =
  (passport, LocalStrategy, User) => {
    passport.use(
      'register',
      new LocalStrategy(
        {
          usernameField: 'username',
          passwordField: 'password'
        },
        async (username, password, done) => {
          try {
            //console.log(User);
            const userNameMatch = await User.get({"username": username});
            if(userNameMatch != undefined) {
              return done(null, false, {message: 'username and/or email already exists'})
            }

            bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(async (hashedPassword) => {
                const newUser = new User({
                  "username": username,
                  "password": hashedPassword
                })
                await newUser.save()
                return done(null, newUser);
              }
            )
          } catch (err) {
            done(err)
          }
        }
      )
    )
}

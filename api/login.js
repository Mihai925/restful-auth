
module.exports =
  (app, passport, JWTSecret, User, jwt) => {
    app.post('/api/login', (req, res, next) => {
      passport.authenticate('login', (err, user, info) => {
        if(info != undefined) {
          res.send(info.message);
        } else {
          req.logIn(user, async (err) => {
            const loginUser = await User.get({"username": user.username});
            const token = jwt.sign({ id: loginUser.username}, JWTSecret.secret);
            res.status(200).send({
              auth: true,
              token: token
            });
          });
        }
      })(req, res, next);
    })
  }

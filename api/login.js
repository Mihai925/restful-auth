module.exports =
  (app, rateLimiter, passport, JWTSecret, UserWrapper, jwt) => {
    app.post("/api/login", rateLimiter, (req, res, next) => {
      passport.authenticate("login", (err, user, info) => {
        if(err !== null) {
          throw new Error(err);
        }
        if(typeof info !== "undefined") {
          res.send({
            auth: false
          });
        } else {
          req.logIn(user, async (err) => {
            const loginUser = await UserWrapper.get({id: user.id});
            const token = jwt.sign({ id: loginUser.id}, JWTSecret.secret);
            res.status(200).send({
              auth: true,
              token,
              role: loginUser.role
            });
          });
        }
      })(req, res, next);
    });
  };

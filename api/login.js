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
            const loginUser = await UserWrapper.get(user.username);
            const token = jwt.sign({ id: loginUser.username}, JWTSecret.secret);
            res.status(200).send({
              auth: true,
              token,
              group: loginUser.group
            });
          });
        }
      })(req, res, next);
    });
  };

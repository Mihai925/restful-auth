module.exports = (app, passport) => {
  app.post("/api/register", (req, res, next) => {
    passport.authenticate("register", (err, user, info) => {
      if(err) {
        throw new Error(err);
      }

      if(typeof info !== "undefined") {
        res.status(info.code).send(info.message);
        return;
      }
      //console.log(info.message);

      res.status(200).send({message:"User created" });
    })(req, res, next);
  });
};

module.exports = (app, rateLimiter) => {
  app.post("/api/logout", rateLimiter, (req, res, next) => {
    req.logout((err) => {
      if(err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
};
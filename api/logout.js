module.exports = (app, rateLimiter) => {
  app.post("/api/logout", rateLimiter, (req, res, next) => {
    req.logout();
    res.redirect("/");
  });
};
//var bodyParser = require('body-parser');
//var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = (app, passport) => {
  app.post('/api/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
      if(err) {
        console.log(err);
      }
      if(info != undefined) {
        console.log(info.message);
        res.status(500).send(info.message);
        return;
      }
      console.log("Reg worked, it seems?");
      res.status(200).send({message:"User created" });
    })(req, res, next);
  })
}

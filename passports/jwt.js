module.exports =
(ExtractJWT, JWTStrategy, JWTSecret, passport, UserWrapper) => {
  const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: JWTSecret.secret
  };
  passport.use(
    'jwt',
    new JWTStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await UserWrapper.get(jwt_payload.id);
        if(user) {
         done(null, user);
         return;
        }
        done(null, false);
      } catch(err) {
        done(err);
      }

    })
  );
};

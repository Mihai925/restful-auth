const BCRYPT_SALT_ROUNDS = 5;
const bcrypt = require("bcrypt");

module.exports = (app, rateLimiter, ResetTokenWrapper, UserWrapper) => {
    app.post("/api/reset", rateLimiter, async (req, res, next) => {
        const token = req.body.token;
        const id = req.body.id;
        const password = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS);
        const dbToken = await ResetTokenWrapper.get({token});
        const currSeconds = (new Date()).getTime() / 1000;
        if(typeof dbToken === "undefined" || dbToken.userId !== id
            || dbToken.expiry < currSeconds) {
            res.sendStatus(404);
        }
        await UserWrapper.update({id}, {password});
        await ResetTokenWrapper.delete({token});
        res.sendStatus(200);
    });
};
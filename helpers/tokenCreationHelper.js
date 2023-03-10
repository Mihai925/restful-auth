module.exports = (UserWrapper, ResetTokenWrapper, TYPE) => {
    const { v4: uuidv4 } = require("uuid");
    return {
        CreateResetToken: async (id, secondsDelay=60*60*24) => {
            var token = uuidv4();
            const now = new Date();
            const expiry = Math.floor(now.getTime() / 1000) + secondsDelay;
            const user = await UserWrapper.get({id});
            if(typeof user === "undefined") {
                token = void 0;
            } else {
                const userId = id;
                await ResetTokenWrapper.create({userId, token, expiry});
            }
            return token;
        }
    };
};
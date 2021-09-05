module.exports = {
    role: (role) => {
        const jwt = require("jsonwebtoken");
        const JWTSecret = require("../config/jwtConfig");
        return (req, res, next) => {
            try {
                const decodedUser = jwt.verify(req.token, JWTSecret.secret);
                if(decodedUser.role === role) {
                    next();
                } else {
                    return res.sendStatus(404);
                }
            } catch {
                return res.sendStatus(404);
            }
        };
    },

    login: () => {
        const jwt = require("jsonwebtoken");
        const JWTSecret = require("../config/jwtConfig");
        return (req, res, next) => {
            try {
                jwt.verify(req.token, JWTSecret.secret);
                next();
            } catch {
                return res.sendStatus(404);
            }
        }
    }
};
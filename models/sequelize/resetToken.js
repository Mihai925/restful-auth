//Note: Not using DataType since we don't wanna make the user inject that too.
module.exports = (sequelize, User) => {
    const Token = sequelize.define("ResetToken", {
        token: {
            type: "VARCHAR(255)",
            allowNull: false,
            primaryKey: true
        },
        expiry: {
            type: "BIGINT",
        },
        userId: {
            type: "VARCHAR(255)",
        }
    });
    return Token;
};
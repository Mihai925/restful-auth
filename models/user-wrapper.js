module.exports = (User, TYPE) => {
    return new class {
        constructor(User, TYPE) {
            this.User = User;
            this.TYPE = TYPE;
        }
        async get(username) {
            if (this.TYPE === "dynamoose") {
                return await this.User.get({username});
            }
            if (this.TYPE === "sequelize") {
                var user = await this.User.findByPk(username);
                if(user === null) {
                    user = undefined;
                }
                return user;
            }
            throw "Undefined database type";
        }

        async create(data) {
            if (this.TYPE === "dynamoose") {
                const newUser = new this.User(data);
                return await newUser.save();
            }
            if (this.TYPE === "sequelize") {
                return this.User.create(data);
            }
            throw "Undefined database type";
        }
    }(User, TYPE);
};
module.exports = (User, TYPE) => {
    return new class {
        constructor(User, TYPE) {
            this.User = User;
            this.TYPE = TYPE;
        }
        async get(username) {
            if (this.TYPE === 'dynamoose') {
                return await this.User.get({"username": username});
            }
            if (this.TYPE === 'sequelize') {
                return await this.User.findOne({where: {"username": username}});
            }
            throw "Undefined database type";
        }

        async create(data) {
            if (this.TYPE === 'dynamoose') {
                const newUser = new this.User(data);
                return await newUser.save();
            }
            if (this.TYPE === 'sequelize') {
                return this.User.create(data);
            }
            throw "Undefined database type";
        }
    }(User, TYPE);
}
module.exports = (User, TYPE) => {
    return new class {
        constructor(User, TYPE) {
            this.User = User;
            this.TYPE = TYPE;
        }
        async get(username) {
            if (this.TYPE == 'dynamoose') {
                return await this.User.get({"username": username});
            }
            throw "Undefined database type"
        }

        async create(data) {
            if (this.TYPE == 'dynamoose') {
                const newUser = new this.User(data);
                return await newUser.save();
            }
            throw "Undefined database type"
        }
    }(User, TYPE);
}
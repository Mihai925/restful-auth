module.exports = (User, TYPE) => {
    const modelWrapper = require("./genericModelWrapper")();
    return {
        get: async (id) => modelWrapper.get(id, TYPE, User),
        create: async (data) => modelWrapper.create(data, TYPE, User),
        update: async (pk, data) => modelWrapper.update(pk, data, TYPE, User)

    };
};
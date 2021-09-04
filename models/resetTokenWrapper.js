module.exports = (ResetToken, TYPE) => {
    var modelWrapper = require("./genericModelWrapper")();
    return {
        get: async (id) => modelWrapper.get(id, TYPE, ResetToken),
        create: async (data) => modelWrapper.create(data, TYPE, ResetToken),
        delete: async (id) => modelWrapper.delete(id, TYPE, ResetToken)
    };
};
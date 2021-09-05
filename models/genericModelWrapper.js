module.exports = () => {
    const toggleObjectId = (data) => {
        if(data && data.id) {
            data._id = data.id;
            delete data.id;
        } else if(data && data._id) {
            data.id = data._id;
            delete data._id;
        }
    };
    const create = {
        "mongoose": async (data, Model) => {
            toggleObjectId(data);
            return await (new Model(data)).save();
        },
        "dynamoose": async (data, Model) => {
            return await (new Model(data)).save();
        },
        "sequelize": async (data, Model) => {
            return await Model.create(data);
        }
    };
    const get = {
        "mongoose": async (pk, Model) => {
            toggleObjectId(pk);
            var record = await Model.findOne(pk).exec();

            if (record && record._id) {
                record.id = record._id;
                delete record._id;
            }
            if (record === null) {
                record = void 0;
            }
            return record;
        },
        "dynamoose": async (pk, Model) => {
            return await Model.get(pk);
        },
        "sequelize": async (pk, Model) => {
            var record = await Model.findOne({ where: pk});
            if (record === null) {
                record = void 0;
            }
            return record;
        }
    };
    const update = {
        "mongoose": async (pk, data, Model) => {
            toggleObjectId(pk);
            const record = await Model.findOne(pk);
            Object.assign(record, data);
            return await record.save();
        },
        "dynamoose": async (pk, data, Model) => {
            const record = await Model.get(pk);
            Object.assign(record, data);
            return await record.save();
        },
        "sequelize": async (pk, data, Model) => {
            const record = await Model.findOne(pk);
            Object.assign(record, data);
            return await record.save();
        }
    };

    const remove = {
        "mongoose": async (pk, Model) => {
            toggleObjectId(pk);
            return await Model.deleteOne(pk);
        },
        "dynamoose": async (pk, Model) => {
            const record = await Model.get(pk);
            return await record.delete();
        },
        "sequelize": async (pk, Model) => {
            const record = await Model.findOne(pk);
            return await record.destroy();
        }
    };
    return {
        create: async (data, TYPE, Model) => create[TYPE](data, Model),
        get: async (pk, TYPE, Model) => get[TYPE](pk, Model),
        update: async (pk, data, TYPE, Model) => update[TYPE](pk, data, Model),
        delete: async (pk, TYPE, Model) => remove[TYPE](pk, Model)
    };
};
module.exports = () => {

    const validationFunctions = {
        "dynamoose": (db) => {
            return db.aws;
        },

        "sequelize": (db) => {
            return db.getQueryInterface;
        },

        "mongoose": (db) => {
            return db.mongo;
        }
    };

    return {
        validate: (dbType, db) => {
            if (typeof db != "object") {
                throw new Error("Please provide a valid database library instance");
            }

            if (!(dbType in validationFunctions)) {
                throw new Error("Database library type is not supported: " + dbType);
            }

            const validationFunction = validationFunctions[dbType];
            if(!validationFunction(db)) {
                throw new Error("Please provide a valid " + dbType  +" instance");
            }
        }
    }

};
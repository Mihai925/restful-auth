const chai = require("chai");
const chaiHttp = require("chai-http");
const bodyParser = require("body-parser");
const expect = chai.expect;
const { Sequelize } = require("sequelize");
const shared = require("./shared.js");

chai.use(chaiHttp);

describe("sequelize/sqlite", function(){
    var express;
    var appWrapper = {};
    var sequelize;
    beforeEach(async () => {
        express = require("express");
        appWrapper.app = express();
        appWrapper.app.use(bodyParser.json());
        var connection = "Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\node;Database=scratch;Trusted_Connection=yes;"

        sequelize = new Sequelize({
            dialect: 'mssql',
            dialectModulePath: 'msnodesqlv8/lib/sequelize',
            dialectOptions: {
                user: '',
                password: '',
                database: 'node',
                options: {
                    driver: 'msnodesqlv8',
                    connectionString: connection,
                    trustedConnection: true,
                    instanceName: '',
                    useUTC: false,
                    dateFirst: 1
                }
            },
            pool: {
                min: 0,
                max: 5,
                idle: 10000
            }
        });
        const restfulAuth = require("../index.js");

        restfulAuth(appWrapper.app, {
            type: "sequelize",
            db: sequelize
        });
        await sequelize.sync({force: true});
    });

    shared(chai, appWrapper, expect);
});
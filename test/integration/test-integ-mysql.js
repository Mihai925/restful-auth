const chai = require("chai");
const chaiHttp = require("chai-http");
const bodyParser = require("body-parser");
const expect = chai.expect;
const { Sequelize } = require("sequelize");
const shared = require("./shared.js");

chai.use(chaiHttp);

describe("sequelize/mysql", function(){
    var express;
    var appWrapper = {};
    var restfulAuthWrapper = {};
    var sequelize;
    beforeEach( async () => {
        express = require("express");
        appWrapper.app = express();
        appWrapper.app.use(bodyParser.json());
        sequelize = new Sequelize('test', 'test', 'test' , {
            host: 'localhost',
            dialect: 'mysql',
            logging: false,
            port: 3307
        });
        const restfulAuth = require("../../index.js");

        restfulAuthWrapper.app = 
            restfulAuth(appWrapper.app, {
                type: "sequelize",
                db: sequelize
            });
        await sequelize.sync({force: true});
    });

    shared(chai, appWrapper, restfulAuthWrapper, expect);
});
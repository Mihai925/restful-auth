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
        sequelize = new Sequelize('test', 'root', 'root' , {
            host: 'localhost',
            dialect: 'mysql',
            logging: console.log,
            port: 3306
        });
        const restfulAuth = require("../../index.js");
        restfulAuthWrapper.app = 
            restfulAuth(appWrapper.app, {
                type: "sequelize",
                db: sequelize
            });
        console.log("Checkpoint 3")
        await sequelize.sync({force: true});
        console.log("Checkpoint 4")
    });

    shared(chai, appWrapper, restfulAuthWrapper, expect);
});
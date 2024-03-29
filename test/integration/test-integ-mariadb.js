const chai = require("chai");
const chaiHttp = require("chai-http");
const bodyParser = require("body-parser");
const expect = chai.expect;
const { Sequelize } = require("sequelize");
const shared = require("./shared.js");

chai.use(chaiHttp);

describe("sequelize/mariadb", function(){
    var express;
    var appWrapper = {};
    var restfulAuthWrapper = {};
    var sequelize;
    beforeEach(async () => {
        express = require("express");
        appWrapper.app = express();
        appWrapper.app.use(bodyParser.json());
        sequelize = new Sequelize('test', 'root', 'root' , {
            host: 'localhost',
            dialect: 'mariadb',
            port: 3800
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
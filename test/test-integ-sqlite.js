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
        sequelize = new Sequelize("sqlite::memory:", { logging: false});
        const restfulAuth = require("../index.js");

        restfulAuth(appWrapper.app, {
            type: "sequelize",
            db: sequelize
        });
        await sequelize.sync({force: true});
    });

    shared(chai, appWrapper, expect);
});
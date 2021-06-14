const chai = require("chai");
const chaiHttp = require("chai-http");
const bodyParser = require("body-parser");
const expect = chai.expect;
const { Sequelize } = require("sequelize");
const shared = require("./shared.js");

chai.use(chaiHttp);

describe("Integration", function() {
    describe("dynamoose/dynamodb", function(){
      var DdbLocalServer;
      var dynamoose;
      var restfulAuth;
      var express;
      var appWrapper = {};
      var ddbInstance;
      beforeEach(async () => {
        DdbLocalServer = require("dynamodb-local");
        dynamoose = require("dynamoose");
        restfulAuth = require("../index.js");
        express = require("express");
        appWrapper.app = express();
        appWrapper.app.use(bodyParser.json());
        
        
        
        ddbInstance = await new DdbLocalServer.launch("3456", null, ["-sharedDb"], true, true);
        dynamoose.aws.ddb.local("http://localhost:3456");


        restfulAuth(appWrapper.app, {
          type: "dynamoose",
          db: dynamoose
        });
      });

      afterEach(async () => {
        await DdbLocalServer.stop("3456");
      });

      shared(chai, appWrapper, expect);
    });

    describe("sequelize/sqlite", function(){
        var express;
        var appWrapper = {};
        var sequelize;
        beforeEach( async () => {
            express = require("express");
            appWrapper.app = express();
            appWrapper.app.use(bodyParser.json());
            sequelize = new Sequelize("sqlite::memory:", { logging: false});
            const restfulAuth = require("../index.js");

            restfulAuth(appWrapper.app, {
                type: "sequelize",
                db: sequelize
            });
        });

        shared(chai, appWrapper, expect);
    });
});

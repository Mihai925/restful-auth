const chai = require("chai");
const chaiHttp = require("chai-http");
const bodyParser = require("body-parser");
const expect = chai.expect;
const { Sequelize } = require("sequelize");
const shared = require("./shared.js");


chai.use(chaiHttp);

describe("dynamoose/dynamodb", function(){
    var dynamoose = require("dynamoose");
    var restfulAuth;
    var express;
    var appWrapper = {};
    var restfulAuthWrapper = {};
    beforeEach(async () => {
        restfulAuth = require("../../index.js");
        express = require("express");
        appWrapper.app = express();
        appWrapper.app.use(bodyParser.json());
        dynamoose.aws.ddb.local("http://localhost:3456");


        
        restfulAuthWrapper.app = 
            restfulAuth(appWrapper.app, {
                type: "dynamoose",
                db: dynamoose
            });     
    });

    afterEach(async () => {
        const User = require("../../models/dynamoose/user.js")(dynamoose);
        const ResetToken = require("../../models/dynamoose/resetToken.js")(dynamoose);
        await User.scan().exec((err, models) => {
            if(!err) {
                models.forEach(async (model) => {
                    await User.delete(model)
                });
            }
        });
        await ResetToken.scan().exec((err, models) => {
            if(!err) {
                models.forEach(async (model) => {
                    await ResetToken.delete(model)
                });
            }
        });
    });
    shared(chai, appWrapper, restfulAuthWrapper, expect);
});
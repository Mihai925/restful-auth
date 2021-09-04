const chai = require("chai");
const chaiHttp = require("chai-http");
const bodyParser = require("body-parser");
const expect = chai.expect;
const shared = require("./shared.js");

chai.use(chaiHttp);

describe("mongoose/mongodb", function(){
    var express;
    var appWrapper = {};
    var restfulAuthWrapper = {};
    var mongoose;
    var sequelize;
    beforeEach(async () => {
        express = require("express");
        appWrapper.app = express();
        appWrapper.app.use(bodyParser.json());
        mongoose = require("mongoose");
        delete mongoose.connection.models["User"];
        delete mongoose.connection.models["ResetToken"];
        const restfulAuth = require("../../index.js");
        await mongoose.connect("mongodb://travis:test@localhost:27017/mydb_test", 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            });
        
        var collections = await mongoose.connection.db.listCollections().toArray();
        for (var i = 0; i < collections.length; i++) {
            await mongoose.connection.db.dropCollection(collections[i].name);
        }
        restfulAuthWrapper.app = 
            restfulAuth(appWrapper.app, {
                type: "mongoose",
                db: mongoose
            });
    });

    afterEach(async () => {
        mongoose.connection.close();
    });
    shared(chai, appWrapper, restfulAuthWrapper, expect);
});
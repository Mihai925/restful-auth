const chai = require("chai");
const chaiHttp = require("chai-http");
const bodyParser = require("body-parser");
const expect = chai.expect;
const { Sequelize } = require("sequelize");
chai.use(chaiHttp);

describe("Integration", function() {
    describe("sequelize(sqlite)+Express", function(){
        var express;
        var app;
        var sequelize;
        beforeEach( async () => {
            express = require("express");
            app = express();
            app.use(bodyParser.json());
            sequelize = new Sequelize("sqlite::memory:", { logging: false});
            const restfulAuth = require("../../../index.js");

            restfulAuth(app, {
                type: "sequelize",
                db: sequelize
            });
        });

        it("should register and login a user", async () => {
            const regResponse = await chai.request(app)
                .post("/api/register")
                .send({"username":"john", "password":"pwd12345"})
                .catch(function (err) {
                    throw new Error(err);
                });
            const loginResponse = await chai.request(app)
                .post("/api/login")
                .send({"username":"john", "password":"pwd12345"})
                .catch(function (err) {
                    throw new Error(err);
                });
            expect(regResponse).to.have.status(200);
            expect(loginResponse).to.have.status(200);
            expect(loginResponse.body).to.have.property("token");
            expect(loginResponse.body).to.have.property("auth").eql(true);
            expect(loginResponse.body).to.have.property("group").eql("standard");
        });
        
        it("should not login a user that is not registered", async () => {
            const loginResponse = await chai.request(app)
                .post("/api/login")
                .send({"username":"john", "password":"pwd12345"})
                .catch(function (err) {
                    throw new Error(err);
                });
            expect(loginResponse).to.have.status(200);
            expect(loginResponse.body).to.not.have.property("token");
            expect(loginResponse.body).to.have.property("auth").eql(false);
      });

        it("should not login a user with wrong password", async () => {
            const regResponse = await chai.request(app)
                .post("/api/register")
                .send({"username":"john", "password":"pwd12345"})
                .catch(function (err) {
                    throw new Error(err);
                });
            const loginResponse = await chai.request(app)
                .post("/api/login")
                .send({"username":"john", "password":"wrongpassword"})
                .catch(function (err) {
                    throw new Error(err);
                });
            expect(loginResponse).to.have.status(200);
            expect(loginResponse.body).to.not.have.property("token");
            expect(loginResponse.body).to.have.property("auth").eql(false);
            });

        it("should register and login a user belonging to a custom group", async () => {
            const regResponse = await chai.request(app)
                .post("/api/register")
                .send({"username":"john", "password":"pwd12345", "group": "customgroup"})
                .catch(function (err) {
                    throw new Error(err);
            });
            const loginResponse = await chai.request(app)
                .post("/api/login")
                .send({"username":"john", "password":"pwd12345"})
                .catch(function (err) {
                    throw new Error(err);
            });
            expect(regResponse).to.have.status(200);
            expect(loginResponse).to.have.status(200);
            expect(loginResponse.body).to.have.property("group").eql("customgroup");
        });

    });


});
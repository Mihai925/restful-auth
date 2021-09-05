const chai = require("chai");
const expect = chai.expect;
const jwt = require("jsonwebtoken");
const JWTSecret = require("../config/jwtConfig");
const secret = "test-secret";
const sinon  = require('sinon');

describe("middlewares", () => {
    const middlewares = require("../helpers/middlewares");
    describe("login", () => {
        const IsLoggedIn = middlewares.login();
        it("should return a function", () => {
            expect(typeof(IsLoggedIn)).to.equal("function");
        });

        it("should accept three arguments", () => {
            expect(IsLoggedIn.length).to.equal(3);
        });

        it("should accept a valid jwt signed token", () => {
            const token = jwt.sign({user:"user", role:"role"}, JWTSecret.secret);
            var nextSpy = sinon.spy();
            IsLoggedIn({token}, {}, nextSpy);
            expect(nextSpy.calledOnce).to.be.true;
        });

        it("should not accept an invalid token", () => {
            const token = "invalid-token";
            var nextSpy = sinon.spy();
            var sendStatusSpy = sinon.spy();
            const fakeRes = {
                sendStatus: (code) => "code"
            }
            const fakeSendStatus = sinon.replace(fakeRes, "sendStatus", sinon.fake(fakeRes.sendStatus));

            
            IsLoggedIn({token}, fakeRes, nextSpy);
            expect(nextSpy.notCalled).to.be.true;
            expect(fakeSendStatus.callCount).to.equal(1);
            expect(fakeSendStatus.getCall(0).args.length).to.equal(1);
            expect(fakeSendStatus.getCall(0).args[0]).to.equal(404);

        });
    });

    describe("role", () => {
        const HasRole = middlewares.role("role");
        it("should return a function", () => {
            expect(typeof(HasRole)).to.equal("function");
        });
        it("should accept three arguments", () => {
            expect(HasRole.length).to.equal(3);
        });

        it("should accept a valid role", () => {
            const token = jwt.sign({user:"user", role:"role"}, JWTSecret.secret);
            var nextSpy = sinon.spy();
            HasRole({token}, {}, nextSpy);
            expect(nextSpy.calledOnce).to.be.true;
        });

        it("should not accept an invalid role", () => {
            const token = jwt.sign({user:"user", role:"role2"}, JWTSecret.secret);
            var nextSpy = sinon.spy();
            var sendStatusSpy = sinon.spy();
            const fakeRes = {
                sendStatus: (code) => "code"
            }
            const fakeSendStatus = sinon.replace(fakeRes, "sendStatus", sinon.fake(fakeRes.sendStatus));

            HasRole({token}, fakeRes, nextSpy);
            expect(nextSpy.notCalled).to.be.true;
            expect(fakeSendStatus.callCount).to.equal(1);
            expect(fakeSendStatus.getCall(0).args.length).to.equal(1);
            expect(fakeSendStatus.getCall(0).args[0]).to.equal(404);
        });

        it("should not accept an invalid token", () => {
            const token = "invalid-token";
            var nextSpy = sinon.spy();
            var sendStatusSpy = sinon.spy();
            const fakeRes = {
                sendStatus: (code) => "code"
            }
            const fakeSendStatus = sinon.replace(fakeRes, "sendStatus", sinon.fake(fakeRes.sendStatus));

            HasRole({token}, fakeRes, nextSpy);
            expect(nextSpy.notCalled).to.be.true;
            expect(fakeSendStatus.callCount).to.equal(1);
            expect(fakeSendStatus.getCall(0).args.length).to.equal(1);
            expect(fakeSendStatus.getCall(0).args[0]).to.equal(404);
        });
    });
});
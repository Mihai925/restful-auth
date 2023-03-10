module.exports = (chai, appWrapper, restfulAuthWrapper, expect) => {
    const sinon  = require('sinon');
    it("should register, login and logout user", async () => {
        const regResponse = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"id":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(regResponse).to.have.status(200);

        const loginResponse = await chai.request(appWrapper.app)
            .post("/api/login")
            .send({"id":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(loginResponse).to.have.status(200);
        expect(loginResponse.body).to.have.property("token");
        expect(loginResponse.body).to.have.property("auth").eql(true);
        const token = loginResponse.body.token;
        const loginMiddleware = restfulAuthWrapper.app.middlewares.IsLoggedIn();
        var nextSpy = sinon.spy();
        loginMiddleware({token}, {}, nextSpy);
        expect(nextSpy.calledOnce).to.be.true;
        const logoutResponse = await chai.request(appWrapper.app)
            .post("/api/logout")
            .redirects(0)
            .catch(function (err) {
                throw new Error(err);
            });
        expect(logoutResponse).to.have.status(302);
    });
        
    it("should not login a user that is not registered", async () => {
        const loginResponse = await chai.request(appWrapper.app)
            .post("/api/login")
            .send({"id":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(loginResponse).to.have.status(200);
        //expect(loginResponse.body).to.not.have.property("token");
        expect(loginResponse.body).to.have.property("auth").eql(false);
    });

    it("should restart the password using a token", async () => {
        const regResponse = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"id":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(regResponse).to.have.status(200);
        const token = await restfulAuthWrapper.app.CreateResetToken("john");
        const resetResponse = await chai.request(appWrapper.app)
            .post("/api/reset")
            .send({"id":"john", "password":"newpass", token})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(resetResponse).to.have.status(200);
        const firstLoginResponse = await chai.request(appWrapper.app)
            .post("/api/login")
            .send({"id":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        const secondLoginResponse = await chai.request(appWrapper.app)
            .post("/api/login")
            .send({"id":"john", "password":"newpass"})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(firstLoginResponse.body).to.have.property("auth").eql(false);
        expect(secondLoginResponse.body).to.have.property("auth").eql(true);
    });

    it("should not restart the password after expiry date", async () => {
        const regResponse = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"id":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(regResponse).to.have.status(200);
        const token = await restfulAuthWrapper.app.CreateResetToken("john", -24*60*60);
        const resetResponse = await chai.request(appWrapper.app)
            .post("/api/reset")
            .send({"id":"john", "password":"newpass", "token":token})
            .catch(function (err) {
                throw new Error(err);
        });
        expect(resetResponse).to.have.status(404);
    });

    it("should not create tokens for non-existent users", async () => {        
        const token = await restfulAuthWrapper.app.CreateResetToken("john");
        expect(token).to.equal(undefined);
    });

    it("should not register a user twice", async () => {
        const regResponse = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"id":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        const secondReg = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"id":"john", "password":"pwd123"})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(regResponse).to.have.status(200);
        expect(secondReg).to.have.status(409);
    });

    it("should not login a user with wrong password", async () => {
        const regResponse = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"id":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        const loginResponse = await chai.request(appWrapper.app)
            .post("/api/login")
            .send({"id":"john", "password":"wrongpassword"})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(loginResponse).to.have.status(200);
        expect(loginResponse.body).to.not.have.property("token");
        expect(loginResponse.body).to.have.property("auth").eql(false);
        });

    it("should register and login a user belonging to a custom role", async () => {
        const regResponse = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"id":"john", "password":"pwd12345", "role": "customrole"})
            .catch(function (err) {
                throw new Error(err);
        });
        const loginResponse = await chai.request(appWrapper.app)
            .post("/api/login")
            .send({"id":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
        });
        const token = loginResponse.body.token;
        const roleMiddleware = restfulAuthWrapper.app.middlewares.HasRole("customrole");
        var nextSpy = sinon.spy();
        roleMiddleware({token}, {}, nextSpy);
        expect(nextSpy.calledOnce).to.be.true;
        expect(regResponse).to.have.status(200);
        expect(loginResponse).to.have.status(200);
    }); 
};

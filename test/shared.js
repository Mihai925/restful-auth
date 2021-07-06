module.exports = (chai, appWrapper, expect) => {
    it("should register and login a user", async () => {
        //console.log("App: " + appWrapper);
        //console.log("Chai: " + chai);
        const regResponse = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"username":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        const loginResponse = await chai.request(appWrapper.app)
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
        const loginResponse = await chai.request(appWrapper.app)
            .post("/api/login")
            .send({"username":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(loginResponse).to.have.status(200);
        expect(loginResponse.body).to.not.have.property("token");
        expect(loginResponse.body).to.have.property("auth").eql(false);
    });

    it("should not register a user twice", async () => {
        const regResponse = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"username":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        const secondReg = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"username":"john", "password":"pwd123"})
            .catch(function (err) {
                throw new Error(err);
            });
        expect(regResponse).to.have.status(200);
        expect(secondReg).to.have.status(409);
    });

    it("should not login a user with wrong password", async () => {
        const regResponse = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"username":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
            });
        const loginResponse = await chai.request(appWrapper.app)
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
        const regResponse = await chai.request(appWrapper.app)
            .post("/api/register")
            .send({"username":"john", "password":"pwd12345", "group": "customgroup"})
            .catch(function (err) {
                throw new Error(err);
        });
        const loginResponse = await chai.request(appWrapper.app)
            .post("/api/login")
            .send({"username":"john", "password":"pwd12345"})
            .catch(function (err) {
                throw new Error(err);
        });
        expect(regResponse).to.have.status(200);
        expect(loginResponse).to.have.status(200);
        expect(loginResponse.body).to.have.property("group").eql("customgroup");
    }); 
};

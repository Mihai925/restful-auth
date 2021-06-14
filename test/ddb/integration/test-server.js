//  AWS_ACCESS_KEY_ID=a AWS_SECRET_ACCESS_KEY=b AWS_REGION="us-east-1" ./node_modules/mocha/bin/mocha test/ddb/*  --exit --unhandled-rejections=strict
const chai = require('chai');
const chaiHttp = require('chai-http');
const bodyParser = require('body-parser');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration', function() {
    describe('Dynamoose+Express', function(){
      var DdbLocalServer;
      var dynamoose;
      var restfulAuth;
      var express;
      var app;
      var ddbInstance;
      beforeEach(async () => {
        DdbLocalServer = require('dynamodb-local');
        dynamoose = null;
        dynamoose = require("dynamoose");
        restfulAuth = require("../../../index.js");
        express = require("express");
        app = express();
        app.use(bodyParser.json());
        ddbInstance = await new DdbLocalServer.launch("3456", null, ['-sharedDb'], true, true);
        dynamoose.aws.ddb.local("http://localhost:3456");


        restfulAuth(app, {
          type: 'dynamoose',
          db: dynamoose
        });
      });

      afterEach(async () => {
        await DdbLocalServer.stop("3456");
      });

      it('should register and login a user', async () => {
        const regResponse = await chai.request(app)
          .post('/api/register')
          .send({'username':'john', 'password':'pwd12345'})
          .catch(function (err) {
            console.log(err);
          });
        const loginResponse = await chai.request(app)
          .post('/api/login')
          .send({'username':'john', 'password':'pwd12345'})
          .catch(function (err) {
            console.log(err);
          });
        expect(regResponse).to.have.status(200);
        expect(loginResponse).to.have.status(200);
        expect(loginResponse.body).to.have.property('token');
        expect(loginResponse.body).to.have.property('auth').eql(true);
        expect(loginResponse.body).to.have.property('group').eql("standard");
      });

      it('should not login a user that is not registered', async () => {
        const loginResponse = await chai.request(app)
          .post('/api/login')
          .send({'username':'john', 'password':'pwd12345'})
          .catch(function (err) {
            console.log(err);
          });
          expect(loginResponse).to.have.status(200);
          expect(loginResponse.body).to.not.have.property('token');
          expect(loginResponse.body).to.have.property('auth').eql(false);
      });

      it('should not login a user with wrong password', async () => {
        const regResponse = await chai.request(app)
          .post('/api/register')
          .send({'username':'john', 'password':'pwd12345'})
          .catch(function (err) {
            console.log(err);
          });
        const loginResponse = await chai.request(app)
          .post('/api/login')
          .send({'username':'john', 'password':'wrongpassword'})
          .catch(function (err) {
            console.log(err);
          });
          expect(loginResponse).to.have.status(200);
          expect(loginResponse.body).to.not.have.property('token');
          expect(loginResponse.body).to.have.property('auth').eql(false);
      });

      it('should register and login a user belonging to a custom group', async () => {
        const regResponse = await chai.request(app)
          .post('/api/register')
          .send({'username':'john', 'password':'pwd12345', 'group': 'customgroup'})
          .catch(function (err) {
            console.log(err);
          });
        const loginResponse = await chai.request(app)
          .post('/api/login')
          .send({'username':'john', 'password':'pwd12345'})
          .catch(function (err) {
            console.log(err);
          });
        expect(regResponse).to.have.status(200);
        expect(loginResponse).to.have.status(200);
        expect(loginResponse.body).to.have.property('group').eql("customgroup");
      });
    });
});

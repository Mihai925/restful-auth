//  AWS_ACCESS_KEY_ID=a AWS_SECRET_ACCESS_KEY=b AWS_REGION="us-east-1" ./node_modules/mocha/bin/mocha test/ddb/*  --exit --unhandled-rejections=strict
var runServer = (test_function) => {

  app.set('port', 8000)
  var server = http.createServer(app);
  server.listen(8000);
  dynamoose.aws.ddb.local("http://localhost:3456");
  restfulAuth(app, {
    dialect: 'dynamodb',
    db: dynamoose
  })

  test_function(app)
  server.close();
}
const chai = require('chai');
const chaiHttp = require('chai-http');
const bodyParser = require('body-parser');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration', function() {
    describe('DDB+Express', function(){
      var dynamoose;
      var restfulAuth;
      var express;
      var app;
      var server;
      var DdbLocalServer;
      var ddbInstance;
      beforeEach(async () => {
        DdbLocalServer = require('dynamodb-local')
        dynamoose = require("dynamoose");
        restfulAuth = require("../../../index.js");
        express = require("express");
        app = express();
        app.use(bodyParser.json());
        ddbInstance = await new DdbLocalServer.launch("3456", null, ['-sharedDb'], true, true);

        dynamoose.aws.ddb.local("http://localhost:3456");


        restfulAuth(app, {
          dialect: 'dynamodb',
          db: dynamoose
        })
      })

      afterEach(async () => {
        await DdbLocalServer.stopChild(ddbInstance);
        console.log("Stopping DDB");
      })

      it('should register and login a user', async () => {
        const regRequest = await chai.request(app)
          .post('/api/register')
          .send({'username':'john', 'password':'pwd12345'})
          .catch(function (err) {
            console.log(err);
          });
        const loginRequest = await chai.request(app)
          .post('/api/login')
          .send({'username':'john', 'password':'pwd12345'})
          .catch(function (err) {
            console.log(err);
          });
        expect(regRequest).to.have.status(200);
        expect(loginRequest).to.have.status(200);
      })


    })
});

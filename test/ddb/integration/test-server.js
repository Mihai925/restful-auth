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
//TODO use this:
//const AWS = require('aws-sdk');
//AWS.config.update({
//  region: "us-west-2",
//  endpoint: "http://localhost:8000"
//});
//const ddb_client = new AWS.DynamoDB({endpoint: new AWS.Endpoint('http://localhost:3456')});;
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
        console.log("DDB here")

        //var tab = await ddb_client.deleteTable({TableName: "User"}).promise();
        //console.log(tab);
        dynamoose.aws.ddb.local("http://localhost:3456");


        restfulAuth(app, {
          dialect: 'dynamodb',
          db: dynamoose
        })
        console.log("Checkpoint here")
      })

      afterEach(async () => {
        await DdbLocalServer.stopChild(ddbInstance);
        console.log("Stopping DDB");
      })

      it('should register a user', () => {
        return chai.request(app)
          .post('/api/register')
          .send({'username':'john', 'password':'pwd12345'})
          .then((res) => {
            expect(res).to.have.status(200);
          })
          .catch(function (err) {
            console.log(err);
          });

      })


    })
});

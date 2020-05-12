//Note: This test requires you manually setup a ddb local on port 3456 before running it
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
var chai = require('chai');
var chaiHttp = require('chai-http');
var bodyParser = require('body-parser');
var expect = chai.expect;

chai.use(chaiHttp);

describe('Integration', function() {
    describe('DDB+Express', function(){
      var dynamoose;
      var restfulAuth;
      var express;
      var app;
      var server;

      beforeEach(() => {
        dynamoose = require("dynamoose");
        restfulAuth = require("../../../index.js");
        express = require("express");
        app = express();
        app.use(bodyParser.json());

        dynamoose.aws.ddb.local("http://localhost:3456");
        restfulAuth(app, {
          dialect: 'dynamodb',
          db: dynamoose
        })
      })

      it('should register a user', () => {
        return chai.request(app)
          .post('/api/register')
          .send({'username':'john', 'password':'pwd12345'})
          .then((res) => {
            expect(res).to.have.status(200);
          });

      })


    })
});

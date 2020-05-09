var runServer = () => {
  var dynamoose = require("dynamoose");
  var restfulAuth = require("../../../index.js");
  var express = require("express");
  var app = express();
  dynamoose.aws.ddb.local("http://localhost:8000");
  app = express();
  restfulAuth(app, {
    dialect: 'dynamodb',
    db: dynamoose
  })
}

var assert = require('assert')
describe('Integration', function() {

    var ddbLocal = new DdbLocal();

    before(function (done){
        ddbLocal.start(done);
      }
    );

    describe('DDB+Express', function(){
      it('should integrate properly', function() {
        runServer();
      })
    });

    after(function(done) {
      ddbLocal.stop(done);
    });
});

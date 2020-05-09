const ddb_user_model = require('./models/ddb/user.js')

module.exports = (app, config) => {
  if(config.dialect != 'dynamodb') {
    throw new Error('Your database dialect is not supported');
  }
  var db = config.db;

  if(typeof db != 'object' || !db.aws) {
    throw new Error('Please provide a valid dynamoose instance')
  }
  ddb_user_model(db);

}

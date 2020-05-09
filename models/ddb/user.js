
module.exports = (dynamoose) => {
const user = dynamoose.model ("Users",
  new dynamoose.Schema({
      "username": {
        "hashKey": true,
        "type": String,
        "required": true
      },
      "password": {
        "type": String,
        "required": true
      },
      "email": {
        "type": String,
        "required": true,
        "index": {
          "name": "emailIndex",
          "global": true
        }
      }
    })
  )
}

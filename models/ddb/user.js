module.exports = (dynamoose) => {
return dynamoose.model("User",
    {
      "username": {
        "hashKey": true,
        "type": String,
        "required": true
      },
      "password": {
        "type": String,
        "required": true
      },
      "group": {
        "type": String,
        "required": false,
        "index": {
          "name": "groupIndex",
          "global": true
        }
      }
    }
  );
};

module.exports = (dynamoose) => {
return dynamoose.model("User",
    {
      "id": {
        "hashKey": true,
        "type": String,
        "required": true
      },
      "password": {
        "type": String,
        "required": true
      },
      "role": {
        "type": String,
        "required": false
      }
    }
  );
};

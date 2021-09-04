module.exports = (dynamoose) => {
return dynamoose.model("ResetToken",
    {
      "token": {
        "hashKey": true,
        "type": String,
        "required": true
      },
      "userId": {
        "type": String,
        "required": true
      },
      "expiry": {
        "type": Number
      }
    }
  );
};
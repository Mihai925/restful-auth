module.exports = (mongoose) => {
    const { Schema } = mongoose;
    const resetTokenSchema = new Schema({
        token: {type: String, unique: true},
        userId: {type: String},
        expiry: {type: Number}
    });
    return mongoose.model("ResetToken", resetTokenSchema);
};
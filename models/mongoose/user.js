module.exports = (mongoose) => {
    const { Schema } = mongoose;
    const userSchema = new Schema({
        _id: {type: String},
        password: String,
        role: {type: String, index: true}
    });
    return mongoose.model("User", userSchema);
};
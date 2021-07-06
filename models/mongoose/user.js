module.exports = (mongoose) => {
	const { Schema } = mongoose;
	const userSchema = new Schema({
		username: {type: String, unique: true},
		password: String,
		group: {type: String, index: true}
	});
	return mongoose.model("User", userSchema);
};
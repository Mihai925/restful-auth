//Note: Not using DataType since we don't wanna make the user inject that too. We'll just go with "VARCHAR(255)"
module.exports = (sequelize) => {
	return sequelize.define("User", {
		username: {
			type: "VARCHAR(255)",
			allowNull: false,
			primaryKey: true
		},
		password: {
			type: "VARCHAR(255)",
			allowNull: false
		},
		group: {
			type: "VARCHAR(255)",
		}
	},
	{
		indexes: [
			{
				unique: false,
				fields: ["group"]
			}
		]
	});
};
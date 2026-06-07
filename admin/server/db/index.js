const mongoose = require("mongoose");
const { MONGO_DB_URI } = require("../config");

const dbConnect = async () => {
	try {
		await mongoose.connect(`${MONGO_DB_URI}`);
		console.log("Db is connected");
	} catch (error) {
		console.log(`Error is ${error}`);
	}
};

module.exports = dbConnect;
const config = require("./key");
const mongoose = require("mongoose");
const connectDB = async () => {
	try {
		await mongoose.connect(config.mongoURI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true
		});
		console.log("connected to db");
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;

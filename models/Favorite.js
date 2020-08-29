const mongoose = require("mongoose");
const favoriteSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		movieId: {
			type: String
		},
		movieTitle: {
			type: String
		},
		moviePost: {
			type: String
		},
		movieRunTime: {
			type: String
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Favorite", favoriteSchema);

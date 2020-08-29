const mongoose = require("mongoose");
const CommentSchema = mongoose.Schema({
	writer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	postId: {
		type: String
	},
	responseTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	content: {
		type: String
	}
});

module.exports = mongoose.model("Comment", CommentSchema);

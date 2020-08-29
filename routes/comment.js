const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const Comment = require("../models/Comment");
//save the comment
router.post("/saveComment", isAuth, (req, res) => {
	//save the data
	const comment = new Comment(req.body);
	comment.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		Comment.find({ _id: comment._id })
			.populate("writer")
			.exec((err, result) => {
				if (err) return res.json({ success: false, err });
				return res.status(200).json({ success: true, result });
			});
	});
});

//get all comments
router.post("/getComments", (req, res) => {
	Comment.find({ postId: req.body.movieId })
		.populate("writer")
		.exec((err, comments) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).json({ success: true, comments });
		});
});
module.exports = router;

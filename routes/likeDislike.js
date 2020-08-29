const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const Like = require("../models/Like");
const Dislike = require("../models/DisLike");

//get all likes
router.post("/getLikes", (req, res) => {
	let variables = {};
	if (req.body.MovieId) {
		variables = { MovieId: req.body.MovieId };
	} else {
		variables = { commentId: req.body.commentId };
	}
	Like.find(variables).exec((err, likes) => {
		if (err) return res.status(400).send(err);

		res.status(200).json({ success: true, likes });
	});
});

//get all dislikes
router.post("/getDislikes", (req, res) => {
	let variables = {};
	if (req.body.MovieId) {
		variables = { MovieId: req.body.MovieId };
	} else {
		variables = { commentId: req.body.commentId };
	}
	Dislike.find(variables).exec((err, dislikes) => {
		if (err) return res.status(400).send(err);

		res.status(200).json({ success: true, dislikes });
	});
});

//add like
router.post("/upLike", isAuth, (req, res) => {
	let variables = {};
	console.log("movie data", req.body);
	if (req.body.MovieId) {
		variables = { MovieId: req.body.MovieId, userId: req.body.userId };
	} else {
		variables = { commentId: req.body.commentId, userId: req.body.userId };
	}
	const like = new Like(variables);
	like.save((err, likeRes) => {
		if (err)
			return res.json({
				success: false,
				err
			});

		//in case the dislike button is already clicked we need to decrease the dislikes by 1
		Dislike.findOneAndDelete(variables).exec((err, results) => {
			if (err)
				return res.status(400).json({
					success: false,
					err
				});
			res.status(200).json({ success: true });
		});
	});
});

//remove the like
router.post("/unLike", isAuth, (req, res) => {
	let variables = {};
	if (req.body.MovieId) {
		variables = { MovieId: req.body.MovieId, userId: req.body.userId };
	} else {
		variables = { commentId: req.body.commentId, userId: req.body.userId };
	}

	//toggle the like and remove it
	Like.findOneAndDelete(variables).exec((err, result) => {
		if (err)
			return res.json({
				success: false,
				err
			});
		res.status(200).json({ success: true });
	});
});

//remove the dislike
router.post("/unDislike", isAuth, (req, res) => {
	let variables = {};
	if (req.body.MovieId) {
		variables = { MovieId: req.body.MovieId, userId: req.body.userId };
	} else {
		variables = { commentId: req.body.commentId, userId: req.body.userId };
	}

	//toggle the like and remove it
	Dislike.findOneAndDelete(variables).exec((err, result) => {
		if (err)
			return res.json({
				success: false,
				err
			});
		res.status(200).json({ success: true });
	});
});

//add dislike
router.post("/upDislike", isAuth, (req, res) => {
	let variables = {};
	if (req.body.MovieId) {
		variables = { MovieId: req.body.MovieId, userId: req.body.userId };
	} else {
		variables = { commentId: req.body.commentId, userId: req.body.userId };
	}
	const DisLike = new Dislike(variables);
	DisLike.save((err, likeRes) => {
		if (err)
			return res.json({
				success: false,
				err
			});

		//in case the dislike button is already clicked we need to decrease the dislikes by 1
		Like.findOneAndDelete(variables).exec((err, results) => {
			if (err)
				return res.json({
					success: false,
					err
				});
			res.status(200).json({ success: true });
		});
	});
});

module.exports = router;

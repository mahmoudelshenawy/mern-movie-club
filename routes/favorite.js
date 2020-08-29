const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const Favorite = require("../models/Favorite");

router.post("/favoriteNumber", isAuth, (req, res) => {
	//find the favorite list
	Favorite.find({ movieId: req.body.movieId }).exec((err, favorite) => {
		if (err) return res.status(400).send(err);
		res.status(200).json({ success: true, favoriteNumber: favorite.length });
	});
});

router.post("/isFavorite", (req, res) => {
	//find the favorite list
	Favorite.find({ movieId: req.body.movieId, userId: req.body.userId }).exec(
		(err, isFavorite) => {
			if (err) return res.status(400).send(err);

			let result = false;
			if (isFavorite.length !== 0) {
				result = true;
			}
			res.status(200).json({ success: true, isFavorite: result });
		}
	);
});

//add to favorite
router.post("/addToFavorite", isAuth, (req, res) => {
	//save the data
	const favorite = new Favorite(req.body);
	favorite.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});
//remove from favorite
router.post("/removeFromFavorite", isAuth, (req, res) => {
	Favorite.findOneAndDelete({
		movieId: req.body.movieId,
		userId: req.body.userId
	}).exec((err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true, doc });
	});
});

//get favorite movies
router.post("/getFavoredMovies", isAuth, (req, res) => {
	Favorite.find({
		userFrom: req.body.userFrom
	}).exec((err, movies) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true, movies });
	});
});
module.exports = router;

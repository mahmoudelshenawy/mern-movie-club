const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuth = require("../middleware/isAuth");
const gravatar = require("gravatar");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const config = require("../config/key");
//models
const User = require("../models/user");

//GET auth
//For the front end to the user
router.get("/", isAuth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error");
	}
});
//POST signup
router.post(
	"/signup",
	[
		check("name", "name is required")
			.not()
			.isEmpty(),
		check("email", "email is required").isEmail(),
		check(
			"password",
			"at least 6 characters with numbers, letters and symbols"
		).isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}
		const { name, email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (user) {
				res.status(400).json({ errors: [{ msg: "user already exists" }] });
			}
			const avatar = gravatar.url(email, {
				s: "200",
				r: "pg",
				d: "mm"
			});
			//create new user
			user = new User({
				_id: new mongoose.Types.ObjectId(),
				name,
				email,
				password,
				avatar
			});
			//hash the password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			//save the user in the data base
			await user.save();
			//get the token in return
			const payload = {
				user: {
					id: user.id
				}
			};
			jwt.sign(
				payload,
				config.secretToken,
				{ expiresIn: 36000 },
				(err, token) => {
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("server error");
		}
	}
);

//POST login
router.post(
	"/login",
	[
		check("email", "please include a valid email").isEmail(),
		check("password", "password is required").exists()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "invalid email or password" }] });
			}
			const isMatched = await bcrypt.compare(password, user.password);
			if (!isMatched) {
				return res
					.status(400)
					.json({ errors: [{ msg: "invalid email or password" }] });
			}
			const payload = {
				user: {
					id: user.id
				}
			};
			jwt.sign(
				payload,
				config.secretToken,
				{ expiresIn: 36000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("server error");
		}
	}
);

module.exports = router;

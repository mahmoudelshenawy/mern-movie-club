const jwt = require("jsonwebtoken");
const config = require("../config/key");

module.exports = function(req, res, next) {
	//Get the token from the header
	const token = req.header("auth-token");

	//check if not token
	if (!token) {
		return res.status(401).json({ msg: "No Token, authorization denied" });
	}
	//verify the token
	try {
		const decoded = jwt.verify(token, config.secretToken);
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: "Token is not valid" });
	}
};

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

//Init middleware
app.use(express.json({ extended: false }));
app.use(cors());

connectDB();

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static("client/build"));

	// index.html for all page routes
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
	});
}

//ROUTES
app.use("/api/user", require("./routes/user"));
app.use("/api/favorite", require("./routes/favorite"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/like", require("./routes/likeDislike"));
const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server Running at ${port}`);
});

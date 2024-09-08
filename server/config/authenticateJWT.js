const jwt = require("jsonwebtoken");
const express = require("express");
const protecedRoute = express.Router();

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	console.log("token", token);

	if (token == null)
		return res
			.status(401)
			.json({ error: "No token provided", isAuthenticated: false });

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				return res.status(401).json({
					error: "Token expired",
					isAuthenticated: false,
				});
			} else {
				return res.status(403).json({
					error: "Invalid token",
					isAuthenticated: false,
				});
			}
		}
		req.user = user;
		console.log("user", user);
		next();
	});
};

protecedRoute.get("/", authenticateToken, (req, res) => {
	res.json({
		message: "User authenticated",
		isAuthenticated: true,
	});
});

module.exports = { protecedRoute, authenticateToken };

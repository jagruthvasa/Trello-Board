const express = require("express");
const authRouter = express.Router();
const passport = require("passport");
const {
	insertGoogleUser,
	isUserExist,
	isUserGoogleLogin,
} = require("../models/user");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = async (user) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{
				expiresIn: "2h",
			},
			(err, token) => {
				if (err) {
					reject(err);
				} else {
					resolve(token);
				}
			}
		);
	});
};

// this function will be called when the user logs in with google
authRouter.get("/google/callback", (req, res, next) => {
	passport.authenticate("google", async (err, user, info) => {
		if (err) {
			console.error("Error during authentication:", err);
			return res.redirect(`/signup?error=Authentication error`);
		}
		if (!user) {
			console.log("No user found:", info);
			return res.redirect(`/signup?error=No user found`);
		}

		try {
			console.log("user data from google api", user);
			console.log("request query", req.query);
			const userExists = await isUserExist(user.emails[0].value);
			console.log("user exists", userExists);
			const action = req.query.state;
			console.log("action", action);
			const googleLoged = await isUserGoogleLogin(
				user.emails[0].value
			);
			console.log("isUserGoogleLogin", googleLoged);

			if (action === "signup") {
				if (!userExists) {
					const result = await insertGoogleUser({
						name: user.displayName || "Unknown",
						email: user.emails[0].value,
						google_id: user.id,
					});

					const data = {
						id: result.insertId,
						email: user.emails[0].value,
					};

					console.log(
						"Google User added to the database",
						result
					);
					const token = await generateToken(data);

					return res.redirect(
						`${process.env.CLIENT_URL}/googleRedirect?token=${token}`
					);
				} else {
					return res.redirect(
						process.env.CLIENT_URL +
							"/signup?error=User already exists. Please login with email and password."
					);
				}
			} else if (action === "login") {
				if (userExists) {
					if (googleLoged == null) {
						return res.redirect(
							process.env.CLIENT_URL +
								"/signup?error=Please login with email and password."
						);
					} else {
						const data = {
							id: googleLoged.id,
							email: googleLoged.email,
						};

						console.log("google user data", data);

						const token = await generateToken(data);

						return res.redirect(
							`${process.env.CLIENT_URL}/googleRedirect?token=${token}`
						);
					}
				} else {
					return res.redirect(
						process.env.CLIENT_URL +
							"/signup?error=User does not exist"
					);
				}
			}
		} catch (err) {
			console.error("Database error:", err);
			return res.redirect(
				process.env.CLIENT_URL + "/signup?error=Database error"
			);
		}
	})(req, res, next);
});

// this function will be called when the user visits /auth/google and will redirect the user to the google login page
authRouter.get("/google", (req, res, next) => {
	console.log("State in /google route:", req.query.state);

	passport.authenticate("google", {
		scope: ["profile", "email"],
		state: req.query.state || "",
	})(req, res, next);
});

module.exports = { authRouter, generateToken };

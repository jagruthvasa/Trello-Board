const express = require("express");
const router = express.Router();
const {
	insertUser,
	isUserExist,
	isUserNormalLogin,
	loginUser,
	insertImage,
	fetchUserById,
} = require("../models/user");
const { generateToken } = require("./auth");
const bcrypt = require("bcryptjs");
const { authenticateToken } = require("../config/authenticateJWT");
const multer = require("multer");
const { uploadToS3 } = require("../config/imageUpload");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = { name, email, password: hashedPassword };

		const existingUser = await isUserExist(email);

		if (existingUser) {
			const normalLoginUser = await isUserNormalLogin(email);

			if (normalLoginUser) {
				return res.status(400).json({
					message: "User already exists.",
				});
			} else {
				return res.status(400).json({
					message: "User already exists. Please login with Google.",
				});
			}
		}

		const result = await insertUser(user);
		const data = { id: result.insertId, email: email };
		const token = await generateToken(data);

		res.status(200).json({
			message: "User registered successfully",
			userId: result.insertId,
			token: token,
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
			message: "User registration failed",
		});
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const userExist = await isUserExist(email);

		if (!userExist) {
			return res.status(400).json({
				message: "User not found.",
			});
		}

		const user = await isUserNormalLogin(email);

		console.log("user", user);

		if (!user) {
			return res.status(400).json({
				message: "User already existed. Please login with Google.",
			});
		}

		const userData = await loginUser(email);
		console.log("userData", userData);

		if (!userData) {
			return res.status(400).json({
				message: "Invalid credentials.",
			});
		}

		const isMatch = await bcrypt.compare(password, userData.password);

		if (!isMatch) {
			return res.status(400).json({
				message: "Invalid Password.",
			});
		}

		const data = { id: userData.id, email: email };
		const token = await generateToken(data);

		res.status(200).json({
			message: "User logged in successfully",
			userId: userData.id,
			token: token,
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
			message: "User login failed",
		});
	}
});

// get user details
router.get("/getUserDetails", authenticateToken, async (req, res) => {
	try {
		const user = await fetchUserById(req.user.id);
		res.status(200).json(user);
	} catch (err) {
		console.error("Failed to get user details", err);
		res.status(500).json({ error: "Failed to get user details" });
	}
});

router.post(
	"/uploadImage",
	authenticateToken,
	upload.single("image"),
	async (req, res) => {
		if (!req.file) {
			return res.status(400).send("No file uploaded.");
		}

		try {
			const imageUrl = await uploadToS3(req.file);

			// store it in the database
			const result = await insertImage(imageUrl, req.user.id);

			const user = await fetchUserById(req.user.id);

			res.status(200).json({
				message: "Image uploaded successfully",
				user: user,
			});
		} catch (error) {
			console.error("Error in upload route:", error);
			res.status(500).send("Error uploading image");
		}
	}
);

module.exports = router;

const { connection } = require("../config/db");

function queryAsync(sql, values) {
	return new Promise((resolve, reject) => {
		connection.query(sql, values, (err, results) => {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
}

const createUserTable = async () => {
	const sql = `CREATE TABLE IF NOT EXISTS users (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  email VARCHAR(255) UNIQUE NOT NULL,
                  password VARCHAR(255) DEFAULT NULL,
                  google_id VARCHAR(255) DEFAULT NULL,
                  image_url VARCHAR(255) DEFAULT NULL,
                  created_at INT(11),
                  updated_at INT(11)
            );
      `;

	try {
		await queryAsync(sql);
		console.log("users table created");
	} catch (err) {
		throw err;
	}
};

const insertUser = async (user) => {
	const created = Math.floor(Date.now() / 1000);
	const updated = created;
	const sql =
		"INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";

	try {
		const result = await queryAsync(sql, [
			user.name,
			user.email,
			user.password,
			created,
			updated,
		]);
		return result;
	} catch (err) {
		throw err;
	}
};

const insertGoogleUser = async (user) => {
	console.log("insert google user", user);

	const created = Math.floor(Date.now() / 1000);
	const updated = created;
	const sql =
		"INSERT INTO users (name, email, google_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";

	try {
		const result = await queryAsync(sql, [
			user.name,
			user.email,
			user.google_id,
			created,
			updated,
		]);
		console.log("Google User added to the database");
		console.log("result", result);
		return result;
	} catch (err) {
		throw err;
	}
};

// login route
const loginUser = async (email) => {
	const sql =
		"SELECT * FROM users WHERE email = ? AND password IS NOT NULL";
	try {
		const [result] = await queryAsync(sql, [email]);
		return result;
	} catch (err) {
		throw err;
	}
};

// Check if the user already exists
const isUserExist = async (email) => {
	const sql = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
	try {
		const [result] = await queryAsync(sql, [email]);
		console.log("user exist fun", result);
		return result.count > 0;
	} catch (err) {
		throw err;
	}
};

// check user is google login or not
const isUserGoogleLogin = async (email) => {
	const sql =
		"SELECT id, email, COUNT(*) AS count FROM users WHERE email = ? AND google_id IS NOT NULL";
	try {
		const [result] = await queryAsync(sql, [email]);
		return result.count > 0 ? result : null;
	} catch (err) {
		throw err;
	}
};

// check user is normal login or not
const isUserNormalLogin = async (email) => {
	const sql =
		"SELECT COUNT(*) AS count FROM users WHERE email = ? AND password IS NOT NULL";
	try {
		const [result] = await queryAsync(sql, [email]);
		console.log("isUserNormalLogin", result);
		return result.count > 0;
	} catch (err) {
		throw err;
	}
};

const insertImage = async (image, userId) => {
	const updated_at = Math.floor(Date.now() / 1000);
	const sql = "UPDATE users SET image_url = ?, updated_at = ? WHERE id = ?";
	try {
		const result = await queryAsync(sql, [image, updated_at, userId]);
		return result;
	} catch (err) {
		throw err;
	}
};

// fetch user by id
const fetchUserById = async (id) => {
	const sql = "SELECT name as username, email, image_url as profileImage FROM users WHERE id = ?";
	try {
		const [result] = await queryAsync(sql, [id]);
		return result;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	createUserTable,
	insertUser,
	insertGoogleUser,
	isUserExist,
	isUserGoogleLogin,
	isUserNormalLogin,
	loginUser,
	queryAsync,
	insertImage,
      fetchUserById,
};

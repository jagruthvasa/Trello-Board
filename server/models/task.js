const { connection } = require("../config/db");
const { queryAsync } = require("./user");

const default_state = 0;
const inprogress = 1;
const completed = 2;

const createTaskTable = async () => {
	const sql = `CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status INT(2) DEFAULT 0,
        created_at INT(11),
        updated_at INT(11),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`;

	try {
		await queryAsync(sql);
		console.log("tasks table created");
	} catch (err) {
		console.error(err);
	}
};

// insert a task
const insertTask = async (task) => {
	const created = Math.floor(Date.now() / 1000);
	const updated = created;
	const sql =
		"INSERT INTO tasks (user_id, title, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";

	try {
		const result = await queryAsync(sql, [
			task.user_id,
			task.title,
			task.description,
			created,
			updated,
		]);
		return result;
	} catch (err) {
		throw err;
	}
};

// get all tasks
const getAllTasks = async (user_id, searchKey) => {
	let sql = "SELECT * FROM tasks WHERE user_id = ?";
	let params = [user_id];

	if (searchKey) {
		sql += " AND title LIKE ?";
		params.push(`%${searchKey}%`);
	}

	sql += " ORDER BY updated_at DESC";

	try {
		const result = await queryAsync(sql, params);
		return result;
	} catch (err) {
		throw err;
	}
};

// export the variables
module.exports = {
	default_state,
	inprogress,
	completed,
	createTaskTable,
	getAllTasks,
	insertTask,
};

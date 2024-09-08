const express = require("express");
const router = express.Router();
const { default_state, inprogress, completed } = require("../models/task");
const { queryAsync } = require("../models/user");

const { getAllTasks, insertTask } = require("../models/task");
const { authenticateToken } = require("../config/authenticateJWT");

// create a new task
router.post("/create", authenticateToken, async (req, res) => {
	const { title, description } = req.body;
	const user_id = req.user.id;
	console.log(req.user);

	if (!title) {
		return res.status(400).json({ error: "Title is required" });
	}

	if (!description) {
		return res.status(400).json({ error: "Description is required" });
	}

	if (!user_id) {
		return res.status(400).json({ error: "User ID is required" });
	}

	const task = {
		user_id,
		title,
		description,
	};

	try {
		const result = await insertTask(task);
		res.status(200).json({ id: result.insertId });
	} catch (err) {
		console.error("Failed to create task", err);
		res.status(500).json({ error: "Failed to create task" });
	}
});

router.get("/getAllTasks", authenticateToken, async (req, res) => {
	const user_id = req.user.id;
	try {
		const { search } = req.query;

		const result = await getAllTasks(user_id, search);

		const tasks = {
			todo: [],
			inprogress: [],
			completed: [],
		};

		result.forEach((task) => {
			if (task.status === default_state) {
				tasks.todo.push(task);
			} else if (task.status === inprogress) {
				tasks.inprogress.push(task);
			} else if (task.status === completed) {
				tasks.completed.push(task);
			}
		});

		res.status(200).json(tasks);
	} catch (err) {
		console.error("Failed to get all tasks", err);
		res.status(500).json({ error: "Failed to get all tasks" });
	}
});

// update the task name and description and status by id
router.post("/update", authenticateToken, async (req, res) => {
	const { id, title, description, status } = req.body;

	console.log(
		"id",
		id,
		"title",
		title,
		"description",
		description,
		"status",
		status
	);
	console.log("req.body", req.body);

	if (!title && !description && status === undefined) {
		return res.status(400).json({ error: "Invalid input" });
	}

	var sql = "UPDATE tasks SET";
	const params = [];

	if (title) {
		sql += " title = ?,";
		params.push(title);
	}

	if (description) {
		sql += " description = ?,";
		params.push(description);
	}

	if (status !== undefined) {
		sql += " status = ?,";
		params.push(status);
	}

	sql = sql.slice(0, -1);

	sql += " WHERE id = ?";
	params.push(id);

	try {
		const result = await queryAsync(sql, params);
		res.status(200).json({ message: "Task updated successfully" });
	} catch (err) {
		console.error("Failed to update task", err);
		res.status(500).json({ error: "Failed to update task" });
	}
});

module.exports = router;


// delete the task by id
router.post("/delete", authenticateToken, async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({ error: "Invalid input" });
	}

	const sql = "DELETE FROM tasks WHERE id = ?";

	try {
		const result = await queryAsync(sql, [id]);
		res.status(200).json({ message: "Task deleted successfully" });
	} catch (err) {
		console.error("Failed to delete task", err);
		res.status(500).json({ error: "Failed to delete task" });
	}
});
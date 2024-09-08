import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import "./HomePage.css";
import TaskModal from "../TaskModel/TaskModel";
import { TaskPage } from "../TaskPage/TaskPage";
import Header from "../../components/Header/Header";
import { Plus, Search } from "lucide-react";
import Loader from "../../components/Loading/Loading";

const HomePage = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [search, setSearch] = useState("");
	const [load, setLoad] = useState(true);
	const token = localStorage.getItem("token");
	const [taskData, setTaskData] = useState([]);

	const fetchTaskData = () => {
		const params = {};

		if (search) params.search = search;
		console.log("params", params);
		setLoad(true);
		axios.get(process.env.REACT_APP_HOSTED_URL + "/task/getAllTasks", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params,
		})
			.then((res) => {
				setTaskData(res?.data);
				console.log(res.data);
				setLoad(false);
			})
			.catch((err) => {
				message.error("Error fetching tasks");
				setLoad(false);
			});
	};

	useEffect(() => {
		fetchTaskData();
	}, []);

	const onAddTask = () => {
		setIsModalVisible(true);
	};

	const onSearch = (value) => {
		setSearch(value);
	};

	return (
		<div>
			<Header />
			<div className="homepage-container">
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					<div className="task-controls">
						<button
							className="add-task-btn"
							onClick={onAddTask}
						>
							<Plus size={20} />
							Add New Task
						</button>
						<div className="search-container">
							<input
								type="text"
								className="search-input"
								placeholder="Search tasks..."
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										onSearch(
											e.target.value
										);
									}
								}}
							/>
							<Search
								size={20}
								className="search-icon"
							/>
						</div>
					</div>
				</div>

				{load ? (
					<Loader />
				) : (
					<div>
						<TaskPage
							taskData={taskData}
							setTaskData={setTaskData}
							fetchTaskData={fetchTaskData}
						/>
					</div>
				)}

				<TaskModal
					visible={isModalVisible}
					onClose={() => setIsModalVisible(false)}
					fetchTaskData={fetchTaskData}
				/>
			</div>
		</div>
	);
};

export default HomePage;

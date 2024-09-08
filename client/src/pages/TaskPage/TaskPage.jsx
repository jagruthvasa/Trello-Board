import React, { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import axios from "axios";
import "./TaskPage.css";
import { TaskCard } from "./TaskCard";
import { message } from "antd";
import Loader from "../../components/Loading/Loading";
const todo_state = 0;
const inprogress = 1;
const completed = 2;

export const TaskPage = ({ taskData, fetchTaskData }) => {
	const [load, setLoad] = useState(false);
	if (!taskData) return <p>Loading...</p>;

	const statusMapping = {
		todo: "To-Do",
		inprogress: "In-Progress",
		completed: "Completed",
	};

	const onDragEnd = (result) => {
		const { source, destination, draggableId } = result;

		if (
			!destination ||
			destination.droppableId === source.droppableId
		) {
			return;
		}

		console.log("destination", destination);

		const payload = {
			id: draggableId,
		};

		if (destination.droppableId === "todo") {
			payload.status = todo_state;
		} else if (destination.droppableId === "inprogress") {
			payload.status = inprogress;
		} else if (destination.droppableId === "completed") {
			payload.status = completed;
		}

		const token = localStorage.getItem("token");
		setLoad(true);
		axios.post(
			process.env.REACT_APP_HOSTED_URL + "/task/update",
			payload,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => {
				message.success("Task Moved Successfully");
				fetchTaskData();
				setLoad(false);
			})
			.catch((err) => {
				console.error("Error moving task", err);
				setLoad(false);
			});
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			{load ? (
				<Loader />
			) : (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					<div className="task-page">
						{["todo", "inprogress", "completed"].map(
							(column) => (
								<Droppable
									droppableId={column}
									key={column}
								>
									{(provided) => (
										<div
											className="task-column"
											{...provided.droppableProps}
											ref={
												provided.innerRef
											}
										>
											<h3>
												{statusMapping[
													column
												] ||
													column}
											</h3>
											<TaskCard
												taskData={
													taskData[
														column
													]
												}
												fetchTaskData={
													fetchTaskData
												}
											/>
											{
												provided.placeholder
											}
										</div>
									)}
								</Droppable>
							)
						)}
					</div>
				</div>
			)}
		</DragDropContext>
	);
};

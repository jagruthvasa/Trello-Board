import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { format } from "date-fns";
import "./TaskPage.css";
import { Button, Modal, Form, Input, message } from "antd";
import axios from "axios";
import {
	Trash,
	Edit3,
	Eye,
	Trash2,
	Calendar,
	Edit,
	FileText,
} from "lucide-react";

export const TaskCard = ({ taskData, fetchTaskData }) => {
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [selectedTask, setSelectedTask] = useState(null);
	const token = localStorage.getItem("token");

	const validateNotEmpty = (rule, value) => {
		if (!value || value.trim() === "") {
			return Promise.reject(
				"This field cannot be empty or whitespace only!"
			);
		}
		return Promise.resolve();
	};

	const showViewModal = (task) => {
		setSelectedTask(task);
		setViewModalVisible(true);
	};

	const showEditModal = (task) => {
		setSelectedTask(task);
		setEditModalVisible(true);
	};

	const showDeleteModal = (task) => {
		setSelectedTask(task);
		setDeleteModalVisible(true);
	};

	const handleViewModalClose = () => {
		setViewModalVisible(false);
		setSelectedTask(null);
	};

	const handleEditModalClose = () => {
		setEditModalVisible(false);
		setSelectedTask(null);
	};

	const handleDeleteModalClose = () => {
		setDeleteModalVisible(false);
		setSelectedTask(null);
	};

	const handleDeleteConfirm = () => {
		DeleteTask(selectedTask?.id);
		setDeleteModalVisible(false);
	};

	const handleEditSubmit = (values) => {
		console.log("values", values);
		values.id = selectedTask?.id;
		axios.post(
			process.env.REACT_APP_HOSTED_URL + `/task/update`,
			values,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => {
				message.success("Task Updated Successfully");
				fetchTaskData();
				setEditModalVisible(false);
			})
			.catch((err) => {
				message.error("Oops! Something went wrong!");
				setEditModalVisible(false);
			});
	};

	const DeleteTask = (taskId) => {
		console.log("taskId", taskId);
		const params = {};

		params.id = taskId;
		axios.post(
			process.env.REACT_APP_HOSTED_URL + `/task/delete`,
			params,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => {
				message.success("Task Deleted Successfully");
				fetchTaskData();
			})
			.catch((err) => {
				message.error(
					"Oops! Something went wrong while deleting the task."
				);
			});
	};

	const tasks = taskData || [];

	console.log("tasks", taskData);

	return (
		<div className="task-container">
			{tasks?.length > 0 ? (
				tasks?.map((ele, index) => (
					<Draggable
						draggableId={String(ele.id)}
						index={index}
						key={ele.id}
					>
						{(provided) => (
							<div
								className="task-card"
								ref={provided.innerRef}
								{...provided.draggableProps}
								{...provided.dragHandleProps}
							>
								<p>{ele.title}</p>
								<p>{ele.description}</p>
								<p>
									Created at:{" "}
									{format(
										new Date(
											ele.created_at
										),
										"dd MMMM yyyy HH:mm a"
									)}
								</p>
								<div className="task-buttons">
									<Button
										icon={
											<Eye
												size={
													15
												}
											/>
										}
										className="details-button"
										onClick={() =>
											showViewModal(
												ele
											)
										}
									>
										<span className="tooltip">
											View Details
										</span>
									</Button>

									<Button
										icon={
											<Edit3
												size={
													15
												}
											/>
										}
										className="edit-button"
										onClick={() =>
											showEditModal(
												ele
											)
										}
									>
										<span className="tooltip">
											Edit
										</span>
									</Button>

									<Button
										icon={
											<Trash
												size={
													15
												}
											/>
										}
										className="delete-button"
										onClick={() =>
											showDeleteModal(
												ele
											)
										}
									>
										<span className="tooltip">
											Delete
										</span>
									</Button>
								</div>

								<Modal
									title={
										<div
											style={{
												display: "flex",
												alignItems:
													"center",
											}}
										>
											<Edit
												size={
													24
												}
												style={{
													marginRight: 10,
												}}
											/>
											Task Details
										</div>
									}
									open={viewModalVisible}
									onOk={
										handleViewModalClose
									}
									onCancel={
										handleViewModalClose
									}
									footer={null}
								>
									{selectedTask && (
										<div
											style={{
												padding: "10px 0",
											}}
										>
											<p
												style={{
													display: "flex",
													alignItems:
														"center",
													marginBottom:
														"10px",
												}}
											>
												<FileText
													size={
														20
													}
													style={{
														marginRight: 8,
														color: "#4CAF50",
													}}
												/>
												<strong>
													Title:
												</strong>{" "}
												<span
													style={{
														marginLeft: 8,
													}}
												>
													{
														selectedTask.title
													}
												</span>
											</p>

											<p
												style={{
													display: "flex",
													alignItems:
														"center",
													marginBottom:
														"10px",
												}}
											>
												<FileText
													size={
														20
													}
													style={{
														marginRight: 8,
														color: "#2196F3",
													}}
												/>
												<strong>
													Description:
												</strong>{" "}
												<span
													style={{
														marginLeft: 8,
													}}
												>
													{
														selectedTask.description
													}
												</span>
											</p>

											<p
												style={{
													display: "flex",
													alignItems:
														"center",
												}}
											>
												<Calendar
													size={
														20
													}
													style={{
														marginRight: 8,
														color: "#FF9800",
													}}
												/>
												<strong>
													Created
													at:
												</strong>{" "}
												<span
													style={{
														marginLeft: 8,
													}}
												>
													{format(
														new Date(
															selectedTask.created_at
														),
														"dd MMMM yyyy HH:mm a"
													)}
												</span>
											</p>
										</div>
									)}
								</Modal>

								<Modal
									title={
										<div
											style={{
												display: "flex",
												alignItems:
													"center",
											}}
										>
											<Edit3
												style={{
													marginRight: 10,
												}}
												size={
													24
												}
											/>
											Edit Task
										</div>
									}
									open={editModalVisible}
									onCancel={
										handleEditModalClose
									}
									footer={null}
								>
									<Form
										layout="vertical"
										initialValues={
											selectedTask
										}
										onFinish={
											handleEditSubmit
										}
										style={{
											marginTop: 20,
										}}
									>
										<Form.Item
											name="title"
											label={
												<div
													style={{
														display: "flex",
														alignItems:
															"center",
													}}
												>
													<span>
														Title
													</span>
												</div>
											}
											rules={[
												{
													required: true,
													message: "Please enter the task title!",
												},
												{
													validator:
														validateNotEmpty,
												},
											]}
										>
											<Input placeholder="Enter task title" />
										</Form.Item>

										<Form.Item
											name="description"
											label={
												<div
													style={{
														display: "flex",
														alignItems:
															"center",
													}}
												>
													<span>
														Description
													</span>
												</div>
											}
											rules={[
												{
													required: true,
													message: "Please enter the task description!",
												},
												{
													validator:
														validateNotEmpty,
												},
											]}
										>
											<Input.TextArea
												rows={4}
												placeholder="Enter task description"
											/>
										</Form.Item>

										<Form.Item>
											<div
												style={{
													display: "flex",
													justifyContent:
														"center",
												}}
											>
												<Button
													onClick={
														handleEditModalClose
													}
													style={{
														marginRight:
															"10px",
														backgroundColor:
															"#f0f0f0",
														border: "none",
														color: "#333",
													}}
												>
													Cancel
												</Button>
												<Button
													type="primary"
													htmlType="submit"
													style={{
														backgroundColor:
															"#4CAF50",
														borderColor:
															"#4CAF50",
													}}
												>
													Save
													Changes
												</Button>
											</div>
										</Form.Item>
									</Form>
								</Modal>

								<Modal
									title="Delete Task"
									open={deleteModalVisible}
									onCancel={
										handleDeleteModalClose
									}
									footer={null}
								>
									<div
										style={{
											marginBottom:
												"20px",
											textAlign:
												"center",
										}}
									>
										<Trash2
											size={48}
											color="red"
										/>
										<h3>
											Are you sure
											you want to
											delete the
											task: "
											{
												selectedTask?.title
											}
											"?
										</h3>
										<p>
											This action
											cannot be
											undone.
										</p>
									</div>

									<div
										style={{
											display: "flex",
											justifyContent:
												"center",
										}}
									>
										<Button
											onClick={
												handleDeleteModalClose
											}
											style={{
												marginRight:
													"10px",
											}}
										>
											Cancel
										</Button>
										<Button
											type="primary"
											danger
											onClick={
												handleDeleteConfirm
											}
										>
											Delete
										</Button>
									</div>
								</Modal>
							</div>
						)}
					</Draggable>
				))
			) : (
				<p style={{ textAlign: "center" }}>No Task Added</p>
			)}
		</div>
	);
};

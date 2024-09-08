import React, { useState } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import axios from "axios";
import Loader from "../../components/Loading/Loading";

const TaskModal = ({ visible, onClose, fetchTaskData }) => {
	const [form] = Form.useForm();
	const [load, setLoad] = useState(false);

	const validateNotEmpty = (rule, value) => {
		if (!value || value.trim() === "") {
			return Promise.reject("This field cannot be empty");
		}
		return Promise.resolve();
	};

	const handleSubmit = (values) => {
		const token = localStorage.getItem("token");

		console.log("values", values);

		if (!token) {
			message.error("User is not authenticated!");
			return;
		}
		setLoad(true);
		axios.post(
			process.env.REACT_APP_HOSTED_URL + "/task/create",
			{
				...values,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => {
				message.success("Task Added Successfully");
				onClose();
				fetchTaskData();
				form.resetFields();
			})
			.catch((err) => {
				message.error("Task Adding Failed");
			})
			.finally(() => {
				setLoad(false);
			});
	};

	return (
		<>
			{load ? (
				<Loader />
			) : (
				<Modal
					title="Add New Task"
					open={visible}
					onCancel={onClose}
					footer={null}
					centered
				>
					<Form
						form={form}
						layout="vertical"
						onFinish={handleSubmit}
					>
						<Form.Item
							name="title"
							label="Title"
							rules={[
								{
									required: true,
									message: "Task Title is required",
								},
								{ validator: validateNotEmpty },
							]}
						>
							<Input placeholder="Task Title" />
						</Form.Item>
						<Form.Item
							name="description"
							label="Description"
							rules={[
								{
									required: true,
									message: "Task Description is required",
								},
								{ validator: validateNotEmpty },
							]}
						>
							<Input.TextArea
								rows={4}
								placeholder="Task Description"
							/>
						</Form.Item>
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
							>
								Submit
							</Button>
							<Button
								style={{ marginLeft: "10px" }}
								onClick={onClose}
							>
								Close
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			)}
		</>
	);
};

export default TaskModal;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import Header from "../../components/Header/Header";
import { message } from "antd";

const ProfileScreen = () => {
	const [user, setUser] = useState({
		username: "",
		email: "",
		profileImage: "",
	});

	useEffect(() => {
		// Fetch user data from your API
		const fetchUserData = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					console.error("No token found");
					return;
				}

				const response = await axios.get(
					`${process.env.REACT_APP_HOSTED_URL}/user/getUserDetails`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setUser(response.data);
				console.log("User data:", response.data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUserData();
	}, []);

	const handleFileChange = async (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile && selectedFile.type.startsWith("image/")) {
			await handleUpload(selectedFile);
		} else {
			alert("Please upload an image file only.");
		}
	};

	const handleUpload = async (selectedFile) => {
		const formData = new FormData();
		formData.append("image", selectedFile);

		try {
			const token = localStorage.getItem("token");
			if (!token) {
				console.error("No token found");
				return;
			}

			const response = await axios.post(
				`${process.env.REACT_APP_HOSTED_URL}/user/uploadImage`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setUser(response.data.user);
			message.success("Image uploaded successfully");
		} catch (error) {
			console.error("Error uploading image:", error);
			message.error("Error uploading image");
		}
	};

	return (
		<div>
			<Header />
			<div className="profile-screen">
				<h1>Profile</h1>
				<div className="profile-content">
					<div className="profile-image-container">
						{user.profileImage ? (
							<img
								src={user.profileImage}
								alt="Profile"
								className="profile-image"
							/>
						) : (
							<div className="profile-image-placeholder">
								<span>No Image</span>
							</div>
						)}
						{!user.profileImage && (
							<input
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="file-input"
							/>
						)}
					</div>
					<div className="user-details">
						<p>
							<strong>Username:</strong>{" "}
							{user.username}
						</p>
						<p>
							<strong>Email:</strong> {user.email}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileScreen;

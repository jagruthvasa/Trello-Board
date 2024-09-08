import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { message } from "antd";
axios.defaults.withCredentials = true;

function Signup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const location = useLocation();
	const passwordCriteria = `
				Password must contain the following:
				• At least 7 characters long
				• At least one uppercase letter
				• At least one lowercase letter
				• At least one digit
				• At least one special character
				`;

	// Extract error message from URL query parameters
	const getErrorFromQuery = () => {
		const queryParams = new URLSearchParams(location.search);
		return queryParams.get("error");
	};

	useState(() => {
		const errorFromQuery = getErrorFromQuery();
		if (errorFromQuery) {
			message.error(errorFromQuery);
		}
	}, [location.search]);

	// Validate password
	const validatePassword = (password) => {
		const minLength = 7;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasDigit = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		if (password.length < minLength) {
			return "Password must be at least 7 characters long.";
		}
		if (!hasUpperCase) {
			return "Password must contain at least one uppercase letter.";
		}
		if (!hasLowerCase) {
			return "Password must contain at least one lowercase letter.";
		}
		if (!hasDigit) {
			return "Password must contain at least one digit.";
		}
		if (!hasSpecialChar) {
			return "Password must contain at least one special character.";
		}
		return "";
	};

	// Handle form submission
	const handleRegister = async (event) => {
		event.preventDefault();

		const passwordError = validatePassword(password);
		if (passwordError) {
			message.error(passwordError);
			message.info(passwordCriteria);
			return;
		}

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOSTED_URL}/user/register`,
				{
					name,
					email,
					password,
				}
			);

			if (response.status === 200) {
				message.success("Successfully registered");
				localStorage.setItem("token", response.data.token);
				window.location.href = "/home";
			}
		} catch (error) {
			message.error(error.response.data.message);
		}
	};

	const googleAuth = () => {
		window.location.href = `${process.env.REACT_APP_HOSTED_URL}/auth/google?state=signup`;
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Sign up Form</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img
						className={styles.img}
						src="./images/signup.jpg"
						alt="signup"
					/>
				</div>
				<div className={styles.right}>
					<h2>Create Account</h2>
					<form onSubmit={handleRegister}>
						<input
							type="text"
							className={styles.input}
							placeholder="Username"
							value={name}
							onChange={(e) =>
								setName(e.target.value)
							}
							required
						/>
						<input
							type="email"
							className={styles.input}
							placeholder="Email"
							value={email}
							onChange={(e) =>
								setEmail(e.target.value)
							}
							required
						/>
						<input
							type="password"
							className={styles.input}
							placeholder="Password"
							value={password}
							onChange={(e) =>
								setPassword(e.target.value)
							}
							required
						/>
						<div className={styles.button_container}>
							<button
								type="submit"
								className={styles.btn}
							>
								Sign Up
							</button>
							<button
								className={styles.google_btn}
								onClick={googleAuth}
							>
								<img
									src="./images/google.png"
									alt="google icon"
								/>
								<span>Sign up with Google</span>
							</button>
						</div>
					</form>
					<p className={styles.text}>
						Already Have an Account?{" "}
						<Link to="/login">Log In</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Signup;

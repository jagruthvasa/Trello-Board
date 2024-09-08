import { useState } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import { message } from "antd";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Handle form submission
	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_HOSTED_URL}/user/login`,
				{
					email,
					password,
				}
			);

			if (response.status === 200) {
				// Redirect to dashboard on successful login
				localStorage.setItem("token", response.data.token);
				message.success("Successfully logged in");
				window.location.href = "/home";
			}
		} catch (error) {
			message.error(error.response.data.message);
		}
	};

	const googleAuth = () => {
		window.location.href = `${process.env.REACT_APP_HOSTED_URL}/auth/google?state=login`;
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Log in Form</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img
						className={styles.img}
						src="./images/login.jpg"
						alt="login"
					/>
				</div>
				<div className={styles.right}>
					<h2>Log In</h2>
					<form
						className={styles.form}
						onSubmit={handleLogin}
					>
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
								Log In
							</button>
							<p className={styles.text}>or</p>
							<button
								className={styles.google_btn}
								onClick={googleAuth}
							>
								<img
									src="./images/google.png"
									alt="google icon"
								/>
								<span>Sign in with Google</span>
							</button>
						</div>
					</form>
					<p className={styles.text}>
						New Here? <Link to="/signup">Sign Up</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;

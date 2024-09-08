import React from "react";
import { Home, User, LogOut } from "lucide-react";
import "./Header.css";
import { message } from "antd";

const handleLogout = () => {
	localStorage.clear();
	message.success("Logged out successfully");
	window.location.href = "/login";
};

const Header = () => {
	return (
		<header className="header">
			<div className="container">
				<h1 className="title">Task Manager</h1>
				<nav className="nav">
					<a href="/home" className="nav-item">
						<Home className="icon" size={20} />
						<span>Home</span>
					</a>
					<a href="/profile" className="nav-item">
						<User className="icon" size={20} />
						<span>Profile</span>
					</a>
					<button className="button" onClick={handleLogout}>
						<LogOut className="icon" size={20} />
						<span>Logout</span>
					</button>
				</nav>
			</div>
		</header>
	);
};

export default Header;

import {
	Routes,
	Route,
	Navigate,
	useNavigate,
	useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/HomePage/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileScreen from "./pages/Profile/Profile";
import Loader from "./components/Loading/Loading";

function App() {
	const [auth, setAuth] = useState(false);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();

	// Check if JWT token exists and is valid
	const getAuthStatus = async () => {
		try {
			const url = `${process.env.REACT_APP_HOSTED_URL}/protected`;
			const { data } = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem(
						"token"
					)}`,
				},
			});
			setAuth(data.isAuthenticated);
			console.log("authenticated");
		} catch (err) {
			setAuth(false);
			if (err.response?.status === 401) {
				localStorage.removeItem("token");
				navigate("/login");
			}
		} finally {
			setLoading(false);
		}
	};

	// Extract token from the URL for /googleRedirect
	const handleGoogleRedirect = () => {
		const searchParams = new URLSearchParams(location.search);
		const token = searchParams.get("token");

		if (token) {
			localStorage.setItem("token", token);
			setAuth(true); 
			navigate("/home");
		}
	};

	useEffect(() => {
		if (location.pathname === "/googleRedirect") {
			handleGoogleRedirect();
		} else {
			getAuthStatus();
		}
	}, [location.pathname]);

	if (loading) {
		return <Loader />;
	}

	return (
		<Routes>
			<Route
				path="/profile"
				element={
					auth ? (
						<ProfileScreen />
					) : (
						<Navigate to="/login" />
					)
				}
			/>
			<Route
				path="/home"
				element={auth ? <Home /> : <Navigate to="/login" />}
			/>
			<Route
				path="/login"
				element={auth ? <Navigate to="/home" /> : <Login />}
			/>
			<Route
				path="/signup"
				element={auth ? <Navigate to="/home" /> : <Signup />}
			/>
			{/* Route for Google Redirect */}
			<Route path="/googleRedirect" element={null} />
		</Routes>
	);
}

export default App;

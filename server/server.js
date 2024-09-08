const express = require("express");
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { connectDB } = require("./config/db");
require("./config/passport");
const { authRouter } = require("./routes/auth");
const expressSession = require("express-session");
const { createUserTable } = require("./models/user");
const { createTaskTable } = require("./models/task");
const { protecedRoute } = require("./config/authenticateJWT");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
	origin: process.env.CLIENT_URL,
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();
createUserTable();
createTaskTable();

app.use(
	expressSession({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

app.use(passport.initialize());
app.use(passport.session());



// google sign up and login
app.use("/auth", authRouter);
app.use("/user", userRoutes);
app.use("/task", taskRoutes);
app.use("/protected", protecedRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

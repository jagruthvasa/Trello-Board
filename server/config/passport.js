const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require('dotenv').config();


passport.serializeUser((user, callback) => {
      callback(null, user);
});

passport.deserializeUser((user, callback) => {
      callback(null, user);
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.HOSTED_URL + "/auth/google/callback",
		},
		(accessToken, refreshToken, profile, callback) => {
                  callback(null, profile);
		}
	)
);


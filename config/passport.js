// Login logic to check users email and password
// If we have a match send user to his the main log in page
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require("../models");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const jwtSecret = require("./jwtConfig");
const jwt = require("jsonwebtoken");


module.exports = function(passport) {
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, (email, password, done) => {
		db.User.findOne({
				email: email
			}).then(user => {
			// If we don't find user by his email
			if (!user) {
				return done(null, false, {
					// Email doesn't exist in database
					message: 'Email address is incorrect!'
				});
			} else { // If we find user by email
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) throw err;
					// Check does users password match with record in database
					if (isMatch) {
					
						return done(null, user);
					} else {
						return done(null, false, {
							// Password is incorrect
							message: 'Password is incorrect!'
						});
					}
				});
			}
		});
	}));
	
	const opts = {
		jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
		secretOrKey: jwtSecret.secret
	};

	passport.use('jwt',
		new JWTstrategy(opts, (jwt_payload, done) => {
			console.log(jwt_payload.id)
			try {
				db.User.findById({
					_id: jwt_payload.id,
				}).then(user => {
					if(user) {
						console.log('user has been found');
						done(null, user);
					} else {
						console.log('no user found');
						done(null, false);
					}
				});
			} catch (err) {
				done(err);
			}
	}))

};
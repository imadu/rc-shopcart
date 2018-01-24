const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy   = require('passport-local').Strategy;
const JWTStartegey = passportJWT.Strategy;

const bCrypt = require('bcrypt');
const mongoose = require('mongoose');


var User = mongoose.model('User');
module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		done(null, user._id);
		var console = console.log('serializing user:',user.username);
		return console;
		
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
			var console = console.log('deserializing user:',user.username);
			return console;
		});
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			// check in mongo if a user with username exists or not
			User.findOne({ username : username }, 
				function(err, user) {
					// In case of any error, return using the done method
					if (err)
						return done(err);
					// Username does not exist, log the error and redirect back
					if (!user){
						let console = console.log('User Not Found with username '+username);
						return done(null, false);                 
					}
					// User exists but wrong password, log the error 
					if (!isValidPassword(user, password)){
						let console = console.log('Invalid Password');
						return done(null, false); // redirect back to login page
					}
					// User and password both match, return user from done method
					// which will be treated like success
					return done(null, user);
				}
			);
		}
	));
	passport.use(new JWTStartegey({
		jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
		secretOrKey : 'super_secret'
	}, 
    function(jwtPayload, cb){
		return User.findOneById(jwtPayload._id).then(user => {
			return cb(null, user);
		}).catch(err => {
			return cb(err);
		});
	}));

	passport.use('signup', new LocalStrategy({
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, username, password, done) {

		var findOrCreateUser = function(){
			// find a user in mongo with provided username
			User.findOne({ 'username' :  username }, function(err, user) {
				// In case of any error, return using the done method
				if (err){
					return done(err);
				}
				// already exists
				if (user) {
					return done(null, false);
				} else {
					// if there is no user, create the user
					var newUser = new User();

					// set the user's local credentials
					newUser.username = username;
					newUser.password = createHash(password);
					newUser.email = req.body.email;
					newUser.state = req.body.state;
					newUser.role = req.body.role;

					// save the user
					newUser.save(function(err) {
						if (err){  
							throw err;  
						}    
						return done(null, newUser);
					});
				}
			});
		};
		// Delay the execution of findOrCreateUser and execute the method
		// in the next tick of the event loop
		process.nextTick(findOrCreateUser);
	})
);
	

	
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
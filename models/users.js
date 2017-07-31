// Dependences
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;
//var Model = mongoose.model;

// User Schema
var UserSchema = Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    }
});

// Export Model
var User = module.exports = mongoose.model('User', UserSchema);

// Creates a New User
module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

// Finds a matching User via Username
module.exports.getUserByUsername = function(username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
}

// Finds a matching User via UserId
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

// Compares Passwords for a Matching User with the right Username
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}
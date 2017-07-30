// Dependences
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;
//var Model = mongoose.model;

// UserRole Schema
var UserRoleSchema = Schema({
    userid: {
        type: String
    },
    role:  {
        type: String,
        enum: ['user', 'admin'],
        default: ['user']
    }
})

var UserRole = module.exports = mongoose.model('UserRole', UserRoleSchema);

// Creates a New User Role
module.exports.createUserRole = function(newUserRole, callback) {
    newUserRole.save(callback);
}

// Finds a match Role via Role
module.exports.getUserRoleByRole = function(role, callback) {
    var query = { role: role };
    UserRole.find(query, callback);
}

// Finds a matching Role via UserId
module.exports.getUserRoleByUserId = function(id, callback) {
    var query = { userid: id };
    UserRole.findOne(query, callback);
}
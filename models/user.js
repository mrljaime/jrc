/**
 * Created by josejaime on 06/12/16.
 */
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

/** This is just a web page with single user, the user schema just need username, email and password  */
var userSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String
});

/** I don't want to stored my password without hashing before */
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/** Some other responsablity of this schema es validate the password */
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

/** Creating the model */
module.exports = mongoose.model("User", userSchema);
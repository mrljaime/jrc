/**
 * Created by josejaime on 18/12/16.
 */
var User = require("../models/user");

function isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect("/appanel/login");
    }

    var user = req.user;
    User.findOne({username: user.username, password: user.password}, function(err, user) {
        if (err || !user) {
            req.logout();
            return res.redirect("/appanel/login");
        }
    });

    return next();
}

module.exports = isAuthenticated;

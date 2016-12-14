/**
 * Created by josejaime on 06/12/16.
 */
var express = require("express");
var router = express.Router();
var User = require("../models/user");

/** Middleware */
var isAuthenticated = function (req, res, next) {
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
};

/** Secure index area */
router.get("/", isAuthenticated, function(req, res) {
    res.render("appanel/index", {
        user: req.user
    });
});


module.exports = router;
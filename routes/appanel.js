/**
 * Created by josejaime on 06/12/16.
 */
var express = require("express");
var passport = require("passport");
var router = express.Router();
var User = require("../models/user");

/** Middleware */
var isAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect("/appanel/login");
    }

    var user = req.user;
    User.findOne({username: user.username, password: user.password}, function(err, user) {
        if (err || !user) {
            res.redirect("/appanel/login");
        }
    });

    return next();
};

/** The sign up page */
router.route("/signup")
    .get(function(req, res, next) {
        res.render("signup");
    })
    .post(passport.authenticate("local-signup", {
        successRedirect: '/',
        failureRedirect: 'signup',
        failureFlash : true
    }));

/** The login page */
router.route("/login")
    .get(function(req, res, next) {
        res.render("login");
    })
    .post(passport.authenticate("local-login", {
        successRedirect: "/appanel/",
        failureRedirect: 'login',
        failureFlash : true
    }));

/** Logout */
router.get("/logout", isAuthenticated, function(req, res) {
    req.logout();
    res.redirect("/appanel/login");
});


/** Secure index area */
router.get("/", isAuthenticated, function(req, res) {
    res.render("appanel/index", {
        user: req.user
    });
});


module.exports = router;
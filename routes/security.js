/**
 * Created by josejaime on 10/12/16.
 */
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var uuid = require("uuid");
var passport = require("passport");

/** Mailer */
var nodeMailer = require('nodemailer');
var smtpConfig = '';
var transporter = nodeMailer.createTransport(smtpConfig);


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

router.post("/reset", function (req, res, next) {
    var email = req.body.resetEmail;

    User.findOne({"email": email}, function(err, user) {
        if (err) {
            return res.redirect("/appanel/login");
        }

        console.log("JAIME EN LAS TRIPAS >>>>> %s",user);

        if (user == null) {
            console.log("JAIME EN LAS TRIPAS >>>>> Redireccionando");
            req.flash("error", "The email that you'd use to reset your password doesn't exists");
            return res.redirect("/appanel/login");
        }

        console.log("JAIME EN LAS TRIPAS >>>>> Antes de setear cosas");

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        user.reset_token = uuid.v4();
        user.expiration_token = tomorrow;

        user.save(function(err) {
            if (err) {
                return res.redirect("/appanel/login");
            }
        });

        var mailOptions = {
            from: "JRC Solutions <mr.ljaime@gmail.com>",
            to: email,
            subject: 'Reset your password', // Subject line
            html: "<a href='" + req.protocol + '://' + req.get('host') + "/appanel/reset/" + user.reset_token + "'>" +
                "Resetear contraseña</a>"
    };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });

        return res.redirect("/appanel/login");
    });
});

router.route("/reset/:token")
    .get(function(req, res, next) {
        var token = req.params.token;
        var now = new Date().toISOString();

        var whereCondition = "this.reset_token == '" + token + "' && ISODate('" + now + "') < this.expiration_token";
        console.log(whereCondition);

        /** Async to avoid res.render before search at database */
        process.nextTick(function() {
            User.findOne({$where: whereCondition}, function(err, user) {
                console.log("JRC Solutions >>>>> Before err");
                if (err) {
                    console.log("JRC Solutions >>>>> Before redirect");
                    return res.redirect("/appanel/login");
                }
                console.log("JRC Solutions >>>>> Before validate user == null");
                if (user == null) {
                    console.log("JRC Solutions >>>>> Before redirect in null == null");
                    req.flash("tokenError", "The token doesn't exists or it is expired");
                    return res.redirect("/appanel/login");
                }

                return res.render("resetPassword", {
                    token: token
                });
            });

        });
    })
    .post(function(req, res, next) {
        var token = req.params.token;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;

        process.nextTick(function() {

            if (password != confirmPassword) {
                return res.render("resetPassword", {
                    token: token,
                    failConfirm: "The passwords doesn't check on each other"
                });
            }

            var whereCondition = "this.reset_token == '" + token + "'";
            console.log(whereCondition);
            User.findOne({$where: whereCondition}, function(err, user) {
                if (err) {
                    console.log("JRC Solutions >>>>> Before redirect");
                    return res.redirect("/appanel/login");
                }
                if (user == null) {
                    console.log("JRC Solutions >>>>> Before redirect in null == null");
                    req.flash("tokenError", "The token doesn't exists or it is expired");
                    return res.redirect("/appanel/login");
                }

                user.password = user.generateHash(password);
                user.save(function(err) {
                    if (err) {
                        console.log("JRC Solutions >>>>> Before redirect");
                        return res.redirect("/appanel/login");
                    }

                    return res.redirect("/appanel/login");
                });
            });
        });
    });


/** The sign up page */
router.route("/signup")
    .get(function(req, res, next) {
        res.render("signup");
    })
    .post(passport.authenticate("local-signup", {
        successRedirect: '/appanel/login',
        failureRedirect: 'signup',
        failureFlash : true
    }));

/** The login page */
router.route("/login")
    .get(function(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect("/appanel/");
        }

        return res.render("login", {
            failEmail: req.flash("error"),
            tokenError: req.flash("tokenError"),
            message: req.flash("message")
        });
    })
    .post(passport.authenticate("local-login", {
        successRedirect: "/appanel/",
        failureRedirect: 'login',
        failureFlash : true
    }));


/** Logout */
router.get("/logout", isAuthenticated, function(req, res) {
    req.logout();
    return res.redirect("/appanel/login");
});

module.exports = router;
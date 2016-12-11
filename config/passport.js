/**
 * Created by josejaime on 06/12/16.
 */
/** This shit is used to stored new users at database */
var LocalStrategy = require("passport-local").Strategy;
var User = require("../models/user");

/** To the universe */
module.exports = function(passport) {
    /** Serialize user */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    /** Deserialize user */
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    /** Local sign up */
    passport.use("local-signup", new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            console.log("JAIME >>>>> Before Async");
            /** Async */
            process.nextTick(function() {

                /**
                 *  1. Find user by email
                 */
                User.findOne({'username': username}, function(err, user) {
                    console.log("JAIME >>>>> Inside searching");
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, false, {
                            username: username
                        });
                    }

                    User.findOne({"email": req.body.email}, function(err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (user) {
                            return done(null, false, {
                                email: req.body.email
                            });
                        }
                    });


                    var newUser = new User();
                    newUser.username = username;
                    newUser.email = req.body.email;
                    newUser.password = newUser.generateHash(password);
                    newUser.reset_token = "";
                    newUser.expiration_token = null;

                    newUser.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                });
            });
        }
    ));

    passport.use("local-login", new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            console.log("JAIME >>>>> Before Async");
            /** Async */
            process.nextTick(function() {

                User.findOne({username: username}, function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user) {
                        return done(null, false, req.flash('message', "The user was not found"));
                    }

                    if (!user.validatePassword(password)) {
                        return done(null, false, req.flash('message', "Bad cretentials"));
                    }

                    return done(null, user);
                });

            });
        }
    ));
};

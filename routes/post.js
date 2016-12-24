/**
 * Created by josejaime on 18/12/16.
 */
var express = require("express");
var router = express.Router();
var uuid = require("uuid");
var isAuthenticated = require("../config/middleware");
var Post = require("../models/post");

router.get("/", isAuthenticated, function(req, res) {
    return res.render("appanel/posts/index", {
        user: req.user
    });
});

router.route("/new")
    .get(isAuthenticated, function(req, res) {
        return res.render("appanel/posts/new", {
            user: req.user,
            error: req.flash("error")
        })
    })
    .post(isAuthenticated, function(req, res) {
        var title = req.body.title;
        var description = req.body.description;
        var content = req.body.content;

        if (title.trim().length == 0 || description.trim().length == 0 || content.trim().length == 0) {
            req.flash("error", "Every field must be completed");
            return res.redirect("/appanel/posts/new");
        }

        var post = new Post();
        post.title = title;
        post.description = description;
        post.content = content;
        post.cover = uuid.v4();

        post.save(function (err) {
            if (err) {
                req.flash("Error", "Can't save the new post");
                return res.redirect("/appanel/posts/new");
            }
        });

        return res.redirect("/appanel/posts/");
    });

module.exports = router;
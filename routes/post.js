/**
 * Created by josejaime on 18/12/16.
 */
var express = require("express");
var router = express.Router();
var uuid = require("uuid");
var isAuthenticated = require("../config/middleware");
var Post = require("../models/post");
var ObjectId = require('mongoose').Types.ObjectId;

router.get("/", isAuthenticated, function(req, res) {

    var search = "";
    if (req.query.q !== undefined) {
        search = req.query.q;
    }

    if (search.trim().length == 0) {
        search = "";
    }

    Post.find({title: new RegExp(search, 'i')}, function(err, posts) {
        return res.render("appanel/posts/index", {
            user: req.user,
            posts: posts,
            success: req.flash("success"),
            q: search
        });
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
        var publicationDate = req.body.publicationDate;
        var active = false;

        /** To verify active exists */
        if (req.body.active !== undefined) {
            active = true;
        }

        if (title.trim().length == 0 || description.trim().length == 0 || content.trim().length == 0) {
            req.flash("error", "Every field must be completed");
            return res.redirect("/appanel/posts/new");
        }

        /** I need be sure that cover will me stored */

        var post = new Post();
        post.title = title;
        post.description = description;
        post.content = content;
        post.cover = uuid.v4();
        post.publicationDate = publicationDate;
        post.active = active;

        post.save(function (err) {
            if (err) {
                req.flash("Error", "Can't save the new post");
                return res.redirect("/appanel/posts/new");
            }
        });

        return res.redirect("/appanel/posts/");
    });

router.route("/edit/:_id")
    .get(isAuthenticated, function(req, res) {

        var _id = req.params._id;
        Post.findOne({_id: ObjectId(_id)}, function(err, post) {
            if (err || !post) {
                return res.redirect("/appanel/posts", {
                    error: "The post doesn't exists"
                });
            }

            return res.render("appanel/posts/edit", {
                post: post,
                error: req.flash("error")
            });
        });
    })
    .post(isAuthenticated, function(req, res) {
        var _id = req.params._id;
        var title = req.body.title;
        var description = req.body.description;
        var content = req.body.content;
        var publicationDate = req.body.publicationDate;
        var active = false;

        /** To verify active exists */
        if (req.body.active !== undefined) {
            active = true;
        }

        if (title.trim().length == 0 || description.trim().length == 0 || content.trim().length == 0) {
            req.flash("error", "Every field must be completed");
            return res.redirect("/appanel/posts/edit/" + _id);
        }

        Post.findOne({_id: ObjectId(_id)}, function(err, post) {
            if (err || !post) {
                req.flash("error", "Can't load post");
                return res.redirect("/appanel/posts/edit/" + _id);
            }

            post.title = title;
            post.description = description;
            post.content = content;
            post.publicationDate = publicationDate;
            post.active = active;

            post.save(function(err) {
                if (err) {
                    req.flash("error", "Can't update post");
                    return res.redirect("/appanel/posts/edit/" + _id);
                }
            });

            req.flash("success", "The post '" + title + "' was updated correctly");
            return res.redirect("/appanel/posts");
        });

    });

router.post("/remove", isAuthenticated, function(req, res) {
    var _id = req.body._id;

    var query = Post.findOne({_id: ObjectId(_id)});
    query.remove().exec(function(err) {
        if (err) {
            return res.status(404).send('Not found');
        }

        return res.json({
            code: 200,
            message: "success"
        });
    });
});

module.exports = router;
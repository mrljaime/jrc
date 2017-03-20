/**
 * Created by josejaime on 18/12/16.
 */
var express = require("express");
var router = express.Router();
var uuid = require("uuid");
var isAuthenticated = require("../config/middleware");
var Post = require("../models/post");
var Image = require("../models/image");
var ObjectId = require('mongoose').Types.ObjectId;

/** Handle multipart request */
var uploadsDir = "./public/uploads/covers/";
var multer = require("multer");
var uploader = multer({dest: uploadsDir});
var fs = require("fs");

/**
 * Show all items
 */
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

/**
 * Add new post
 */
router.route("/new")
    .get(isAuthenticated, function(req, res) {
        return res.render("appanel/posts/new", {
            user: req.user,
            error: req.flash("error")
        })
    })
    .post(isAuthenticated, uploader.single("cover"), function(req, res) {
        var title = req.body.title;
        var description = req.body.description;
        var content = req.body.content;
        var publicationDate = req.body.publicationDate;
        var tags = req.body.tags;
        var active = false;
        var cover = req.file;

        /** To verify active exists */
        if (req.body.active !== undefined) {
            active = true;
        }

        /**
         * Let's be sure fields doesn't are empty
         */
        if (title.trim().length == 0 || description.trim().length == 0 || content.trim().length == 0) {
            req.flash("error", "Every field must be completed");
            return res.redirect("/appanel/posts/new");
        }

        /** Ensure to upload the cover */
        var coverData = {originalname: null, path: null};
        if (undefined !== cover) {
            /** To stored cover picture */
            var ext = cover.mimetype;
            ext = ext.split("/")[1];
            var filename = cover.filename + "." + ext;
            coverData.originalname = cover.originalname;
            coverData.path = filename;
            uploadFile(cover, filename);
        }

        var post = new Post();
        post.title = title;
        post.description = description;
        post.content = content;
        post.cover = coverData;
        post.publicationDate = publicationDate;
        post.tags = tags.split(",");
        post.active = active;

        post.save(function (err) {
            if (err) {
                req.flash("Error", "Can't save the new post");
                return res.redirect("/appanel/posts/new");
            }
        });

        return res.redirect("/appanel/posts/");
    });

/**
 * Edit and update to post id
 */
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
    .post(isAuthenticated, uploader.single("cover"), function(req, res) {
        var _id = req.params._id;
        var title = req.body.title;
        var description = req.body.description;
        var content = req.body.content;
        var publicationDate = req.body.publicationDate;
        var tags = req.body.tags;
        var active = false;
        var cover = req.file;

        /** To verify active exists */
        if (req.body.active !== undefined) {
            active = true;
        }

        /**
         * Let's verify fields doesn't are empty
         */
        if (title.trim().length == 0 || description.trim().length == 0 || content.trim().length == 0) {
            req.flash("error", "Every field must be completed");
            return res.redirect("/appanel/posts/edit/" + _id);
        }

        /**
         * To check if cover file was updated
         */
        var coverData = {originalname: null, path: null};
        if (undefined !== cover) {
            /** To stored cover picture */
            var ext = cover.mimetype;
            ext = ext.split("/")[1];
            var filename = cover.filename + "." + ext;
            coverData.originalname = cover.originalname;
            coverData.path = filename;
            uploadFile(cover, filename);
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
            post.tags = tags.split(",");
            post.active = active;

            if (coverData.originalname != null) {
                post.cover = coverData;
            }

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

/**
 * Remove specific post
 */
router.post("/remove", isAuthenticated, function(req, res) {
    var _id = req.body._id;

    var query = Post.findOne({_id: ObjectId(_id)});

    /** First remove cover */
    if (query.cover !== undefined) {
        var path = dir + query.cover;
        fs.unlink(path, function(err) {
            if (err) {
                console.log("Can't delete uploaded file");
            }
        });
    }

    /** Remove document */
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

function uploadFile(cover, filename) {
    fs.readFile(cover.path, function(err, data) {
        if (err || !data) {
            console.log("An error has been ocurred uploading file");
            return;
        }

        var storedDir = uploadsDir + filename;

        fs.writeFile(storedDir, data, function(err) {
            if (err) {
                console.log("An error has been ocurred storing file");
            }
        });

        fs.unlink(cover.path, function(err) {
            if (err) {
                console.log("Can't delete original file");
            }
        });

    });
}

module.exports = router;
/**
 * Created by jaime on 12/03/17.
 */
var express = require("express");
var router = express.Router();
var escape = require("escape-html");

/**
 * Import models
 */
var Contact = require("../models/contact");
var Post = require("../models/post");

router.post("/contact/create", function(res, resp, next) {
    var msg = res.body;

    var contact = new Contact();
    contact.name = escape(msg.name);
    contact.email = escape(msg.email);
    contact.comment = escape(msg.comment);
    contact.created_at = new Date();

    contact.save(function(err) {
        if (err) {
            return resp.json({
                code: 500,
                msg: "No se ha podido guardar el comentario."
            });
        }

        return resp.json({
            code: 201,
            msg: "Comentario creado satisfactoriamente"
        });
    });
});

/**
 * Get all post for front
 */
router.get("/posts", function(res, resp, next) {
    Post.find(
        {
            active: true,
            publicationDate: {$lt: new Date()}
        }
    )
    .select({_id: 1, title: 1, description: 1, publicationDate: 1, cover: 1})
    .sort({_id: -1})
    .exec(function(err, posts) {
        if (err) {
            return resp.json({
                code: 500,
                msg: "Ocurrió un error inesperado"
            });
        }

        return resp.json({
            code: 200,
            data: posts
        });
    });
});

/**
 * Get post by id
 */
router.get("/post/:id/view", function(req, resp, next) {
    Post.findOne({
        _id: req.params.id
    }).exec(function(err, post) {
        if (err) {
            return resp.json({
                code: 404,
                msg: "La publicación no fue encontrada"
            });
        }

        return resp.json({
            code: 200,
            data: post
        });
    });
});


module.exports = router;
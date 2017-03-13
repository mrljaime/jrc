/**
 * Created by jaime on 12/03/17.
 */
var express = require("express");
var router = express.Router();
var escape = require("escape-html");

/**
 * Import contact model
 */
var Contact = require("../models/contact");

router.post("/contact/create", function(res, resp, next) {
    var msg = res.body;

    var contact = new Contact();
    contact.name = escape(msg.name);
    contact.email = escape(msg.email);
    contact.comment = escape(msg.comment);

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

module.exports = router;
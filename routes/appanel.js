/**
 * Created by josejaime on 06/12/16.
 */
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var isAuthenticated = require("../config/middleware");

/** Secure index area */
router.get("/", isAuthenticated, function(req, res) {
    return res.render("appanel/index", {
        user: req.user
    });
});


module.exports = router;
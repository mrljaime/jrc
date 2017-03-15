/**
 * Created by jaime on 14/03/17.
 */
const fs = require("fs");
const _jade = require("jade");
const mailer = require("nodemailer");
const mailerConfig = require("../config/mail");
const mailSender = mailer.createTransport(mailerConfig);

var renderView = function(view, content, options) {
    var template = process.cwd() + "/views/email/" + view + ".jade";
    var iMessage = "";
    fs.readFile(template, "UTF-8", function (err, file) {
        if (err) {
            console.log(err);
        }

        var compiledTmpl = _jade.compile(file, {filename: template});
        options.html = compiledTmpl(content);

        mailSender.sendMail(options, function(err, info) {
            if (err) {
                console.log(err);
                return;
            }

            console.log(info);
        });
    });
}

module.exports = function(view, content, options) {
    renderView(view, content, options);
}
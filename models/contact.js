/**
 * Created by jaime on 12/03/17.
 */
var mongoose = require("mongoose");

var contactSchema = mongoose.Schema({
    name: String,
    email: String,
    comment: String,
    created_at: Date
});

module.exports = mongoose.model("Contact", contactSchema);


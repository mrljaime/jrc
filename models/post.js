/**
 * Created by josejaime on 18/12/16.
 */
var mongoose = require("mongoose");

/** Schema for every post in the blog section */
var postSchema = mongoose.Schema({
    title: String,
    description: String,
    content: String,
    cover: String,
    publicationDate: Date
});

/** Creating the model */
module.exports = mongoose.model("Post", postSchema);
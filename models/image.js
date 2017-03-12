/**
 * Created by josejaime on 18/12/16.
 */
var mongoose = require("mongoose");

/** Many to one with reference in Post */
var imageSchema = mongoose.Schema({
    path: String
});

/** Creating the model */
module.exports = mongoose.model("Image", imageSchema);

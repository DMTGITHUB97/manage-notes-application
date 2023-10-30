const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        require: Date.now
    }
})
const note = mongoose.model("note", notesSchema);
module.exports = note;
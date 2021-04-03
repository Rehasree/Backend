const mongoose = require("mongoose")

const edit = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,

    },
    about: {
        type: String,
        required: true

    },
    headLine: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }



})


module.exports = mongoose.model("editProfile", edit);

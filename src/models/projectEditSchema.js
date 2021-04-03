const mongoose = require("mongoose")

const projects = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    // positionAvailable: {
    //     type: String,
    //     required: true

    // },
    startDate: {
        type: Date,
        required: true
    },
    applyBy: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    stipend: {
        type: Number,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    // eligibility: {
    //     type: String,
    //     required: true
    // },
    // city: {
    //     type: String,
    //     required: true
    // },

    // zip: {
    //     type: Number,
    //     required: true
    // },
    // perks: {
    //     type: String,
    //     required: true
    // },
    openings: {
        type: Number,
        required: true
    },
    weblink: {
        type: String,
        required: true
    },
    jobJD: {
        type: String,
        required: true
    },
    workJD: {
        type: String,
        required: true
    },
    myimage: String

})

const Kumar = new mongoose.model("Kumar", projects)
module.exports = Kumar
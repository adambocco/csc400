const mongoose = require("mongoose");

const HistorySchema = mongoose.Schema({
    email: {
        type: String,
        required: true
        },
    mostRecent: {
        type: String,
        required: true,
        default: "1,1" // Lab 1, Module 1
    },
    lab1: {
        type: Number,
        required: true,
        default: 0
    },
    lab2: {
        type: Number,
        required: true,
        default: 0
    },
    lab3: {
        type: Number,
        required: true,
        default: 0
    },
    lab4: {
        type: Number,
        required: true,
        default: 0
    },
    lab5: {
        type: Number,
        required: true,
        default: 0
    },
    lab6: {
        type: Number,
        required: true,
        default: 0
    },
    lab7: {
        type: Number,
        required: true,
        default: 0
    },
    lab8: {
        type: Number,
        required: true,
        default: 0
    },
    lab9: {
        type: Number,
        required: true,
        default: 0
    },
});

// export model user with UserSchema
module.exports = mongoose.model("history", HistorySchema);

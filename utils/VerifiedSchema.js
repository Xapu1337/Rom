const { Schema, model } = require("mongoose");

const Verified = Schema({
    ID: {
        type: String,
        required: true,
    },
    trusted: {
        type: Boolean,
    },
});

module.exports = model('VerifiedUsers', Verified);
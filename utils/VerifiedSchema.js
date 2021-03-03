const { Schema, model } = require("mongoose");

const Verified = Schema({
    users: [
        {
            ID: String,
            trusted: Boolean,
        }
    ],
});

module.exports = model('VerifiedUsers', Verified);
const { Schema, model } = require("mongoose");

const Guild = Schema({
    id: {
        unique: true,
        type: String
    },
    prefix: {
        default: "rr!",
        type: String
    },
    isWelcomeEnabled: {
        default: false,
        type: Boolean
    },
    welcomeChannel: {
        default: null,
        type: String
    },
    welcomeMessage: {
        default: "Welcome %user% to %server%!",
        type: String
    }
});

module.exports = model('Guild', Guild);
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
    },
    warnings:
        {
            type: Array,
            of: {
                reason: String,
                userID: String,
                creationTime: {
                    type: Number, default: Date.now()
                }
            }
        },
    registeredAt: { type: Number, default: Date.now() }

});

module.exports = model('Guild', Guild);
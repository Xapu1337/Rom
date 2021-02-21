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
    isPremium: {
        default: false,
        type: Boolean
    },
    warnings: [
        {
            warnID: String,
            reason: String,
            userID: String,
            creatorID: String,
            creationTime: {
                type: Number, default: Date.now()
            }
        }
    ],
    suggestions: [
        {
            messageID: String,
            message: String,
            userID: String,
            replied: Boolean,
            reply: String,
            replyedFrom: String,
        }
    ],
    reactionRoles: [
        {
            messageID: {
                type: String,
            },
            roleID: String,
            emoteID: String,
        }
    ],
    eco: [
        {
            userID: {
                type: String,
            },
            money: {
                type: Number,
                default: 0,
            },

        }
    ],
    registeredAt: { type: Number, default: Date.now() }

});

module.exports = model('Guild', Guild);
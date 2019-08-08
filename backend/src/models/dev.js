const { Schema, model } = require('mongoose');

const devSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    bio: String,
    avatar: {
        type: String,
        required: true,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'devIser',
    }],
    deslikes: [{
        type: Schema.Types.ObjectId,
        ref: 'devIser',
    }],
}, {
        timestamps: true,
    });

module.exports = model('devUser', devSchema);

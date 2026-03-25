const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        //expires: 86400 // auto delete after 1 day (TTL Index)
    },
    role : {
        type : String,
        required : true
}
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
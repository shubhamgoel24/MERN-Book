const mongoose = require('mongoose');

const resetpassSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accessToken:{
        type: String,
        required: true
    },
    isValid:{
        type: Boolean,
        required: true
    }
},{
    timestamps: true
});

const reset = mongoose.model('reset',resetpassSchema);
module.exports = reset;
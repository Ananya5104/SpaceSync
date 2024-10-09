const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    workspaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workspaces'  
    }],
    revenue: {
        type: Number,
        default: 0,  
    },
    role: {
        type: String,
        default: 'owner',  
    }
}, {
    timestamps:true
});

module.exports = mongoose.model('owners', OwnerSchema);

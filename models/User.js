const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        passwordHash: {
            type: String, 
            required: function () {
                return !this.auth0_id;
            },
        },
        auth0_id: {
            type: String, 
            unique: true,
            sparse: true,
        },
        files: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }],
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);

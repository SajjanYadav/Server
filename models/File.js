const mongoose = require('mongoose');

const fileSchema = mongoose.Schema(
    {
        fileName: {
            type: String,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now(),
        },
        expiry: {
            type: Date,
            default: () => new Date(Date.now() + 24*60*60*1000), // everytime the file uploads this function runs
        },
        url: {
            type: String,
        },
        shortUrl: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Url'
        }
    }
);

//Time to live index in mongodb automatically deletes the file after a certain time
fileSchema.index({expiry: 1}, {expiryAfterSeconds: 0});

module.exports = mongoose.model('File', fileSchema);


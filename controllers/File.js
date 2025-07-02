const path = require('path');
const File = require('../models/File');
const User = require('../models/User');
const { uploadOnCloudinary } = require('../config/cloudinary');
const { shortenUrl } = require('../service/urlServices');

exports.fileUpload = async (req, res) => {
    try {
        const file = req.file;
        const { id } = req.user;

        // Check if file exists
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file"
            });
        }

        const filePath = file.path;
        const filename = path.basename(filePath);

        const response = await uploadOnCloudinary(filePath);
        if (!response) {
            return res.status(500).json({
                success: false,
                message: "Error occurred while uploading file to Cloudinary"
            });
        }

        const shortenedUrl = await shortenUrl(response.secure_url);

        const savedFile = await File.create({
            fileName: filename,
            uploadedBy: id,
            url: response.secure_url,
            shortUrl: shortenedUrl._id
        });

        const updatedUser = await User.findByIdAndUpdate(
            { _id: id },
            {
                $push: {
                    files: savedFile._id,
                }
            },
            { new: true }
        );

        // Final response
        return res.status(200).json({
            success: true,
            message: "File uploaded and URL shortened successfully",
            updatedUser,
            data: {
                file: savedFile,
                shortUrlId: shortenedUrl._id,
                shortUrl: `http://${req.get('host')}/api/v1/url/${shortenedUrl.shortUrl}`
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



exports.getFilesOfUser = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await User.findOne({ _id: id })
            .populate({
                path: 'files',
                populate: {
                    path: 'shortUrl',
                    model: 'Url'
                }
            })
            .exec();

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Unable to find user"
            });
        }

        const transformedFiles = user.files.map(file => {
            const fileObj = file.toObject();
            fileObj.shortUrl = `${req.protocol}://${req.get('host')}/api/v1/url/${file.shortUrl.shortUrl}`;
            return fileObj;
        });

        res.status(200).json({
            success: true,
            data: transformedFiles,
            message: "Files fetched successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

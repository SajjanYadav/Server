const File = require('../models/File');
const {uploadOnCloudinary} = require('../config/cloudinary')
const path = require('path');
const User = require('../models/User');

exports.fileUpload = async (req, res) => {
    try{
        const file = req.file;

        if(!file){
            return res.status(400).json({
                success: false,
                message: "Please Upload the file"
            })
        }

        const filePath = file.path;
        console.log(filePath);

        let filename = path.basename(filePath);

        const response = await uploadOnCloudinary(filePath);

        if(!response){
            return res.status(500).json({
                succcess: false,
                message: "Error Occured while uploading file on CLoudinary"
            })
        }

        const saveToDB = await File.create({
            filename,
            uploadedBy: req.user.id,
            url: response.secure_url
        })

        return res.status(200).json({
            success: true,
            data: saveToDB,
            message: "File Uploaded Successfully"
        })

    }catch(error)
    {
        return res.status(500).json({
            succcess: false,
            message: error.message
        })
    }
}


exports.getFilesOfUser = async (req, res) => {
    try {
        const {id} = req.user;
        console.log(id);

        const response = await User.findOne({_id: id}).populate('files').exec();

        if(!response){
            res.status(400).json({
                success: false,
                message: "Unable to Find User"
            })
        }

        res.status(200).json({
            success: true,
            data: response.files,
            message: "Files fetched successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs")          //file system come bydefault with nodejs

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //uploading the file on the cloudinary server
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("File has been uploaded on the server:- " + response.url);

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the locally saved file as the oprn fails
        throw new Error("Cloudinary Upload Failed: " + error.message);
    }
}

module.exports = {uploadOnCloudinary}
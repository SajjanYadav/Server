const multer = require('multer');
const path = require('path');
const fs = require('fs');

const fileFilter = (req, file, cb) => {
    const allowedTypes = [".pdf", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF, JPEG, and PNG allowed."));
    }
};

const tempDir = path.resolve(__dirname, '../public/temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const timestamp = Date.now();
        const basicName = `file_${timestamp}${ext}`;
        cb(null, basicName); 
    }
});

const upload = multer({ storage, fileFilter });

module.exports = { upload };

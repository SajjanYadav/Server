const Router = require("express");
const { login, signUp, sendOTP, auth0_login } = require("../controllers/Auth");
const { upload } = require('../middleware/multer.middleware')
const { auth } = require('../middleware/auth')
const { fileUpload, getFilesOfUser } = require('../controllers/File')


const router = Router();

/* ****************************************************************************************************** */
/*                                              AUTH ROUTES                                               */
/* ****************************************************************************************************** */

router.route("/signUp").post(signUp); 
router.route("/login").post(login);   
router.route("/sendOTP").post(sendOTP);
router.route("/auth0_login").post(auth0_login);


/* ****************************************************************************************************** */
/*                                               FILE ROUTES                                              */
/* ****************************************************************************************************** */

router.route('/file-upload').post(
    upload.single('file'),               // here file is the field name not the fileName or file
    auth,
    fileUpload
)

router.route('/getUserFiles').post(
    auth,
    getFilesOfUser
)


module.exports = router

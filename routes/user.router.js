const Router = require("express");
const { login, signUp, sendOTP } = require("../controllers/Auth");
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



module.exports = router

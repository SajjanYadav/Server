const User = require("../models/User")
const bcrypt = require('bcrypt');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');

exports.sendOTP = async(req, res) => {
    try {
        //extract karo email body se
        // check karo ki user exist karta hai ya nahi kyoki ham otp sirf registration ke liye use karre hai
        // otp generate karo 
        // check karo agar otp exist karta hai to usse dobara genrate karo
        // ab otp ko save karo 
        // save karne ke bad mail bhejo
        // ab response return kardo

        const { email } = req.body;

        const existingUser = await User.findOne({email : email});

        if(!existingUser)
        {
            return res.status(401).json({
                success: false,
                message: "User Already Exist"
            })
        }

        var otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })

        let result = await OTP.findOne({otp: otp});

        while(result)
        {
            otp = otpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            })

            result = await OTP.findOne({otp: otp});
        }

        const response = await OTP.create({
            email,
            otp
        })

        return res.status(200).json({
            success: true,
            message: "OTP generated Successfully",
            data: response
        })

    } catch (error) {
        console.log("Error Occured while sending otp to user");

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }   
}

//signup
exports.signUp = async (req, res) => {
    try{
        console.log(req.cookie);
        const {firstName, lastName, email, password, confirmPassword, otp} = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) 
        {
            return res.status(403).json({
                success: false,
                message: "Please provide all the fields"
            })
        }

        if(password !== confirmPassword)
        {
            return res.status(400).json({
                success: false,
                message: "Password do not match"
            })
        }

        const existingUser = await User.findOne({email: email});

        if(existingUser)
        {
            return res.status(400).json({
                success: false,
                message: "User Already Exist"
            })
        }

        const recentOTP = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log("Recent OTP: ", recentOTP);

        //if the otp matches, create the user

        if(recentOTP.length === 0){
            return res.status(401).json({
                success: false,
                message: "OTP not Found!"
            })
        }

        if(recentOTP[0].otp !== otp){
            return res.status(400).json({
                success: false,
                message: "OTP doesn't Matched"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName, 
            email,
            passwordHash: hashedPassword,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

         //check if the user is created or not

        const userCreated = await User.findById(newUser._id).select(
            "-passwordHash"                                        // add those which we donot want and "-one -two"
        )
        
        if(!userCreated)
        {
            return res.status(500).json({
                success: false,
                message: "Error occured while Registering the user"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            data: userCreated
        })

    }catch(error){
        console.log("Error occured while registering the user :- ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


// login
exports.login = async (req, res) => {
    try{
        console.log(req);
        const {email, password} = req.body;

        if(!email || !password) 
        {
            return res.status(403).json({
                success: false,
                message: "Please Enter all the Details"
            })
        }

        const existingUser = await User.findOne({email: email});

        if(!existingUser)
        {
            return res.status(401).json({
                success: false,
                message: "Please SignUp first"
            })
        }

        const passFromDB = existingUser.passwordHash;

        const isMatch = await bcrypt.compare(password, passFromDB);

        const payload = {
            email: existingUser.email,
            id: existingUser._id,
            firstName: existingUser.firstName
        }

        if(isMatch)
        {
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '24h'
            })

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                message: "User logged in successfully",
                data: existingUser
            })
        }else 
        {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            })
        }

    }catch(error)
    {
        console.log("Error Occured while Logging in the User:- ", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//one ootion is to store the jwt in local storage to prevent from getting stolen but one can acces it using attacks 
//such as access or process cutting attack which allow them to access the local storage so we use 
//httponly: so we can keep them in cookies and turining this flag on will prevent js from accessing it


exports.auth0_login = async (req, res) => {
    try {
        const {auth0_id, email, name, image} = req.body;

        if(!auth0_id || !email){
            res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        let user = await User.findOne({auth0_id});

        if (!user){

            const [firstName, ...rest] = name?.split(" ") || ["User"];
            const lastName = rest.join(" ") || "";

            user = await User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                auth0_id: auth0_id,
                image: image,
            });

            if (!user) {
                return res.status(500).json({
                success: false,
                message: "Error occurred while registering the user",
                });
            }
        }

        const payload = {
            email: user.email,
            id: user._id,
            firstName: user.firstName,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            message: "User logged in successfully",
            data: user,
        });


    } catch (error) {
        console.log("Error occured while registering the user :- ", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
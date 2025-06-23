const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mail/template/emailVerificationTemplate');

const otpSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now(),
            expires: 60 * 5,
        },
    },
    {
        timestamps: true,
    }
)

async function sendVerificationMail(email, otp){
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            otpTemplate(otp)
        );

        console.log("Email sent Successfully:- ", mailResponse.response)
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
		throw error;
    }
}

// before saving we are going to so some processing on the otp also we donot use arrow function here as arrow function
// doesn't have the reference of this or we can say they don't have context so we write function here normally

otpSchema.pre("save", async function (next) {
    console.log("Doc saved to database");

    if(this.isNew){
        await sendVerificationMail(this.email, this.otp);
    }
    
    next();
})

module.exports = mongoose.model("OTP", otpSchema);
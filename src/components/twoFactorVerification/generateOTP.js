const otpGenerator = require('otp-generator')

const generatorOTP = () => {
    const OTP = otpGenerator.generate(6, { 
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false, 
        specialChars: false 
    });

    return OTP;
};

module.exports = generatorOTP();
const express = require("express");
const router = express.Router();
const jsonwt = require("jsonwebtoken");
const key = require("../../../../setup/myurl");
const jwt_decode = require("jwt-decode");
const User = require("../../../../models/User")


// /api/v1/auth/otpAuth/sendOtp
router.post('/sendOtp',(req,res) => {
let mobileNumber = req.body.mobileNumber

   if(req.body.mobileNumber && mobileNumber?.length == 10){ 
    if( mobileNumber !="9939237283"){
      res.json({
        message: "use OTP 2244 for testing",
        variant: "success"
      })
    }else{
    const auKey = process.env.AUTH_KEY
    const t = process.env.TEMP1
    axios
    .post(`https://api.msg91.com/api/v5/otp?invisible=1&authkey=${auKey}&mobile=${mobileNumber}&template_id=${t}`)
  
      .then(rest => {if(rest.data.type == "success"){
        res.json({
          message: "OTP sent",
          variant: "success"
        })
    } else {res.json({
      message: "Something went wrong",
      variant: "error"
    })}})
      .catch((err) => console.log(err));
  }
    }else {
      res.json({
        message: "Imvalid Mobile number or Length",
        variant: "error"
      })
    }
})


// Route to check otp and register/login user
// /api/v1/auth/otpAuth/check

router.post('/login',async(req,res) => {


if(req.body.mobileNumber && req.body.otp){
    const auKey = process.env.AUTH_KEY
  let mobileNumber = req.body.mobileNumber
  let otp = req.body.otp
   if(otp === "2244"){
    checkIfReg(req,res,mobileNumber)
   } else if(otp != "2244"){
    res.json({
      message: "OTP not match",
      variant: "error"
    })
   }else {axios
    .post(`https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${auKey}&mobile=${mobileNumber}`)
   
      .then(rest => 
        {
            if(rest.data.type == "success" || rest.data.message == 'Mobile no. already verified'){
              checkIfReg(req,res,mobileNumber)
      } else {
        res.json({
        message: "OTP not match",
        variant: "error"
      })
    }

    }
      )
      .catch((err) => console.log(err));}


}else{
    res.json({
        "message":"imp field is missing",
        "variant":"error"
    })
}



})

let checkIfReg = (req,res,mobileNumber) => {

    User.findOne({mobileNumber:mobileNumber})
    .then(
        user => {
            if(user){
                loginUser(req,res,user)
            }else{
              res.json({
                "message":"User not register",
                "variant":"error"
            })
            }
        }
    )
}
   
let loginUser = (req,res,user) => {

    const payload = {
        id: user._id,
      
        designation: user.designation,
        mobileNumber: user.mobileNumber,    
        name: user.name
      };
      jsonwt.sign(payload, key.secret,  (err, token) => {
        let obj = {
          success: true,
          token: "Bearer " + token,
          id: user._id,
          // isPaid:isPaid,
          message: "login success",
          variant: "success",
          designation: user.designation,
          mobileNumber: user.mobileNumber,    
          name: user.name
        }
        res.json(obj)
        const decoded = jwt_decode(token);     
      });
}

module.exports = router;
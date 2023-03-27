const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

function check(userDetails) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    userDetails.name === null ||
    userDetails.email === null ||
    userDetails.password === null
  ) {
    return {
      result: false,
      message: "Please enter all required fields",
    };
  } else if (!(userDetails.isChecked)) {
    return {
      result: false,
      message: "Please tick terms and conditions",
    };
  } else if (!(emailRegex.test(userDetails.email))) {
    
    return {
      result: false,
      message: "Please enter a valid email address",
    };
  }
  return {
    result: true
  }
}

function checkLoginDetails(loginDetails){
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    loginDetails.email === null ||
    loginDetails.password === null
  ) {
    return {
      result: false,
      message: "Please enter all required fields",
    };
  } else if (!(emailRegex.test(loginDetails.email))) {
    
    return {
      result: false,
      message: "Please enter a valid email address",
    };
  }
  return {
    result: true
  }
}

router.post("/signup", async (req, res) => {
 if (check(req.body).result){
    try {
        await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        })
        res.json({status:"success"})
    } catch (error) {        
        res.json({status:"error",message : "Email already exists"});
    } 
 }
 else{
    res.json({status : "error",message : check(req.body).message});
 }
});

router.post("/login",async (req,res)=>{
  if(checkLoginDetails(req.body).result){
     const user = await User.findOne({
      email : req.body.email,
      password : req.body.password
     })
     if(!user){
      res.json({status : "error",message:"Invalid email or password"});
     }
     else{
      const token = jwt.sign({
          name: user.name,
          email: user.email,
          id : user._id,
          profileImage : user.profileImage
      },process.env.JWT_SECRET)
      res.json({status : "success",token});
     }
  }
  else{
    res.json({status: "error",message : checkLoginDetails(req.body).message});
  }
})

module.exports = router;

const jwt = require('jsonwebtoken');

function verifytoken(req,res,next){
   const token = req.headers.token;
   try {
    const loggedInUser = jwt.verify(token,process.env.JWT_SECRET);
    req.loggedInUser = loggedInUser
    next();    
   } catch (error) {
     res.json({status:'error',message:'Invalid Token'});
   }
}

module.exports = verifytoken;
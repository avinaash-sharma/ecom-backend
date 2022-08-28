const User = require("../model/user");
const HOCPromise = require("./HOCPromise");
const CustomErrorHandler = require("../util/customError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = HOCPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return next(new CustomErrorHandler("Login first to access the page.", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

exports.customRole = (...roles) => {
    return(req,res,next) => {
        
        
        if(!roles.includes(req.user.role)){
              return next(new CustomErrorHandler('Not accessable', 403));
        }else{
            next();
        }
    }
}
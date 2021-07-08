const jwt = require("jsonwebtoken");
const {UserModel} = require("../models/userModel");
const { config } = require("../config/secretData")

exports.authToken = (req, res, next) => {
  let validToken = req.header("x-auth-token");
  if (!validToken) {
    return res.status(401).json({ msg: "you must send token ! ,read the docs of the api !!!!" });
  }
  try {
    let decodeToken = jwt.verify(validToken, config.jwtSecret);
    //passing to the req for next functions to use tokenData(user id)
    req.tokenData = decodeToken;
    // everything good now can go to the next function
    next();
  }
  catch (err) {
    console.log(err);
    res.status(401).json({ err: "token invalid or expired" });
  }
}



// this middleware check if user is biz
exports.checkIfBiz = async(req, res, next) => {
  try {
    let user = await UserModel.findOne({ _id: req.tokenData._id, biz: true });
    console.log(user);
    if (!user) {
      return res.status(401).json({ err: "User not biz" })
    }
    
    next();
  }
  catch (err) {
    console.log(err);
    res.status(401).json({ err: "there problem or user is not biz" });
  }
}
const express = require("express");
const bcrypt = require("bcrypt");
const {authToken} = require("../middlewares/auth");
const {pick} = require("lodash")

const {CardModel} = require("../models/cardsModel");
const { validUser, UserModel , validLogin , getToken, validCardsArray } = require("../models/userModel");



const router = express.Router();

router.get("/",async(req,res) => {
  res.json({msg:"users work"})
})

router.get("/userInfo", authToken ,async(req,res) => {
  try{
    console.log(req.tokenData)
    // getting user data accordind to id from token
    //{password:0} show everything but password
    // req.decodeToken - from middleware
    let data = await UserModel.findOne({_id:req.tokenData._id},{password:0});
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(400).json(err)
  }
})
// if valid token than set status to ok
router.get("/authUser" , authToken , (req,res) => {
  res.json({status:"ok"});
})

// יget all favorite cards of the user
router.get("/userCardsFav", authToken , async(req,res) => {
  try{
    // getting array of user cards
    let user = await UserModel.findOne({_id:req.tokenData._id});
    // cards_ar -> ["0000","11111","22222"] example of result of previous line
    let cards_ar = user.cards;
    // וnow going to cards and finding those cards by ids from cards_ar
    let userCards = await CardModel.find({bizNumber: { $in:cards_ar}})
    res.json(userCards);
  }
  catch(err){
    console.log(err)
    res.status(400).json(err)
  }
})


// updates cards that user liked
router.patch("/cards", authToken, async(req,res) => {
  let validBody = validCardsArray(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let data = await UserModel.updateOne({_id:req.tokenData._id}, req.body);
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(400).json(err)
  }
})

// adding user
router.post("/",async(req,res) => {
  let validBody = validUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);

    // codding the password up to level 10  
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
    res.status(201).json(pick(user,["name","email","_id","createdAt"]));
  }
  catch(err){ 
    if(err.code == 11000){
      //if already exists(we have unique email in db)
      return res.status(400).json({err:"User/Email already in system! try to log in", code:11000})
    }
    console.log(err)
    res.status(400).json(err)
  }
})

router.post("/login",async(req,res) => {
  let validBody = validLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    // checking if there is a user with such email
    let user = await UserModel.findOne({email:req.body.email});
    if(!user){
      // if there is no user with this email returns error
      return res.status(401).json("User or password not found 1");
    }
    // console.log(user)
    // checking password
    let validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass){
      return res.status(401).json("User or password not found 2");
    }
    // creating token
    let newToken = getToken(user._id)
    res.json({token:newToken});

  }
  catch(err){
 
    console.log(err)
    res.status(400).json(err)
  }
})

module.exports = router;
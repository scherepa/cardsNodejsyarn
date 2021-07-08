const express = require("express");

const router = express.Router();
const path = require("path");

router.get("/",(req,res) => {
  res.json({msg:"upload test"})
});

router.post("/" , (req,res) => {
  console.log(req.files);
  let file = req.files?req.files.fileSend88:null;
  if(!file){
    return  res.status(400).json({msg:"you need to send file!"});
  }
  if(file.size >= 5 * 1024 * 1024){
    return  res.status(400).json({msg:"file too big, you can send file up to 5 mb"})
  }
  file.ext = path.extname(file.name);
    let allowExts_ar = [".jpg",".png",".jpeg",".gif"];
  // if(file.ext != ".jpg" ){
  if(!allowExts_ar.includes(file.ext) ){
    return  res.status(400).json({msg:"file must be jpg , png , jpeg or gif"})
  }


  file.mv("public/images/"+file.name , (err) => {
    if(err){ return  res.status(500).json({msg:"There is a problem please contact the admin, maybe he know what the problem"}) }
    res.json({msg:"file sended", n:1})
  })

});


module.exports = router;
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const axios = require("axios");
const img = require("../../../setup/myimageurl")

//Load User Model
const User = require("../../../models/User");

//Load Category.js Model
const Category = require("../../../models/Test/Category");

// @type    POST
//@route    /api/test/category/
// @desc    route for SAVING data for category
// @access  PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";

    if (des == des1 || des == des2  ) {
    
    const categoryValues = {
      
    };
    categoryValues.user = req.user.id;
    categoryValues.categoryTitle = req.body.categoryTitle;
//link start

    var strs = req.body.link;
    var rests = strs.replace(/  | |   |    |      /gi, function (x) {
      return  "";
    });
    categoryValues.link = rests.toLowerCase()
// link end
if (req.body.image == ""){
  categoryValues.image = img.defaultPoster;

} else {
  categoryValues.image = req.body.image;
}
if (req.body.logo == "" ){
  categoryValues.logo = img.defaultLogo;

} else {
  categoryValues.logo = req.body.logo;

}

if (req.body.description == ""){
  categoryValues.description = "Practice thousands of questions created by experts & toppers, review answers with detailed solutions, track your progress with performance analysis, and master all your subjects at no cost.";

} else {
  categoryValues.description = req.body.description;
  
}
if (req.body.lock == ""){
  categoryValues.lock = false;


}else {
  categoryValues.lock = req.body.lock;
  

}
    categoryValues.designation = req.user.designation;
    categoryValues.highlight = req.body.highlight;
  
    //getting last voucher number and making new one 

    //Do database stuff
if(
  req.body.categoryTitle == undefined || req.body.categoryTitle == "" ||
  req.body.link == undefined || req.body.link == "" ||
  req.user.designation == undefined || req.user.designation == "" 



){

  res.json({
    message: "Title, image, link,designation are Required field",
    variant: "error"
})

  
    } else {
    
          Category.findOne({
            categoryTitle: categoryValues.categoryTitle
          })
            .then(category => {
              //Username already exists
              if (category) {
                res.json({
                  message: "Title Already exist ",
                  variant: "error"
                });
              } else {
                Category.findOne({
                  link: categoryValues.link
                })
                  .then(category => {
                    //Username already exists
                    if (category) {
                      res.json({
                        message: "link Already exist ",
                        variant: "error"
                      });
                    } else {
                      new Category(categoryValues)
                      .save()
                      .then(
                        res.json({
                          message: "Successfully saved",
                          variant: "success"
                        })
                      )
                      .catch(err => console.log(err));
                      
                    }})
                    .catch(err => console.log(err));
              }
            })
            .catch(err => console.log(err));
     

    }


    } else {
      res.json({
        message: "you are not authorised",
        variant: "error"
      })
    }
    }
);

// @type    GET
//@route    /api/test/category/allcategory
// @desc    route for getting all data from  category
// @access  PRIVATE
router.get(
  "/allcategory",
 
  (req, res) => {
    Category.find({})
      .sort({ date: -1 })
      .then(Category => res.json(Category))
      .catch(err =>
        res
          .status(404)
          .json({ message: "No Category Found", variant: "error" })
      );
  }
);

// @type    get
//@route    /api/test/category/get/:id
// @desc    route to get single category by id
// @access  PRIVATE
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Category.find({
      _id: req.params.id
    }).then(Category => res.json(Category)).catch(err => res.json({message: "Problem in finding With this Id", variant: "error"}));
  }
);

// @type    POST
//@route    /api/test/category/:id
// @desc    route to update/edit category
// @access  PRIVATE
async function updateMe(req,res,categoryValues){
  var des = req.user.designation;
 if (des == "Admin" ) {
  Category.findOneAndUpdate(
    { _id: req.params.id },
    { $set: categoryValues },
    { new: true }
  )
    .then(category => {
      if (category){
        res.json({ message: "Updated successfully!!", variant: "success" })

      } else {
        res.json({ message: "Id not found", variant: "error" })

      }
    }        
    )

    .catch(err =>
      console.log("Problem in updating category value" + err)
    );
  } else if(des == "Manager") {
    Category.findOneAndUpdate(
      { _id: req.params.id, user:req.user.id },
      { $set: categoryValues },
      { new: true }
    )
      .then(category => {
        if (category){
          res.json({ message: "Updated successfully!!", variant: "success" })
  
        } else {
          res.json({ message: "Id not found or USer Id mismatch", variant: "error" })
  
        }
      }        
      )
  
      .catch(err =>
        console.log("Problem in updating category value" + err)
      );
 }



}

router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async(req, res) => {
    let Cat1 = await Category.findOne({ _id: req.params.id}).catch(err =>console.log(err))

let Cour1 = await Course.find({'category.link':Cat1.link}).catch(err => console.log(err))
if (Cour1.length >= 1){
  res.json({ message: "Child Exist", variant: "error" })
}else{
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";
// here we are checking designation in last step, that is in funtion called
   if (des == des1 || des == des2  ) {


    const categoryValues = { 
      
    };

    if(req.body.categoryTitle)categoryValues.categoryTitle = req.body.categoryTitle;
   //link start
    if(req.body.link){
      var stru = req.body.link;
      var restu = stru.replace(/  | |   |    |      /gi, function (x) {
        return  "";
      });
      categoryValues.link = restu.toLowerCase()
    };

//link end
    if(req.body.image)categoryValues.image = req.body.image;
    if(req.body.description)categoryValues.description = req.body.description;
    categoryValues.designation = req.user.designation;
    if(req.body.highlight)categoryValues.highlight = req.body.highlight;
    if(req.body.lock == false || req.body.lock == true )categoryValues.lock = req.body.lock;


    Category.findOne({categoryTitle: categoryValues.categoryTitle})
          .then(category => {
            if(category){
              caId = category._id;
              if (caId == req.params.id) {
                Category.findOne({link:categoryValues.link || "df#$@g#*&"})     
          .then(category => {
            if(category) {
              const catId = category._id;
              if (catId == req.params.id){
                updateMe(req,res,categoryValues)
              } else {
res.json({message: "This Link Already Exist", variant: "error"})

              }

            }else{
              updateMe(req,res,categoryValues)

            }
          })
          .catch(err => console.log( `error in link matching ${err}`))

              }else {
                  res.json ({message: "This title already exist", variant : "error"})

              }
            } else {

              Category.findOne({link:categoryValues.link || "df#$@g#*&"})     
              .then(category => {
                if(category) {
                  const catId = category._id;
                  if (catId == req.params.id){
                    updateMe(req,res,categoryValues)
                  } else {
    res.json({message: "This Link Already Exist", variant: "error"})
    
                  }
    
                }else{
                 updateMe(req,res,categoryValues)
    
                }
              })
              .catch(err => console.log( `error in link matching ${err}`))

            }
          })
          .catch(err => console.log(`Error in title matching ${err}`))


   

    } else {
      res.json({ message: "You are not Authorised", variant: "error" })
    }
  }}
);


// @type    GET
//@route    /api/test/category/allcategory/:searchcategory
// @desc    route for searching of category from searchbox using any text
// @access  PRIVATE
router.get(
  "/allcategory/:searchcategory",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";
    const search = req.params.searchcategory;

    if (des == des1   ) {
    if (isNaN(search)) {
      Category.find({
        categoryTitle: new RegExp(search, "i")
      }).then(Category => res.json(Category)).catch(err => res.json({message: "Problem in Searching" + err, variant: "success"}));
    } 

  } else if(des == des2){
    if (isNaN(search)) {
      Category.find({
        categoryTitle: new RegExp(search, "i"),
        user:req.user.id
      }).then(Category => res.json(Category)).catch(err => res.json({message: "Problem in Searching" + err, variant: "success"}));
    } 
  }else {
    res.json({ message: "You are not Authorised", variant: "error" })
  }

  }
);


module.exports = router;
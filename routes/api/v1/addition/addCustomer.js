const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load User Model
const User = require("../../../../models/User");

// @type    POST
// @route   /api/v1/addition/addcustomer
// @desc    Create a new customer
// @access  Public
router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    var des = req.user.designation;
    var des1 = "admin";
    var des2 = "manager";

    if (des == des1 || des == des2) {
      // Check if the required fields are present
      if (!req.body.name || !req.body.mobileNumber || !req.body.address) {
        return res.status(201).json({
          message: "Name, mobileNumber, and address are required fields.",
          variant: "error"
        });
      }
  
      const newCustomer = new User({
        user:req.user.id,
        designation:"customer",
       userName: req.body.userName || `${req.body.name}${req.body.mobileNumber}`,

      });
      if (req.body.emergencyContact) {
        newCustomer.emergencyContact = newCustomer.emergencyContact || {};
        if (req.body.emergencyContact.name) {
          newCustomer.emergencyContact.name = req.body.emergencyContact.name;
        }
        if (req.body.emergencyContact.mobileNumber) {
          newCustomer.emergencyContact.mobileNumber = req.body.emergencyContact.mobileNumber;
        }
      }
      
      if (req.body.nomineeContact) {
        newCustomer.nomineeContact = newCustomer.nomineeContact || {};
        if (req.body.nomineeContact.name) {
          newCustomer.nomineeContact.name = req.body.nomineeContact.name;
        }
        if (req.body.nomineeContact.mobileNumber) {
          newCustomer.nomineeContact.mobileNumber = req.body.nomineeContact.mobileNumber;
        }
        if (req.body.nomineeContact.relationship) {
          newCustomer.nomineeContact.relationship = req.body.nomineeContact.relationship;
        }
      }
      
      if(req.body.name)newCustomer.name = req.body.name;
      if (req.body.name) {
        newCustomer.name = req.body.name;
      }
      
      if (req.body.email) {
        newCustomer.email = req.body.email;
      }
      
      if (req.body.mobileNumber) {
        newCustomer.mobileNumber = req.body.mobileNumber;
      }
      
      if (req.body.address) {
        newCustomer.address = req.body.address;
      }
      
      if (req.body.aadharCardNumber) {
        newCustomer.aadharCardNumber = req.body.aadharCardNumber;
      }
      
      if (req.body.panCardNumber) {
        newCustomer.panCardNumber = req.body.panCardNumber;
      }
      
      if (req.body.dateOfBirth) {
        newCustomer.dateOfBirth = req.body.dateOfBirth;
      }
      
      if (req.body.occupation) {
        newCustomer.occupation = req.body.occupation;
      }
      
      if (req.body.gender) {
        newCustomer.gender = req.body.gender;
      }
      
      if (req.body.nationality) {
        newCustomer.nationality = req.body.nationality;
      }
      
      if (req.body.maritalStatus) {
        newCustomer.maritalStatus = req.body.maritalStatus;
      }
      

      // Check if the username is already taken
      if (req.body.userName) {
        const existingUserName = await User.findOne({ userName: req.body.userName });
        const existingMobile = await User.findOne({ mobileNumber: req.body.mobileNumber });
        if(existingMobile){
          res.status(201).json({
            message: "Mobile Number is already used. Please choose a different number.",
            variant: "error"
          });
        
        }else  if (existingUserName) {
           res.status(201).json({
            message: "Username is already taken. Please choose a different username.",
            variant: "error"
          });
         }else {
          
          newCustomer
          .save()
          .then(() => {   
           res.status(200).json({
            message: "Customer Successfully added",
            variant: "success"
          });})
          .catch(err => console.log(err));
        }
      }
  

    } else {
      res.status(401).json({
        message: "You are not authorized.",
        variant: "error"
      });
    }
  });
  

// @type    GET
// @route   /api/v1/addition/addcustomer/:id
// @desc    Get a customer by ID
// @access  Public
router.get("/getOne/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.findById(req.params.id)
    .then(customer => {
      if (!customer) {
         res.status(404).json({ message: "Customer not found" });
      }
      res.status(200).json(customer);
    })
    .catch(err => console.log(err));
});

// @type    GET
// @route   /api/v1/addition/addcustomer/getall
// @desc    Get all customers
// @access  Public
router.get("/getAll", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.find({designation:"customer"})
    .then(user => res.status(200).json(user))
    .catch(err => console.log(err));
});

// @type    GET
// @route   /api/v1/addition/getDataWithPage/:PageNumber
// @desc    Get customers with pagination
// @access  Public
router.get("/getDataWithPage/:PageNumber", passport.authenticate("jwt", { session: false }), (req, res) => {
    const page = parseInt(req.params.PageNumber) || 1; // Get the page number from the route parameters (default to 1)
    const limit = 10; // Number of records to retrieve per page
  
    // Retrieve customers with pagination
    User.find()
      .skip((page - 1) * limit) // Skip the appropriate number of records based on the page number
      .limit(limit) // Limit the number of records to retrieve
      .then(customers => {
        // Calculate total count if it's the first page
        const totalCountPromise = page === 1 ? User.countDocuments() : Promise.resolve(0);
  
        // Respond with customers and total count
        Promise.all([totalCountPromise, customers])
          .then(([totalCount, customers]) => {
            const response = {
              page,
              totalCount: totalCount || customers.length, // Use totalCount if available, otherwise use the length of customers
              customers
            };
            res.status(200).json(response);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while retrieving customers." });
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: "An error occurred while retrieving customers." });
      });
  });
  

// @type    PUT
// @route   /api/v1/addition/addcustomer/:id
// @desc    Update a customer by ID
// @access  Public
// @type    POST

async function updateMe(req,res,updateCustomer){

  User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: updateCustomer },
    { new: true }
  )
    .then(user => {
      if (user){
        res.status(200).json({ message: "Updated successfully!!", variant: "success" })

      } else {
        res.status(401).json({ message: "Id not found", variant: "error" })

      }
    }        
    )

    .catch(err =>
      console.log("Problem in updating user value" + err)
    );




}

router.post(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  async(req, res) => {
    var des = req.user.designation;
    var des1 = "admin";
    var des2 = "manager";

    if (des == des1 || des == des2) {
 
  
      const newCustomer = {
        user:req.user.id,
        emergencyContact:{},
        nomineeContact:{}
      };

      if (req.body.emergencyContact) {
        if (req.body.emergencyContact.name) {
          newCustomer.emergencyContact.name = req.body.emergencyContact.name;
        }
        if (req.body.emergencyContact.mobileNumber) {
          newCustomer.emergencyContact.mobileNumber = req.body.emergencyContact.mobileNumber;
        }
      }
      
      if (req.body.nomineeContact) {
        if (req.body.nomineeContact.name) {
          newCustomer.nomineeContact.name = req.body.nomineeContact.name;
        }
        if (req.body.nomineeContact.mobileNumber) {
          newCustomer.nomineeContact.mobileNumber = req.body.nomineeContact.mobileNumber;
        }
        if (req.body.nomineeContact.relationship) {
          newCustomer.nomineeContact.relationship = req.body.nomineeContact.relationship;
        }
      }
      
      if(req.body.userName){
        newCustomer.userName= req.body.userName} ;
      if (req.body.name) {
        newCustomer.name = req.body.name;
      }
      
      if (req.body.email) {
        newCustomer.email = req.body.email;
      }
      
      if (req.body.mobileNumber) {
        newCustomer.mobileNumber = req.body.mobileNumber;
      }
      
      if (req.body.address) {
        newCustomer.address = req.body.address;
      }
      
      if (req.body.aadharCardNumber) {
        newCustomer.aadharCardNumber = req.body.aadharCardNumber;
      }
      
      if (req.body.panCardNumber) {
        newCustomer.panCardNumber = req.body.panCardNumber;
      }
      
      if (req.body.dateOfBirth) {
        newCustomer.dateOfBirth = req.body.dateOfBirth;
      }
      
      if (req.body.occupation) {
        newCustomer.occupation = req.body.occupation;
      }
      
      if (req.body.gender) {
        newCustomer.gender = req.body.gender;
      }
      
      if (req.body.nationality) {
        newCustomer.nationality = req.body.nationality;
      }
      
      if (req.body.maritalStatus) {
        newCustomer.maritalStatus = req.body.maritalStatus;
      }
      

      // Check if the username is already taken
      if (req.body.userName) {
        const existingUserName = await User.findOne({ userName: req.body.userName });
        const existingMobile = await User.findOne({ mobileNumber: req.body.mobileNumber });
        const existingEmail = await User.findOne({ email: req.body.email });
        if(existingMobile && (req.body.mobileNumber != req.user.mobileNumber)){
          res.status(401).json({
            message: "Mobile Number is already used. Please choose a different number.",
            variant: "error"
          });
        
        }else  if (existingEmail && (req.body.email != req.user.email)) {
          res.status(401).json({
           message: "Email is already taken. Please choose a different Email.",
           variant: "error"
         });
        }else if (existingUserName && (req.body.userName != req.user.userName)) {
           res.status(401).json({
            message: "Username is already taken. Please choose a different username.",
            variant: "error"
          });
         }else {
          updateMe(req,res,newCustomer)
    
        }
      }
  

    } else {
      res.status(401).json({
        message: "You are not authorized.",
        variant: "error"
      });
    }

  }
);
// @type    GET
//@route    /api/v1/addition/addcustomer/getall/:searchCustomer
// @desc    route for searching of user from searchbox using any text
// @access  PRIVATE
router.get(
  "/getall/:searchCustomer",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var des = req.user.designation;
    var des1 = "admin";
    var des2 = "manager";
    const search = req.params.searchCustomer;

    if (des == des1 || des == des2  ) {
    if (isNaN(search)) {
      User.find({
        designation:"customer",
        name: new RegExp(search, "i")
      })
      .then(User => res.status(200).json(User)).catch(err => res.status(401).json({message: "Problem in Searching" + err, variant: "success"}));
      
   
    } 

  } else {
    res.status(401).json({ message: "You are not Authorised", variant: "error" })
  }

  });

// @type    DELETE
// @route   /api/v1/addition/addcustomer/:id
// @desc    Delete a customer by ID
// @access  Public
router.delete("/deleteOne/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(customer => {
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(200).json({ message: "Customer deleted successfully" });
    })
    .catch(err => console.log(err));
});

module.exports = router;

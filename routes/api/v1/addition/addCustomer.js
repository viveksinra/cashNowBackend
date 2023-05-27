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
        return res.json({
          message: "Name, mobileNumber, and address are required fields.",
          variant: "error"
        });
      }
  
      const newCustomer = new User({
        user:req.user.id,
       userName: req.body.userName || `${req.body.name}${req.body.mobileNumber}`,
       emergencyContact: {
        name: req.body.emergencyContactName,
        mobileNumber: req.body.emergencyContactPhoneNumber
      },
      nomineeContact: {
        name: req.body.nomineeContact?.name || "",
        mobileNumber: req.body.nomineeContact?.mobileNumber || "",
        relationship: req.body.nomineeContact?.relationship || ""
      }
      });
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
        const existingCustomer = await User.findOne({ userName: req.body.userName });
        if (existingCustomer) {
          return res.json({
            message: "Username is already taken. Please choose a different username.",
            variant: "error"
          });
        }
      }
  
      newCustomer
        .save()
        .then(() => {   return res.json({
          message: "Customer Successfully added",
          variant: "success"
        });})
        .catch(err => console.log(err));
    } else {
      res.json({
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
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    })
    .catch(err => console.log(err));
});

// @type    GET
// @route   /api/v1/addition/addcustomer/getall
// @desc    Get all customers
// @access  Public
router.get("/getAll", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.find({designation:"customer"})
    .then(user => res.json(user))
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
            res.json(response);
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
router.put("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(customer => {
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    })
    .catch(err => console.log(err));
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
      res.json({ message: "Customer deleted successfully" });
    })
    .catch(err => console.log(err));
});

module.exports = router;

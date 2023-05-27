const express = require("express");
const router = express.Router();

// Load AddCustomer Model
const AddCustomer = require("../models/AddCustomer");

// @type    POST
// @route   /api/v1/addition/addcustomer
// @desc    Create a new customer
// @access  Public
router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    var des = req.user.designation;
    var des1 = "Admin";
    var des2 = "Manager";
  
    if (des == des1 || des == des2) {
      // Check if the required fields are present
      if (!req.body.name || !req.body.phoneNumber || !req.body.address) {
        return res.json({
          message: "Name, phoneNumber, and address are required fields.",
          variant: "error"
        });
      }
  
      const newCustomer = new AddCustomer({
        userName: req.body.userName || `${req.body.name}${req.body.phoneNumber}`,
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        aadharCardNumber: req.body.aadharCardNumber,
        panCardNumber: req.body.panCardNumber,
        dateOfBirth: req.body.dateOfBirth,
        occupation: req.body.occupation,
        gender: req.body.gender,
        nationality: req.body.nationality,
        maritalStatus: req.body.maritalStatus,
        emergencyContact: {
          name: req.body.emergencyContactName,
          phoneNumber: req.body.emergencyContactPhoneNumber
        },
        nomineeContact: {
          name: req.body.nomineeContact?.name || "",
          phoneNumber: req.body.nomineeContact?.phoneNumber || "",
          relationship: req.body.nomineeContact?.relationship || ""
        }
      });
  
      // Check if the username is already taken
      if (req.body.userName) {
        const existingCustomer = await AddCustomer.findOne({ userName: req.body.userName });
        if (existingCustomer) {
          return res.json({
            message: "Username is already taken. Please choose a different username.",
            variant: "error"
          });
        }
      }
  
      newCustomer
        .save()
        .then(customer => res.json(customer))
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
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  AddCustomer.findById(req.params.id)
    .then(customer => {
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    })
    .catch(err => console.log(err));
});

// @type    GET
// @route   /api/v1/addition/addcustomer
// @desc    Get all customers
// @access  Public
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  AddCustomer.find()
    .then(customers => res.json(customers))
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
    AddCustomer.find()
      .skip((page - 1) * limit) // Skip the appropriate number of records based on the page number
      .limit(limit) // Limit the number of records to retrieve
      .then(customers => {
        // Calculate total count if it's the first page
        const totalCountPromise = page === 1 ? AddCustomer.countDocuments() : Promise.resolve(0);
  
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
  AddCustomer.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
router.delete("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  AddCustomer.findByIdAndRemove(req.params.id)
    .then(customer => {
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ message: "Customer deleted successfully" });
    })
    .catch(err => console.log(err));
});

module.exports = router;

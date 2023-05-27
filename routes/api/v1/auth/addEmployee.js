const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load AddEmployee Model
const AddEmployee = require("../../../../models/User");

// @type    POST
// @route   /api/v1/addition/addemployee
// @desc    Create a new employee
// @access  Public
router.post("/", 
// passport.authenticate("jwt", { session: false }), 
async (req, res) => {
  var des = "admin";
  var des1 = "admin";
  var des2 = "manager";

  if (des == des1 || des == des2) {
    // Check if the required fields are present
    if ( !req.body.mobileNumber ) {
      return res.json({
        message: "Name and mobileNumber are required fields.",
        variant: "error"
      });
    }

    const newEmployee = new AddEmployee({
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      address: req.body.address,
      designation: req.body.designation,
      department: req.body.department,
      salary: req.body.salary
    });
 
    newEmployee
      .save()
      .then(employee => {
        res.json({
          message: "Employee successfully created",
          variant: "success"
        });
      })
      .catch(err => console.log(err));
  } else {
    res.json({
      message: "You are not authorized.",
      variant: "error"
    });
  }
});

// @type    GET
// @route   /api/v1/addition/addemployee/:id
// @desc    Get an employee by ID
// @access  Public
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  AddEmployee.findById(req.params.id)
    .then(employee => {
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    })
    .catch(err => console.log(err));
});

// @type    GET
// @route   /api/v1/addition/addemployee
// @desc    Get all employees
// @access  Public
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  AddEmployee.find()
    .then(employees => res.json(employees))
    .catch(err => console.log(err));
});

// @type    PUT
// @route   /api/v1/addition/addemployee/:id
// @desc    Update an employee by ID
// @access  Public
router.put("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  AddEmployee.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(employee => {
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    })
    .catch(err => console.log(err));
});

// @type    DELETE
// @route   /api/v1/addition/addemployee/:id
// @desc    Delete an employee by ID
// @access  Public
router.delete("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  AddEmployee.findByIdAndRemove(req.params.id)
    .then(employee => {
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json({ message: "Employee deleted successfully" });
    })
    .catch(err => console.log(err));
});

module.exports = router;

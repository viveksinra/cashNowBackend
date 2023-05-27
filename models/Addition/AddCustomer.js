const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddCustomerSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ""
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  aadharCardNumber: {
    type: String,
    default: ""
  },
  panCardNumber: {
    type: String,
    default: ""
  },
  dateOfBirth: {
    type: Date,
  },
  occupation: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Other"
  },
  nationality: {
    type: String,
    default: ""
  },
  maritalStatus: {
    type: String,
    enum: ["Single", "Married", "Divorced", "Widowed"],
    default: "Single"
  },
  emergencyContact: {
    name: {
      type: String,
      default: ""
    },
    phoneNumber: {
      type: String,
      default: ""
    }
  },
  nomineeContact: {
    name: {
      type: String,
      default: ""
    },
    phoneNumber: {
      type: String,
      default: ""
    },
    relationship: {
      type: String,
      default: ""
    }
  },
  // Add more fields as needed

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = AddCustomer = mongoose.model("myAddCustomer", AddCustomerSchema);
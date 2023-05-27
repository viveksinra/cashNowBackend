const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  
  userName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default:""
  },
  email: {
    type: String,
    default: ""
  },
  mobileNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ""
  },
  designation: {
    type: String,
    default: ""
  },
  admin: {
    type: Boolean,
    default: false
  },
  collector: {
    type: Boolean,
    default: false
  },
  dateOfBirth: {
    type: Date
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
    mobileNumber: {
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

module.exports = User = mongoose.model("myUser", UserSchema);





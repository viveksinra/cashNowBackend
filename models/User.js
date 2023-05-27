const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  
  user: {
    type: Schema.Types.ObjectId,
    ref: "myUser",
    required:true
  },
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
  mobileNumber: {
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
    mobileNumber: {
      type: String,
      default: ""
    }
  },
  nomineeContact: {
    name: {
      type: String,
      default: ""
    },
    mobileNumber: {
      type: String,
      default: ""
    },
    relationship: {
      type: String,
      default: ""
    }
  },
  designation: {
    type: String,
    enum: ["customer", "admin", "collector"],
    default: "customer"
  },
  // Add more fields as needed

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("myUser", UserSchema);





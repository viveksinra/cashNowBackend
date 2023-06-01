const LoanRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myUser"
  },
    customer: {
      name:{
        type: String,
      default: 'name',
      required: true
      },
      id: {
      type: Schema.Types.ObjectId,
      ref: 'myUser',
      required: true
    }
  },
    referredBy: {
      type: String,
      default: ''
    },
    amountRequested: {
      type: Number,
      required: true
    },
    emiAmount: {
      type: Number,
      required: true
    },
    totalEmi:{
      type: Number,
      required: true
    },
    emiFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    requestedDate: {
      type: Date,
      default: Date.now
    },
    loanDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
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
    // Add any other fields you require
  
    date: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = LoanRequest = mongoose.model('LoanRequest', LoanRequestSchema);
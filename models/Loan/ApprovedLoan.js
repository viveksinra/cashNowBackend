const ApprovedLoanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myUser"
  },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'AddCustomer',
        required: true
      },
      loanRequest: {
        type: Schema.Types.ObjectId,
        ref: 'LoanRequest',
        required: true
      },
      amountApproved: {
        type: Number,
        required: true
      },
      emiAmount: {
        type: Number,
        required: true
      },
      emiFrequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly'],
        default: 'Monthly'
      },
      loanDate: {
        type: Date,
        required: true
      },
      approvedDate: {
        type: Date,
        default: Date.now
      },
      // Add any other fields you require
    
      date: {
        type: Date,
        default: Date.now
      }
  });
  
  module.exports = ApprovedLoan = mongoose.model('ApprovedLoan', ApprovedLoanSchema);
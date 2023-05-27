const LoanRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myUser"
  },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'AddCustomer',
      required: true
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
    emiFrequency: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly'],
      default: 'Daily'
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
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    // Add any other fields you require
  
    date: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = LoanRequest = mongoose.model('LoanRequest', LoanRequestSchema);
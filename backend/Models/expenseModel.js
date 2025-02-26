import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  expenseBy: {
    type: String,
    required: true,
    trim: true,
  },
  expenseAmount: {
    type: Number,
    required: true,
  },
   expenseFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Expense = mongoose.models.Expense ||  mongoose.model('Expense', expenseSchema);

export default Expense;
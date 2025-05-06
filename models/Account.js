import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  balance: { type: Number, default: 0 },
  history: [
    {
      type: String, // "deposit", "withdraw", "transfer"
      amount: Number,
      date: { type: Date, default: Date.now },
      to: String // eğer transfer ise
    }
  ]
});

const Account = mongoose.model('Account', AccountSchema);
export default Account;
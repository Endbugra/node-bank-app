const Account = require('../models/Account');
const User = require('../models/User');

exports.getBalance = async (req, res) => {
  const account = await Account.findOne({ user: req.userId });
  res.json({ balance: account.balance });
};

exports.transfer = async (req, res) => {
  const { email, amount } = req.body;
  const sender = await Account.findOne({ user: req.userId });
  const receiverUser = await User.findOne({ email });
  if (!receiverUser) return res.status(400).json({ message: "Alıcı bulunamadı" });

  const receiver = await Account.findOne({ user: receiverUser._id });

  if (sender.balance < amount) return res.status(400).json({ message: "Yetersiz bakiye" });

  sender.balance -= amount;
  receiver.balance += amount;

  sender.history.push({ type: "transfer", amount, to: email });
  receiver.history.push({ type: "receive", amount });

  await sender.save();
  await receiver.save();

  res.json({ message: "Transfer başarılı" });
};
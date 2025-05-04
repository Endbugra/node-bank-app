import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  action: String,
  user: String,
  timestamp: Date,
  details: {
    params: Object,
    query: Object,
    body: Object,
    ip: String,
  },
});

const Log = mongoose.model('Log', LogSchema);

export default Log; // Default export
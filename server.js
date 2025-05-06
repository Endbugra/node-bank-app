import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import conn from './config/db.js';
import User from './models/User.js';
import express from 'express';
import { logAction } from './middleware/logMiddleware.js';
import {router} from './routes/auth.js';
import bcrypt from 'bcryptjs';
const app = express();
app.use(express.json());

// Loglama middleware'ini tüm isteklere uygula
app.use(logAction);

conn();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //form verilerini okuyabilmek için gerekli

const PORT = process.env.PORT || 5001;

// Ana sayfa endpointi
app.use("/sign",router)

app.post("sign",(req,res)=>{
  register(req,res)
})
// Kullanıcıları listeleme endpointi
app.post('/users/list', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcılar alınırken bir hata oluştu" });
  }
});

// Bakiye sorgulama endpointi
app.get('/balance/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Bakiye sorgulama sırasında bir hata oluştu" });
  }
});

// Bakiye artırma endpointi
app.put('/balance/increase/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { amount } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    user.balance += amount;
    await user.save();
    
    res.json({ message: "Bakiye başarıyla artırıldı", balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Bakiye artırılırken bir hata oluştu" });
  }
});

// Bakiye azaltma endpointi
app.put('/balance/decrease/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { amount } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Yetersiz bakiye" });
    }

    user.balance -= amount;
    await user.save();

    res.json({ message: "Bakiye başarıyla azaltıldı", balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Bakiye azaltılırken bir hata oluştu" });
  }
});

// API çalıştığını gösteren portu dinle
app.listen(PORT, () => {
  console.log(`API çalışıyor: http://localhost:${PORT}`);
});

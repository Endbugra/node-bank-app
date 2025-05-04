import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import bcrypt from 'bcryptjs';
import conn from './config/db.js';
import User from './models/User.js';
import express from 'express';
import { logAction } from './middleware/logMiddleware.js';

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
app.post("/", (req, res) => {
  res.send("Sunucu çalışıyor!");
});

// Kullanıcıları listeleme endpointi
app.post('/users/list', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Kullanıcılar alınırken bir hata oluştu" });
  }
});

// Kullanıcı kayıt (Sign Up) endpointi
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      balance: 0  // Yeni kullanıcıya başlangıç bakiyesi ekliyoruz
    });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ message: "Kullanıcı başarıyla oluşturuldu", user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: "Kullanıcı oluşturulurken bir hata oluştu" });
  }
});

// Kullanıcı giriş (Login) endpointi
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Şifre yanlış" });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ message: "Giriş başarılı", user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: "Giriş yapılırken bir hata oluştu" });
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

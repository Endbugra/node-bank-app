import dotenv from 'dotenv';
dotenv.config(); // Ortam değişkenlerini yükle

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import conn from './config/db.js';
import User from './models/User.js';

// MongoDB bağlantısını başlat
conn();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Port tanımlama
const PORT = process.env.PORT || 5001;

// Kullanıcıları listeleme endpointi
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Tüm kullanıcıları getir
    res.json(users);
  } catch (err) {
    console.error("Hata:", err.message); // Hata mesajını konsola yazdır
    res.status(500).json({ error: "Kullanıcılar alınırken bir hata oluştu" });
  }
});




app.get("/", (req, res) => {
  res.send("Sunucu çalışıyor!");
});



// Test endpointi: Yeni bir kullanıcı oluşturma
app.get('/test', async (req, res) => {
  try {
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Yeni kullanıcı oluştur
    const user = await User.create({
      name: "Test User",
      email: "tes22222t@example.com",
      password: hashedPassword,
    });

    // Şifreyi döndürmeden kullanıcıyı yanıtla
    const { password, ...userWithoutPassword } = user.toObject();
    res.json({ message: "Kullanıcı başarıyla oluşturuldu", user: userWithoutPassword });
  } catch (err) {
    console.error("Hata:", err.message); // Hata mesajını konsola yazdır
    res.status(500).json({ error: "Kullanıcı oluşturulurken bir hata oluştu" });
  }
});

// Kullanıcı güncelleme endpointi
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true } // Güncellenmiş kullanıcıyı döndür
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Hata:", err.message);
    res.status(500).json({ error: "Kullanıcı güncellenirken bir hata oluştu" });
  }
});

// Kullanıcı silme endpointi
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (err) {
    console.error("Hata:", err.message);
    res.status(500).json({ error: "Kullanıcı silinirken bir hata oluştu" });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`API çalışıyor: http://localhost:${PORT}`);
});
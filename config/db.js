import mongoose from "mongoose";

const conn = async () => {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL ortam değişkeni tanımlı değil!");
    process.exit(1); // Uygulamayı durdur
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "bankapp",
    });
    console.log("MongoDB bağlantısı başarılı");
  } catch (err) {
    console.error("MongoDB bağlantı hatası:", err.message);
    process.exit(1); // Hata durumunda uygulamayı durdur
  }
};


export default conn;

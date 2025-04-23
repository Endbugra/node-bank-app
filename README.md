# Node.js Banka Uygulaması

Bu proje, bir banka uygulaması için Node.js tabanlı bir backend API'sidir. MongoDB Atlas kullanılarak veritabanı işlemleri gerçekleştirilir. Kullanıcı yönetimi, hesap işlemleri ve şifreleme gibi özellikler içerir.

---

## **Özellikler**
- Kullanıcı oluşturma ve listeleme
- Şifrelerin güvenli bir şekilde hash'lenmesi (`bcryptjs` kullanılarak)
- MongoDB Atlas ile veritabanı bağlantısı
- CRUD işlemleri için RESTful API endpointleri
- Jest ile birim testleri

- Proje Yapısı
node-bank-app/
├── config/
│   └── [db.js](http://_vscodecontentref_/1)          # MongoDB bağlantı ayarları
├── models/
│   ├── User.js        # Kullanıcı modeli
│   └── Account.js     # Hesap modeli
├── test/
│   └── models/
│       └── User.test.js # Kullanıcı modeli için testler
├── [server.js](http://_vscodecontentref_/2)          # Ana uygulama dosyası
├── [package.json](http://_vscodecontentref_/3)       # Proje bağımlılıkları ve betikleri
└── .env               # Ortam değişkenleri

Lisans
Bu proje MIT Lisansı ile lisanslanmıştır.


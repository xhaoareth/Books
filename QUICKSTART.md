# 🚀 Hızlı Başlangıç Rehberi

## Seçenek 1: Docker ile Kurulum (Önerilir)

### Adım 1: Docker ve Docker Compose Yukleyin
- https://www.docker.com/products/docker-desktop adresinden indirin

### Adım 2: Projeyi Başlatın
```bash
docker-compose up -d
```

### Adım 3: Uygulamaya Erişin
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

✅ Bu kadar! Uygulama hazır.

---

## Seçenek 2: Manuel Kurulum

### Ön Koşullar
1. **Node.js 18+** - https://nodejs.org adresinden indirin
2. **MongoDB** - https://www.mongodb.com/try/download/community adresinden indirin

### Adım 1: MongoDB'yi Başlatın
```bash
# Windows
mongod

# macOS / Linux
brew services start mongodb-community
```

### Adım 2: Backend'i Başlatın
```bash
cd server

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env

# Geliştirme sunucusunu başlat
npm run dev
```

### Adım 3: Frontend'i Başlatın (Yeni Terminal Penceresi)
```bash
cd client

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start
```

### Adım 4: Uygulamaya Erişin
- Frontend otomatik olarak http://localhost:3000 adresinde açılacak
- Backend http://localhost:5000 üzerinde çalışıyor

---

## 🧪 İlk Test

1. **Kaydol** (http://localhost:3000)
   - Ad: Test Kullanıcı
   - E-Mail: test@example.com
   - Şifre: password123

2. **PDF Yükle**
   - "PDF Yükle" düğmesine tıklayın
   - Bir PDF dosyası seçin
   - Başlık ve yazar bilgisini doldurun
   - "Yükle" düğmesini tıklayın

3. **Kitap Oku**
   - Kitap kartından tıklayın
   - PDF'i okumaya başlayın
   - Sayfa ilerlemesi otomatik kaydedilir

---

## 🔌 API Testi

**PostMan** veya **curl** ile API'yi test edin:

### Kayıt
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Kullanıcı",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Giriş
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🛑 Sorun Giderme

### Docker Mimarisi Problemi (M1/M2 Mac)
Eğer `exec ./docker-entrypoint.sh: exec format error` hatası alırsanız:

```bash
# docker-compose.yml dosyasını düzenle
# Bu satırı ekle:
services:
  server:
    platform: linux/amd64
  client:
    platform: linux/amd64
```

### Port Zaten Kullanımda
```bash
# Port 3000'i değiştir
# client/package.json içinde:
"scripts": {
  "start": "PORT=3001 react-scripts start"
}

# veya Windows'te:
set PORT=3001 && npm start
```

### MongoDB Bağlantı Başarısız
```bash
# MongoDB çalışıyor mu kontrol et
docker ps

# Manuel başlat
docker run -d -p 27017:27017 --name books-mongodb mongo:7.0
```

---

## 📚 Sonraki Adımlar

1. **Özelleştir**
   - `server/.env` dosyasında `JWT_SECRET` ve diğer ortam değişkenlerini ayarla
   - `client/src` klasöründeki dosyaları özelleştir

2. **Veritabanı**
   - MongoDB Atlas kullanmak için `MONGODB_URI` güncelle
   - https://www.mongodb.com/cloud/atlas

3. **Hosting**
   - Backend için Heroku / Railway / Render
   - Frontend için Vercel / Netlify

---

## 💡 İpuçları

- **Logları görüntüle**: `docker-compose logs -f`
- **Containerları durdur**: `docker-compose down`
- **Veritabanını sıfırla**: `docker-compose down -v`
- **Tekrar inşa et**: `docker-compose up --build`

---

## 🎉 Tamamlandı!

Uygulamanız çalışıyor demektir. Hoş kullanmalar! 📚✨

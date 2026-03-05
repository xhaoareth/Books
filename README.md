# 📚 E-Kitap Kütüphanesi

PDF yükleme, OCR işlemi ve e-kitap okuma özelliklerine sahip modern bir web uygulaması.

## ✨ Özellikler

### 📤 PDF Yükleme
- Kullanıcı tarafından PDF dosyaları yüklenebilir
- Dosya doğrulaması ve güvenlik kontrolleri
- Yüklü dosyaların sunucuda depolanması

### 📖 Kütüphane
- Yüklenen tüm PDF'leri listele
- Kitapları kategorilere ayırma (Kurgu, Bilim Kurgu, Kişisel Gelişim, Teknik, İş, Diğer)
- Kitap adı ve yazar adına göre arama
- Favori kitapları işaretleme
- Kitap bilgilerini düzenleme

### 👓 Okuma Alanı
- Sayfa sayfa PDF görüntüleme
- İlerleme takibi (hangi sayfada olduğunuzu hatırlama)
- Yer imi ekleme ve kaldırma
- Okuma istatistikleri

### 👤 Kullanıcı Sistemi
- Kayıt ve Giriş
- Güvenli kimlik doğrulama (JWT)
- Şifre şifreleme (bcryptjs)
- Profil yönetimi

## 🛠️ Teknoloji Stack

**Backend:**
- Node.js + Express
- MongoDB
- Multer (dosya yükleme)
- JWT (kimlik doğrulama)
- Bcryptjs (şifre şifreleme)

**Frontend:**
- React 18
- React Router
- Axios
- PDF.js (PDF görüntüleme)
- Tailwind CSS
- Lucide Icons

**Deployment:**
- Docker & Docker Compose
- MongoDB container
- Node.js backend container
- React frontend container

## 🚀 Kurulum ve Çalıştırma

### Ön Koşullar
- Node.js 18+
- Docker & Docker Compose (veya manual kurulum)
- npm veya yarn

### 1️⃣ Backend Kurulumu (Manuel)

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Backend varsayılan olarak `http://localhost:5000` üzerinde çalışır.

### 2️⃣ Frontend Kurulumu (Manuel)

```bash
cd client
npm install
npm start
```

Frontend varsayılan olarak `http://localhost:3000` üzerinde açılır.

### 3️⃣ MongoDB Kurulumu

Backend'in çalışması için bir MongoDB örneği gereklidir:

```bash
# Docker ile MongoDB başlat
docker run -d -p 27017:27017 --name books-mongodb mongo:7.0
```

### 🐳 Docker ile Kurulum (Önerilir)

```bash
# Tüm containerları başlat
docker-compose up -d

# Logları görüntüle
docker-compose logs -f

# Containerları durdur
docker-compose down
```

Kurulumdan sonra:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı giriş
- `GET /api/auth/profile` - Profil bilgisi

### Books
- `GET /api/books` - Tüm kitapları listele (filtreleme destekli)
- `POST /api/books/upload` - PDF yükle
- `GET /api/books/:id` - Tek kitap detayı
- `PUT /api/books/:id` - Kitap bilgisini güncelle
- `DELETE /api/books/:id` - Kitap sil

### Reading Progress
- `GET /api/reading/:bookId/progress` - Okuma ilerlemeğini getir
- `PUT /api/reading/:bookId/progress` - Okuma ilerlemeğini güncelle
- `POST /api/reading/:bookId/bookmarks` - Yer imi ekle
- `DELETE /api/reading/:bookId/bookmarks/:bookmarkId` - Yer imi sil
- `GET /api/reading/stats/all` - Okuma istatistikleri

## 📁 Proje Yapısı

```
Books/
├── server/                 # Backend
│   ├── src/
│   │   ├── controllers/    # İş mantığı
│   │   ├── models/         # MongoDB şemaları
│   │   ├── routes/         # API yolları
│   │   ├── middleware/     # Express middleware'ları
│   │   └── index.js        # Ana sunucu dosyası
│   ├── uploads/            # Yüklenen PDF'ler
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── client/                 # Frontend
│   ├── src/
│   │   ├── pages/          # React sayfaları
│   │   ├── components/     # React bileşenleri
│   │   ├── context/        # React Context
│   │   ├── api.js          # API çağrıları
│   │   └── App.js          # Ana uygulama
│   ├── public/
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml      # Docker konfigürasyonu
```

## 🔐 Güvenlik Notları

⚠️ **Üretim için:**
- `.env` dosyasında `JWT_SECRET` değerini değiştirin
- MongoDB'ye kimlik doğrulama ekleyin
- HTTPS kullanın
- CORS ayarlarını düzenleyin
- PDF yükleme boyut limitlerini ayarlayın

## 🐛 Troubleshooting

### MongoDB Bağlantı Hatası
```bash
# MongoDB çalışıyor mu kontrol et
docker ps | grep mongodb

# Manuel MongoDB başlat
docker run -d -p 27017:27017 --name books-mongodb mongo:7.0
```

### Port Zaten Kullanımda
```bash
# Port 5000'i kullanmakta olan süreci bul
lsof -i :5000

# Port 3000'i kullanmakta olan süreci bul
lsof -i :3000
```

### Frontend API'ye Bağlanamıyor
```bash
# Proxy ayarını kontrol et
# client/.env dosyasında REACT_APP_API_URL doğru yere işaret ediyor mu?
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚧 Gelecek Özellikler

- [ ] OCR işlemi (Tesseract.js)
- [ ] Metin arayüzünde arama
- [ ] Kitap yorumları ve puanlandırması
- [ ] Okuma müddetinin takip edilmesi
- [ ] E-kitap dönüştürme özellikleri
- [ ] Sosyal özellikleri
- [ ] Mobil uygulaması

## 📝 Lisans

MIT

## 👨‍💻 Geliştirici Notları

### Hızlı Başlangıç
1. `cd server && npm install && npm run dev`
2. `cd client && npm install && npm start`
3. http://localhost:3000 adresini ziyaret edin
4. Yeni kullanıcı olarak kaydolun
5. PDF yükleyip okumaya başlayın

### Test Verileri
```bash
# Test kullanıcısı oluştur
E-Mail: test@example.com
Şifre: password123
```

## 📞 Destek

Sorularınız veya sorunlarınız için lütfen GitHub Issues'ı kullanın.
Kendi pdf kitaplarımı e-kitap okuyucu formatında düzenlemek için kullanıyorum.

## 🌐 HTML Olarak GitHub'da Yayınlama (Mobil + Bilgisayar)

Bu proje React ile üretim derlemesinde **statik HTML/CSS/JS** dosyalarına dönüşür ve GitHub Pages'te yayınlanabilir.

### 1) GitHub Pages için frontend ayarları
Bu repoda hazırlandı:
- `client` için hash-router desteği (`REACT_APP_ROUTER_MODE=hash`)
- GitHub Actions ile otomatik deploy (`.github/workflows/deploy-client-gh-pages.yml`)

### 2) GitHub'da yayınlama adımları
1. Bu repoyu GitHub'a push edin.
2. GitHub repo ayarlarında **Settings → Pages → Source: GitHub Actions** seçin.
3. `main` branch'e `client` tarafında bir commit gönderin.
4. Action tamamlanınca siteniz şu formatta yayınlanır:
   - `https://<kullanici-adi>.github.io/<repo-adi>/#/`

### 3) Local test (HTML build)
```bash
cd client
npm install
REACT_APP_ROUTER_MODE=hash npm run build
npx serve -s build
```

### 4) Mobil ve bilgisayarda çalışma
- Yayınlanan GitHub Pages linki mobil tarayıcıda ve masaüstü tarayıcıda çalışır.
- Arayüz responsive olduğu için telefon/tablet/desktop ekranlarına uyum sağlar.

### Önemli Not (API)
GitHub Pages sadece frontend'i yayınlar. Login, PDF upload, kütüphane gibi canlı işlemler için backend API'nizi ayrıca (Render/Railway/Fly.io vb.) yayınlayıp frontend'de şu değeri kullanmalısınız:

```bash
REACT_APP_API_URL=https://your-backend-domain/api
```

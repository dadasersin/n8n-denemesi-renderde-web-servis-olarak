# Render.com n8n Bağlantı Sorunları Çözüm Rehberi

n8n üzerinde **"Sunucuyla bağlantı kesildi"** veya **"Connection lost"** hatası alıyorsanız, bu rehber sorunu %99 oranında çözecektir.

## 1. En Kritik Ayar: Port Yapılandırması
Render, uygulamanızın `$PORT` (genellikle 10000) üzerinden dinlemesini bekler. n8n ise varsayılan olarak 5678'i kullanır. Bu uyuşmazlık bağlantının kopmasına neden olur.

**Çözüm:** Render panelinde **Environment** sekmesine gidin ve şu değişkeni ekleyin:
- **Key:** `N8N_PORT`
- **Value:** `10000` (Veya `$PORT`)

## 2. Bellek (RAM) Sorunları (OOM Kill)
Render Ücretsiz planı (Free Tier) sadece 512MB RAM sunar. n8n çok fazla iş akışı çalıştırdığında veya ağır JSON verileri işlediğinde bu sınırı aşar.

**Belirtiler:** Loglarda `SIGKILL` veya `Out of Memory` mesajları görülür.
**Çözüm:**
- Eğer bütçeniz varsa **Starter** plana geçin (2GB RAM).
- Ücretsiz planda kalacaksanız, çok büyük veri kümelerini (500+ satır) tek seferde işlememeye çalışın, `Split In Batches` nodunu kullanın.

## 3. SQLite Veritabanı Kilitlenmeleri
"Database is locked" hatası n8n'in donmasına ve bağlantının kopmasına neden olur.

**Çözüm:** Environment sekmesine şu değişkeni ekleyin:
- **Key:** `N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS`
- **Value:** `false`

## 4. Webhook URL Yapılandırması
Bazı nodların (Telegram, WhatsApp vb.) çalışması için doğru Webhook URL şarttır.
- **Key:** `WEBHOOK_URL`
- **Value:** `https://uygulama-adiniz.onrender.com/` (Sonunda / olmalı)

## 5. Render.yaml ile Otomatik Kurulum
Depodaki `render.yaml` dosyasını kullanarak tüm bu ayarların otomatik yapıldığı yeni bir servis başlatabilirsiniz.

**Hata Nerede?**
Eğer hala sorun yaşıyorsanız, loglarınızı kopyalayıp bu uygulamanın ana sayfasındaki analiz kutusuna yapıştırın. Gemini size tam olarak hangi satırda ne hatası olduğunu Türkçe olarak açıklayacaktır.

## 💎 Kesin Çözüm: Supabase (PostgreSQL) Kullanımı
Render'ın ücretsiz planında SQLite (n8n'in varsayılanı) kullanmak "Sunucuyla bağlantı kesildi" hatasının en yaygın sebebidir. SQLite dosya kilitlenmeleri n8n'i dondurur.

**Çözüm:** Supabase'den ücretsiz bir PostgreSQL veritabanı açın ve şu değişkenleri Render panelinde tanımlayın:

| Key | Value |
| :--- | :--- |
| `DB_TYPE` | `postgresdb` |
| `DB_POSTGRESDB_HOST` | Supabase Host (örn: db.xyz.supabase.co) |
| `DB_POSTGRESDB_PORT` | `5432` |
| `DB_POSTGRESDB_DATABASE` | `postgres` |
| `DB_POSTGRESDB_USER` | `postgres` |
| `DB_POSTGRESDB_PASSWORD` | Supabase Şifreniz |

Bu ayarlar yapıldığında n8n verilerini harici bir veritabanında saklar, SQLite kilitlenmeleri yaşanmaz ve bağlantı kopma sorunu kalıcı olarak çözülür.

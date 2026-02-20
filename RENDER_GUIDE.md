# Render.com Dağıtım (Deployment) Rehberi

Bu uygulama için Render.com üzerinde yapılması gereken ayarlar aşağıdadır. "Sunucuyla bağlantı kesildi" hatasını önlemek ve uygulamanın doğru çalışmasını sağlamak için bu adımları takip edin.

## 1. Yeni Web Service Oluşturun
Render panelinde **New +** butonuna tıklayın ve **Web Service** seçeneğini belirleyin. GitHub deponuzu bağlayın.

## 2. Çalışma Zamanı (Runtime) Ayarları
Render deponuzda bir `Dockerfile` bulursa otomatik olarak Docker kullanmaya çalışabilir. Eğer Docker hatası alıyorsanız veya bağlantı kopuyorsa şu ayarları kullanın:

- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

## 3. Ortam Değişkenleri (Environment Variables)
**Settings > Environment** sekmesine gidin ve şu değişkenleri ekleyin:

| Key | Value | Açıklama |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AI...your_key...` | Gemini API anahtarınız (Zorunlu) |
| `PORT` | `10000` | Render'ın kullandığı varsayılan port |
| `NODE_VERSION` | `20` | Node.js sürümü (Önerilen) |

## 4. "Sunucuyla bağlantı kesildi" Hatası İçin Çözümler

1.  **API Anahtarı Kontrolü:** `GEMINI_API_KEY` değişkeninin doğru girildiğinden ve geçerli olduğundan emin olun.
2.  **Ücretsiz Plan Kısıtlaması:** Render'ın ücretsiz planı (Free Tier), uygulama 15 dakika boyunca istek almazsa sunucuyu "uyku" moduna alır. İlk girişte sunucunun uyanması 30-60 saniye sürebilir. Bu sürede bağlantı hatası alıyorsanız sayfayı yenileyin.
3.  **Sağlık Kontrolü (Health Check):** Render panelinde `Health Check Path` kısmını boş bırakın veya `/` yapın.

## 5. Uygulama Nasıl Güncellenir?
GitHub deponuza kod gönderdiğinizde (push), Render otomatik olarak yeni bir build başlatacaktır. Eğer build hata verirse, terminal kısmındaki hata mesajlarını kopyalayıp uygulamadaki AI asistanına sorabilirsiniz.

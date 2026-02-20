# n8n Render Troubleshooter & Optimized Deployment

Bu proje, n8n'in Render.com üzerinde yaşadığı **"Sunucuyla bağlantı kesildi"** hatalarını çözmek için tasarlanmıştır.

## 🚀 Hata Nerede? (Neden Bağlantı Kopuyor?)

n8n kurulumunuzda bu hatayı almanızın **3 temel sebebi** vardır:

1.  **PORT Ayarı:** n8n'e Render'ın portunu (`$PORT`) kullanması gerektiğini söylemelisiniz. (Çözüm: `N8N_PORT=10000`)
2.  **RAM Sınırı:** Ücretsiz plandaki 512MB RAM n8n için yetersiz kalabilir. (Çözüm: Starter plana geçmek veya iş akışlarını parçalamak.)
3.  **SQLite Kilidi:** Dosya yazma hataları sistemi dondurabilir. (Çözüm: `N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=false`)

Detaylı teknik rehber için: **[RENDER_GUIDE.md](./RENDER_GUIDE.md)**

---

## 🛠️ Bu Uygulama Nasıl Kullanılır?

Bu depo aslında bir **Teşhis Aracıdır**. Render'daki loglarınızı bu uygulamaya yapıştırarak hatanın tam yerini bulabilirsiniz.

1.  Uygulamayı Render'da bir "Web Service" olarak başlatın.
2.  `GEMINI_API_KEY` değişkenini tanımlayın.
3.  Loglarınızı asistan kutusuna yapıştırın.

---

## 🏗️ n8n'i Doğru Kurmak İçin

Eğer n8n'i en baştan hatasız kurmak istiyorsanız, bu depodaki `render.yaml` ve `Dockerfile.n8n` dosyalarını kullanabilirsiniz.

### n8n İçin Gerekli Environment Variables:
- `N8N_PORT`: `10000`
- `N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS`: `false`
- `WEBHOOK_URL`: `https://[app-adiniz].onrender.com/`

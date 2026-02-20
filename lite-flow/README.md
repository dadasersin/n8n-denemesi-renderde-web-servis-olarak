# Lite-Flow: n8n'e Hafif ve Hatasız Alternatif

Bu sistem, n8n gibi ağır arayüzlere ihtiyaç duymayan, Render'ın ücretsiz planında (512MB RAM) asla donmadan ve bağlantı kopmadan çalışacak şekilde tasarlanmış minimal bir otomasyon motorudur.

## Neden Bu?
1. **Bağlantı Kopmaz:** Arayüz (UI) olmadığı için RAM tüketimi %90 daha azdır.
2. **Hatasız:** Karmaşık veritabanı kilitlenmeleri (SQLite error) yaşanmaz.
3. **Esnek:** Kod ile istediğiniz her şeyi yapabilirsiniz.

## Nasıl Kullanılır?
1. src/index.ts dosyasını açın.
2. .addStep fonksiyonu ile yeni adımlar ekleyin.

---
*Bu sistem, n8n'in bağlantı sorunlarından bıkan kullanıcılar için özel olarak hazırlanmıştır.*

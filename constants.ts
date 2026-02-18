
import { Step, Variable, Workflow } from './types';

export const DOCKERFILE_CONTENT = `FROM n8nio/n8n:latest

USER root
RUN mkdir -p /data/.n8n && chmod -R 777 /data
ENV N8N_USER_ID=1000
ENV N8N_DATA_FOLDER=/data/.n8n

# Hugging Face default port is 7860
EXPOSE 7860
CMD ["n8n", "start", "--port=7860"]`;

export const README_CONTENT = `---
title: n8n Automation
emoji: 🚀
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# n8n Hugging Face Space
Bu Space, Docker altyapısı kullanılarak n8n çalıştırmak için yapılandırılmıştır.

## 🛠 Yapılandırma Notları
- **SDK:** Docker
- **Port:** 7860 (Hugging Face varsayılanı)
- **RAM:** 16GB (Ücretsiz plan)

Eğer "Configuration Error" alıyorsanız, bu dosyanın (README.md) en üstündeki YAML başlığı eksik veya hatalı olduğunda bu hatayı verir.`;

export const STEPS: Step[] = [
  {
    id: 1,
    title: "Yeni Bir Space Oluştur",
    description: "Hugging Face üzerinde yeni bir 'Space' başlatın. Kurulumun temeli burada atılır.",
    tips: [
      "huggingface.co/new-space adresine gidin.",
      "İsim verin (Örn: n8n-is-akisi).",
      "SDK: Mutlaka 'Docker' ve şablon olarak 'Blank' seçin.",
      "Privacy: 'Private' seçerek güvenliğinizi sağlayın."
    ]
  },
  {
    id: 2,
    title: "README.md Yapılandırması (Kritik)",
    description: "Hugging Face'in 'Configuration Error' vermemesi için README.md dosyasının en başında bu metadata bloğu bulunmalıdır. 'sdk: docker' satırı sistemin Dockerfile'ı tanımasını sağlar.",
    fileName: "README.md",
    code: README_CONTENT,
    tips: [
      "README.md dosyasını düzenle diyerek en üste bu içeriği yapıştırın.",
      "app_port: 7860 ayarı, Hugging Face'in konteynere hangi porttan bağlanacağını söyler.",
      "Bu blok olmazsa veya hatalıysa Space 'Building' aşamasına geçemez."
    ]
  },
  {
    id: 3,
    title: "Dockerfile Dosyasını Oluştur",
    description: "n8n'in nasıl kurulacağını ve çalıştırılacağını tarif eden dosyadır. (Bu dosyayı Hugging Face'e ekleyeceksiniz, Render'a değil!)",
    fileName: "Dockerfile",
    code: DOCKERFILE_CONTENT,
    tips: [
      "Hugging Face 7860 portunu bekler. EXPOSE and --port değerlerinin 7860 olduğundan emin olun.",
      "n8n verileri için /data klasörü oluşturulur ve izinleri ayarlanır."
    ]
  },
  {
    id: 4,
    title: "Ortam Değişkenlerini (Variables) Tanımla",
    description: "Güvenlik ve erişim için Settings > Variables and secrets sekmesine gidin.",
    tips: [
      "N8N_ENCRYPTION_KEY: Rastgele bir şifre girin.",
      "WEBHOOK_URL: Space sayfasındaki URL'nizi (örneğin: https://username-spacename.hf.space/) sonuna '/' koyarak ekleyin.",
      "N8N_PORT: 7860 olarak ayarlayın."
    ]
  }
];

export const RENDER_STEPS: Step[] = [
  {
    id: 1,
    title: "Dosyaları GitHub'a Hazırlayın",
    description: "Deponuzda package.json ve server.js olmalı. DOCKERFILE OLMAMALI.",
    tips: [
      "Önemli: Eğer n8n için olan Dockerfile dosyasını deponuzda tutuyorsanız, Render bunu Node projesi sanmaz. Onu deponuzdan çıkarın.",
      "Kök dizinde sadece bu siteye ait dosyalar kalsın."
    ]
  },
  {
    id: 2,
    title: "Render'da Yeni 'Web Service' Oluştur",
    description: "Render panelinde 'New +' butonuna basınca 'Web Service' seçeneğini seçin.",
    tips: [
      "GitHub deponuzu Render'a bağlayın.",
      "Runtime: Mutlaka 'Node' seçin (Docker SEÇMEYİN)."
    ]
  },
  {
    id: 3,
    title: "Web Servisi Ayarları",
    description: "Render'ın uygulamayı çalıştırması için bu ayarları girin:",
    tips: [
      "Build Command: npm install && npm run build",
      "Start Command: npm start",
      "Environment Variables: API_KEY (Gemini için) eklemeyi unutmayın."
    ]
  }
];

export const VARIABLES: Variable[] = [
  { key: "N8N_ENCRYPTION_KEY", description: "Veritabanındaki hassas verileri şifrelemek için kullanılır.", placeholder: "rastgele-bir-anahtar-123" },
  { key: "WEBHOOK_URL", description: "Dış servislerin n8n'e ulaşabilmesi için Space URL'niz.", placeholder: "https://user-space.hf.space/" },
  { key: "N8N_PORT", description: "n8n'in içeride dinlediği port (Dockerfile ile aynı olmalı).", placeholder: "7860" },
  { key: "DB_TYPE", description: "Kalıcı veri için PostgreSQL kullanacaksanız ekleyin.", placeholder: "postgresdb" },
];

export const WORKFLOWS: Workflow[] = [
  {
    name: "YouTube Trend & Gemini Senaryo Yazarı",
    description: "YouTube popüler videolarını çeker ve Gemini 1.5/2.0 modelleriyle bu konularda viral senaryolar üretir.",
    json: `{
  "nodes": [
    {
      "parameters": {
        "url": "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=TR&maxResults=5&key=YOUR_API_KEY",
        "options": {}
      },
      "name": "YouTube Trends",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [250, 300]
    },
    {
      "parameters": {
        "model": "gemini-3-flash-preview",
        "prompt": "=Lütfen şu başlık için yaratıcı bir video senaryosu yaz: {{ $json.snippet.title }}",
        "options": {}
      },
      "name": "Gemini AI",
      "type": "n8n-nodes-base.googleGemini",
      "typeVersion": 1,
      "position": [450, 300]
    }
  ],
  "connections": {
    "YouTube Trends": {
      "main": [
        [
          {
            "node": "Gemini AI",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}`
  }
];

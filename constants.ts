
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
Bu Space, Docker altyapısı kullanılarak n8n çalıştırmak için yapılandırılmıştır.`;

export const STEPS: Step[] = [
  {
    id: 1,
    title: "Yeni Bir Space Oluştur",
    description: "Hugging Face üzerinde yeni bir 'Space' başlatın.",
    tips: [
      "huggingface.co/new-space adresine gidin.",
      "SDK olarak 'Docker' seçin.",
      "Privacy: 'Private' seçilmesi önerilir."
    ]
  },
  {
    id: 2,
    title: "README.md Yapılandırması",
    description: "Hugging Face metadata bloğunu README.md dosyasının en üstüne yapıştırın.",
    fileName: "README.md",
    code: README_CONTENT,
    tips: [
      "sdk: docker satırı çok önemlidir.",
      "app_port: 7860 değerini değiştirmeyin."
    ]
  },
  {
    id: 3,
    title: "Dockerfile Dosyasını Oluştur",
    description: "Bu kodu Hugging Face'deki Dockerfile dosyasına yapıştırın.",
    fileName: "Dockerfile",
    code: DOCKERFILE_CONTENT,
    tips: [
      "Bu dosya n8n'in Hugging Face'de çalışmasını sağlar.",
      "ÖNEMLİ: Bu dosyayı Render'a yüklediğiniz GitHub deposunun ana dizininde TUTMAYIN, Render'ın kafası karışır."
    ]
  }
];

export const RENDER_STEPS: Step[] = [
  {
    id: 1,
    title: "Render 'Runtime' Ayarı",
    description: "Render panelinde 'Settings' kısmına gidin.",
    tips: [
      "Runtime: 'Node' seçilmeli (DOCKER SEÇMEYİN).",
      "Eğer Docker seçili kalırsa 'package.json not found' hatası alırsınız."
    ]
  },
  {
    id: 2,
    title: "Komutları Doğru Yerlere Yazın",
    description: "Render 'Web Service' için şu iki alanı doldurun:",
    tips: [
      "Build Command: npm install && npm run build",
      "Start Command: npm start",
      "Bu komutları 'Docker Command' kısmına değil, kendi alanlarına yazmalısınız."
    ]
  },
  {
    id: 3,
    title: "Environment Variables",
    description: "Uygulamanın çalışması için API anahtarını ekleyin.",
    tips: [
      "Key: API_KEY",
      "Value: Google AI Studio'dan aldığınız anahtar."
    ]
  }
];

export const VARIABLES: Variable[] = [
  { key: "N8N_ENCRYPTION_KEY", description: "Hassas verileri şifrelemek için anahtar.", placeholder: "rastgele-anahtar-123" },
  { key: "WEBHOOK_URL", description: "Space URL'niz (sonunda / olmalı).", placeholder: "https://user-space.hf.space/" }
];

export const WORKFLOWS: Workflow[] = [
  {
    name: "YouTube Trend & Gemini Senaryo Yazarı",
    description: "Trend videoları bulur ve Gemini ile senaryolaştırır.",
    json: `{ "nodes": [], "connections": {} }` // Sadeleştirildi
  }
];

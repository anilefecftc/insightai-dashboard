# 🔍 InsightAI — AI-Powered SaaS Analytics Dashboard

![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-green) ![GPT](https://img.shields.io/badge/AI-GPT--4.1--mini-purple) ![License](https://img.shields.io/badge/License-MIT-yellow)

A full-stack SaaS KPI & Funnel Analytics Dashboard with real-time metrics tracking, A/B testing with statistical analysis, and AI-powered reporting using GPT-4.1-mini.

---

##  Features

- **KPI Dashboard** — 7 core SaaS metrics (DAU, Revenue, Signups, Activation Rate, Retention Rate, Conversion Rate, Churn Rate) with sparklines, trend charts, and drag & drop card reordering
- **Funnel Analysis** — Signup → Activation → Retention → Payment conversion funnel with drop-off detection and critical alerts
- **A/B Testing** — Chi-square statistical analysis with confidence levels and significance badges
- **AI Reports** — GPT-4.1-mini powered automated KPI analysis and weekly executive summaries
- **Metric Detail Pages** — Click any KPI card for 90-day historical breakdown, averages, min/max, and standard deviation
- **Dark/Light Mode** — Full theme support with persistent preference
- **Custom Date Ranges** — Preset periods (7d/14d/30d/60d/90d) and custom date range picker
- **CSV/PDF Export** — Export data from any page
- **Drag & Drop Dashboard** — Reorder KPI cards with persistent layout
- **Login & Register** — Professional auth UI with animated gradient design and password strength indicator

---

##  Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, React Router, Lucide Icons |
| Backend | Python 3.10+, FastAPI, Uvicorn, SQLite |
| AI | OpenAI GPT-4.1-mini |
| Statistics | SciPy (Chi-square test) |
| Fonts | DM Sans, JetBrains Mono |

---

##  Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/anilefecftc/insightai-dashboard.git
cd insightai-dashboard
```

2. **Setup Backend**
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python seed_data.py
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

4. **Configure Environment**
```bash
cp backend/.env.example backend/.env
# Add your OpenAI API key to backend/.env (optional)
```

5. **Run the Application**
```bash
# Terminal 1 — Backend
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

6. **Open** http://localhost:5173

---

##  AI Reports Setup

To enable real AI-powered analysis, add your OpenAI API key to `backend/.env`:

```
OPENAI_API_KEY=sk-your-key-here
```

Without an API key, the dashboard uses smart mock analysis based on live database metrics. When you add a key, real GPT-4.1-mini analysis activates automatically — no code changes needed.

---

##  Dashboard Modules

| Module | Description |
|--------|-------------|
| KPI Dashboard | 7 draggable metric cards with sparklines, change badges, and detail drill-down |
| Funnel Analysis | 4-stage vertical funnel with animated bars and critical drop-off alerts |
| A/B Testing | Control vs Variant comparison with chi-square test and significance verdict |
| AI Reports | Real-time GPT analysis, key insights, recommendations, and weekly executive summaries |

---

##  Authentication

The app includes a login and register flow with:
- Email & password form with validation
- Password strength indicator (Weak / Medium / Strong)
- Social login buttons (Google, GitHub — UI only)
- Animated gradient background with floating dashboard illustrations
- Session persistence via localStorage

> Note: This is a UI-only auth system for demonstration purposes. No real authentication backend is implemented.

---

##  Responsive Design

- **Desktop** (>1280px): Full sidebar + 3-column bento grid
- **Tablet** (768-1280px): Collapsed sidebar + 2-column grid
- **Mobile** (<768px): Hamburger menu + single column stack

---

##  License

This project is licensed under the MIT License.

---

---

# 🇹🇷 Türkçe

#  InsightAI — Yapay Zeka Destekli SaaS Analitik Paneli

Gerçek zamanlı metrik takibi, A/B testi ve GPT-4.1-mini ile yapay zeka destekli raporlama sunan tam yığın (full-stack) bir SaaS KPI ve Dönüşüm Hunisi Analitik Paneli.

---

##  Özellikler

- **KPI Paneli** — 7 temel SaaS metriği (DAU, Gelir, Kayıtlar, Aktivasyon Oranı, Tutundurma Oranı, Dönüşüm Oranı, Kayıp Oranı). Sparkline grafikler, trend çizelgeleri ve sürükle-bırak kart sıralaması
- **Dönüşüm Hunisi Analizi** — Kayıt → Aktivasyon → Tutundurma → Ödeme dönüşüm hunisi. Kayıp noktası tespiti ve kritik uyarılar
- **A/B Testi** — Ki-kare istatistiksel analiz, güven düzeyleri ve anlamlılık rozetleri
- **Yapay Zeka Raporları** — GPT-4.1-mini ile otomatik KPI analizi ve haftalık yönetici özetleri
- **Metrik Detay Sayfaları** — Herhangi bir KPI kartına tıklayarak 90 günlük geçmiş dökümü, ortalamalar, min/max ve standart sapma
- **Karanlık/Aydınlık Mod** — Kalıcı tercih ile tam tema desteği
- **Özel Tarih Aralıkları** — Hazır dönemler (7g/14g/30g/60g/90g) ve özel tarih seçici
- **CSV/PDF Dışa Aktarma** — Herhangi bir sayfadan veri dışa aktarma
- **Sürükle-Bırak Panel** — KPI kartlarını yeniden sıralama, düzen kalıcı olarak saklanır
- **Giriş ve Kayıt** — Animasyonlu gradient tasarımlı profesyonel kimlik doğrulama arayüzü ve şifre güç göstergesi

---

##  Teknoloji Yığını

| Katman | Teknolojiler |
|--------|-------------|
| Ön Yüz (Frontend) | React 18, Vite, Tailwind CSS, Recharts, React Router, Lucide Icons |
| Arka Yüz (Backend) | Python 3.10+, FastAPI, Uvicorn, SQLite |
| Yapay Zeka | OpenAI GPT-4.1-mini |
| İstatistik | SciPy (Ki-kare testi) |
| Yazı Tipleri | DM Sans, JetBrains Mono |

---

##  Kurulum

### Gereksinimler

- Node.js 18+
- Python 3.10+
- Git

### Adımlar

1. **Depoyu klonlayın**
```bash
git clone https://github.com/anilefecftc/insightai-dashboard.git
cd insightai-dashboard
```

2. **Backend kurulumu**
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python seed_data.py
```

3. **Frontend kurulumu**
```bash
cd frontend
npm install
```

4. **Ortam değişkenleri**
```bash
cp backend/.env.example backend/.env
# OpenAI API anahtarınızı backend/.env dosyasına ekleyin (isteğe bağlı)
```

5. **Uygulamayı başlatın**
```bash
# Terminal 1 — Backend
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

6. **Tarayıcıda açın:** http://localhost:5173

---

##  Yapay Zeka Raporları Kurulumu

Gerçek yapay zeka analizini etkinleştirmek için OpenAI API anahtarınızı `backend/.env` dosyasına ekleyin:

```
OPENAI_API_KEY=sk-anahtariniz-buraya
```

API anahtarı olmadan panel, canlı veritabanı metriklerine dayalı akıllı mock analiz kullanır. Anahtar eklediğinizde gerçek GPT-4.1-mini analizi otomatik olarak devreye girer — kod değişikliği gerekmez.

---


---

**React, FastAPI ve GPT-4.1-mini kullanılarak geliştirilmiştir.**

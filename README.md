# Irfan Noor Hidayat — Cloud Engineer & DevOps Portfolio

A modern, high-performance portfolio web application for **Irfan Noor Hidayat**, Cloud Engineer & DevOps Developer based in Jakarta, Indonesia. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and integrated with an **AWS Bedrock** serverless AI assistant.

---

## 🌟 Key Features

### 1. In-Program Database (Zero External DB Setup)
- All portfolio records (career history, education, verified projects, tech stack, certifications, and AI system context) are bundled directly in code: [`src/data/portfolioData.ts`](./src/data/portfolioData.ts).
- No external database (PostgreSQL, MySQL, MongoDB, or Supabase) is required to run the portfolio.

### 2. Job Experience with Company Logo Spaces & Skill Tags
- Dedicated branded logo containers for **PT Panasonic Manufacturing Indonesia**, **Bangkit Academy**, **Wowrack Indonesia**, **Skypro Manajemen Teknologi**, and **PT Media Kreasi Abadi**.
- Interactive skill tags for each role (e.g., `ASP.NET Core`, `Blazor`, `AWS Bedrock`, `SQL Server`, `Power Automate`, `n8n`, `Docker`, `Cloud Run`, `Hapi.js`, `COBIT`, `Laravel`).
- **Interactive Cross-Filtering**: Clicking any skill tag automatically scrolls down and filters the Projects section!

### 3. Dedicated Education Section with Institution Logos
- Showcases higher education journey with branded crest containers:
  - **Politeknik Elektronika Negeri Surabaya (PENS)**: Applied Bachelor's Degree (D4) in Informatics (Graduated March 2026), highlighting Cloud Computing, Microservices, and the SATUSEHAT project.
  - **Politeknik Negeri Samarinda (POLNES)**: Associate's Degree (D3) in Information Technology (2021–2024), highlighting networking, systems administration, and software engineering.

### 4. Multi-Dimensional Project Filtering (12+ Real Projects)
- Loaded with all 12 projects from the portfolio library document:
  - *Proxmox VE with Cloudflare Zero Trust & Tunnel*
  - *WireGuard VPN on AWS EC2*
  - *Serverless RAG Chatbot on AWS Bedrock & Lambda*
  - *PT Bankaltimtara OJK SOP Compliance Audit across 9 Domains (COBIT)*
  - *Cloudraya Android Backend Microservices on GCP (Cloud Run, Cloud Build, Docker, ML)*
  - *SATUSEHAT HL7 FHIR Interoperability Agent (Trustmedis to MoH, master-slave DB)*
  - *JLPT Registration Bot (Playwright on AWS EC2)*
  - *Enterprise HRMS Modernization & People Traffic Control (PTC) at Panasonic*
  - *TalentTrail AI E-Recruitment at Panasonic (AWS Bedrock, Blazor, ASP.NET Core)*
  - *Centralized NGINX Reverse Proxy on GCP VM*
  - *GCP Nested Virtualization (Windows guest on Ubuntu host)*
  - *Azure DevOps Self-Hosted Agent Pool & CI/CD Pipeline*
- **Filters**:
  - **Skill Pills**: Filter by `AWS`, `GCP`, `Docker`, `Cloudflare`, `WireGuard`, `Proxmox`, `Node.js`, `.NET`, `PostgreSQL`, `SQL Server`, `AWS Bedrock`, `CI/CD`, `Playwright`, `HL7 FHIR`, `COBIT`.
  - **Category Tabs**: `All`, `DevOps`, `App Dev`, `IT Governance`, `AI & Cloud`.
  - **Type Tabs**: `All`, `WORK`, `PERSONAL`, `FINAL PROJECT`.
  - **Real-Time Search**: Search by keywords across titles, problems, and tech stacks.
- **Modals**: Full **Case Study Modal** (Problem, Role, Solution, Results, Links) and **AI Explainer Modal**.

### 5. Evidence-Based Tech Stack
- Replaced arbitrary percentage progress bars with categorized domains (*Cloud & Infrastructure*, *DevOps & Security*, *Backend & Databases*, *AI & Automation*).
- Interactive chips show verified project counts (e.g. `Docker · 5 Projects`, `AWS · 3 Projects`) with one-click project filtering.

### 6. AWS Bedrock AI Assistant with IP Rate Limiter
- Server-side route handler at [`/api/chat`](./src/app/api/chat/route.ts) using `@aws-sdk/client-bedrock-runtime`.
- **Strict Rate Limiting**: In-memory rate limiter caps queries at **15 requests per IP address**.
- **Live Quota Display**: `⚡ Quota: 15/15 queries remaining` badge updates in real time.
- **Graceful Fallback**: High-fidelity offline demo engine when AWS credentials are not set in `.env.local`, allowing recruiters to test conversational answers without incurring cloud costs.

### 7. Verified Credential Cards
- Clean certification cards with issuer badges and direct verification links to LinkedIn (AWS Academy Cloud Foundations, Bangkit Academy, BNSP Network Admin, BNSP Data Center, Google Coursera, Dicoding).

### 8. Cyber Aesthetic & Visual Design
- Tailored dark navy & cyber cyan theme (`#0a192f` / `#64ffda`).
- Native HTML5 Canvas particle network animation with smooth 60fps cursor interaction.
- Floating WhatsApp quick-contact action button.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Devicon](https://devicon.dev/)
- **AI Integration**: [@aws-sdk/client-bedrock-runtime](https://docs.aws.amazon.com/bedrock/)
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ or v20+ recommended
- **npm** / **yarn** / **pnpm**

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
# On Windows PowerShell if execution policy blocks scripts:
# npm.cmd install
```

### 3. Development Server
Start the local Next.js development server:
```bash
npm run dev
# Or on Windows:
# npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

### 4. Production Build
Build and run the optimized production bundle:
```bash
npm run build
npm start
# Or on Windows:
# npm.cmd run build
# npm.cmd run start
```

---

## 🔐 Environment Variables (Optional)

The application works out of the box in **Demo Mode** without any API keys. 

To enable live **AWS Bedrock** inference, create a `.env.local` file in the project root:

```env
# AWS Bedrock Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
```

---

## 📁 Project Structure

```
├── .env.example                     # Sample environment variables
├── package.json                     # Project scripts and dependencies
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts               # Custom Tailwind cyber colors & fonts
├── postcss.config.mjs               # PostCSS config
├── next.config.ts                   # Next.js image domain configuration
├── src/
│   ├── app/
│   │   ├── globals.css              # Custom cyber scrollbar and card glow styles
│   │   ├── layout.tsx               # Root layout with fonts & SEO metadata
│   │   ├── page.tsx                 # Main page coordinator with filter states
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts         # Bedrock AI route handler + 5 req/IP rate limiter
│   ├── components/
│   │   ├── Navbar.tsx               # Fixed responsive navigation
│   │   ├── Hero.tsx                 # Hero banner with role highlights & CTAs
│   │   ├── About.tsx                # Bio, languages & profile photo
│   │   ├── Experience.tsx           # Company logo spaces & interactive skill tags
│   │   ├── Education.tsx            # PENS & POLNES with institution logos
│   │   ├── TechStack.tsx            # Evidence-based tech stack with project counts
│   │   ├── Projects.tsx             # Multi-dimensional filter (Skill, Cat, Type, Search)
│   │   ├── ProjectDetailModal.tsx   # Comprehensive case study dialog
│   │   ├── ProjectExplainerModal.tsx# AI architecture deep-dive dialog
│   │   ├── Certifications.tsx       # Verified credential cards linking to LinkedIn
│   │   ├── AiChat.tsx               # Rebuilt Bedrock AI Assistant terminal
│   │   ├── Footer.tsx               # Contact section, social bars & WhatsApp button
│   │   └── ParticlesBackground.tsx  # Native 60fps HTML5 Canvas particle mesh
│   ├── data/
│   │   └── portfolioData.ts         # In-program database (all projects & experiences)
│   └── lib/
│       ├── bedrock.ts               # AWS Bedrock runtime client & demo engine
│       └── rateLimit.ts             # In-memory IP rate limiter (5 req/IP)
```

---

## 📬 Contact & Connect

- **Name**: Irfan Noor Hidayat
- **Email**: [irfannoorh@gmail.com](mailto:irfannoorh@gmail.com)
- **WhatsApp**: [+6287784312184](https://wa.me/6287784312184)
- **LinkedIn**: [linkedin.com/in/irfan-noor-hidayat-5847b2156](https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/)
- **GitHub**: [github.com/ChaosO9](https://github.com/ChaosO9)

---

Designed & Built with ❤️ by Irfan Noor Hidayat.

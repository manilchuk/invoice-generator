<div align="center">

# 🧾 InvoiceFlow

**Invoice generator for Ukrainian entrepreneurs, freelancers, and small businesses.**

Create professional PDF invoices in 30 seconds. No registration fees, no hidden costs.

[Live Demo](https://fopdop.xyz) ·
[Report Bug](https://github.com/manilchuk/invoice-generator/issues) ·
[Request Feature](https://github.com/manilchuk/invoice-generator/issues)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📖 About

InvoiceFlow is a web application that helps Ukrainian FOPs (sole traders), freelancers, and small
businesses create professional PDF invoices quickly and efficiently.

**The problem:** Creating invoices manually in Word or Excel takes 5-15 minutes each time —
copy-pasting requisites, resizing logos, manual numbering.

**The solution:** InvoiceFlow saves your requisites once and generates a branded PDF invoice in 30
seconds.

---

## ✨ Features

- 🔐 **Authentication** — Sign up, sign in, password reset via email
- 🏢 **Company Profile** — Save your FOP details (name, tax ID, IBAN, bank) once
- 🖼️ **Logo Upload** — Upload your logo, it appears on every invoice
- 👥 **Client Management** — Save clients for repeat invoices
- 📄 **PDF Generation** — Professional invoices with Ukrainian formatting
- 🔢 **Sequential Numbering** — Auto-generated invoice numbers (YYYY-MM-0001)
- 📊 **Invoice Status** — Track invoices (draft / sent / paid)
- 📱 **Responsive** — Works on desktop, tablet, and mobile
- 🌙 **Dark Mode** _(planned)_
- 🎨 **Custom Templates** _(planned)_

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** (App Router, Server Components, Server Actions)
- **React 19**
- **TypeScript**
- **CSS Modules**

### Backend

- **Supabase** — PostgreSQL + Auth + Storage
- **Server Actions** — Form submissions and mutations
- **Row Level Security** — Per-user data isolation

### PDF Generation

- **@react-pdf/renderer** — React-based PDF generation
- **Roboto Fonts** — Cyrillic support

### Email

- **Resend** — Transactional emails
- **Custom SMTP** — Configured in Supabase for branded emails

### Deployment & Monitoring

- **Vercel** — Hosting and CI/CD
- **Google Analytics 4** — Usage analytics
- **Custom domain** — `fopdop.xyz` via NIC.UA

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- A Supabase account — [sign up free](https://supabase.com)
- A Resend account — [sign up free](https://resend.com) _(optional, for production emails)_

### 1. Clone the repository

```bash
git clone https://github.com/manilchuk/invoice-generator.git
cd invoice-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create `.env.local` in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPPORT_URL=https://send.monobank.ua/jar/your_jar_id
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
ADMIN_EMAIL=your_email@example.com
```

### 4. Setup Supabase database

Create tables in Supabase SQL Editor:

- `profiles` — user requisites
- `clients` — saved clients
- `invoices` — invoices with items
- Enable Row Level Security on all tables
- Create trigger `handle_new_user` for auto-profile creation
- Create SQL functions for admin metrics

### 5. Setup Supabase Storage

Create a **public** bucket `logos` with RLS policies:

```sql
-- INSERT
create policy "Users can upload own logo"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'logos'
  and (storage.foldername(name))[1] = (auth.uid())::text
);
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages
│   ├── api/                 # API routes (PDF)
│   ├── dashboard/           # Protected area
│   │   ├── invoices/        # Invoice detail
│   │   ├── metrics/         # Admin metrics
│   │   ├── new/             # Create invoice
│   │   └── settings/        # Company profile
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── analytics/           # Google Analytics
│   ├── dashboard/           # Dashboard widgets
│   ├── invoice/             # Invoice forms
│   └── ui/                  # Reusable UI
├── lib/
│   ├── pdf/                 # PDF + fonts
│   └── supabase/            # Supabase clients
├── types/                   # TypeScript types
└── proxy.ts                 # Middleware
```

---

## 🔐 Security

- **Row Level Security** — users access only their own data
- **Server-side authentication** — all checks on server
- **Admin-only pages** — via `ADMIN_EMAIL`
- **Environment secrets** — service role key never exposed
- **HTTPS** — enforced by Vercel

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository on [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy

Vercel automatically:

- Builds the project
- Issues SSL certificate
- Deploys on every `git push`

### Custom Domain

1. Buy a domain (NIC.UA, Namecheap, Cloudflare)
2. Add it in Vercel → Settings → Domains
3. Update DNS records (A + CNAME)
4. Update Supabase Redirect URLs

---

## 🗺️ Roadmap

### ✅ Done

- [x] Authentication (register, login, logout, password reset)
- [x] Company profile with logo upload
- [x] Client management
- [x] Invoice creation with sequential numbering
- [x] PDF generation with Cyrillic support
- [x] Invoice statuses (draft, sent, paid)
- [x] Dashboard with invoice list
- [x] Admin metrics dashboard
- [x] SEO + OpenGraph metadata
- [x] Custom domain + HTTPS
- [x] Branded email via Resend

### 🚧 In Progress

- [ ] Payment integration (LiqPay / Stripe)
- [ ] Freemium model (3 free invoices)

### 📅 Planned

- [ ] Invoice editing
- [ ] Duplicate invoice
- [ ] Email invoices to clients
- [ ] Multiple invoice templates
- [ ] Multi-currency support
- [ ] Export to Excel/CSV
- [ ] Recurring invoices
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Valentyn Manilchuk** — [manilchuk.v@gmail.com](mailto:manilchuk.v@gmail.com)

Project Link:
[https://github.com/manilchuk/invoice-generator](https://github.com/manilchuk/invoice-generator)

Live Demo: [https://fopdop.xyz](https://fopdop.xyz)

---

<div align="center">

**⭐ If you find this project useful, please give it a star!**

Made with ❤️ in Ukraine 🇺🇦

</div>

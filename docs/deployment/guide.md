# PSU Rizal - Academic Collaboration Platform

A unified platform for Palawan State University (PSU) Rizal, enabling seamless virtual interaction, academic management, and collaboration for students and faculty.

## 🚀 Quick Deploy

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal)

1. Click the "Deploy to Vercel" button above
2. Connect your GitHub account
3. Configure environment variables (see below)
4. Deploy!

### Deploy to Replit

[![Run on Replit](https://replit.com/badge/github/PROJECT01GALAHADD/COM-PSU-Rizal)](https://replit.com/github/PROJECT01GALAHADD/COM-PSU-Rizal)

1. Click "Run on Replit"
2. Fork the repository
3. Add environment variables in Secrets
4. Click Run!

## 📋 Environment Variables

Create a `.env.local` file with the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# JWT Secret (generate a random string)
JWT_SECRET=your_random_jwt_secret
```

### Get Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the values:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to Settings > Auth > JWT Secret
   - Copy → `SUPABASE_JWT_SECRET` and `JWT_SECRET`

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/PROJECT01GALAHADD/COM-PSU-Rizal.git
cd COM-PSU-Rizal

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🗄️ Database Setup

The application uses Supabase for backend services. Migrations are located in `supabase/migrations/`.

### Apply Migrations

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the migration files in order

Or use the Supabase CLI:

```bash
pnpm supabase:install
pnpm supabase:migrate
```

## 🎯 Features

- **Video Conferencing** - Real-time meetings with WebRTC
- **Guest Access** - Join meetings without an account
- **Academic Management** - Course tracking and submissions
- **Role-Based Access** - Student, Faculty, and Admin roles
- **Responsive Design** - Works on desktop and mobile

## 📚 Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **WebRTC**: Native WebRTC API
- **Deployment**: Vercel / Replit

## 🔧 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run tests
```

## 📖 Documentation

- [Setup Guide](./SETUP-COMPLETE.md)
- [Supabase Configuration](./SUPABASE-CONFIGURATION-COMPLETE.md)
- [Deployment Guide](./DEPLOYMENT-READY.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Contact the development team

---

**Built with ❤️ for PSU Rizal Community**

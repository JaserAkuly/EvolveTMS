# Evolve TMS - Transportation Management System

A comprehensive Transportation Management System (TMS) built with Next.js 14, Supabase, and shadcn/ui. This application manages the complete shipment lifecycle for transportation brokerages.

## 🚀 Features

- **Complete Shipment Lifecycle Management**: From creation to delivery and invoicing
- **Role-Based Access Control**: Admin, Carrier, Shipper, and Viewer roles
- **Real-time Status Updates**: Track shipments through all stages
- **Document Management**: BOL, POD, and invoice generation
- **Financial Tracking**: AR/AP management and reporting
- **CSV Export**: Export data from any table
- **Modern UI**: Dark mode by default with shadcn/ui components
- **Mobile Responsive**: Works on all device sizes

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **PDF Generation**: React-PDF

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evolve-tms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   ```bash
   # Initialize Supabase (if not already done)
   npx supabase init
   
   # Start local Supabase (optional)
   npx supabase start
   
   # Or link to your remote project
   npx supabase link --project-ref your-project-ref
   
   # Apply migrations
   npx supabase db push
   
   # Seed the database with sample data
   npx supabase db seed
   ```

4. **Configure environment variables**
   
   Copy `.env.local.example` to `.env.local` and update with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Accounts

The application comes with pre-configured demo accounts:

| Role | Email | Password | Access Level |
|------|--------|-----------|--------------|
| Admin | admin@evolve.local | password123 | Full system access |
| Carrier | carrier@evolve.local | password123 | Limited to assigned loads |
| Shipper | shipper@evolve.local | password123 | View shipments & invoices |
| Viewer | viewer@evolve.local | password123 | Read-only access |

## 🚛 Shipment Lifecycle

The system manages the complete shipment workflow:

1. **Created** → Admin creates a load
2. **Tendered** → Load offered to carriers  
3. **Booked** → Carrier accepts the load
4. **In Transit** → Shipment en route
5. **Delivered** → Delivery completed
6. **Closed** → Invoice generated and paid

## 📊 Database Schema

Key tables include:

- **profiles**: User roles and information
- **carriers**: Carrier details and credentials
- **shippers**: Customer information
- **locations**: Pickup and delivery locations
- **loads**: Core shipment data
- **documents**: BOL, POD, invoices
- **invoices**: Billing information
- **settlements**: Carrier payments
- **journal_entries**: Financial tracking

## 🎨 Branding

- **Primary Color**: Navy Slate (#0F172A)
- **Accent Color**: Teal (#00BFA6) 
- **Secondary Color**: Yellow (#FACC15)
- **Font**: Inter
- **Design**: Minimal, dashboard-style (Linear/Vercel inspired)

## 🚀 Deployment

### Vercel Deployment

1. **Connect to GitHub**
   ```bash
   # Create GitHub repository
   git remote add origin https://github.com/yourusername/evolve-tms.git
   git push -u origin main
   
   # Create dev branch
   git checkout -b dev
   git push -u origin dev
   ```

2. **Deploy to Vercel**
   - Import your repository at [vercel.com/new](https://vercel.com/new)
   - Select "Next.js" framework preset
   - Add environment variables in Vercel dashboard
   - Configure branch deployments (main = production, dev = staging)

3. **Environment Variables in Vercel**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### Supabase Production Setup

1. Create a new Supabase project for production
2. Run migrations: `npx supabase db push`
3. Seed database: Run the seed.sql file in the SQL editor
4. Configure Row Level Security policies
5. Set up authentication providers if needed

## 📁 Project Structure

```
evolve-tms/
├── app/                    # Next.js 14 App Router
│   ├── contexts/          # React contexts (Auth)
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication
│   ├── shipments/        # Shipment management
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utilities and configs
├── supabase/           # Database migrations and config
│   ├── migrations/     # SQL migrations
│   └── seed.sql        # Sample data
└── public/             # Static assets
```

## 🔧 Development Commands

```bash
# Development
npm run dev                # Start dev server
npm run build             # Build for production
npm run start             # Start production server
npm run lint              # Run ESLint

# Supabase
npx supabase start        # Start local Supabase
npx supabase stop         # Stop local Supabase
npx supabase db push      # Push migrations
npx supabase db pull      # Pull remote schema
npx supabase db reset     # Reset local database
```

## 📈 Features Roadmap

- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] API integrations (DAT, Carrier411)
- [ ] Mobile app
- [ ] Advanced document OCR
- [ ] Route optimization
- [ ] EDI integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@evolve-tms.com or create an issue in the GitHub repository.

---

**Built with ❤️ using Next.js, Supabase, and shadcn/ui**
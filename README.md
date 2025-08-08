# So plugged Marketplace MVP

A minimal viable product for connecting creators with brands, built with React and Supabase.

## Features

- **Authentication**: Email/password signup and login using Supabase Auth
- **Multi-step Onboarding**: 3-step process to collect creator profile information
- **Dashboard**: Shows creator profile and matching brief opportunities
- **Brief Submission**: Allows brands to submit project briefs
- **Skill Matching**: Automatically shows briefs that match creator skills

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd creator-brand-marketplace
npm install
```

### 2. Environment Variables

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Add Supabase credentials to `.env`:

REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

### 3. Supabase Database Setup

Create the following tables in your Supabase database:

#### Table: userssop

```sql
CREATE TABLE userssop (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  availability TEXT,
  rate NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE userssop ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON userssop FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON userssop FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON userssop FOR INSERT WITH CHECK (auth.uid() = id);
```

#### Table: briefs

```sql
CREATE TABLE briefs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read briefs
CREATE POLICY "All users can view briefs" ON briefs FOR SELECT TO authenticated USING (true);

-- Allow all authenticated users to create briefs
CREATE POLICY "All users can create briefs" ON briefs FOR INSERT TO authenticated WITH CHECK (true);
```

### 4. Run the Application

```bash
npm/bun start
```

The app will be available at `http://localhost:3000`.

## Customization

### Branding

The app uses CSS variables for easy customization. Update the following in `src/index.css`:

1. **Colors**: Update the `:root` CSS variables at the top of the file
2. **Fonts**: Replace the Google Fonts link in `public/index.html` and update the `--font-family`: "Plus Jakarta Sans", "Plus Jakarta Sans Fallback"
3. **Logo**: Replace "CreatorBridge" text in `src/components/Navbar.js` with your logo
4. **App Name**: Update the title and meta tags in `public/index.html`

### Categories

Update the categories array in both:

- `src/pages/Onboarding.js`
- `src/pages/SubmitBrief.js`

## Project Structure

src/
├── components/
│   ├── Navbar.js          # Navigation component
│   └── ProtectedRoute.js  # Route protection wrapper
├── pages/
│   ├── Login.js           # Login page
│   ├── Signup.js          # Signup page
│   ├── Onboarding.js      # 3-step onboarding flow
│   ├── Dashboard.js       # Creator dashboard
│   └── SubmitBrief.js     # Brief submission form
├── supabaseClient.js      # Supabase configuration
├── index.css              # Global styles and CSS variables
├── index.js               # App entry point
└── App.js                 # Main app component with routing

## User Flow

1. **Authentication**: Users sign up or log in
2. **Onboarding**: New users complete 3-step profile setup
3. **Dashboard**: Creators see their profile and matching briefs
4. **Brief Submission**: Brands can submit project briefs
5. **Skill Matching**: System shows briefs matching creator skills

## Available Scripts

- `npm start`: Runs the development server
- `npm run build`: Builds the app for production
- `npm test`: Runs tests
- `npm run eject`: Ejects from Create React App

## Deployment

This app can be deployed to any static hosting service:

1. **Netlify/Vercel**: Connect your GitHub repo for automatic deployments
2. **Build**: Run `npm run build` to create optimized production build
3. **Environment Variables**: Set your Supabase credentials in your hosting platform's environment variables

## Next Steps

This MVP provides the foundation for a creator-brand marketplace. Consider adding:

- Application management system
- Messaging between creators and brands
- Project management features
- Payment integration
- Advanced search and filtering
- Reviews and ratings
- File upload capabilities

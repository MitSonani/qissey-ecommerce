# Supabase Backend Setup Guide

This guide will help you set up Supabase as the backend for your e-commerce application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: `qissey-ecommerce` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click **"Create new project"**
6. Wait for the project to be provisioned (takes ~2 minutes)

## Step 2: Run the Database Schema

1. In your Supabase project dashboard, click on the **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste it into the SQL editor
5. Click **"Run"** to execute the schema
6. Verify the tables were created:
   - Go to **Table Editor** in the left sidebar
   - You should see: `products`, `collections`, `orders`, `order_items`
   - The `products` table should have 4 sample products

## Step 3: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`
4. Copy these values (you'll need them in the next step)

## Step 4: Configure Local Environment

1. Open the `.env.local` file in the project root
2. Replace the placeholder values with your actual Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Save the file
4. **Restart your development server** for the changes to take effect:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

## Step 5: Test Locally

1. Open your browser to `http://localhost:5173`
2. Navigate to a product detail page
3. You should see the product data loaded from Supabase
4. Check the browser console for any errors

## Step 6: Configure Netlify Deployment

### Option A: Deploy via Netlify UI

1. Push your code to GitHub
2. Go to [https://app.netlify.com](https://app.netlify.com)
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect to your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add environment variables:
   - Click **"Show advanced"** → **"New variable"**
   - Add `VITE_SUPABASE_URL` with your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your Supabase anon key
7. Click **"Deploy site"**

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init

# Set environment variables
netlify env:set VITE_SUPABASE_URL "your_supabase_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"

# Deploy
netlify deploy --prod
```

## Step 7: Verify Production Deployment

1. Visit your deployed Netlify URL
2. Navigate to product pages
3. Verify products load correctly
4. Check browser console for errors
5. Test cart functionality

## Optional: Set Up Supabase Storage (for future image uploads)

If you plan to upload product images directly to Supabase:

1. In Supabase dashboard, go to **Storage** in the left sidebar
2. Click **"Create a new bucket"**
3. Name it `product-images`
4. Set it to **Public** bucket
5. Click **"Create bucket"**
6. Configure storage policies as needed for your admin panel

## Troubleshooting

### Products not loading
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure Supabase project is running (check dashboard)
- Verify the SQL schema was executed successfully

### Build errors on Netlify
- Check build logs in Netlify dashboard
- Ensure environment variables are set in Netlify
- Verify `netlify.toml` is in the project root

### CORS errors
- Supabase allows all origins by default for the anon key
- If you see CORS errors, check your Supabase project settings

## Next Steps

- Add more products via Supabase Table Editor
- Set up authentication for user accounts
- Implement order management
- Create an admin panel for product management

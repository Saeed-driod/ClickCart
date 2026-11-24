# 🛒 ClickCart — Full-Featured E-Commerce Store

**ClickCart** is a modern, production-ready, full-stack e-commerce web application engineered with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **Neon Postgres**, **NextAuth.js**, and **Zustand**. It is fully optimized for single-click deployment to **Vercel** with zero paid dependencies.

---

## 🌟 Key Features

### 🛍️ Customer-Facing Storefront
- **Dynamic Home Page**:
  - Hero banner with quick navigation to catalog & mega discounts
  - Department tiles for 8 categories with live product count
  - Limited-time **Flash Deals** section with real-time countdown timer
  - Handpicked **Featured Products** & **New Arrivals**
  - Trust indicators: 100% Genuine Guarantee, 7-Day Returns, 24/7 Helpline
- **Extensive Catalog (200+ Products)**:
  - Pre-seeded with 215 realistic products across 8 core categories:
    - 📱 **Electronics** (Smartphones, Noise-Cancelling Headphones, 4K Monitors, Smartwatches)
    - 👗 **Fashion** (Oxford Shirts, Denim Jackets, Leather Boots, Evening Dresses)
    - 🍳 **Home & Kitchen** (Air Fryers, Espresso Machines, Damascus Chef Knives, Dutch Ovens)
    - 💄 **Beauty & Care** (Hyaluronic Acid Serums, Retinol Creams, Perfumes, Clay Masks)
    - 🏃 **Sports & Fitness** (Air Zoom Running Shoes, Alignment Yoga Mats, Dumbbells)
    - 🎮 **Toys & Games** (Space Building Sets, Remote Buggies, Monopoly, Educational Robots)
    - 📚 **Books & Stationery** (Atomic Habits, Clean Code, System Design, Sapiens)
    - 🥑 **Groceries & Gourmet** (Extra Virgin Olive Oil, Raw Honey, Basmati Rice, Coffee Beans)
- **Advanced Product Listing & Filters**:
  - Live search with instant filtering
  - Multi-department filter (Category, Brand, Price Range PKR min/max, Star Rating, In-Stock Only)
  - Sorting options: Price (Low to High, High to Low), Newest, Rating, Popularity
  - Dynamic pagination controls
- **Rich Product Detail Pages (`/products/[slug]`)**:
  - Multi-image zoom gallery with clickable thumbnails
  - Price display with real-time discount savings calculation in PKR (₨)
  - Stock availability badges ("In Stock", "Only X left", "Out of Stock")
  - Quantity selector with stock boundary protection
  - Tabbed sections for Overview, Specifications, and Shipping terms
  - Verified buyer star ratings and customer review submission
  - Related products recommendation carousel
- **Persistent Cart & Checkout**:
  - Add to cart, adjust quantities, delete items
  - Promotional coupon engine (**`WELCOME10`** for 10% off, **`CLICK20`** for 20% off, **`FLAT500`** for ₨ 500 off)
  - Free express delivery indicator on orders over ₨ 3,000 threshold
  - State persisted via **Zustand** (`localStorage` & database synchronization)
  - Full shipping address form tailored for Pakistani cities (Islamabad, Karachi, Lahore, Rawalpindi, etc.)
  - Default payment method: **Cash on Delivery (COD)** with optional Stripe flag
- **Order Confirmation & Live Tracking (`/orders/[id]` & `/order-tracking`)**:
  - Visual tracking progress timeline (**Pending → Processing → Shipped → Delivered**)
  - Courier tracking number generation (TCS / Leopard / CallCourier format)
  - Print-friendly invoice generation (`window.print()`)
  - Public order tracking page searchable by Order ID or Tracking Number
- **User Accounts & Wishlists**:
  - User profile with order history and delivery address management
  - Dedicated wishlist page with heart toggle on all product cards
  - Dark mode toggle with seamless system theme synchronization (`next-themes`)
  - Multi-currency switcher (**PKR ₨** default, USD $, EUR €, GBP £, AED)

---

### 🛡️ Admin Management Panel (`/admin`)
- **Role-Based Security**: Protected route accessible exclusively to users with `ADMIN` role.
- **Executive KPI Dashboard**:
  - Total Revenue, Orders Processed, Active Customers, Low-Stock Warnings
  - Interactive Sales Volume Chart (last 30 days)
  - Sales Distribution by Department
  - Recent transactions table with instant status updates
- **Product Inventory Management (Full CRUD)**:
  - Add, edit, or delete products
  - Upload multiple product images (Cloudinary integration + fallback URLs)
  - Price, sale price, stock count, SKU, department category, brand
  - Active/Inactive status toggle
  - Bulk actions (bulk delete selected items)
- **Categories & Brands Management (CRUD)**:
  - Add and manage departments and manufacturer brands
- **Order Processing & Fulfillment**:
  - Filter orders by status (Pending, Processing, Shipped, Delivered, Cancelled)
  - Update courier tracking numbers and dispatch notes
  - Print-ready packing slips and invoices
- **Customer Management**:
  - Customer directory with total orders placed, spend volume, and active/deactivate toggle
- **Coupons Management**:
  - Create promotional vouchers (percentage or flat discount, minimum order, expiry date)
- **Reviews Moderation**:
  - Approve or reject customer reviews before they appear on the public storefront
- **Store Configuration**:
  - Update store name, helpline phone, support email, shipping fee, free shipping threshold

---

## 🔑 Demo Credentials

| Role | Email | Password | Access URL |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@clickcart.com` | `Admin@123` | [/admin](http://localhost:3000/admin) |
| **Customer** | `customer@clickcart.com` | `Customer@123` | [/account](http://localhost:3000/account) |

*Note: You can also use the **1-Click Instant Demo Login** buttons on the [/auth/signin](http://localhost:3000/auth/signin) page.*

---

## 🚀 Quick Start (Run Locally)

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd ClickCart
npm install
```

### 2. Environment Variables Configuration
Copy the template environment variables:
```bash
cp .env.example .env
```
Default `.env` values work out of the box with zero external dependencies!

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🗄️ Database Setup & Seeding (Neon Postgres)

ClickCart uses **Prisma ORM** with **PostgreSQL**. To connect a live cloud database on the free tier:

1. Create a free PostgreSQL database at [Neon.tech](https://neon.tech).
2. Copy your connection string into `.env`:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@<ep-id>.neon.tech/neondb?sslmode=require"
   ```
3. Push the database schema:
   ```bash
   npm run prisma:push
   ```
4. Seed the database with 200+ products, categories, coupons, and demo accounts:
   ```bash
   npm run prisma:seed
   ```

*Note: Even without configuring a live database URL, ClickCart features an automatic high-performance in-memory repository fallback. The entire catalog of 200+ products, cart, checkout, search, filters, order tracking, and admin dashboard work seamlessly offline!*

---

## ☁️ Vercel Deployment Checklist (Zero Paid Services)

ClickCart is optimized to build and deploy to **Vercel** with a single click.

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: complete ClickCart production store"
git branch -M main
git remote add origin https://github.com/<your-username>/ClickCart.git
git push -u origin main
```

### Step 2: Import Project on Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your `ClickCart` GitHub repository.
3. Framework Preset: **Next.js** (automatically detected).
4. Root Directory: `./`

### Step 3: Configure Environment Variables in Vercel
In the Vercel project settings, add the following environment variables:

| Variable Name | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon Postgres URL (free tier) | `postgresql://<user>:<pwd>@<host>.neon.tech/neondb?sslmode=require` |
| `NEXTAUTH_SECRET` | Strong secret for JWT session encryption | Random 32+ character string (e.g. run `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Production URL of your deployed store | `https://your-clickcart-app.vercel.app` |
| `NEXT_PUBLIC_STORE_NAME` | Public brand name | `ClickCart` |
| `NEXT_PUBLIC_CURRENCY_SYMBOL` | Currency symbol | `₨` |
| `NEXT_PUBLIC_DEFAULT_CURRENCY`| Default currency code | `PKR` |
| `CLOUDINARY_CLOUD_NAME` | Free Cloudinary Cloud Name (optional) | `demo` or your free account cloud name |
| `CLOUDINARY_API_KEY` | Free Cloudinary API Key (optional) | `<your-cloudinary-key>` |
| `CLOUDINARY_API_SECRET` | Free Cloudinary API Secret (optional) | `<your-cloudinary-secret>` |
| `ENABLE_STRIPE` | Stripe payment gateway toggle | `false` (Cash on Delivery enabled by default) |

### Step 4: Click Deploy!
Vercel will run:
```bash
npm run build
```
The build executes `prisma generate && next build`, generating all static routes, SEO metadata (`sitemap.xml`, `robots.txt`), and serverless API endpoints.

---

## 📂 Project Architecture

```
ClickCart/
├── app/                        # Next.js 14 App Router
│   ├── account/               # Customer account profile & orders
│   ├── admin/                 # Protected Admin Portal (/admin)
│   │   ├── categories/        # Categories & Brands CRUD
│   │   ├── coupons/           # Promotional Coupons CRUD
│   │   ├── customers/         # Customer account directory
│   │   ├── orders/            # Order fulfillment & status updates
│   │   ├── products/          # Product inventory CRUD
│   │   ├── reviews/           # Customer reviews moderation
│   │   ├── settings/          # Store shipping & contact parameters
│   │   └── page.tsx           # Admin Executive Dashboard
│   ├── api/                   # Serverless API routes
│   │   ├── auth/[...nextauth] # NextAuth session & credentials handler
│   │   ├── coupons/           # Coupon validation & listing
│   │   ├── orders/            # Order creation & tracking updates
│   │   ├── products/          # Product queries & catalog filters
│   │   └── upload/            # Cloudinary image upload endpoint
│   ├── auth/signin/           # NextAuth login & 1-click demo access
│   ├── cart/                  # Shopping cart with coupon engine
│   ├── checkout/              # Shipping address & COD order placement
│   ├── order-tracking/        # Public order tracking by Order ID
│   ├── orders/[id]/           # Order confirmation & printable invoice
│   ├── products/              # Catalog with faceted search & filters
│   │   └── [slug]/            # Product detail view with reviews
│   ├── wishlist/              # Wishlist gallery
│   ├── layout.tsx             # Root layout with providers & nav
│   ├── page.tsx               # Storefront homepage
│   ├── robots.ts              # SEO Robots.txt
│   └── sitemap.ts             # Dynamic XML Sitemap
├── components/                # Reusable UI components
│   ├── currency-switcher.tsx  # Multi-currency switcher (PKR default)
│   ├── footer.tsx             # Storefront footer
│   ├── navbar.tsx             # Header with search, cart badge, auth
│   ├── product-card.tsx       # Reusable Product Card with ratings
│   ├── product-detail-view.tsx# Interactive product detail gallery
│   ├── products-filter.tsx    # Multi-attribute filter sidebar
│   ├── providers.tsx          # Session, Theme, & Toast providers
│   ├── theme-toggle.tsx       # Light / Dark mode toggle
│   └── ui/                    # shadcn/ui buttons, inputs, badges
├── data/
│   └── seed-data.ts           # 215 curated seed products across 8 categories
├── lib/
│   ├── auth.ts                # NextAuth options & role authorization
│   ├── currency.ts            # PKR money formatting & exchange rates
│   ├── db.ts                  # Resilient database repository layer
│   ├── prisma.ts              # PrismaClient singleton instance
│   └── utils.ts               # Tailwind cn, slugify, formatDate helpers
├── prisma/
│   ├── schema.prisma          # PostgreSQL schema (User, Product, Order, etc.)
│   └── seed.ts                # Complete database seeding script
├── stores/                    # Zustand state management
│   ├── cart-store.ts          # Cart persistence & totals
│   ├── currency-store.ts      # Active currency selection
│   └── wishlist-store.ts      # Wishlist persistence
├── .env.example               # Template environment configuration
├── package.json               # Dependencies & build scripts
└── tailwind.config.ts         # Tailwind design system configuration
```

---

## 📜 License
MIT License. Built for performance, high conversion, and reliability.

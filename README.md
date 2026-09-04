# EKAS Healthy Foods - Modern E-Commerce Web App

A premium, modern e-commerce web application for EKAS Healthy Foods, built with Next.js, Tailwind CSS, and TypeScript.

## 🌟 Features

- **Premium UI/UX**: Inspired by modern D2C brands, featuring smooth animations, glassmorphism, and a clean, organic aesthetic.
- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop.
- **Product Management**: 
  - Product Listing Page with filters and sorting.
  - Detailed Product Page with image galleries and quantity selectors.
- **Shopping Cart**: Fully functional cart UI with state management.
- **Performance**: Optimized with Next.js App Router and Server Components.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS, CSS Modules
- **Icons**: Lucide React
- **Animations**: CSS Keyframes (Tailwind)
- **Font**: Geist Sans (Sans-serif), Playfair Display (Serif)

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open Browser**:
    Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with Navbar & Footer
│   ├── page.tsx         # Landing Page
│   ├── shop/            # Product Listing
│   ├── product/[id]/    # Product Details
│   └── cart/            # Shopping Cart
├── components/
│   ├── home/            # Landing page sections (Hero, Categories, etc.)
│   ├── layout/          # Global layout components (Navbar, Footer)
│   └── ui/              # Reusable UI components (ProductCard, etc.)
├── lib/
│   └── utils.ts         # Utility functions (cn, etc.)
└── public/
    └── images/          # Static assets
```

## 🎨 Design System

- **Primary Color**: Deep Forest Green (`#2D5C35`) - Represents nature and organic purity.
- **Secondary Color**: Golden Harvest (`#D9A528`) - Represents premium quality and traditional methods.
- **Background**: Soft Cream (`#FDFAF5`) - Provides a warm, organic feel compared to stark white.

C:\projects\foremade-frontend\
├── public/                     # Static assets served as-is
│   ├── favicon.ico             # Favicon
│   ├── logo.png                # App logo
├── src/                        # Source code
│   ├── assets/                 # Static assets (images, icons)
│   │   ├── images/
│   │   │   ├── hero1.jpg       # Carousel images for homepage
│   │   │   ├── hero2.jpg
│   │   ├── icons/
│   │   │   ├── cart.svg        # Boxicons or custom icons (e.g., cart, user)
│   ├── components/             # Reusable UI components
│   │   ├── common/             # Shared components
│   │   │   ├── Button.jsx      # Reusable button
│   │   │   ├── Input.jsx       # Reusable input field
│   │   │   ├── Spinner.jsx     # Loading spinner
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.jsx      # Navbar with search, cart, user links
│   │   │   ├── Footer.jsx      # Footer with links
│   │   │   ├── Sidebar.jsx     # Mobile sidebar for categories
│   │   ├── home/               # Homepage-specific components
│   │   │   ├── Carousel.jsx    # Hero image carousel (eBay-like)
│   │   │   ├── CategoryList.jsx # Category links
│   │   │   ├── ProductCard.jsx # Product preview card
│   │   ├── product/            # Product-related components
│   │   │   ├── ProductList.jsx # Product grid
│   │   │   ├── ProductDetails.jsx # Product detail page
│   │   │   ├── ProductFilter.jsx # Filters (price, category)
│   │   ├── cart/               # Cart-related components
│   │   │   ├── CartItem.jsx    # Single cart item
│   │   │   ├── CartSummary.jsx # Cart totals
│   │   ├── checkout/           # Checkout components
│   │   │   ├── CheckoutForm.jsx # Shipping/payment form
│   │   │   ├── OrderSummary.jsx # Order details
│   │   ├── auth/               # Authentication components
│   │   │   ├── Login.jsx       # Login form
│   │   │   ├── Register.jsx    # Registration form
│   │   ├── seller/             # Seller dashboard components
│   │   │   ├── ProductForm.jsx # Add/edit product form
│   │   │   ├── SellerDashboard.jsx # Seller overview
│   │   │   ├── OrderList.jsx   # Seller’s order history
│   ├── pages/                  # Page components (routes)
│   │   ├── Home.jsx            # Homepage
│   │   ├── Products.jsx        # Product listing page
│   │   ├── Product.jsx         # Single product page
│   │   ├── Cart.jsx            # Cart page
│   │   ├── Checkout.jsx        # Checkout page
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Register page
│   │   ├── Seller.jsx          # Seller dashboard page
│   │   ├── NotFound.jsx        # 404 page
│   ├── context/                # React Context for state
│   │   ├── AuthContext.jsx     # User auth state
│   │   ├── CartContext.jsx     # Cart state
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.js          # Auth-related logic
│   │   ├── useCart.js          # Cart-related logic
│   │   ├── useProducts.js      # Product fetching logic
│   ├── utils/                  # Utility functions
│   │   ├── api.js              # Axios instance for API calls
│   │   ├── formatPrice.js      # Format currency
│   ├── styles/                 # Custom CSS
│   │   ├── main.css            # Tailwind output and custom styles
│   ├── App.jsx                 # Main app component (routes)
│   ├── main.jsx                # Entry point (Vite-specific)
├── index.html                  # Root HTML file (Vite places it here)
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration for Tailwind
├── .env                        # Environment variables
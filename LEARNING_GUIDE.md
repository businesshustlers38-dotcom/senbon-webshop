# 🚀 Fullstack Development Learning Guide

**Project:** Senbon Webshop | **Goal:** Master Vite, Node.js, JavaScript, CSS & Tailwind CSS

---

## 📚 Table of Contents

1. [Phase 1: Understanding Your Current Setup](#phase-1-understanding-your-current-setup)
2. [Phase 2: JavaScript Fundamentals Deep Dive](#phase-2-javascript-fundamentals-deep-dive)
3. [Phase 3: Vite Mastery](#phase-3-vite-mastery)
4. [Phase 4: CSS & Tailwind CSS](#phase-4-css--tailwind-css)
5. [Phase 5: Node.js Backend](#phase-5-nodejs-backend)
6. [Phase 6: Frontend-Backend Integration](#phase-6-frontend-backend-integration)
7. [Advanced Topics](#advanced-topics)

---

## Phase 1: Understanding Your Current Setup

### What You Have Now:
- ✅ Vite as build tool
- ✅ React 19 with Router
- ✅ State management with `useState` & Context API
- ✅ ES Modules (type: "module" in package.json)

### Task 1.1: Analyze Your Current Architecture

**File:** `src/App.jsx`
- **CartContext**: Provides `cart`, `addToCart`, `removeFromCart` globally
- **Routes**: Home (/), Product Detail (/product/:id), Order (/order)
- **Props Flow**: Down from App → Components

**Key Concepts to Understand:**
```javascript
// Context API Pattern (you're using this)
export const CartContext = createContext()

// Provider wraps children and shares state
<CartContext.Provider value={{cart, addToCart, removeFromCart}}>
  <App />
</CartContext.Provider>
```

### Task 1.2: Examine package.json

**What each script does:**
```bash
npm run dev      # Starts Vite dev server with hot reload
npm run build    # Creates optimized production build
npm run lint     # Checks code quality
npm run preview  # Preview production build locally
```

### Checkpoint 1 ✓
- [ ] Run `npm run dev` and see hot reload in action
- [ ] Change something in `src/App.jsx`, watch it update without page refresh
- [ ] Open DevTools → Sources and explore the bundled code

---

## Phase 2: JavaScript Fundamentals Deep Dive

### 2.1: ES6+ Modern Features You're Already Using

**In your code:**

```javascript
// 1. Arrow Functions
const removeFromCart = (index) => { ... }

// 2. Destructuring
const { cart, addToCart, removeFromCart } = useContext(CartContext)

// 3. Spread Operator (copying arrays)
setCart([...cart, product])

// 4. Template Literals
`Found ${results.length} products`

// 5. Const/Let (block scope)
const [search, setSearch] = useState('')
```

### Task 2.1: Refactor for Better JavaScript

**Before:** Props drilling
```javascript
// App.jsx passes props down multiple levels
<ProductList search={search} addToCart={addToCart} />
// ProductList.jsx
function ProductList({search, addToCart}) { 
  // Then passes to child
  <ProductCard addToCart={addToCart} />
}
```

**After:** Use Context everywhere (already doing this!)
```javascript
// Any component can consume
const { addToCart } = useContext(CartContext)
```

### Task 2.2: Understand Closures & Scope

**In your `Cart.jsx`, understand why this works:**
```javascript
function removeHandler(index) {
  // This function 'closes over' the index variable
  removeFromCart(index)
}
```

### Task 2.3: Async/Await Pattern (for API calls)

**You'll need this for backend integration:**
```javascript
async function fetchProducts() {
  try {
    const response = await fetch('/api/products')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch:', error)
  }
}

// Using it in a component
useEffect(() => {
  fetchProducts().then(data => setProducts(data))
}, [])
```

### Checkpoint 2 ✓
- [ ] Write a function using async/await
- [ ] Practice destructuring: `const {name, price} = product`
- [ ] Use spread operator: `[...oldArray, newItem]`

---

## Phase 3: Vite Mastery

### 3.1: How Vite Works

**Development Mode (`npm run dev`):**
1. Vite intercepts requests from browser
2. Transforms ES Modules on-the-fly
3. Only processes changed files (instant HMR - Hot Module Reload)
4. Shows full source code in DevTools

**Production Mode (`npm run build`):**
1. Bundles everything into optimized chunks
2. Tree-shakes unused code
3. Minifies JavaScript
4. Optimizes assets

### Task 3.1: Explore Vite Configuration

**Current:** `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()], // This enables JSX support
})
```

**You can customize it:**
```javascript
export default defineConfig({
  plugins: [react()],
  
  // Environment variables
  define: {
    __DEV__: JSON.stringify(true),
  },
  
  // Server configuration
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  
  // Build optimization
  build: {
    outDir: 'dist',
    minify: 'terser',
  }
})
```

### Task 3.2: Environment Variables

Create `.env` file (never commit this):
```
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Senbon Webshop
```

Use in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL
console.log(API_URL) // http://localhost:3001/api
```

### Task 3.3: Dynamic Imports (Code Splitting)

Instead of importing all pages at once:
```javascript
// Old: loads everything upfront
import Produktside from './Produktside'

// New: loads only when needed
const Produktside = lazy(() => import('./Produktside'))
```

Wrap with Suspense:
```javascript
import { Suspense, lazy } from 'react'
const Produktside = lazy(() => import('./Produktside'))

<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path='/product/:id' element={<Produktside />} />
  </Routes>
</Suspense>
```

### Checkpoint 3 ✓
- [ ] Add proxy config to vite.config.js
- [ ] Create .env file with VITE_API_URL
- [ ] Implement lazy loading for at least one route
- [ ] Check DevTools Network tab and see chunks load on demand

---

## Phase 4: CSS & Tailwind CSS

### 4.1: Current CSS Setup Analysis

Your project uses:
- Global CSS (`src/index.css`)
- Component CSS (`src/App.css`)

**Problem:** Easy to have naming conflicts, specificity wars

### Task 4.1: Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

This creates:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - CSS processing

### Task 4.2: Configure Tailwind

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",  // Scan these files
  ],
  theme: {
    extend: {
      colors: {
        'brand': '#FF6B6B', // Your custom colors
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}
```

### Task 4.3: Update CSS Files

**Before:** `src/index.css`
```css
body {
  margin: 0;
  font-family: Inter;
  background: white;
  color: #333;
}

.button {
  padding: 10px 20px;
  background: blue;
  color: white;
  border: none;
}
```

**After:** `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom components */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition;
  }
}
```

### Task 4.4: Refactor Components to Use Tailwind

**Before:** `src/Nav.jsx`
```jsx
export function Nav() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1>Senbon</h1>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/order">Orders</a></li>
        </ul>
      </div>
    </nav>
  )
}
```

**After:** Using Tailwind
```jsx
export function Nav() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Senbon</h1>
        <ul className="flex gap-6">
          <li><a href="/" className="hover:text-gray-300 transition">Home</a></li>
          <li><a href="/order" className="hover:text-gray-300 transition">Orders</a></li>
        </ul>
      </div>
    </nav>
  )
}
```

### 4.5: Tailwind Classes Explained

**Spacing:**
```
p-4    = padding: 1rem (16px)
m-2    = margin: 0.5rem (8px)
px-4   = padding-left & right: 1rem
py-2   = padding-top & bottom: 0.5rem
gap-4  = gap between flex items: 1rem
```

**Colors:**
```
bg-blue-500  = background: #3b82f6
text-red-600 = color: #dc2626
border-gray-300 = border: #d1d5db
```

**Responsive:**
```
md:flex     = display: flex on medium screens
lg:grid-2   = grid-cols: 2 on large screens
sm:text-sm  = font-size on small screens
```

### Checkpoint 4 ✓
- [ ] Install Tailwind CSS
- [ ] Update `src/index.css` with Tailwind directives
- [ ] Refactor Nav component to use Tailwind
- [ ] Refactor ProductCard to use Tailwind (with hover states)
- [ ] Test responsive design with browser dev tools

---

## Phase 5: Node.js Backend

### 5.1: Node.js & Express Basics

Node.js is JavaScript runtime that runs **outside the browser** (on server).

**Create backend folder:**
```bash
mkdir senbon-backend
cd senbon-backend
npm init -y
npm install express cors dotenv
npm install -D nodemon  # Auto-restart on file changes
```

### 5.2: Basic Express Server

**backend/server.js:**
```javascript
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
  ]
  res.json(products)
})

app.post('/api/orders', (req, res) => {
  const { cart, customer } = req.body
  console.log('New order:', cart, customer)
  res.json({ orderId: 123, status: 'success' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

**package.json:**
```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

### Task 5.1: Create Your Backend

1. Create `../senbon-backend` folder
2. Set up Express server
3. Run `npm run dev`
4. Test endpoint: `curl http://localhost:3001/api/products`

### 5.3: Routing Structure

```javascript
// Instead of putting everything in server.js, use route files

// routes/products.js
export function setupProductRoutes(app) {
  app.get('/api/products', (req, res) => {
    res.json([{id: 1, name: 'Product 1'}])
  })
  
  app.get('/api/products/:id', (req, res) => {
    const id = req.params.id
    res.json({id, name: `Product ${id}`})
  })
}

// routes/orders.js
export function setupOrderRoutes(app) {
  app.post('/api/orders', (req, res) => {
    res.json({orderId: 123})
  })
}

// server.js
import { setupProductRoutes } from './routes/products.js'
import { setupOrderRoutes } from './routes/orders.js'

setupProductRoutes(app)
setupOrderRoutes(app)
```

### 5.4: Database (Simple Version)

**Using JSON file instead of database initially:**

```javascript
import fs from 'fs'

function loadProducts() {
  const data = fs.readFileSync('./data/products.json', 'utf-8')
  return JSON.parse(data)
}

function saveProducts(products) {
  fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2))
}

app.get('/api/products', (req, res) => {
  const products = loadProducts()
  res.json(products)
})

app.post('/api/products', (req, res) => {
  const products = loadProducts()
  const newProduct = { id: Date.now(), ...req.body }
  products.push(newProduct)
  saveProducts(products)
  res.json(newProduct)
})
```

### Checkpoint 5 ✓
- [ ] Create `../senbon-backend` with Express server
- [ ] Set up `/api/products` GET endpoint
- [ ] Set up `/api/orders` POST endpoint
- [ ] Run both frontend and backend simultaneously
- [ ] Test backend endpoints with Postman or curl

---

## Phase 6: Frontend-Backend Integration

### 6.1: Fetching Data from Backend

**In React component:**

```javascript
import { useEffect, useState } from 'react'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:3001/api/products')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, []) // Runs once on mount
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="border p-4 rounded">
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### 6.2: Sending Data to Backend

```javascript
async function handleAddToCart(product) {
  try {
    const response = await fetch('http://localhost:3001/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product })
    })
    const result = await response.json()
    console.log('Added to cart:', result)
  } catch (error) {
    console.error('Failed to add to cart:', error)
  }
}
```

### 6.3: API Helper Function

Create **src/api.js:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export async function get(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`)
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`)
  return response.json()
}

export async function post(endpoint, data) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error(`Failed to post to ${endpoint}`)
  return response.json()
}

// Usage in component:
// import { get } from './api'
// const products = await get('/products')
```

### Checkpoint 6 ✓
- [ ] Create API helper functions
- [ ] Fetch products from backend in ProductList
- [ ] Display loading/error states
- [ ] Send order data to backend
- [ ] Show confirmation after order submission

---

## Advanced Topics

### 7.1: Error Handling & Validation

**Backend:**
```javascript
app.post('/api/orders', (req, res) => {
  const { cart, email } = req.body
  
  // Validate
  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' })
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' })
  }
  
  // Process...
  res.json({ orderId: 123 })
})
```

**Frontend:**
```javascript
try {
  const result = await post('/orders', data)
} catch (error) {
  showErrorMessage(error.message)
}
```

### 7.2: Environment Variables & Secrets

**Backend .env:**
```
DATABASE_URL=mongodb://localhost
JWT_SECRET=your-secret-key
NODE_ENV=development
```

**Use it:**
```javascript
import dotenv from 'dotenv'
dotenv.config()

const secret = process.env.JWT_SECRET
```

### 7.3: Middleware

```javascript
// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Custom header middleware
app.use((req, res, next) => {
  res.setHeader('X-API-Version', '1.0')
  next()
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})
```

### 7.4: Performance & Optimization

**Frontend:**
- Use Suspense for code splitting
- Implement pagination for product lists
- Cache API responses

**Backend:**
- Use caching headers
- Paginate large result sets
- Index database queries

### 7.5: Testing

**Backend with Postman:**
```
GET http://localhost:3001/api/products
POST http://localhost:3001/api/orders
  Body: {"cart": [...], "email": "test@example.com"}
```

---

## 📋 Learning Checklist

### Level 1: Foundation (Week 1)
- [ ] Phase 1: Understand current setup
- [ ] Phase 2: JavaScript deep dive
- [ ] Phase 3: Vite basics
- [ ] Run dev server and see hot reload

### Level 2: Styling (Week 2)
- [ ] Phase 4: Install Tailwind CSS
- [ ] Refactor 2-3 components to use Tailwind
- [ ] Learn responsive design with Tailwind
- [ ] Build a nice UI for products

### Level 3: Backend (Week 3)
- [ ] Phase 5: Create Node.js backend
- [ ] Set up Express routes
- [ ] Create sample data
- [ ] Test endpoints

### Level 4: Integration (Week 4)
- [ ] Phase 6: Fetch from backend
- [ ] Handle loading/error states
- [ ] Send orders to backend
- [ ] Full working app

### Level 5: Polish (Week 5+)
- [ ] Error handling
- [ ] Environment variables
- [ ] Performance optimization
- [ ] Deploy

---

## 🚀 Quick Start Commands

```bash
# Frontend
cd senbon-webshop
npm run dev          # Start dev server on port 5173

# Backend (in new terminal)
cd senbon-backend
npm run dev          # Start Express server on port 3001

# Build for production
npm run build
npm run preview
```

---

## 📚 Resources

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## Next Step

Start with **Phase 1 Checkpoint** - run your app and understand the current architecture!

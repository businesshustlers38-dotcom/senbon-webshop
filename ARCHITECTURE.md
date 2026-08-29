# 🏗️ Your Project Architecture

## Current Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         SENBON WEBSHOP                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    App.jsx (Parent)                      │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │ State:                                              │ │  │
│  │  │ • search: '' (from Sökfält)                        │ │  │
│  │  │ • cart: [] (updated by addToCart/removeFromCart)  │ │  │
│  │  │                                                     │ │  │
│  │  │ Context:                                            │ │  │
│  │  │ • CartContext.Provider (shares cart globally)      │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│              │                      │                   │       │
│       ┌──────▼─────┐         ┌──────▼─────┐    ┌──────▼────┐  │
│       │  Nav.jsx   │         │ Sökfält.jsx│    │ Routes    │  │
│       │            │         │            │    │           │  │
│       │ Shows nav  │         │ Updates    │    │ /         │  │
│       │ links      │         │ search     │    │ /product/:id
│       │            │         │ state      │    │ /order    │  │
│       └────────────┘         └────────────┘    └───────────┘  │
│                                  │              │       │      │
│                      ┌───────────▼──┐   ┌──────▼─┐  ┌──▼──┐   │
│                      │ Producklista  │   │Produkt │  │Orde │   │
│                      │               │   │side    │  │sida │   │
│                      │ Fetches from  │   │        │  │     │   │
│                      │ DummyJSON API │   │Fetches │  │Show │   │
│                      │ Filters by    │   │one     │  │cart │   │
│                      │ search text   │   │product │  │&    │   │
│                      │ Shows loading │   │by ID   │  │form │   │
│                      │ & error       │   │        │  │     │   │
│                      └──────────────┘   └────────┘  └─────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Fetches from
                                ▼
                    ┌─────────────────────────┐
                    │  DummyJSON API (External)│
                    │ https://dummyjson.com    │
                    └─────────────────────────┘
```

---

## Component Breakdown

### **App.jsx** (The Brain 🧠)
**Responsibilities:**
- Manages `search` state (text to filter products)
- Manages `cart` state (array of products in cart)
- Provides `CartContext` to all children
- Sets up React Router routes

**Props It Sends:**
```
App
├── Nav              (no props)
├── Sökfält          { onSearch: setSearch }
├── Cart             (accesses via useContext)
└── Routes
    ├── Producklista { search, addToCart }
    ├── Produktside  (no props, uses useParams)
    └── Orderssida   (accesses via useContext)
```

### **Sökfält.jsx** (Search Input 🔍)
```javascript
// Receives
Props: { onSearch: function }

// Does
- Takes user input
- Calls onSearch(text) to update parent state
- Updates Producklista in real-time
```

### **Producklista.jsx** (Product List 🛍️)
```javascript
// Receives
Props: { search: string, addToCart: function }
API: fetch('https://dummyjson.com/products')

// Does
- Fetches all products on mount
- Filters by search text (case-insensitive)
- Shows Loading... while fetching
- Shows Error: ... if fetch fails
- Maps products to ProductCard components
- Calls addToCart when "Add to Cart" clicked

// Teaches You
✅ useEffect with async/await
✅ try/catch/finally error handling
✅ Conditional rendering (loading/error/data)
✅ Array filtering & mapping
✅ Props drilling
```

### **Cart.jsx** (Shopping Cart 🛒)
```javascript
// Receives
Context: CartContext { cart, removeFromCart }

// Does
- Maps through cart array
- Shows each item's title & price
- "Ta bort" button removes item by index
- Link to order page

// Teaches You
✅ useContext hook
✅ Array mapping with index
✅ Event handlers (onClick)
✅ React Router Link
```

### **Produktside.jsx** (Product Detail 📄)
```javascript
// Receives
URL Params: /product/:id

// Does
- Gets ID from URL using useParams
- Fetches single product from API
- Shows loading while fetching
- Displays full product info

// Teaches You
✅ useParams hook
✅ Dynamic URLs
✅ Dependency in useEffect [id]
```

### **Orderssida.jsx** (Orders Page)
*Your next target to refactor!*

---

## State Management Flow

### How State Flows Down:

```
App (holds state)
├── search: '' → Sökfält (input), Producklista (filter)
└── cart: [] → Cart (display), Orderssida (show all)
```

### How Events Flow Up:

```
Component (event)
└── calls function prop
    └── updates parent state
        └── component re-renders with new value
```

Example:
```javascript
// Sökfält.jsx
<input onChange={(e) => onSearch(e.target.value)} />
        ↓ calls
// App.jsx
{ onSearch: setSearch }
        ↓ updates
// state: search = new value
        ↓ passes to
// Producklista.jsx
filter(product => product.title.includes(search))
```

---

## API Calls (Data Coming In)

### Current API: DummyJSON

**Producklista.jsx:**
```
GET https://dummyjson.com/products
Response: {
  products: [
    { id: 1, title: "...", price: 100, thumbnail: "..." },
    { id: 2, title: "...", price: 200, thumbnail: "..." },
    ...
  ]
}
```

**Produktside.jsx:**
```
GET https://dummyjson.com/products/5
Response: {
  id: 5,
  title: "...",
  description: "...",
  price: 100,
  thumbnail: "...",
  ...
}
```

---

## Learning Path: What Each File Teaches

| File | Concept | Level |
|------|---------|-------|
| **main.jsx** | React setup, StrictMode, BrowserRouter | Beginner |
| **App.jsx** | State management, Context API, Routing | Beginner |
| **Sökfält.jsx** | Event handlers, controlled inputs | Beginner |
| **Producklista.jsx** | useEffect, async/await, error handling | **Intermediate** |
| **Cart.jsx** | useContext, array operations | Beginner |
| **Produktside.jsx** | useParams, dynamic routing | Beginner |

---

## Where to Add Features

### To Improve Styling (Phase 4: Tailwind)
- Update `src/index.css` with Tailwind directives
- Convert all `className` strings to Tailwind
- Improve Cart display (grid, colors, spacing)
- Style ProductCard with Tailwind

### To Add Backend (Phase 5: Node.js)
- Create `../senbon-backend/server.js` with Express
- Move product data to backend
- Replace DummyJSON with local API
- Add order submission endpoint

### To Integrate Frontend-Backend (Phase 6)
- Create `src/api.js` helper functions
- Update Producklista to fetch from `/api/products`
- Update Orderssida to POST to `/api/orders`
- Handle loading/error states from real backend

---

## Common Patterns You're Using

### Pattern 1: Loading States
```javascript
const [loading, setLoading] = useState(true)

useEffect(() => {
  async function fetch() {
    const data = await get()
    setLoading(false)
  }
  fetch()
}, [])

if (loading) return <div>Loading...</div>
```

### Pattern 2: Error Handling
```javascript
const [error, setError] = useState(null)

try {
  const data = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
} catch (err) {
  setError(err.message)
}

if (error) return <div>Error: {error}</div>
```

### Pattern 3: Conditional Rendering
```javascript
{loading && <Spinner />}
{error && <ErrorMsg error={error} />}
{data && <DisplayData data={data} />}
```

### Pattern 4: Array Filtering
```javascript
const filtered = array.filter(item =>
  item.name.toLowerCase().includes(search.toLowerCase())
)
```

### Pattern 5: Context Provider
```javascript
<CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
  <App />
</CartContext.Provider>

// In child component
const { cart } = useContext(CartContext)
```

---

## Next Steps After Reading This

1. ✅ You already understand the current architecture
2. ⏭️ Run `npm run dev` and test the app
3. ⏭️ Modify a component and see hot reload
4. ⏭️ Read Producklista.jsx and understand useEffect
5. ⏭️ Continue to **LEARNING_GUIDE.md** Phase 2

---

## Quick Debug Checklist

When something doesn't work:

- [ ] Check browser console for errors
- [ ] Check Network tab for failed API requests
- [ ] Check component is receiving props correctly
- [ ] Check state is updating (React DevTools)
- [ ] Check dependencies in useEffect []
- [ ] Check function is called at the right time
- [ ] Check API endpoint URL is correct

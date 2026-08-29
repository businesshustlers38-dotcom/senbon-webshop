# Quick Reference Guide

## Vite Commands

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Create production build
npm run lint     # Check code quality
npm run preview  # Preview production build
```

---

## React Hooks Cheat Sheet

### useState - State Management
```javascript
const [count, setCount] = useState(0)
setCount(count + 1)
```

### useEffect - Side Effects
```javascript
useEffect(() => {
  console.log('Component mounted')
  return () => console.log('Cleanup')
}, []) // Empty = run once on mount
```

### useContext - Access Global State
```javascript
const { cart, addToCart } = useContext(CartContext)
```

### useParams - Get URL Parameters
```javascript
const { id } = useParams()  // /product/:id
```

### useNavigate - Programmatic Navigation
```javascript
const navigate = useNavigate()
navigate('/orders')
```

---

## JavaScript Essentials

### Destructuring
```javascript
// Arrays
const [first, second] = [1, 2]

// Objects
const { name, price } = product
const { cart, setCart } = useContext(CartContext)
```

### Spread Operator
```javascript
// Copy array
const newCart = [...cart, newItem]

// Copy object
const updated = { ...product, price: 99 }
```

### Array Methods
```javascript
products.map(p => <Card key={p.id} product={p} />)
cart.filter((_, i) => i !== indexToRemove)
total = cart.reduce((sum, item) => sum + item.price, 0)
```

### Async/Await
```javascript
async function fetchData() {
  try {
    const res = await fetch('/api/data')
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}
```

---

## Tailwind CSS Classes

### Spacing
```
p-4   = padding: 1rem
m-2   = margin: 0.5rem
px-4  = padding left/right
py-2  = padding top/bottom
gap-4 = gap: 1rem
```

### Colors
```
bg-blue-500      = background
text-red-600     = text color
border-gray-300  = border color
```

### Sizing
```
w-full     = width: 100%
w-1/2      = width: 50%
h-64       = height: 16rem
max-w-md   = max-width
```

### Flexbox
```
flex             = display: flex
gap-4            = gap: 1rem
justify-center   = justify-content: center
items-center     = align-items: center
```

### Grid
```
grid             = display: grid
grid-cols-3      = grid-template-columns: repeat(3)
gap-4            = gap: 1rem
```

### Responsive
```
md:grid-cols-2   = 2 columns on medium screens+
lg:flex          = flex on large screens+
sm:text-sm       = smaller text on small screens+
```

### Hover & States
```
hover:bg-blue-600    = on hover
focus:outline        = on focus
disabled:opacity-50  = when disabled
```

---

## API Patterns

### Fetch GET
```javascript
const response = await fetch('/api/products')
const data = await response.json()
```

### Fetch POST
```javascript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cart, email })
})
const result = await response.json()
```

### With Error Handling
```javascript
try {
  const res = await fetch('/api/data')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.json()
} catch (error) {
  console.error('Request failed:', error)
  throw error
}
```

---

## Component Patterns

### Functional Component
```javascript
export function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded">
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </div>
  )
}
```

### Component with State
```javascript
export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

### Component with Effects
```javascript
export function UserList() {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    async function load() {
      const data = await fetch('/api/users').then(r => r.json())
      setUsers(data)
    }
    load()
  }, []) // Runs once on mount
  
  return users.map(u => <div key={u.id}>{u.name}</div>)
}
```

---

## Routing Examples

### Basic Routes
```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Programmatic Navigation
```javascript
const navigate = useNavigate()
navigate('/product/123')
navigate('/', { replace: true }) // Don't add to history
```

### Get URL Parameters
```javascript
const { id } = useParams()
const [searchParams] = useSearchParams()
const query = searchParams.get('search')
```

---

## Express.js Patterns

### Basic Server
```javascript
import express from 'express'
const app = express()

app.use(express.json())
app.use(cors())

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello' })
})

app.listen(3001, () => console.log('Server running'))
```

### GET with Params
```javascript
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id
  res.json({ id, name: `Product ${id}` })
})
```

### POST with Body
```javascript
app.post('/api/orders', (req, res) => {
  const { cart, email } = req.body
  
  // Validate
  if (!cart || !email) {
    return res.status(400).json({ error: 'Missing data' })
  }
  
  // Process...
  res.status(201).json({ orderId: 123 })
})
```

### Error Handling
```javascript
app.get('/api/user/:id', (req, res) => {
  const user = findUser(req.params.id)
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})
```

---

## Environment Variables

### React
```javascript
// .env
VITE_API_URL=http://localhost:3001/api

// Use
const API_URL = import.meta.env.VITE_API_URL
```

### Node.js
```javascript
// .env
DATABASE_URL=mongodb://localhost
JWT_SECRET=secret-key

// Use
import dotenv from 'dotenv'
dotenv.config()
const db = process.env.DATABASE_URL
```

---

## Debugging Tips

### React DevTools
```javascript
// Console log during render
console.log('render', count)

// Log state change
useEffect(() => {
  console.log('State changed:', count)
}, [count])
```

### Network Tab
- See all API requests
- Check response bodies
- Check status codes (200, 400, 500, etc)

### Sources Tab
- Set breakpoints
- Step through code
- Inspect variables

### Common Status Codes
```
200 = OK
201 = Created
400 = Bad Request
404 = Not Found
500 = Server Error
```

---

## Performance Tips

### Frontend
- Use lazy loading: `const Component = lazy(() => import('./...'))`
- Memoize expensive computations: `useMemo`
- Optimize re-renders: `useCallback`
- Code splitting by route

### Backend
- Cache responses: `res.set('Cache-Control', 'max-age=3600')`
- Paginate large lists: `/api/products?page=1&limit=20`
- Use database indexes
- Compress responses with gzip

---

## Common Issues & Fixes

### "Cannot find module"
- Check file path spelling
- Ensure export/import match
- Check file extensions (.jsx, .js)

### State not updating
- Use functional form: `setCount(c => c + 1)`
- Immutable updates: `[...arr]` or `{...obj}`
- Check dependencies in useEffect

### 404 on API call
- Check backend is running: `curl http://localhost:3001`
- Check endpoint path matches
- Check CORS setup

### Hot reload not working
- Check Vite dev server is running
- Refresh browser
- Check no syntax errors in console

---

## File Structure Reference

```
senbon-webshop/
├── src/
│   ├── main.jsx           # Entry point
│   ├── App.jsx            # Main component
│   ├── components/        # Reusable components
│   ├── pages/             # Route pages
│   ├── api.js             # API helpers
│   └── index.css          # Global styles
├── public/                # Static assets
├── vite.config.js         # Vite config
├── tailwind.config.js     # Tailwind config
├── postcss.config.js      # PostCSS config
├── package.json           # Dependencies
└── .env                   # Environment vars

senbon-backend/
├── server.js              # Entry point
├── routes/
│   ├── products.js
│   └── orders.js
├── data/
│   ├── products.json
│   └── orders.json
├── package.json
└── .env
```

---

## Next Steps

1. Read `LEARNING_GUIDE.md`
2. Start with Phase 1 Checkpoint
3. Run `npm run dev` and explore
4. Pick a component to refactor with Tailwind
5. Continue to Phase 2 and beyond!

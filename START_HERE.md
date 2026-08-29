# 🚀 START HERE - Your First Day Learning Plan

**Goal:** Understand your current app architecture and see Vite's hot reload in action

**Time:** 30-45 minutes

---

## Step 1: Start Your Dev Server

```bash
npm run dev
```

**What happens:**
1. Vite starts a development server (usually on `http://localhost:5173`)
2. Opens your app in development mode
3. Watches for file changes and automatically reloads

**You should see something like:**
```
  VITE v8.0.10  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Step 2: Open Your App in Browser

1. Click the link: `http://localhost:5173`
2. You should see your Senbon Webshop app
3. Try these actions:
   - [ ] See the product list loading
   - [ ] Search for a product (e.g., "phone")
   - [ ] Click on a product to see details
   - [ ] Add products to cart
   - [ ] Remove products from cart
   - [ ] Click "Forsätt med ordern" to see order page

---

## Step 3: See Hot Reload in Action ⚡

Hot reload means your changes show up **instantly without reloading the page**.

**Test it:**

1. Open `src/Nav.jsx` in your editor
2. Change the title from "Senbon" to "Senbon Shop"
3. **Don't refresh the page!** Just save the file
4. Watch your browser - it updates instantly ✨

**This is the power of Vite!** No page reload needed.

---

## Step 4: Understand the Code Structure

Open these files in order and read the comments:

### 4a. `src/main.jsx` (2 minutes)
- **What it does:** Entry point for React
- **Key lines:** 
  ```javascript
  createRoot(document.getElementById('root')).render(...)
  // This tells React: "Take over the #root div in index.html"
  
  <BrowserRouter>
  // This enables React Router for URL changes
  ```
- **Learn:** This is where React starts

### 4b. `src/App.jsx` (5 minutes)
- **What it does:** Main component, holds all state
- **Key concepts:**
  ```javascript
  const [search, setSearch] = useState('')
  // State = data that can change (search text)
  
  const [cart, setCart] = useState([])
  // State = array of products in cart
  
  <CartContext.Provider value={{...}}>
  // Shares cart data with ALL child components
  ```
- **Learn:** This is where state "lives"

### 4c. `src/Producklista.jsx` (7 minutes)
- **What it does:** Fetches products from DummyJSON API
- **Key concepts:**
  ```javascript
  useEffect(() => { fetchProducts() }, [])
  // On first render: fetch products from API
  
  const [loading, setLoading] = useState(true)
  // Show "Loading..." until data arrives
  
  async function fetchProducts() {
    const res = await fetch('...')
    const data = await res.json()
    setProducts(data.products)
  }
  // Waits for data, then updates state
  ```
- **Learn:** This is how you fetch from APIs

### 4d. `src/Cart.jsx` (3 minutes)
- **What it does:** Shows items in cart
- **Key concepts:**
  ```javascript
  const { cart } = useContext(CartContext)
  // Get cart from context (shared state)
  
  cart.map((item, index) => ...)
  // Loop through items and display each
  ```
- **Learn:** How to use Context API

### 4e. `src/Produktside.jsx` (3 minutes)
- **What it does:** Shows one product detail
- **Key concepts:**
  ```javascript
  const { id } = useParams()
  // Get product ID from URL: /product/5 → id = 5
  
  useEffect(() => { fetchProducts() }, [id])
  // Re-fetch when ID changes
  ```
- **Learn:** Dynamic URLs with useParams

---

## Step 5: Open React DevTools

This is your superpower for learning React!

1. Open browser DevTools: `F12` or `Right-click → Inspect`
2. Click "Components" tab (you may need to install React DevTools extension)
3. You should see your component tree:
   ```
   <App>
     <Nav>
     <Sökfält>
     <Cart>
     <Routes>
       <Producklista> (or other route)
   ```

**What you can do:**
- Click on a component to see its props and state
- Change state values and see the UI update
- Understand the "component hierarchy"

---

## Step 6: Open Network Tab (See API Calls)

1. DevTools → Network tab
2. Search for "products" to see the API calls
3. Click on the request to see:
   - **Request:** What you asked for (GET /products)
   - **Response:** What the API sent back (list of products)
   - **Status:** 200 = success, 404 = not found, 500 = error

**This shows you:** How data flows from API → component

---

## Step 7: Read the Architecture Diagram

Open `ARCHITECTURE.md` and look at the data flow diagram.

**Key insight:** All data flows DOWN:
- App holds the state
- App passes data to children
- Children can't change state directly
- Children call functions to update parent state

This is React's "unidirectional data flow"

---

## Step 8: Modify Your First Component 

Now let's make a change to practice:

### Task 8a: Change Button Text

**File:** `src/Cart.jsx`

**Current:**
```javascript
<button onClick={() => removeFromCart(index)}>Ta bort</button>
```

**Change to:**
```javascript
<button onClick={() => removeFromCart(index)}>🗑️ Remove</button>
```

**What you learned:**
- How to make a simple change
- Hot reload works instantly
- Emojis in React work fine!

### Task 8b: Add a Total Price to Cart

**File:** `src/Cart.jsx`

**Current:** Just shows items

**Add after the map:**
```javascript
// Calculate total price
const total = cart.reduce((sum, item) => sum + item.price, 0)

// Show it in the JSX
<div>
  <strong>Total: ${total.toFixed(2)}</strong>
</div>
```

**What you learned:**
- `reduce()` is a powerful array method
- How to compute derived values
- `.toFixed(2)` formats numbers to 2 decimals

---

## Step 9: Understanding Key Concepts

### Concept 1: Hooks

Hooks are functions that let you "hook into" React features:

```javascript
// useState: Use state in a component
const [count, setCount] = useState(0)

// useEffect: Run code when component mounts/updates
useEffect(() => { ... }, [dependencies])

// useContext: Access shared state
const { cart } = useContext(CartContext)

// useParams: Get URL parameters
const { id } = useParams()
```

### Concept 2: Components

Every `.jsx` file is a component - a reusable piece of UI:

```javascript
function ProductCard({ product }) {
  return <div>{product.name}</div>
}
// This is a component!
// It takes props and returns JSX
```

### Concept 3: Props vs State

```javascript
// Props = data passed IN (read-only)
function Card({ title }) {
  return <h1>{title}</h1>  // Use it but don't change it
}

// State = data that lives IN component (changeable)
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### Concept 4: Async/Await

This pattern is everywhere:

```javascript
// OLD way (callbacks) - hard to read
fetch('/api/data')
  .then(res => res.json())
  .then(data => setData(data))
  .catch(err => setError(err))

// NEW way (async/await) - easier to read
async function fetchData() {
  try {
    const res = await fetch('/api/data')
    const data = await res.json()
    setData(data)
  } catch (err) {
    setError(err)
  }
}
```

---

## Step 10: Checkpoint - Check Your Understanding

Answer these questions:

1. **Where does the `search` state live?**
   - Answer: In `App.jsx`

2. **How does `Producklista` know what to search?**
   - Answer: Via `search` prop from `App.jsx`

3. **How does `Cart` know what's in the cart?**
   - Answer: Via `CartContext` (useContext hook)

4. **When does `Producklista` fetch from the API?**
   - Answer: When component first mounts (useEffect with [] dependencies)

5. **What happens when you click a product?**
   - Answer: It calls `addToCart(product)` → updates `cart` state → re-renders

---

## 🎯 Summary of What You Learned

| Concept | File | How It Works |
|---------|------|-------------|
| **State** | App.jsx | `useState` holds data that can change |
| **Props** | Producklista.jsx | Receive data from parent via function arguments |
| **Context** | App.jsx + Cart.jsx | Share state with many children without props drilling |
| **Routes** | App.jsx | Different components based on URL |
| **useEffect** | Producklista.jsx | Fetch data when component mounts |
| **API Calls** | Producklista.jsx | `fetch()` + `async/await` to get data from server |
| **JSX** | All files | HTML-like syntax that becomes JavaScript |
| **Hot Reload** | Any file | Vite updates instantly without full page reload |

---

## 📚 Next Steps

1. ✅ You've read all the files and understand the architecture
2. ✅ You've modified a component (button text)
3. ✅ You understand hooks, props, state, and async/await
4. ⏭️ **Next:** Go to `LEARNING_GUIDE.md` and start **Phase 2: JavaScript Fundamentals**

---

## 🆘 Troubleshooting

### "npm run dev" doesn't start?
```bash
# Try clearing node_modules and reinstalling
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Browser shows "Cannot GET /product/1"?
- Make sure you're on `localhost:5173` (not another port)
- Check that `npm run dev` is running
- Try refreshing the browser

### Changes not showing up?
- Save the file (Ctrl+S or Cmd+S)
- Check browser console for errors (F12)
- Try a hard refresh (Ctrl+Shift+R)

### API shows "Failed to fetch"?
- This is expected - it's trying to fetch from DummyJSON
- Check Network tab (F12 → Network)
- It should still load products if DummyJSON is up

---

## 💡 Learning Tips

1. **Type out the code** - Don't copy/paste. Typing helps learning.
2. **Change things and break them** - That's how you learn!
3. **Use DevTools** - React DevTools is your best friend
4. **Read the comments** - Your code has Swedish comments explaining everything
5. **Take notes** - Write down concepts that confuse you
6. **Ask "why?" constantly** - Why does this work this way?

---

## 🎓 You're Ready!

You now understand:
- ✅ How your app is structured
- ✅ How Vite and React work together
- ✅ How data flows through components
- ✅ How to modify code and see changes instantly

**Next level: Master JavaScript and Tailwind CSS!**

Continue with `LEARNING_GUIDE.md` → Phase 2

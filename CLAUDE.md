# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**Install dependencies:**
```bash
npm install
```

**Development:**
```bash
npm run dev
```
Starts a local dev server at `http://localhost:5173` with hot module replacement.

**Build & Preview:**
```bash
npm run build      # Creates production-optimized build in dist/
npm run preview    # Previews the built output locally
```

**Linting:**
```bash
npm lint           # Runs ESLint on all .js and .jsx files
```

## Architecture Overview

**Senbon Zakura Webshop** is a React 19 + Vite SPA (Single Page Application) that fetches product data from DummyJSON API.

### Component Structure

- **App.jsx** — Root component and state manager
  - Manages `cart` state (array of products) and `search` state (string)
  - Provides `CartContext` to all child components via Context API
  - Exports `addToCart(product)` and `removeFromCart(index)` functions
  - Routes all pages using React Router (v7)

- **Nav.jsx** — Navigation bar
  - Displays Senbon Zakura logo
  - Static links (Home, Orders) using React Router `Link`

- **Producklista.jsx** — Product listing (homepage)
  - Fetches all products from `https://dummyjson.com/products` on mount
  - Filters products based on search prop (case-insensitive)
  - Shows loading state and error handling
  - Renders product cards with Link to detail page

- **Produktside.jsx** — Product detail page
  - Reads product ID from URL using `useParams()`
  - Fetches single product data from API when ID changes
  - No error handling currently (can throw if product not found)

- **Cart.jsx** — Shopping cart sidebar
  - Uses `CartContext` via `useContext()` hook
  - Displays all items with remove buttons
  - Link to order summary page

- **Orderssida.jsx** — Order summary/checkout page
  - Consumes cart data from context

- **Sökfält.jsx** — Search input component
  - Implements debounced search (500ms delay)
  - Calls `onSearch` prop to update parent search state

### Data Flow

1. User searches → `Sökfält` updates App's `search` state
2. `Producklista` receives `search` prop, filters products locally
3. User clicks product → React Router navigates to `/product/:id`
4. `Produktside` reads ID from URL, fetches product details
5. User adds to cart → `addToCart()` spreads into `cart` state via context
6. `Cart` component subscribes to `CartContext`, displays items

### API Integration

- All data comes from **DummyJSON API** (https://dummyjson.com/)
- No backend server; fetches happen in useEffect on component mount
- Error handling: uses try/catch in async fetch; renders error message to user

## Important Implementation Details

- **Search Debounce** — `Sökfält` uses `setTimeout` + `clearTimeout` in useEffect to delay API calls 500ms after user stops typing
- **Cart State** — Uses spread operator (`...cart`) to ensure immutability; duplicates allowed (same product added twice = two items)
- **React Router** — `BrowserRouter` wraps `App` in main.jsx; routes don't reload the page
- **Context API** — Cart state is global via `CartContext` to avoid prop drilling; both Cart and Orderssida components consume it
- **Comments in Swedish** — Codebase uses Swedish variable names and comments

## Known Gaps & Considerations

- **Produktside.jsx** — No error handling for missing products or failed API calls; component will hang on error
- **Cart.jsx** — Uses array index as React key (not ideal for lists; causes issues if items are removed dynamically)
- **No Tests** — Project has no test suite; ESLint is the only static check
- **Styling** — All CSS in App.css; uses CSS classes imported from old "Senbonzakura projekt"
- **State Persistence** — Cart state is lost on page reload (not persisted to localStorage)

## ESLint Configuration

Uses flat config (eslint.config.js):
- Extends `@eslint/js` recommended rules
- Includes `eslint-plugin-react-hooks` for hook rules
- Includes `eslint-plugin-react-refresh` for Vite compatibility
- Ignores `dist/` folder (build output)

## Dependencies

- **react** (19.2.5) — UI library
- **react-dom** (19.2.5) — DOM rendering
- **react-router-dom** (7.15.0) — Client-side routing
- **vite** (8.0.10) — Build tool & dev server
- **@vitejs/plugin-react** — React support in Vite

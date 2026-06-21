import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'

const STORAGE_KEY = 'forge-cart'
const FREE_SHIPPING_THRESHOLD = 99
const SHIPPING_FLAT = 9.95

const CartContext = createContext(null)

const lineKey = (id, variant) => `${id}::${variant || '-'}`

function loadInitial() {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    if (parsed && Array.isArray(parsed.items)) return { items: parsed.items }
  } catch {
    /* ignore corrupt storage */
  }
  return { items: [] }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, variant, quantity } = action
      const key = lineKey(product.id, variant)
      const existing = state.items.find((i) => i.key === key)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, 99) } : i,
          ),
        }
      }
      const unitPrice = product.salePrice ?? product.price
      return {
        items: [
          ...state.items,
          {
            key,
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.thumbnail || product.images?.[0],
            category: product.category,
            price: product.price,
            unitPrice,
            variant: variant || null,
            quantity,
          },
        ],
      }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.key !== action.key) }
    case 'SET_QTY':
      return {
        items: state.items
          .map((i) => (i.key === action.key ? { ...i, quantity: action.quantity } : i))
          .filter((i) => i.quantity > 0),
      }
    case 'INCREMENT':
      return {
        items: state.items.map((i) =>
          i.key === action.key ? { ...i, quantity: Math.min(i.quantity + 1, 99) } : i,
        ),
      }
    case 'DECREMENT':
      return {
        items: state.items
          .map((i) => (i.key === action.key ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)
  const lastAddRef = useRef(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    const fullPriceTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const savings = Math.max(0, fullPriceTotal - subtotal)
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const shipping = count === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
    const total = subtotal + shipping
    const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

    return {
      items: state.items,
      count,
      subtotal,
      savings,
      shipping,
      total,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      freeShippingRemaining,
      lastAdd: lastAddRef.current,
      addItem: (product, { variant = null, quantity = 1 } = {}) => {
        lastAddRef.current = Date.now()
        dispatch({ type: 'ADD', product, variant, quantity })
      },
      removeItem: (key) => dispatch({ type: 'REMOVE', key }),
      setQuantity: (key, quantity) => dispatch({ type: 'SET_QTY', key, quantity }),
      increment: (key) => dispatch({ type: 'INCREMENT', key }),
      decrement: (key) => dispatch({ type: 'DECREMENT', key }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Tipos de datos
export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
  maxStock: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
}

// Acciones del carrito
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

// Estado inicial
const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
}

// Funciones auxiliares
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0)
}

// Clave única estable para identificar items en acciones externas
const getItemKey = (item: { id: string; size: string; color: string }) =>
  `${item.id}-${item.size}-${item.color}`

// Reducer del carrito
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      )

      let newItems: CartItem[]

      if (existingItemIndex > -1) {
        // Si el item ya existe, incrementar cantidad
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, item.maxStock),
              }
            : item
        )
      } else {
        // Si es un item nuevo, agregarlo
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
        isOpen: true, // Abrir carrito al agregar item
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => getItemKey(item) !== action.payload
      )
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items
        .map(item =>
          getItemKey(item) === action.payload.id
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  Math.min(action.payload.quantity, item.maxStock)
                ),
              }
            : item
        )
        .filter(item => item.quantity > 0) // Remover items con cantidad 0

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      }
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      }
    }

    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    }

    case 'OPEN_CART': {
      return {
        ...state,
        isOpen: true,
      }
    }

    case 'CLOSE_CART': {
      return {
        ...state,
        isOpen: false,
      }
    }

    default:
      return state
  }
}

// Contexto
const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

// Provider del carrito
export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

// Hook personalizado para usar el carrito
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    console.warn('useCart must be used within a CartProvider')
    // Retornar objeto mock para evitar errores en SSR
    return {
      items: [],
      itemCount: 0,
      total: 0,
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      isOpen: false,
      toggleCart: () => {},
      openCart: () => {},
      closeCart: () => {},
    }
  }

  const { state, dispatch } = context

  // Funciones de conveniencia
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  return {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  }
}

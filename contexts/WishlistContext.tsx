'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Tipos de datos
export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  maxStock: number
}

export interface WishlistState {
  items: WishlistItem[]
  itemCount: number
}

// Acciones del wishlist
type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }

// Estado inicial
const initialState: WishlistState = {
  items: [],
  itemCount: 0,
}

// Reducer
const wishlistReducer = (
  state: WishlistState,
  action: WishlistAction
): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.id === action.payload.id
      )
      if (existingItem) {
        return state // Item already exists
      }
      const newItems = [...state.items, action.payload]
      return {
        items: newItems,
        itemCount: newItems.length,
      }
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      return {
        items: newItems,
        itemCount: newItems.length,
      }
    }
    case 'CLEAR_WISHLIST':
      return initialState
    default:
      return state
  }
}

// Contexto
const WishlistContext = createContext<{
  state: WishlistState
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
} | null>(null)

// Provider
export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)

  const addItem = (item: WishlistItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' })
  }

  const isInWishlist = (id: string) => {
    return state.items.some(item => item.id === id)
  }

  return (
    <WishlistContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// Hook para usar el contexto
export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

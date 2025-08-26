'use client'

import { useEffect, useState, useRef } from 'react'
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Heart,
  User,
  LogOut,
  Settings,
  Package,
  CreditCard,
  ChevronDown,
} from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [wishlistCount] = useState(2)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false) // Para evitar hydration mismatch
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Marcar como montado en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Detectar rol admin desde Supabase Auth (cliente)
  useEffect(() => {
    if (!mounted) return // Solo ejecutar después del mount

    const supabase = supabaseBrowser()

    const checkUserAndRole = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setLoggedIn(true)
          setUserEmail(user.email ?? null)
          setUserName(
            user.user_metadata?.name || user.user_metadata?.full_name || null
          )

          // Verificar rol admin en múltiples ubicaciones
          const roleFromApp = user.app_metadata?.role
          const roleFromUser = user.user_metadata?.role
          const isAdminUser =
            roleFromApp === 'admin' || roleFromUser === 'admin'

          console.log('User metadata:', user.user_metadata)
          console.log('App metadata:', user.app_metadata)
          console.log('Role from app:', roleFromApp)
          console.log('Role from user:', roleFromUser)
          console.log('Is admin:', isAdminUser)

          setIsAdmin(isAdminUser)
        } else {
          setLoggedIn(false)
          setUserEmail(null)
          setUserName(null)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error checking user:', error)
        setLoggedIn(false)
        setIsAdmin(false)
      }
    }

    // Verificar al montar
    checkUserAndRole()

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      if (session?.user) {
        setLoggedIn(true)
        setUserEmail(session.user.email ?? null)
        setUserName(
          session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            null
        )

        const roleFromApp = session.user.app_metadata?.role
        const roleFromUser = session.user.user_metadata?.role
        const isAdminUser = roleFromApp === 'admin' || roleFromUser === 'admin'

        setIsAdmin(isAdminUser)
      } else {
        setLoggedIn(false)
        setUserEmail(null)
        setUserName(null)
        setIsAdmin(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [mounted])

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Usar el contexto del carrito con manejo de errores
  let itemCount = 0
  let toggleCart = () => {}

  if (mounted) {
    try {
      const cart = useCart()
      if (cart) {
        itemCount = cart.itemCount || 0
        toggleCart = cart.toggleCart || (() => {})
      }
    } catch (error) {
      // Silenciar error en el servidor o cuando no hay CartProvider
      console.debug('CartProvider not available:', error)
    }
  }

  const scrollToSection = (href: string) => {
    if (!mounted) return // Evitar ejecución en servidor

    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
      // Aquí iría la lógica de búsqueda
      setIsSearchOpen(false)
    }
  }

  const handleCartClick = () => {
    toggleCart()
  }

  const handleWishlistClick = () => {
    console.log('Opening wishlist')
    // Aquí iría la lógica para abrir la lista de deseos
  }

  const handleUserClick = () => {
    if (loggedIn) {
      setIsUserMenuOpen(!isUserMenuOpen)
    } else {
      router.push('/login')
    }
  }

  const handleLogout = async () => {
    const supabase = supabaseBrowser()
    await supabase.auth.signOut()
    setIsAdmin(false)
    setLoggedIn(false)
    setUserEmail(null)
    setUserName(null)
    setIsUserMenuOpen(false)
    router.push('/')
  }

  const handleProfileAction = (action: string) => {
    setIsUserMenuOpen(false)
    switch (action) {
      case 'profile':
        router.push('/profile')
        break
      case 'orders':
        router.push('/orders')
        break
      case 'addresses':
        router.push('/account/addresses')
        break
      case 'settings':
        router.push('/settings')
        break
      case 'logout':
        handleLogout()
        break
      default:
        break
    }
  }

  const navigationItems = [
    { name: 'Inicio', href: '#home' },
    { name: 'Tienda', href: '#shop' },
    { name: 'Categorías', href: '#categories' },
    { name: 'Ofertas', href: '#offers' },
    { name: 'Contacto', href: '#contact' },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4">
        {/* Main header - Una sola fila */}
        <div className="flex items-center justify-between py-3 lg:py-4">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-rose-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                ✨ Dream
              </span>
              Wear
            </h1>
          </div>

          {/* Navigation - Desktop */}
          <nav
            className="hidden lg:block"
            role="navigation"
            aria-label="Main navigation"
          >
            <ul className="flex space-x-6 xl:space-x-8">
              {navigationItems.map(item => (
                <li key={item.name}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-700 hover:text-rose-500 font-medium transition-colors py-2 px-1 relative group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4 lg:mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="search"
                placeholder="Buscar pijamas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 h-8 w-8 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            {mounted && isAdmin && (
              <Link
                href="/admin"
                className="hidden md:inline-flex px-3 py-2 rounded-full border border-rose-300 text-rose-600 hover:bg-rose-50 text-sm font-medium"
              >
                Admin
              </Link>
            )}
            {mounted && loggedIn && (
              <Link
                href="/orders"
                className="hidden md:inline-flex px-3 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                title="Mis pedidos"
              >
                Pedidos
              </Link>
            )}
            {/* Mobile Search Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-rose-500 transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* User Account */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleUserClick}
                className="hidden sm:flex items-center space-x-1 p-2 text-gray-700 hover:text-rose-500 transition-colors"
                aria-label="User account"
                title={
                  mounted
                    ? loggedIn
                      ? 'Mi cuenta'
                      : 'Iniciar sesión'
                    : 'Usuario'
                }
              >
                <User size={20} />
                {mounted && loggedIn && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* User Dropdown Menu */}
              {mounted && loggedIn && isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {userName || 'Usuario'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {userEmail}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => handleProfileAction('profile')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={16} className="mr-3" />
                      Mi Perfil
                    </button>

                    <button
                      onClick={() => handleProfileAction('orders')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Package size={16} className="mr-3" />
                      Mis Pedidos
                    </button>

                    <button
                      onClick={() => handleProfileAction('addresses')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <CreditCard size={16} className="mr-3" />
                      Direcciones
                    </button>

                    <button
                      onClick={() => handleProfileAction('settings')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings size={16} className="mr-3" />
                      Configuración
                    </button>

                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Settings size={16} className="mr-3" />
                          Panel Admin
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => handleProfileAction('logout')}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlistClick}
              className="hidden sm:flex relative p-2 text-gray-700 hover:text-rose-500 transition-colors"
              aria-label={`Wishlist with ${wishlistCount} items`}
              title="guardados"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-gray-700 hover:text-rose-500 transition-colors group"
              aria-label={
                mounted
                  ? `Shopping cart with ${itemCount} items`
                  : 'Shopping cart'
              }
              title="mi carrito"
            >
              <ShoppingCart
                size={20}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="relative mt-4">
              <input
                type="search"
                placeholder="Buscar pijamas hermosas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-gray-50"
                aria-label="Search products"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-2 h-8 w-8 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav
          className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 py-4">
            {/* Mobile menu items */}
            <ul className="space-y-1">
              {navigationItems.map(item => (
                <li key={item.name}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="block py-3 px-4 text-gray-700 hover:text-rose-500 hover:bg-rose-50 font-medium transition-all duration-200 w-full text-left rounded-lg"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Mobile actions */}
            <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
              {/* User info for mobile */}
              {mounted && loggedIn && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {userName || 'Usuario'}
                      </p>
                      <p className="text-sm text-gray-600">{userEmail}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile menu buttons */}
              <div className="space-y-2">
                {mounted && loggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        handleProfileAction('profile')
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <User size={18} className="mr-3" />
                      Mi Perfil
                    </button>

                    <button
                      onClick={() => {
                        handleProfileAction('orders')
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Package size={18} className="mr-3" />
                      Mis Pedidos
                    </button>

                    <button
                      onClick={() => {
                        handleProfileAction('addresses')
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <CreditCard size={18} className="mr-3" />
                      Direcciones
                    </button>

                    <button
                      onClick={() => {
                        handleProfileAction('settings')
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Settings size={18} className="mr-3" />
                      Configuración
                    </button>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center w-full px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Settings size={18} className="mr-3" />
                        Panel Admin
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        handleProfileAction('logout')
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-t border-gray-200 mt-2 pt-4"
                    >
                      <LogOut size={18} className="mr-3" />
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center w-full px-4 py-3 text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-lg transition-colors justify-center"
                  >
                    <User size={18} className="mr-3" />
                    Iniciar Sesión
                  </Link>
                )}
              </div>

              {/* Bottom mobile actions */}
              <div className="flex items-center justify-around pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleWishlistClick()
                    setIsMenuOpen(false)
                  }}
                  className="flex flex-col items-center p-2 text-gray-700 hover:text-rose-500"
                >
                  <Heart size={20} />
                  <span className="text-xs mt-1 font-medium">Favoritos</span>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleCartClick()
                    setIsMenuOpen(false)
                  }}
                  className="flex flex-col items-center p-2 text-gray-700 hover:text-rose-500 relative"
                >
                  <ShoppingCart size={20} />
                  <span className="text-xs mt-1 font-medium">Carrito</span>
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

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
import { useCart } from '../../contexts/CartContext'
import MultiImageSelector from '../MultiImageSelector'
import Link from 'next/link'
import { supabaseBrowser } from '@/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchRetryCount, setSearchRetryCount] = useState(0)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false) // Nuevo estado para evitar búsquedas concurrentes

  // Timer para búsqueda automática con debouncing
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedVariations, setSelectedVariations] = useState<
    { index: number; image: string; variationName: string }[]
  >([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false) // Para evitar hydration mismatch
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchDropdownRef = useRef<HTMLDivElement>(null)

  const {
    itemCount: cartItemCount,
    toggleCart: toggleCartFunc,
    addItem,
  } = useCart()

  // Actualizar contador de wishlist
  const updateWishlistCount = () => {
    if (mounted && typeof window !== 'undefined' && window.localStorage) {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
        setWishlistCount(wishlist.length)
        setWishlistItems(wishlist)
      } catch (error) {
        console.error('Error reading wishlist from localStorage:', error)
        setWishlistCount(0)
        setWishlistItems([])
      }
    }
  }

  // Cargar productos para búsqueda
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  const loadAllProducts = async () => {
    try {
      setIsLoadingProducts(true)

      // Cargar productos de la base de datos
      const supabase = supabaseBrowser()
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')

      if (error) {
        console.error('Error loading products from database:', error)
        // No hacer return aquí, continuar con productos del JSON
      }

      // Cargar productos del archivo JSON (ofertas)
      let offerProducts = []
      try {
        const response = await fetch('/data/products.json')
        const jsonData = await response.json()
        offerProducts = jsonData.products || []
      } catch (jsonError) {
        console.error('Error loading products from JSON:', jsonError)
        // Continuar sin productos del JSON
      }

      // Combinar productos
      const combinedProducts = [
        ...(dbProducts || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: getValidImageUrl(
            Array.isArray(p.images) && p.images.length > 0
              ? p.images[0]
              : undefined
          ),
          category: p.category || 'General',
          size: Array.isArray(p.sizes) ? p.sizes : [],
          fabricType: Array.isArray(p.colors) ? p.colors : ['Algodón'],
          description: p.description || '',
          source: 'database',
        })),
        ...offerProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: getValidImageUrl(p.image),
          category: p.category,
          size: p.size || [],
          fabricType: p.colors || ['Algodón'],
          description: p.description || '',
          source: 'offers',
        })),
      ]

      setAllProducts(combinedProducts)
      console.log('Productos cargados para búsqueda:', combinedProducts.length)
      console.log('Primeros productos:', combinedProducts.slice(0, 2))
    } catch (error) {
      console.error('Error loading products:', error)
      // Asegurar que los productos se marquen como cargados incluso con error
      setAllProducts([])
    } finally {
      setIsLoadingProducts(false)
    }
  }

  // Marcar como montado en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar productos solo después del montaje
  useEffect(() => {
    if (mounted) {
      updateWishlistCount()
      loadAllProducts()
    }

    // Escuchar cambios en wishlist
    const handleWishlistUpdate = () => {
      if (mounted) {
        updateWishlistCount()
      }
    }

    // Escuchar eventos de detalles de producto
    const handleProductDetailsEvent = (event: any) => {
      const detail = event.detail
      setSelectedProduct(detail)
      // Autoseleccionar primera talla disponible si existe
      const firstSize =
        Array.isArray(detail?.size) && detail.size.length > 0
          ? detail.size[0]
          : null
      setSelectedSize(firstSize || null)
      // Resetear variaciones seleccionadas
      setSelectedVariations([])
      setIsProductDetailsOpen(true)
    }

    // Agregar event listeners
    window.addEventListener('wishlistUpdated', handleWishlistUpdate)
    window.addEventListener('openProductDetails', handleProductDetailsEvent)

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate)
      window.removeEventListener(
        'openProductDetails',
        handleProductDetailsEvent
      )
      // Limpiar timeout de búsqueda
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [mounted])

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

  // Cerrar menú de usuario y dropdown de búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }

      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchResultsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Usar el contexto del carrito con manejo de errores
  let itemCount = 0

  if (mounted) {
    try {
      itemCount = cartItemCount || 0
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

  // Función helper para validar URLs de imágenes
  const getValidImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl || imageUrl.trim() === '') {
      return '/placeholder.jpg'
    }

    // Si es una URL relativa que no comienza con /, agregar /
    if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
      return `/${imageUrl}`
    }

    return imageUrl
  }

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Evitar búsquedas concurrentes
    if (isSearching) {
      console.log('Búsqueda ya en progreso, ignorando...')
      return
    }

    const query = searchQuery.trim()
    console.log('Búsqueda iniciada con query:', query)

    if (!query) {
      console.log('Query vacío, limpiando resultados')
      setSearchResults([])
      setIsSearchResultsOpen(false)
      return
    }

    setIsSearching(true)

    try {
      // Si no hay productos cargados y es el primer intento, cargarlos
      if (allProducts.length === 0 && searchRetryCount === 0) {
        console.log('No hay productos cargados, cargando productos...')
        setSearchRetryCount(1)

        try {
          await loadAllProducts()
          console.log('Productos cargados exitosamente')

          // Esperar a que el estado se actualice
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          console.error('Error al cargar productos:', error)
          setSearchRetryCount(0)
          setIsSearching(false)
          return
        }
      }

      // Obtener productos actuales (pueden haber sido cargados recién)
      const productsToSearch = allProducts.length > 0 ? allProducts : []

      if (productsToSearch.length === 0) {
        console.log('No hay productos disponibles para búsqueda')
        setSearchResults([])
        setIsSearchResultsOpen(true)
        setIsSearching(false)
        return
      }

      // Buscar en todos los productos
      const queryLower = query.toLowerCase()
      const results = productsToSearch.filter(product => {
        if (!product) return false

        const nameMatch = product.name?.toLowerCase().includes(queryLower)
        const categoryMatch = product.category
          ?.toLowerCase()
          .includes(queryLower)
        const descriptionMatch = product.description
          ?.toLowerCase()
          .includes(queryLower)
        const sizeMatch =
          Array.isArray(product.size) &&
          product.size.some((s: string) =>
            s?.toLowerCase().includes(queryLower)
          )
        const fabricMatch =
          Array.isArray(product.fabricType) &&
          product.fabricType.some((f: string) =>
            f?.toLowerCase().includes(queryLower)
          )

        return (
          nameMatch ||
          categoryMatch ||
          descriptionMatch ||
          sizeMatch ||
          fabricMatch
        )
      })

      console.log('Resultados encontrados:', results.length)
      setSearchResults(results)
      setIsSearchOpen(false)
      setIsSearchResultsOpen(true)
      setSearchRetryCount(0) // Reset after successful search
    } catch (error) {
      console.error('Error durante la búsqueda:', error)
      setSearchResults([])
      setIsSearchResultsOpen(false)
    } finally {
      setIsSearching(false)
    }
  }

  // Función para cancelar la búsqueda
  const cancelSearch = () => {
    console.log('Cancelando búsqueda...')
    setIsSearching(false)
    setSearchQuery('')
    setSearchResults([])
    setIsSearchResultsOpen(false)
    setIsSearchOpen(false)
    setSearchRetryCount(0)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }
  }

  // Función para manejar cambios en el input de búsqueda con debouncing
  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value)

    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Limpiar resultados si el input está vacío
    if (value.trim() === '') {
      setSearchResults([])
      setIsSearchResultsOpen(false)
      setIsSearching(false) // También parar cualquier búsqueda en progreso
      return
    }

    // Ejecutar búsqueda automática después de 300ms
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim().length >= 2) {
        // Solo buscar si hay al menos 2 caracteres
        handleSearch()
      }
    }, 300)
  }

  const handleCartClick = () => {
    toggleCartFunc()
  }

  const handleWishlistClick = () => {
    updateWishlistCount() // Actualizar datos antes de abrir
    setIsWishlistOpen(true)
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
    { name: 'Tienda', href: '#products-heading' },
    { name: 'Colección', href: '#collection-heading' },
    { name: 'Ofertas', href: '#specialoffers' },
    { name: 'Contacto', href: '#contact' },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4">
        {/* Main header - Una sola fila */}
        <div className="flex items-center justify-between py-1 lg:py-2">
          {/* Mobile Menu Button */}
          {mounted && (
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-rose-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mounted ? isMenuOpen : false}
            >
              {mounted ? (
                isMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )
              ) : (
                <Menu size={24} />
              )}
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center">
            <div className="mr-1 w-full max-w-[240px] sm:max-w-[300px] md:max-w-[380px] lg:max-w-[520px]">
              <Link href="/" aria-label="Ir al inicio">
                <img
                  src="/logotipo/logo_edit_2.png"
                  alt="PijamaCandy Logo"
                  className="block w-full h-auto max-h-24 object-contain cursor-pointer"
                />
              </Link>
            </div>
            {/*<h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              ✨ Pijama
              </span>
              Candy
            </h1>*/}
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
          <div
            className="hidden md:flex flex-1 max-w-sm mx-4 lg:mx-6 relative"
            ref={searchDropdownRef}
          >
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="search"
                placeholder="Buscar pijamas..."
                value={searchQuery}
                onChange={e => handleSearchInputChange(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setIsSearchResultsOpen(true)
                  }
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSearchResults([])
                    setIsSearchResultsOpen(false)
                  }}
                  className="absolute right-12 top-1 h-8 w-8 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoadingProducts || isSearching}
                className="absolute right-1 top-1 h-8 w-8 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                aria-label="Search"
              >
                {isLoadingProducts || isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Search size={16} />
                )}
              </button>
            </form>

            {/* Search Results Dropdown */}
            {mounted && isSearchResultsOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-500 px-2 py-1 border-b">
                    {searchResults.length} resultado
                    {searchResults.length !== 1 ? 's' : ''} para "{searchQuery}"
                  </div>
                  {searchResults.slice(0, 8).map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                      onClick={() => {
                        // Emitir evento personalizado para abrir detalles del producto
                        window.dispatchEvent(
                          new CustomEvent('openProductDetails', {
                            detail: product,
                          })
                        )
                        setIsSearchResultsOpen(false)
                        setSearchQuery('')
                      }}
                    >
                      <div className="w-12 h-12 flex-shrink-0 mr-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={e => {
                            const target = e.target as HTMLImageElement
                            if (target.src !== '/placeholder.jpg') {
                              target.src = '/placeholder.jpg'
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {product.category}
                        </p>
                        <p className="text-sm font-semibold text-rose-600">
                          ${product.price?.toLocaleString('es-CO') || 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            addItem({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              size: product.size?.[0] || 'M',
                              color: product.fabricType?.[0] || 'Algodón',
                              maxStock: 10,
                            })
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                          title="Agregar al carrito"
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {searchResults.length > 8 && (
                    <div className="px-2 py-2 border-t text-center">
                      <button
                        onClick={() => {
                          // Mostrar todos los resultados en modal (opcional)
                          console.log('Ver todos los resultados')
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                      >
                        Ver todos los {searchResults.length} resultados
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {mounted &&
              isSearchResultsOpen &&
              searchResults.length === 0 &&
              searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 text-center">
                    <Search size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      No se encontraron resultados para "{searchQuery}"
                    </p>
                  </div>
                </div>
              )}
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

                    {mounted && isAdmin && (
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
              aria-label={`Wishlist with ${mounted ? wishlistCount : 0} items`}
              title="guardados"
            >
              <Heart size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
        {mounted && isSearchOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 relative">
            <form onSubmit={handleSearch} className="relative mt-4">
              <input
                type="search"
                placeholder="Buscar pijamas hermosas..."
                value={searchQuery}
                onChange={e => handleSearchInputChange(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setIsSearchResultsOpen(true)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-gray-50"
                aria-label="Search products"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSearchResults([])
                    setIsSearchResultsOpen(false)
                  }}
                  className="absolute right-14 top-2 h-8 w-8 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoadingProducts || isSearching}
                className="absolute right-2 top-2 h-8 w-8 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                aria-label="Search"
              >
                {isLoadingProducts || isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Search size={16} />
                )}
              </button>
            </form>

            {/* Mobile Search Results Dropdown */}
            {mounted && isSearchResultsOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-500 px-2 py-1 border-b">
                    {searchResults.length} resultado
                    {searchResults.length !== 1 ? 's' : ''} para "{searchQuery}"
                  </div>
                  {searchResults.slice(0, 6).map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent('openProductDetails', {
                            detail: product,
                          })
                        )
                        setIsSearchResultsOpen(false)
                        setSearchQuery('')
                        setIsSearchOpen(false)
                      }}
                    >
                      <div className="w-10 h-10 flex-shrink-0 mr-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={e => {
                            const target = e.target as HTMLImageElement
                            if (target.src !== '/placeholder.jpg') {
                              target.src = '/placeholder.jpg'
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {product.category}
                        </p>
                        <p className="text-sm font-semibold text-rose-600">
                          ${product.price?.toLocaleString('es-CO') || 'N/A'}
                        </p>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            size: product.size?.[0] || 'M',
                            color: product.fabricType?.[0] || 'Algodón',
                            maxStock: 10,
                          })
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                        title="Agregar al carrito"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  ))}
                  {searchResults.length > 6 && (
                    <div className="px-2 py-2 border-t text-center">
                      <button
                        onClick={() => {
                          setIsSearchResultsOpen(false)
                          setIsSearchOpen(false)
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                      >
                        Ver todos los {searchResults.length} resultados
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile No Results Message */}
            {mounted &&
              isSearchResultsOpen &&
              searchResults.length === 0 &&
              searchQuery.trim() && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 text-center">
                    <Search size={20} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      No se encontraron resultados para "{searchQuery}"
                    </p>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {mounted && isMenuOpen && (
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

                    {mounted && isAdmin && (
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
                  {mounted && wishlistCount > 0 && (
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

      {/* Modal de Wishlist */}
      {mounted && isWishlistOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                ❤️ Mis Favoritos ({mounted ? wishlistCount : 0})
              </h2>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Tu lista de favoritos está vacía
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Haz clic en el corazón de los productos que te gusten para
                    guardarlos aquí
                  </p>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Explorar Productos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-lg p-3 border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-stretch space-x-3 h-36">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-full object-cover rounded-lg flex-shrink-0"
                          onError={e => {
                            const target = e.target as HTMLImageElement
                            if (target.src !== '/placeholder.jpg') {
                              target.src = '/placeholder.jpg'
                            }
                          }}
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2 leading-tight">
                              {item.name}
                            </h3>
                            <p className="text-blue-600 font-bold text-sm mb-2">
                              ${item.price?.toLocaleString('es-CO') || 'N/A'}
                            </p>
                            <div className="text-xs text-gray-600 space-y-1">
                              <p>
                                Talla:{' '}
                                {Array.isArray(item.size)
                                  ? item.size.join(', ')
                                  : item.size || 'N/A'}
                              </p>
                              <p>
                                Tipo de tela:{' '}
                                {item.fabricType || item.color || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => {
                                // Abrir modal de detalles para seleccionar talla antes de agregar
                                const baseId = String(item.id).replace(
                                  /-img-\d+$/,
                                  ''
                                )
                                window.dispatchEvent(
                                  new CustomEvent('openProductDetails', {
                                    detail: {
                                      id: baseId,
                                      name: item.name,
                                      price: item.price,
                                      image: item.image,
                                      images: [item.image],
                                      description:
                                        selectedProduct?.description || '',
                                      category:
                                        selectedProduct?.category || 'General',
                                      size: Array.isArray(item.size)
                                        ? item.size
                                        : selectedProduct?.size || ['M'],
                                      fabricType: item.fabricType ||
                                        selectedProduct?.fabricType || [
                                          'Algodón',
                                        ],
                                      maxStock: item.maxStock || 10,
                                    },
                                  })
                                )
                                setIsWishlistOpen(false)
                              }}
                              className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                            >
                              Agregar
                            </button>
                            <button
                              onClick={() => {
                                // Remover de wishlist
                                const updatedWishlist = wishlistItems.filter(
                                  (w: any) => w.id !== item.id
                                )
                                localStorage.setItem(
                                  'wishlist',
                                  JSON.stringify(updatedWishlist)
                                )
                                updateWishlistCount()
                              }}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resultados de Búsqueda - DESHABILITADO, usando dropdown */}
      {false && mounted && isSearchResultsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                🔍 Resultados para "{searchQuery}" (
                {mounted ? searchResults.length : 0})
              </h2>
              <button
                onClick={cancelSearch}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {mounted && searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Intenta con otros términos de búsqueda como nombre,
                    categoría, talla o tipo de tela
                  </p>
                  <button
                    onClick={cancelSearch}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mounted &&
                    searchResults.map((product: any) => (
                      <div
                        key={product.id}
                        className="bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                            onError={e => {
                              const target = e.target as HTMLImageElement
                              if (target.src !== '/placeholder.jpg') {
                                target.src = '/placeholder.jpg'
                              }
                            }}
                          />
                          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-blue-600 font-bold mb-2">
                            ${product.price?.toLocaleString('es-CO') || 'N/A'}
                          </p>
                          <div className="text-sm text-gray-600 space-y-1 mb-3">
                            <p>Categoría: {product.category}</p>
                            <p>Talla: {product.size?.join(', ') || 'N/A'}</p>
                            <p>
                              Tipo de tela:{' '}
                              {product.fabricType?.join(', ') || 'N/A'}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                // Agregar al carrito
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  size: product.size?.[0] || 'M',
                                  color: product.fabricType?.[0] || 'Algodón',
                                  maxStock: 10,
                                })
                              }}
                              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                            >
                              Agregar
                            </button>
                            <button
                              onClick={() => {
                                // Emitir evento personalizado para abrir detalles del producto
                                window.dispatchEvent(
                                  new CustomEvent('openProductDetails', {
                                    detail: product,
                                  })
                                )
                                setIsSearchResultsOpen(false)
                              }}
                              className="bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
                            >
                              Ver modelos
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles de Producto */}
      {mounted && isProductDetailsOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-emerald-50">
              <h2 className="text-3xl font-bold text-gray-800">
                {selectedProduct.name}
              </h2>
              <button
                onClick={() => setIsProductDetailsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Selector múltiple de imágenes */}
                <div className="lg:col-span-2">
                  <MultiImageSelector
                    images={
                      Array.isArray(selectedProduct.images) &&
                      selectedProduct.images.length > 0
                        ? selectedProduct.images
                        : [selectedProduct.image]
                    }
                    productName={selectedProduct.name}
                    maxSelections={5}
                    onSelectionChange={setSelectedVariations}
                  />
                </div>

                {/* Información y acciones */}
                <div className="lg:col-span-1 space-y-6 bg-gray-50 rounded-xl p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {selectedProduct.description ||
                        'Pijama de alta calidad con materiales premium. Diseño cómodo y elegante perfecto para el descanso.'}
                    </p>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-emerald-600">
                          $
                          {selectedProduct.price?.toLocaleString('es-CO') ||
                            'N/A'}
                        </span>
                        {selectedProduct.originalPrice &&
                          selectedProduct.originalPrice >
                            selectedProduct.price && (
                            <span className="text-lg text-gray-400 line-through">
                              $
                              {selectedProduct.originalPrice?.toLocaleString(
                                'es-CO'
                              )}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Selector de tallas */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                      Tallas Disponibles
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.isArray(selectedProduct.size) &&
                      selectedProduct.size.length > 0 ? (
                        selectedProduct.size.map((size: string) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-full py-2 border-2 rounded-lg text-sm font-semibold transition-all ${
                              selectedSize === size
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                            }`}
                          >
                            {size}
                          </button>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 col-span-4">
                          Tallas no disponibles
                        </span>
                      )}
                    </div>
                    {!selectedSize && (
                      <p className="mt-2 text-xs text-red-600">
                        Selecciona una talla
                      </p>
                    )}
                  </div>

                  {/* Tipos de tela (solo informativo) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                      Tipos de Tela
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedProduct.fabricType) &&
                      selectedProduct.fabricType.length > 0 ? (
                        selectedProduct.fabricType.map((fabric: string) => (
                          <span
                            key={fabric}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                          >
                            {fabric}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          Información no disponible
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <button
                      disabled={
                        !selectedSize || selectedVariations.length === 0
                      }
                      onClick={() => {
                        if (!selectedSize || selectedVariations.length === 0)
                          return
                        const color =
                          Array.isArray(selectedProduct.fabricType) &&
                          selectedProduct.fabricType.length > 0
                            ? selectedProduct.fabricType[0]
                            : 'Algodón'
                        selectedVariations.forEach(v => {
                          const composedId = `${selectedProduct.id}-img${
                            v.index + 1
                          }-${selectedSize}`
                          addItem({
                            id: composedId,
                            name: `${selectedProduct.name} - ${v.variationName}`,
                            price: selectedProduct.price,
                            image: v.image,
                            size: selectedSize,
                            color,
                            maxStock: selectedProduct.maxStock || 10,
                          })
                        })

                        setIsProductDetailsOpen(false)
                      }}
                      className={`w-full py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                        selectedSize && selectedVariations.length > 0
                          ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={20} />
                      {!selectedSize
                        ? 'Selecciona una talla'
                        : selectedVariations.length === 0
                        ? 'Selecciona al menos un diseño'
                        : `Agregar ${selectedVariations.length} diseño${
                            selectedVariations.length > 1 ? 's' : ''
                          } (talla ${selectedSize}) al carrito`}
                    </button>

                    <button
                      disabled={selectedVariations.length === 0}
                      onClick={() => {
                        // Wishlist: solo imágenes, sin talla, sin duplicados
                        if (selectedVariations.length === 0) return
                        const existing = JSON.parse(
                          localStorage.getItem('wishlist') || '[]'
                        )

                        const toAdd: any[] = []
                        const seen = new Set(existing.map((it: any) => it.id))
                        selectedVariations.forEach(v => {
                          const wid = `${selectedProduct.id}-img-${v.index + 1}`
                          if (!seen.has(wid)) {
                            seen.add(wid)
                            toAdd.push({
                              id: wid,
                              name: `${selectedProduct.name} - ${v.variationName}`,
                              price: selectedProduct.price,
                              image: v.image,
                              size: selectedProduct.size, // informativo
                              fabricType: selectedProduct.fabricType,
                              maxStock: selectedProduct.maxStock || 10,
                            })
                          }
                        })

                        if (toAdd.length > 0) {
                          const updated = [...existing, ...toAdd]
                          localStorage.setItem(
                            'wishlist',
                            JSON.stringify(updated)
                          )
                          updateWishlistCount()
                          window.dispatchEvent(new Event('wishlistUpdated'))
                        }
                        setIsProductDetailsOpen(false)
                      }}
                      className={`w-full border-2 py-3 px-6 rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 ${
                        selectedVariations.length > 0
                          ? 'border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600'
                          : 'border-gray-300 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Heart size={18} />
                      {selectedVariations.length === 0
                        ? 'Selecciona al menos un diseño'
                        : selectedVariations.length > 1
                        ? 'Agregar varios diseños a favoritos'
                        : 'Agregar a favoritos'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

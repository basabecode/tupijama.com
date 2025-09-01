// Instrucciones para integrar el sistema de carrito correctamente

// 1. En tu archivo raíz (page.tsx, layout.tsx, o App.tsx):

import { CartProvider } from './contexts/CartContext'
import Header from './components/Header'
import CartSidebar from './components/CartSidebar'
import Banner from './components/Banner'

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (

<html lang="es">
<body>
{/_ IMPORTANTE: CartProvider debe envolver TODA la aplicación _/}
<CartProvider>
<Header />
<main>
<Banner />
{children}
</main>
<CartSidebar />
</CartProvider>
</body>
</html>
)
}

// 2. Si estás usando Next.js 13+ con app directory, modifica tu layout.tsx:

// app/layout.tsx
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import Header from '@/components/Header'
import CartSidebar from '@/components/CartSidebar'

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (

<html lang="es">
<body>
<CartProvider>
<Header />
{children}
<CartSidebar />
</CartProvider>
</body>
</html>
)
}

// 3. Para testing del carrito, crea una página de prueba:

// app/test-cart/page.tsx
'use client'

import ProductCard from '@/components/products/ProductCard'

const testProducts = [
{
id: '1',
name: 'Pijama de Prueba',
price: 50000,
image: '/piyamas/tela_chalis_crepe.jpg',
rating: 4.5,
reviews: 100,
sizes: ['S', 'M', 'L'],
colors: ['Rosa', 'Azul'],
maxStock: 10,
}
]

export default function TestCartPage() {
return (

<div className="container mx-auto px-4 py-8">
<h1 className="text-2xl font-bold mb-6">Prueba del Carrito</h1>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{testProducts.map(product => (
<ProductCard key={product.id} {...product} />
))}
</div>
</div>
)
}

// 4. Verifica que las rutas de importación sean correctas:
// - Si usas alias (@/), asegúrate de que esté configurado en tsconfig.json
// - Si no usas alias, usa rutas relativas: '../contexts/CartContext'

// 5. Ejemplo de tsconfig.json con alias:
{
"compilerOptions": {
"baseUrl": ".",
"paths": {
"@/_": ["./_"]
}
}
}

// SOLUCIÓN AL ERROR DE LA LÍNEA 171:
// El error ocurre porque el Header intenta usar useCart()
// sin estar dentro de un CartProvider.
//
// SOLUCIÓN:
// 1. Asegúrate de que CartProvider envuelve toda la app
// 2. Verifica las rutas de importación
// 3. Si el error persiste, puedes usar un fallback:

/\*
export default function Header() {
// Fallback para evitar errores si no hay CartProvider
let itemCount = 0
let toggleCart = () => {}

try {
const cart = useCart()
itemCount = cart.itemCount
toggleCart = cart.toggleCart
} catch (error) {
console.warn('Header: CartProvider no encontrado, usando valores por defecto')
}

// ... resto del código
}
\*/

instrucciones para agente Gemini

---

# Desarrollo Ecommerce Pijamas con Supabase y Next.js

## Objetivo

Implementar una solución ecommerce moderna para venta de pijamas, con manejo eficiente de inventario, autenticación de usuarios y una experiencia optimizada de compra. El sistema debe ser seguro, modular y escalable, utilizando Supabase como backend y el stack tecnológico actual.

---

## Stack Tecnológico

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript (modo estricto), Tailwind CSS, Radix UI, shadcn/ui, Lucide React
- **Backend/API:** Next.js API routes, Supabase
- **Estado:** React Context API
- **Formularios:** React Hook Form + Zod

---

## Módulos y Requisitos Clave

### 1. Gestión de Productos e Inventario

- **Modelo:** Productos con nombre, descripción, categoría, precio, stock, tallas, colores, imágenes (storage en Supabase), estado, tags.
- **Subida de imágenes:** Integrar con Supabase Storage desde el panel admin, validando tipo y tamaño.
- **CRUD:** Endpoints protegidos para crear, editar, eliminar y listar productos (solo admin).
- **Frontend:** Formularios con React Hook Form + Zod. Visualización categorizada (por tipo, talla, color).
- **Performance:** Paginación, lazy loading de imágenes, filtros dinámicos.

### 2. Autenticación de Usuarios

- **Registro/Login:** Supabase Auth (email/password, OAuth con Google).
- **Roles:** Admin y usuario, con rutas y acciones protegidas.
- **Gestión de sesión:** Tokens seguros con refresco, logout global vía Context API.
- **Recuperación de contraseña:** Flujo seguro y claro.
- **Buenas prácticas:** Validación con Zod, protección CSRF/XSS.

### 3. Carrito de Compras y Órdenes (sin pasarela de pago por ahora)

- **Carrito:** Agregar, editar y eliminar productos. Validación de stock.
- **Órdenes:** Registro en Supabase con referencia a usuario y productos. Estado de orden (pendiente, confirmada, enviada).
- **Frontend:** Flujo de compra claro, con feedback en cada paso.

---

## Buenas Prácticas Senior

- **Modularidad:** Estructura clara en `/app`, `/components`, `/lib`, `/api`, `/context`.
- **Seguridad:** Validación en frontend y backend, sanitización, CORS, HTTPS.
- **Performance:** SSR/SSG donde aporte valor, optimización de assets e imágenes.
- **Escalabilidad:** Modelos listos para crecimiento futuro (ejemplo: integrar pasarela de pagos más adelante).
- **Accesibilidad:** Conforme a WCAG, navegación con teclado, feedback visual/auditivo.
- **SEO:** Etiquetas meta, estructura semántica, optimización de carga.
- **Documentación:** Comentarios claros, README, docs por módulo.

---

## Entregable

- Archivos esenciales: configuración Supabase, API routes, componentes y páginas principales.
- Ejemplos funcionales: productos, auth, carrito y órdenes.
- Documentación breve por módulo.
- Sin archivos innecesarios ni mockups.

---

## Flujo de Usuario

1. **Admin** sube productos (pijamas) con imágenes, tallas y colores.
2. **Usuario** navega catálogo, se registra/inicia sesión y añade productos al carrito.
3. En **checkout**, se registra la orden y se descuenta el inventario.
4. El sistema confirma la compra y actualiza el historial del usuario.

---

## Restricciones

- Nada innecesario: solo código relevante, modular y seguro.
- Listo para ser extendido (ejemplo: integración de pagos en el futuro).

---

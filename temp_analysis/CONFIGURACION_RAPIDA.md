# ⚡ CONFIGURACIÓN RÁPIDA SUPABASE - 5 MINUTOS

## 🎯 ACCIONES CRÍTICAS

### 1️⃣ STORAGE (2 min)

```
Dashboard → Storage → Create bucket
├── Name: product-images
├── Public: ✅ ON
└── Save
```

### 2️⃣ AUTH URLS (2 min)

```
Dashboard → Authentication → URL Configuration
├── Site URL: http://localhost:3000
└── Redirect URLs (add 3):
    ├── http://localhost:3000
    ├── http://localhost:3000/login
    └── http://localhost:3000/update-password
```

### 3️⃣ EMAIL (1 min)

```
Dashboard → Authentication → Settings
└── Enable email confirmations: ❌ OFF (para testing rápido)
```

---

## ✅ VALIDACIÓN INMEDIATA

### Check 1: Health Endpoint

```bash
curl http://localhost:3000/api/health
# Buscar: "hasProductImages": true
```

### Check 2: Registro de Usuario

```
1. http://localhost:3000/login
2. "Crear cuenta"
3. Email real + password
4. Debe crear usuario exitosamente
```

### Check 3: Login

```
1. Usar credenciales del registro
2. Debe redirigir a home page
3. Header debe mostrar usuario logueado
```

---

## 🚨 ERRORES COMUNES

| Error                     | Causa                 | Fix                       |
| ------------------------- | --------------------- | ------------------------- |
| `hasProductImages: false` | Bucket no creado      | Crear bucket público      |
| `Invalid redirect URL`    | URLs mal configuradas | Verificar URLs exactas    |
| `Invalid credentials`     | Email no verificado   | Desactivar confirmation   |
| `Network error`           | Site URL incorrecta   | Configurar localhost:3000 |

---

## 📞 ¿NECESITAS AYUDA?

Si algún paso no funciona:

1. 📸 Toma screenshot del error
2. 📋 Comparte qué paso específico falla
3. 🔍 Revisamos juntos la configuración

**¡Tu app está a 5 minutos de estar 100% funcional!** 🚀

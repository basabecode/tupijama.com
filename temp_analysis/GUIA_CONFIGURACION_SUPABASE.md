# 🔧 GUÍA COMPLETA: CONFIGURACIÓN SUPABASE DASHBOARD

## 📋 RESUMEN DE CONFIGURACIÓN NECESARIA

Para que el registro de usuarios funcione completamente, necesitas configurar **3 elementos** en tu Dashboard de Supabase:

1. **Storage Bucket** para imágenes de productos
2. **Authentication URLs** para redirects de login/registro
3. **Email Configuration** para verificación de usuarios

---

## 🗂️ PASO 1: CONFIGURAR STORAGE BUCKET

### 1.1 Acceder a Storage

```
1. Abrir https://supabase.com/dashboard
2. Seleccionar tu proyecto: "dvfcpsmempdncavhkwcd"
3. En el menú lateral izquierdo → Click "Storage"
```

### 1.2 Crear Bucket

```
4. Click botón "Create bucket" (verde, esquina superior derecha)
5. Llenar formulario:
   - Bucket name: product-images
   - Public bucket: ✅ ACTIVAR (muy importante)
   - File size limit: dejar por defecto (50MB)
   - Allowed file types: dejar vacío (permite todos)
6. Click "Create bucket"
```

### 1.3 Verificar Bucket Creado

```
7. Debe aparecer "product-images" en la lista
8. Status: debe mostrar "Public" con ícono de ojo abierto
```

### ✅ **Validación Storage:**

- Visita `http://localhost:3000/api/health`
- Busca: `"hasProductImages": true` ← debe cambiar a `true`

---

## 🔐 PASO 2: CONFIGURAR AUTHENTICATION URLs

### 2.1 Acceder a Authentication

```
1. En menú lateral izquierdo → Click "Authentication"
2. Sub-menú → Click "URL Configuration"
```

### 2.2 Configurar Site URL

```
3. En el campo "Site URL":
   - Actual: puede estar vacío o tener otra URL
   - Cambiar a: http://localhost:3000
   - Click "Save" (botón verde)
```

### 2.3 Agregar Redirect URLs

```
4. En la sección "Redirect URLs":
   - Click "Add URL" (botón azul)
   - Agregar UNA POR UNA:

     URL 1: http://localhost:3000
     → Click "Add URL"

     URL 2: http://localhost:3000/login
     → Click "Add URL"

     URL 3: http://localhost:3000/update-password
     → Click "Add URL"

5. Al final debes tener 3 URLs en la lista
6. Click "Save" (botón verde al final)
```

### 2.4 Verificar Configuración

```
La pantalla debe mostrar:

Site URL: http://localhost:3000

Redirect URLs:
• http://localhost:3000
• http://localhost:3000/login
• http://localhost:3000/update-password
```

---

## 📧 PASO 3: VERIFICAR EMAIL CONFIGURATION

### 3.1 Acceder a Email Settings

```
1. Mantente en "Authentication"
2. Sub-menú → Click "Settings"
3. Scroll hacia abajo hasta "SMTP Settings"
```

### 3.2 Opciones de Configuración

#### OPCIÓN A: Usar Supabase Email (Recomendado para testing)

```
4. Si ves "Enable custom SMTP": mantenerlo DESACTIVADO
5. Supabase usará su servicio interno de emails
6. Límite: ~50 emails/día (suficiente para testing)
```

#### OPCIÓN B: Configurar SMTP Propio (Opcional)

```
4. Si quieres usar Gmail/otro proveedor:
   - Enable custom SMTP: ✅ ACTIVAR
   - SMTP Host: smtp.gmail.com
   - SMTP Port: 587
   - SMTP User: tu-email@gmail.com
   - SMTP Pass: [App Password de Gmail]
   - Sender name: Tu App
   - Sender email: tu-email@gmail.com
```

### 3.3 Configurar Email Confirmation

```
5. En la misma página, buscar "User Signups"
6. Opción "Enable email confirmations":

   PARA TESTING RÁPIDO:
   - ❌ DESACTIVAR (permite login inmediato)

   PARA PRODUCCIÓN:
   - ✅ ACTIVAR (requiere confirmar email)

7. Click "Save" (botón verde)
```

---

## 🧪 PASO 4: TESTING COMPLETO

### 4.1 Test Health Check

```
1. Abrir: http://localhost:3000/api/health
2. Verificar JSON response:
   {
     "ok": true,
     "checks": {
       "env": { "todas": true },
       "db": { "ok": true },
       "storage": { "ok": true, "hasProductImages": true }, ← DEBE SER TRUE
       "authAdmin": { "ok": true }
     }
   }
```

### 4.2 Test Registro de Usuario

```
1. Abrir: http://localhost:3000/login
2. Click "¿No tienes cuenta? Regístrate"
3. Llenar formulario:
   - Email: tu-email-real@gmail.com (usa un email que puedas revisar)
   - Password: 123456 (mínimo 6 caracteres)
   - Confirmar password: 123456
4. Click "Crear cuenta"

RESULTADOS ESPERADOS:

Si Email Confirmation DESACTIVADA:
✅ "Usuario creado exitosamente" + redirect automático

Si Email Confirmation ACTIVADA:
✅ "Hemos enviado un correo de verificación"
→ Revisar bandeja y confirmar
→ Luego hacer login manual
```

### 4.3 Verificar Usuario en Dashboard

```
1. Ir a Supabase Dashboard
2. Authentication → Users
3. Debe aparecer tu usuario con:
   - Email: el que ingresaste
   - Status: "Confirmed" o "Unconfirmed"
   - Created: fecha actual
```

### 4.4 Test Login

```
1. Si el registro fue exitoso, probar login:
2. Ir a: http://localhost:3000/login
3. Usar "Con contraseña"
4. Ingresar email/password del registro
5. Debe redirigir a página principal
```

---

## 🚨 TROUBLESHOOTING COMÚN

### Error: "Invalid login credentials"

```
CAUSA: Email no verificado (si confirmation está activa)
SOLUCIÓN:
1. Revisar bandeja de correo
2. Click en enlace de verificación
3. Intentar login nuevamente
```

### Error: "Invalid redirect URL"

```
CAUSA: URLs no configuradas correctamente
SOLUCIÓN:
1. Verificar URLs exactas en Dashboard
2. Asegurar que NO hay espacios extra
3. Verificar http:// vs https://
```

### Error: Storage "hasProductImages": false

```
CAUSA: Bucket no creado o no público
SOLUCIÓN:
1. Verificar bucket existe
2. Verificar que es "Public"
3. Refresh del health endpoint
```

### Error: "Network error" en registro

```
CAUSA: Site URL no configurada
SOLUCIÓN:
1. Verificar Site URL = http://localhost:3000
2. Guardar configuración
3. Esperar ~1 minuto para propagación
```

---

## 📋 CHECKLIST FINAL

Antes de probar el sistema completo, verificar:

### Configuración Supabase:

- [ ] ✅ Bucket "product-images" creado y público
- [ ] ✅ Site URL: http://localhost:3000
- [ ] ✅ 3 Redirect URLs agregadas
- [ ] ✅ Email confirmation configurada (ON/OFF según preferencia)

### Validación Técnica:

- [ ] ✅ `/api/health` → "hasProductImages": true
- [ ] ✅ Registro crea usuario en Dashboard
- [ ] ✅ Login funciona después de verificación
- [ ] ✅ Admin panel accesible

### Testing E-commerce:

- [ ] ✅ Agregar productos al carrito
- [ ] ✅ Crear dirección de envío
- [ ] ✅ Finalizar compra
- [ ] ✅ Ver orden en /orders

---

## 🎉 ¡LISTO PARA PRODUCCIÓN!

Una vez completados estos pasos, tu aplicación estará **100% funcional** con:

- ✅ Registro y login de usuarios
- ✅ Panel de administración
- ✅ Gestión de productos con imágenes
- ✅ Sistema de órdenes completo
- ✅ Gestión de direcciones
- ✅ Carrito de compras funcional

**Tiempo estimado:** 10-15 minutos para toda la configuración.

**¿Algún paso no está claro o encuentras algún error? ¡Avísame y te ayudo a resolverlo!**

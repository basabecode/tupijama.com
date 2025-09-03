# 🚀 Guía de Despliegue en Vercel

## Error: "Supabase URL and Anon Key must be defined in .env.local"

Este error aparece cuando las variables de entorno de Supabase no están configuradas en Vercel. Sigue esta guía para solucionarlo.

## ✅ Configuración de Variables de Entorno en Vercel

### Paso 1: Acceder a la Configuración

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `tupijama.com`
3. Ve a **Settings** → **Environment Variables**

### Paso 2: Añadir Variables Requeridas

Añade EXACTAMENTE estas variables (respeta mayúsculas/minúsculas):

#### Variable 1: URL de Supabase

- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://tu-proyecto.supabase.co` (reemplaza con tu URL real)
- **Environment**: Selecciona **Production** y **Preview**
- **Secret**: NO marcar como secret (es pública)

#### Variable 2: Clave Anónima

- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Tu clave anónima de Supabase (empieza con `eyJ...`)
- **Environment**: Selecciona **Production** y **Preview**
- **Secret**: NO marcar como secret (es pública)

#### Variable 3: Service Role Key (Opcional pero recomendada)

- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Tu service role key de Supabase (empieza con `eyJ...`)
- **Environment**: Selecciona **Production** (y Preview si necesitas)
- **Secret**: ✅ **SÍ marcar como secret** (no exponer)

#### Variable 4: Admin Secret (Opcional)

- **Name**: `ADMIN_SECRET`
- **Value**: Tu secreto personalizado (ej: `1h2m3s1D*`)
- **Environment**: Selecciona **Production**
- **Secret**: ✅ **SÍ marcar como secret**

### Paso 3: Obtener las Claves de Supabase

Si no tienes las claves:

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** → para `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → para `SUPABASE_SERVICE_ROLE_KEY`

### Paso 4: Forzar Re-despliegue

1. En Vercel, ve a **Deployments**
2. Haz clic en **Redeploy** en el último deployment
3. Selecciona **Use existing Build Cache** para ir más rápido
4. Haz clic en **Redeploy**

## 🔍 Verificar que Funciona

### Probar la API de Health

Una vez desplegado, prueba:

```bash
curl https://tu-app.vercel.app/api/health
```

Debería devolver algo como:

```json
{ "status": "ok", "database": "connected", "timestamp": "..." }
```

### Revisar Logs de Error

Si sigue fallando:

1. Ve a **Deployments** → tu deployment más reciente
2. Haz clic en **View Logs**
3. Busca errores relacionados con Supabase
4. Verifica que los nombres de variables sean exactos

## ⚠️ Problemas Comunes

### Error: Variables no encontradas

- ✅ Verifica que los nombres sean EXACTOS (case-sensitive)
- ✅ Asegúrate de seleccionar **Production** environment
- ✅ Haz redeploy después de añadir variables

### Error: "Invalid API key"

- ✅ Verifica que copiaste las claves completas desde Supabase
- ✅ No añadas espacios al inicio/final de las claves
- ✅ Considera regenerar las claves en Supabase si fueron expuestas

### Build exitoso pero runtime error

- ✅ Verifica que `NEXT_PUBLIC_*` variables estén en **Production** y **Preview**
- ✅ Las variables que no empiezan con `NEXT_PUBLIC_` solo necesitan **Production**

## 🔄 Desarrollo Local

Para desarrollo local, crea `.env.local` (NO subirlo a git):

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
ADMIN_SECRET=tu-admin-secret
```

Luego ejecuta:

```bash
npm run dev
# o
pnpm dev
```

## 🆘 Si Sigue Sin Funcionar

1. **Verifica las URLs**: Asegúrate de que tu proyecto Supabase esté activo
2. **Regenera claves**: Ve a Supabase → Settings → API → Regenerate keys
3. **Contacta soporte**: Si nada funciona, contacta al soporte de Vercel con los logs específicos

---

**Última actualización**: Septiembre 2025

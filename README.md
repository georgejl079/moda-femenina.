# MODA FEMENINA · Cloudflare Pages + D1 + R2

Sitio preparado para desplegar en Cloudflare Pages con base de datos D1 y almacenamiento de assets R2.

## Requisitos

- Node.js 18+
- Wrangler CLI (`npm install -g wrangler` o `npx wrangler`)
- Cuenta en Cloudflare con acceso a Pages, D1 y R2

## Estructura

```
├── index.html
├── admin.html
├── wrangler.toml
├── schema.sql
├── seed.sql
├── package.json
├── functions/
│   ├── api/
│   │   ├── data.js
│   │   ├── cart.js
│   │   ├── upload-r2.js
│   │   └── admin/
│   │       ├── login.js
│   │       ├── products.js
│   │       ├── categories.js
│   │       ├── promotions.js
│   │       ├── projects.js
│   │       ├── config.js
│   │       └── upload.js
│   └── r2/
│       └── [[path]].js
├── scripts/
│   └── upload-r2.js
└── README.md
```

## Paso 1: Iniciar sesión en Cloudflare

```bash
wrangler login
```

## Paso 2: Crear recursos en Cloudflare

```bash
# Crear base de datos D1
wrangler d1 create moda-femenina-db

# Crear bucket R2
wrangler r2 bucket create moda-femenina-assets
wrangler r2 bucket create moda-femenina-assets-preview
```

Anota el `database_id` que devuelve el comando de D1 y actualiza `wrangler.toml`.

## Paso 3: Configurar wrangler.toml

Reemplaza `REPLACE_WITH_D1_DATABASE_ID` por el ID real de la base de datos D1.

```toml
[[d1_databases]]
binding = "DB"
database_name = "moda-femenina-db"
database_id = "TU_DATABASE_ID_AQUI"
```

## Paso 4: Configurar variables de entorno

Copiá `.dev.vars.example` a `.dev.vars` y completá:

```bash
cp .dev.vars.example .dev.vars
```

En el dashboard de Cloudflare Pages (Settings > Environment variables) configurá también:

- `ADMIN_PASSWORD` — contraseña para acceder al panel admin (`/admin.html`)
- `PHONE`, `DEVELOPER_NAME`, `DEVELOPER_URL` (opcionales)

## Paso 5: Aplicar schema y datos iniciales

```bash
# Local
npm run migrate:local
npm run seed:local

# Remoto (producción)
npm run migrate:remote
npm run seed:remote
```

## Paso 6: Desarrollo local

```bash
npm install
npm run dev
```

Esto levanta Cloudflare Pages en `http://localhost:8788` con D1 local y bindings de R2.

## Paso 7: Deploy

```bash
wrangler pages project create moda-femenina
wrangler pages deploy .
```

O conectá el repositorio a Cloudflare Pages desde el dashboard. Cloudflare detectará automáticamente las carpetas `functions/`.

## Panel Admin

Accedé a `/admin.html` en tu sitio desplegado y usá la contraseña configurada en `ADMIN_PASSWORD`.

Desde el panel podés:

- Ver estadísticas (productos, categorías, promociones, looks)
- Crear / editar / eliminar **productos**
- Crear / editar / eliminar **categorías**
- Crear / editar / eliminar **promociones**
- Crear / editar / eliminar **looks / proyectos**
- Modificar la **configuración** de la tienda (nombre, historia, misión, horario, contacto)

## Rutas API

- `GET /api/data` — datos públicos de la tienda (productos, categorías, promos, proyectos, config)
- `GET/POST /api/cart` — carrito por session_id
- `POST /api/upload-r2` — subida de imágenes a R2
- `POST /api/admin/login` — login del panel
- `GET/POST/PUT/DELETE /api/admin/products`
- `GET/POST/PUT/DELETE /api/admin/categories`
- `GET/POST/PUT/DELETE /api/admin/promotions`
- `GET/POST/PUT/DELETE /api/admin/projects`
- `GET/POST /api/admin/config`
- `POST /api/admin/upload` — subida de imágenes desde el admin
- `GET /r2/*` — servir assets desde R2

## Notas

- El carrito de compras se sincroniza con D1 por `session_id`.
- Las imágenes se sirven desde `/r2/` una vez subidas a R2.
- Los textos y productos se cargan dinámicamente desde D1 vía `/api/data`.
- Si `/api/data` no responde, el sitio usa datos de fallback embebidos.

## Limpieza de caché

Tras modificar datos en D1, recordá que `/api/data` se cachea por 60s. Para desarrollo podés reducir el `Cache-Control` en `functions/api/data.js`.

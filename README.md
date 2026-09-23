# Scentora storefront

Scentora is a mobile-first Next.js fragrance storefront. The project is intentionally frontend-only: the catalog, collection pages, cart, wishlist, contact hand-off, and checkout preview run without a database, API routes, authentication provider, or server-side commerce service.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Frontend architecture

- Product, category, and collection content lives in [`lib/data/catalog.ts`](./lib/data/catalog.ts).
- Cart and wishlist state is kept in browser `localStorage` through [`lib/guest-cart.ts`](./lib/guest-cart.ts) and [`lib/guest-wishlist.ts`](./lib/guest-wishlist.ts).
- Storefront copy and default contact details are defined in [`lib/site-settings.ts`](./lib/site-settings.ts).
- All storefront layouts use responsive Tailwind utility classes and collapse navigation, grids, forms, and product imagery for small screens.

The checkout and contact forms are presentation flows that hand off to the customer/team experience without pretending to persist data locally.

## Future NestJS CMS integration

The frontend is prepared to consume a separate NestJS CMS through `NEXT_PUBLIC_API_URL`.
When that variable is set, the following content is loaded from the CMS first:

- `GET /content/site-settings`
- `GET /catalog/products`
- `GET /catalog/products/:idOrSlug`
- `GET /catalog/categories`
- `GET /catalog/categories/:slug`
- `GET /catalog/collections`
- `GET /catalog/collections/:slug`

The expected product-list response is:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

The current local catalog remains an explicit temporary fallback while the separate NestJS backend is not available. Once `NEXT_PUBLIC_API_URL` is configured, no frontend redeploy is needed for content changes made in the CMS.

## Editable promo banner

The announcement bar is backed by a small PostgreSQL table and can be edited at `/admin/banner`.

Set these server-only environment variables before using the editor:

```env
DATABASE_URL=your-postgres-connection-string
BANNER_ADMIN_TOKEN=your-private-editor-token
```

Open `/admin/banner`, enter `BANNER_ADMIN_TOKEN`, edit the message, and select **Save banner**. The storefront reads the saved value while retaining the existing banner styling and fallback text.

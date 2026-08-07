# Scentora NestJS Backend + Next.js Frontend Migration

## Current project in plain language

The project is a Next.js 16 e-commerce application. It currently combines the website and server API in one repository.

- Frontend: `app/` pages and `components/` React UI.
- Current backend: `app/api/` Next.js Route Handlers.
- Database: PostgreSQL with Drizzle. Schema: `lib/db/schema.ts`; migrations: `drizzle/`.
- Customer authentication: Clerk. A customer is copied into the local `users` table on first protected action.
- Admin authentication: separate local email/password account plus a signed cookie valid for 8 hours; an admin API key is also supported.
- Images: Cloudinary signed uploads.
- Orders: Cash on Delivery only. No online payment gateway or webhook exists yet.
- Notifications: Resend email, SMS, and WhatsApp helpers.

For the new architecture, NestJS must own database access, secrets, price calculations, stock updates, uploads, notification sending, and authorization. Next.js must only display pages and call NestJS.

## Important problems to fix during migration

1. Catalogue APIs are marked as public in the old Swagger document, but their code currently requires admin access. This includes products, categories, collections, product detail, and site settings. In NestJS they must be public.
2. Many Next.js server pages bypass HTTP and directly import database helpers from `lib/api/catalog.ts`. After separation, replace these with HTTP calls to NestJS.
3. The frontend calls `/api/account/profile`, `/api/auth/forgot-password`, and `/api/auth/reset-password`, but those route handlers do not exist.
4. The current `POST /api/admin/auth/signup` lets anyone create an admin. Do not expose this in production. Use a protected seed/CLI command or a super-admin-only endpoint.
5. Coupon validation currently trusts the subtotal sent by the browser. NestJS must calculate totals from the saved cart/products.
6. Cart add/update does not check stock until checkout. Check stock in cart operations and again inside the checkout transaction.

## Data stored in PostgreSQL

`users`, `user_sessions`, `categories`, `collections`, `products`, `product_collections`, `cart_items`, `wishlist_items`, `product_reviews`, `orders`, `order_items`, `order_status_history`, `payments`, `coupons`, `user_coupons`, `newsletter_subscribers`, `contact_inquiries`, and `site_settings`.

Products have model number, slug, descriptions, HTML content, SEO fields, image, purchase/selling price, stock, notes, scent options, tags, category, collections, active/featured/bestseller flags, and an optional parent product for variants.

## Access levels for NestJS

- Public: product browsing, public site settings, reviews reading, contact, newsletter.
- Customer: cart, wishlist, review writing, checkout, profile, own orders and returns.
- Admin: every `/admin` endpoint.

Use JWT plus refresh tokens with `RolesGuard`, or verify Clerk JWTs in NestJS if you decide to keep Clerk. Use one documented authentication strategy; do not carry over the accidental split system.

## Existing API inventory

All below are the current Next.js routes. NestJS should use the same path below `/api/v1`, for example `GET /api/v1/products`.

### Catalogue

- `GET /products` — active parent product list. Query: `category`, `collection`, `search`, `tag`, `bestSeller`, `featured`, `sort`, `page`, `limit`. Search checks name, brand, model number, text and notes. Returns paginated `{ data, meta }`. Currently admin-only; make public.
- `GET /products/:id` — active product by UUID, slug, SEO URL, or legacy numeric model number. Currently admin-only; make public.
- `GET /products/:id/reviews` — ten latest approved reviews plus rating summary. Public.
- `POST /products/:id/reviews` — create/update the current customer review. Body: `{ rating: 1..5, title?: string, comment: string }`; comment length 20–1200. Marks verified purchase when applicable.
- `GET /categories` — category list. Currently admin-only; make public.
- `GET /categories/:slug/products` — category and matching paginated products. Currently admin-only; make public.
- `GET /collections` — collections ordered by display order. Currently admin-only; make public.
- `GET /collections/:slug` — one collection. Currently admin-only; make public.
- `GET /collections/:slug/products` — collection and matching paginated products. Currently admin-only; make public.
- `GET /site-settings` — banner, social/contact information, and promotional slides. Currently admin-only; make public.

### Customer cart and wishlist

- `GET /cart` — signed-in customer cart with product data, quantity, and subtotal.
- `POST /cart` — add/increase item. Body: `{ productId, quantity, scentOption }`.
- `PATCH /cart` — set item quantity. Body: `{ productId, quantity, scentOption }`.
- `DELETE /cart` — remove item. Body: `{ productId, scentOption }`.
- `GET /wishlist` — signed-in customer wishlist and saved product IDs.
- `POST /wishlist` — add active product. Body: `{ productId }`.
- `DELETE /wishlist` — remove product. Body: `{ productId }`.

Guest cart/wishlist are currently local browser storage. Keep that in Next.js, then merge on login or send `guestItems` at checkout.

### Checkout and customer orders

- `POST /checkout` — validates address/contact data; gets customer cart or `guestItems`; re-reads price and stock; applies assigned coupon; creates COD order/items/history; reduces stock; clears customer cart; creates tracking ID; attempts notifications. It accepts name, email for guests, dial code, phone, address lines, city/country/state/postal code, `guestItems`, and `couponCode`. Shipping is currently zero.
- `POST /checkout/coupon` — validates assigned coupon. Body: `{ code, subtotal, email? }`. Redesign this so NestJS derives subtotal itself.
- `POST /orders/:id/cancel` — customer cancels their own `PENDING`, `ACCEPTED`, or `PROCESSING` order; writes history and notifies admin.
- `POST /orders/:id/return` — customer requests a return for their own delivered order within 15 days; writes history and notifies admin.

Missing APIs that NestJS should add:

- `GET /me` and `PATCH /me` — current customer profile.
- `GET /orders` — current customer orders only.
- `GET /orders/:id` — current customer order, items, tracking and history only.

### Contact and newsletter

- `POST /contact` — stores `{ name, email, phone?, subject, message }`; name/email/subject/message are required and email is validated.
- `POST /newsletter` — stores/reuses `{ email }`; duplicate email is safe.

### Admin authentication

- `POST /admin/auth/login` — `{ email, password }`; starts current admin session.
- `POST /admin/auth/logout` — ends current admin session.
- `GET /admin/auth/me` — current admin information.
- `POST /admin/auth/signup` — creates an admin; replace this public bootstrap behavior before production.

### Admin products, import and collections

- `GET /admin/products` — up to 100 products with category/collection data.
- `POST /admin/products` — creates product. Required: `name`, `description`, `image`, `categoryId`, `price`, `stock`; model/slug can be generated. Supports SEO fields, purchase price, tag, notes, scent options, flags, parent product, and `collectionIds`.
- `PATCH /admin/products/:id` — currently supports only model number, name, image, price, stock, and active flag.
- `DELETE /admin/products/:id` — soft delete by setting `isActive=false`.
- `POST /admin/products/:id/generate-variants` — makes child products from scent options or notes. Body: `{ force?: boolean }`; force deactivates old variants.
- `POST /admin/products/import` — Excel import using `multipart/form-data` field `file`. Required columns: `modelNo`, `name`, `slug`, `description`, `image`, `categorySlug`, `price`, `stock`. Optional: `purchasePrice`, `parentModelNo`.
- `PATCH /admin/collections/:id` — only changes `{ displayOrder }`.

Category CRUD and full collection CRUD do not exist today; build them in NestJS.

### Admin orders, customers and support

- `GET /admin/orders` — paginated orders. Query: `page`, `limit`, `status`, `paymentStatus`, `q` (ID/name/email).
- `GET /admin/orders/:id` — full order, items and status history.
- `PATCH /admin/orders/:id` — updates status, payment status, courier, tracking URL/number, or `codCollected`; validates status flow, stores history, timestamps delivery, and notifies customer.
- `GET /admin/orders/:id/invoice` — invoice download/view.
- `POST /admin/orders/:id/invoice` — regenerate/send invoice email.
- `GET /admin/carts` — all carts grouped by customer.
- `GET /admin/users` — up to 500 users with order/cart/session metrics.
- `GET /admin/reviews` — all reviews with user and product.
- `DELETE /admin/reviews` — body `{ reviewId }`.
- `GET /admin/contact-inquiries` — latest 100 messages.
- `GET /admin/newsletter-subscribers` — latest 500 subscribers.

### Admin marketing, coupons, settings and uploads

- `GET /admin/coupons` — coupon assignments with customer and coupon details.
- `POST /admin/coupons` — assigns coupon to customer. Required `{ userId, code, discountValue }`; also supports type, description, minimum/maximum, start/end dates.
- `GET /admin/best-sellers` — mode, products and sales metrics.
- `POST /admin/best-sellers` — sets auto mode and recalculates.
- `PATCH /admin/best-sellers` — `{ mode?, bestSellerIds?, trendingIds? }`; selecting IDs uses manual mode.
- `GET /admin/site-settings` — editable settings.
- `PATCH /admin/site-settings` — banner text, social/contact details and home slides. Requires banner plus one valid slide.
- `POST /admin/uploads/sign` — Cloudinary signature. Optional body `{ folder: "scentora/products" | "scentora/collections" }`.
- `GET /openapi` — incomplete Swagger JSON; currently admin-only.

## Order flow

Main delivery flow:

`PENDING → ACCEPTED → PROCESSING → DISPATCHED → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED`

`SHIPPED` is also accepted and behaves like the in-transit phase. `REJECTED` is only allowed from pending. Customers can cancel before dispatch. A delivered order can become `RETURN_REQUESTED`, then `RETURNED`, then `REFUNDED`. Payment states are `PENDING`, `SUCCESS`, `FAILED`, and `REFUNDED`.

## Recommended NestJS modules

```txt
auth, users, catalog, cart, wishlist, reviews, orders,
coupons, uploads, notifications, settings, admin, database, common
```

Use DTOs with `class-validator`, a global validation pipe, global exception filter, Swagger decorators, rate limiting, and CORS restricted to the frontend URL.

## Next.js changes

Create `lib/api-client.ts` using `NEXT_PUBLIC_API_URL`. Replace every `fetch("/api/...")` and every direct database helper import with that client. Keep guest cart/wishlist only in browser storage.

```txt
# frontend
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1

# backend only
DATABASE_URL=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
CORS_ORIGIN=https://www.example.com
CLOUDINARY_...=...
RESEND_API_KEY=...
```

## Recommended migration order

1. Create NestJS and connect it to a copy of current PostgreSQL.
2. Move public catalogue/settings; change Next.js pages to call NestJS.
3. Decide customer auth: Nest JWT or Clerk token verification.
4. Move cart, wishlist, reviews and customer order reading.
5. Move checkout as one DB transaction; server always owns totals/stock/coupon rules.
6. Move admin tools, uploads, orders, support data, and settings; close public admin signup.
7. Add online payment provider and webhook only when needed.
8. Remove old Next.js route handlers feature-by-feature after testing.

## Response format

Use a consistent success response:

```json
{ "data": {}, "meta": {} }
```

Use NestJS error responses with correct status codes: 400 invalid input, 401 not signed in, 403 wrong role, 404 missing, 409 conflict.

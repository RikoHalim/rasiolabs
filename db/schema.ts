import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(), reference: text('reference').notNull(),
  isPreview: integer('is_preview').notNull().default(0),
  idempotencyHash: text('idempotency_hash').notNull(), payloadHash: text('payload_hash').notNull(),
  businessName: text('business_name').notNull(), customerName: text('customer_name').notNull(),
  whatsapp: text('whatsapp').notNull(), email: text('email').notNull().default(''),
  domain: text('domain').notNull(), domainStatus: text('domain_status').notNull().default('pending'),
  template: text('template').notNull(), duration: integer('duration').notNull(),
  monthly: integer('monthly').notNull(), total: integer('total').notNull(), renewalMonthly: integer('renewal_monthly').notNull(),
  status: text('status').notNull().default('new'), paymentStatus: text('payment_status').notNull().default('pending'),
  paymentReference: text('payment_reference').notNull().default(''), notes: text('notes').notNull().default(''),
  slug: text('slug').notNull(), createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull()
}, t => [uniqueIndex('orders_reference_unique').on(t.reference),uniqueIndex('orders_idempotency_unique').on(t.idempotencyHash),uniqueIndex('orders_slug_unique').on(t.slug),index('orders_status_created').on(t.status,t.createdAt)]);
export const contents = sqliteTable('contents', {
  orderId: text('order_id').primaryKey().references(()=>orders.id), draft: text('draft').notNull(),
  published: text('published'), revision: integer('revision').notNull().default(1),
  publishedRevision: integer('published_revision'), updatedAt: integer('updated_at').notNull()
});
export const sessions = sqliteTable('sessions', {
  tokenHash: text('token_hash').primaryKey(), role: text('role').notNull(),
  orderId: text('order_id').references(()=>orders.id), csrf: text('csrf').notNull(),
  generation: text('generation').notNull().default(''), expiresAt: integer('expires_at').notNull(), createdAt: integer('created_at').notNull()
},t=>[index('sessions_order_id').on(t.orderId),index('sessions_expiry').on(t.expiresAt)]);
export const invites = sqliteTable('invites', {
  tokenHash: text('token_hash').primaryKey(), orderId: text('order_id').notNull().references(()=>orders.id),
  expiresAt: integer('expires_at').notNull(), usedAt: integer('used_at'),createdAt: integer('created_at').notNull()
},t=>[index('invites_order_id').on(t.orderId)]);
export const media = sqliteTable('media', {
  id: text('id').primaryKey(), orderId: text('order_id').notNull().references(()=>orders.id),
  key: text('key').notNull(), mime: text('mime').notNull(),size: integer('size').notNull(),
  isPublic: integer('is_public').notNull().default(0), createdAt: integer('created_at').notNull()
},t=>[index('media_order_id').on(t.orderId)]);
export const audit = sqliteTable('audit', {
  id:text('id').primaryKey(), orderId:text('order_id').notNull().references(()=>orders.id),
  actor:text('actor').notNull(),action:text('action').notNull(),detail:text('detail').notNull(),createdAt:integer('created_at').notNull()
},t=>[index('audit_order_created').on(t.orderId,t.createdAt)]);
export const rateLimits = sqliteTable('rate_limits', {
  key:text('key').primaryKey(), count:integer('count').notNull(), expiresAt:integer('expires_at').notNull()
});

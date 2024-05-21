// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
  real,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `nextjs_server_ecomm_${name}`,
);

export const products = createTable(
  "product",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const colorEnum = pgEnum("color", ["light", "dark"]);

export const variants = createTable("variant", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  price: real("price"),
  color: colorEnum("color").notNull(),
  image: text("image"),
  productId: integer("product_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const reviews = createTable("review", {
  id: serial("id").primaryKey(),
  rating: integer("rating"),
  comment: text("comment"),
  productId: integer("product_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const variantProductRelation = relations(variants, ({ one }) => ({
  variants: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
}));

export const reviewProductRelation = relations(reviews, ({ one }) => ({
  reviews: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

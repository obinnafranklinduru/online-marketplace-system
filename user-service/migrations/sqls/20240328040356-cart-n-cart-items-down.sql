ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cart_id_fkey";

ALTER TABLE "shopping_carts" DROP CONSTRAINT "shopping_carts_user_id_fkey";
DROP TABLE shopping_carts;
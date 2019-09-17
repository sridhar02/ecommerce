CREATE TABLE orders(
id BIGSERIAL NOT NUll PRIMARY KEY,
user_id BIGINT REFERENCES users(id)
);


CREATE TABLE order_products(

order_id BIGINT REFERENCES orders(id),
product_id BIGINT REFERENCES products(id)
);

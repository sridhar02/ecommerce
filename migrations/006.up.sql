CREATE TABLE cart (
product_id BIGINT REFERENCES products(id),
user_id BIGINT REFERENCES users(id)
);
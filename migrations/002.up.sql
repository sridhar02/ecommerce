CREATE TYPE sex AS ENUM ('Male','Female');

CREATE TABLE users(
id BIGSERIAL NOT NULL PRIMARY KEY,
username VARCHAR(100) NOT NULL,
email VARCHAR(300) NOT NULL UNIQUE,
phonenumber BIGINT NOT NULL UNIQUE,
password VARCHAR(200) NOT NULL,
age BIGINT ,
sex sex ,
created_at TIMESTAMP NOT NULL,
updated_at TIMESTAMP NOT NULL
);
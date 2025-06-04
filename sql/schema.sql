-- Schema for RIE Server database

DROP SCHEMA IF EXISTS postgres CASCADE;

CREATE SCHEMA postgres;

CREATE TABLE users(
   id             BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   username       VARCHAR(20) UNIQUE     NOT NULL,
   created_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE recipes(
   id             BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   name           VARCHAR(100)                NOT NULL,
   slug           VARCHAR(30) UNIQUE          NOT NULL,
   description    VARCHAR(500)                NOT NULL,
   recipe         VARCHAR(3000)               NOT NULL,
   author         VARCHAR(20)                NOT NULL,
   created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
   deleted_at     TIMESTAMP    ,
   CONSTRAINT fk_recipes_author
      FOREIGN KEY(author) 
      REFERENCES users(username)
);

CREATE TABLE recipe_favorites(
   id             BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   recipe_slug    VARCHAR(30)     NOT NULL,
   username       VARCHAR(20)     NOT NULL,
   created_at     TIMESTAMP       NOT NULL DEFAULT NOW(),
   CONSTRAINT fk_recipe_favorites_recipe_id
      FOREIGN KEY(recipe_slug) 
      REFERENCES recipes(slug),
   CONSTRAINT fk_recipe_favorites_username
      FOREIGN KEY(username) 
      REFERENCES users(username)
);

CREATE TABLE news(
   id             BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   type           VARCHAR(100)                NOT NULL,
   text           VARCHAR(500)                NOT NULL,
   title          VARCHAR(100)                NOT NULL,
   author         VARCHAR(20)                NOT NULL,
   created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
   recipe_slug    VARCHAR(30),
   CONSTRAINT fk_news_recipe_slug
      FOREIGN KEY(recipe_slug) 
      REFERENCES recipes(slug),
   CONSTRAINT fk_news_author
      FOREIGN KEY(author) 
      REFERENCES users(username)
);


CREATE TABLE app_config(
   is_app_initialized BOOLEAN DEFAULT FALSE,
   initialized_at TIMESTAMP DEFAULT NOW()
);


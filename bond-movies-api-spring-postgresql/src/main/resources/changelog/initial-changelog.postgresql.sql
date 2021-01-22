--liquibase formatted sql

--changeset byrnej:1611353282165-2
CREATE TABLE bond_movies (id BIGINT NOT NULL, catalog_order INTEGER NOT NULL, imdbid VARCHAR(255), movie_type VARCHAR(255), poster VARCHAR(255), review VARCHAR(255), runtime VARCHAR(255), synopsis VARCHAR(255), title VARCHAR(255), year VARCHAR(255), CONSTRAINT "bond_moviesPK" PRIMARY KEY (id));

--changeset byrnej:1611353282165-1
CREATE SEQUENCE  IF NOT EXISTS bond_movie_seq START WITH 1 INCREMENT BY 50;

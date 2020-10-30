--liquibase formatted sql

--changeset byrnej:1603989511864-1 context:default
CREATE SEQUENCE  IF NOT EXISTS bond_movie_seq;

--changeset byrnej:1603989511864-2 context:default
CREATE TABLE bond_movies (id BIGINT NOT NULL, catalog_order INTEGER, imdbid VARCHAR(255), poster VARCHAR(255), review VARCHAR(255), runtime VARCHAR(255), synopsis VARCHAR(255), title VARCHAR(255), type VARCHAR(255), year VARCHAR(255), CONSTRAINT "bond_moviesPK" PRIMARY KEY (id));

--changeset byrnej:1603989511864-3 context:default
ALTER TABLE bond_movies ADD CONSTRAINT UC_BOND_MOVIE_NAME_COL UNIQUE (title);

--changeset byrnej:1603989511864-4 context:default
ALTER SEQUENCE bond_movie_seq INCREMENT 50;

--changeset byrnej:1603989511864-5 context:test
INSERT INTO bond_movies (id, catalog_order, imdbid, poster, review, runtime, synopsis, title, type, year) VALUES
(999, 1, 'test_imdbid', 'test_poster', 'test_review', 'test_runtime', 'test_synopsis', 'My Test Title', 'movie', '1963');

CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    spotify_id VARCHAR(255) UNIQUE,
    spotify_access_token TEXT,
    spotify_refresh_token TEXT
);
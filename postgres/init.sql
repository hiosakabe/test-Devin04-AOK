-- Create helloworld table
CREATE TABLE IF NOT EXISTS helloworld (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL
);

-- Insert initial data
INSERT INTO helloworld (message) VALUES ('helloworld');

-- Import other SQL files if they exist
\i /docker-entrypoint-initdb.d/textbox_commit.sql

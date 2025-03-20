#!/bin/bash

az postgres flexible-server execute -n "monitly" -u "product_super" -p "superuser" -d "product2025" -q "
CREATE TABLE textbox_commit (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

CREATE TRIGGER update_textbox_commit_modtime
BEFORE UPDATE ON textbox_commit
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();" --output table

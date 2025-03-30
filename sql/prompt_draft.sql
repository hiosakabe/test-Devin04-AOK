CREATE TABLE prompt_draft (
    id SERIAL PRIMARY KEY,
    input_content TEXT NOT NULL,
    output_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger function to update timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_prompt_draft_modtime
BEFORE UPDATE ON prompt_draft
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

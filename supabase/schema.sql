-- SAT Mathematics Questions Table
CREATE TABLE IF NOT EXISTS sat_math_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium',
    topic VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SAT English Questions Table
CREATE TABLE IF NOT EXISTS sat_english_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium',
    topic VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sat_math_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_english_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for demo purposes)
CREATE POLICY "Allow public read access" ON sat_math_questions
FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON sat_english_questions
FOR SELECT USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE sat_math_questions TO anon, authenticated;
GRANT ALL ON TABLE sat_english_questions TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
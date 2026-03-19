-- Create telegram_channels table
CREATE TABLE IF NOT EXISTS telegram_channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id TEXT NOT NULL UNIQUE,
    style TEXT NOT NULL,
    prefix TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE telegram_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active telegram_channels" ON telegram_channels
    FOR SELECT USING (is_active = true);

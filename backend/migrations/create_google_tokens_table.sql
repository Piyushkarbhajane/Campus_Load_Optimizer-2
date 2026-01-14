-- Update google_tokens table to use TEXT for user_id instead of UUID
-- This is compatible with MongoDB ObjectIds
-- Run this SQL in your Supabase SQL Editor

-- Drop existing table and recreate with correct schema
DROP TABLE IF EXISTS google_tokens CASCADE;

CREATE TABLE google_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_google_tokens_user_id ON google_tokens(user_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE google_tokens ENABLE ROW LEVEL SECURITY;

-- Note: Since we're using MongoDB user IDs, we can't use auth.uid()
-- Instead, we'll rely on application-level security
-- Allow all authenticated operations (secure this in your application logic)
CREATE POLICY "Allow all operations"
    ON google_tokens
    FOR ALL
    USING (true)
    WITH CHECK (true);

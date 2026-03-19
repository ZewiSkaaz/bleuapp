-- Add telegram_chat_id to telegram_channels
ALTER TABLE public.telegram_channels 
ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

-- Add unique constraint to avoid duplicates
ALTER TABLE public.telegram_channels 
DROP CONSTRAINT IF EXISTS telegram_channels_telegram_chat_id_key;

ALTER TABLE public.telegram_channels 
ADD CONSTRAINT telegram_channels_telegram_chat_id_key UNIQUE (telegram_chat_id);

-- Update the specific channel "BleuApp VIP Canal"
-- Note: usage of ILIKE to find it by name since we don't have the ID handy and username might be null or different
UPDATE public.telegram_channels
SET telegram_chat_id = -1000000000000
WHERE name ILIKE '%BleuApp VIP Canal%';

-- Verify the update
SELECT name, username, telegram_chat_id 
FROM public.telegram_channels 
WHERE telegram_chat_id = -1000000000000; -- Remplacez par votre vrai chat_id

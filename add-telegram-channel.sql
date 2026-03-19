-- Ajouter le canal L'IMPRIMANTE dans la base de données
-- Exécute ce script dans Supabase SQL Editor

-- Insérer le canal L'IMPRIMANTE
INSERT INTO public.telegram_channels (id, username, name, description, is_premium, created_at)
VALUES (
  'bleuapp-channel-id',
  'bleuapp_canal',
  'L''IMPRIMANTE',
  'Canal officiel L''IMPRIMANTE - Signaux de trading premium',
  true,
  NOW()
)
ON CONFLICT (username) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_premium = EXCLUDED.is_premium;

-- Vérifier l'insertion
SELECT * FROM public.telegram_channels WHERE username = 'bleuapp_canal';

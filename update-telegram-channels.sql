-- MIGRATION: Ajout de l'option Gratuit / Premium pour les canaux Telegram

-- Étape 1: Ajouter la colonne
ALTER TABLE public.telegram_channels 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT true;

-- Note: Par défaut, on met tout en Premium pour protéger vos informations actuelles.
-- Vous pourrez modifier cela directement depuis votre nouveau dashboard Admin BleuApp.

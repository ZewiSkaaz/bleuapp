-- Corriger les permissions de la base de données Supabase
-- Exécutez ce script dans l'éditeur SQL de Supabase (SQL Editor) pour réparer les erreurs "permission denied"

-- 1. Donner l'accès au schéma public
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Donner tous les droits sur toutes les tables au service_role (Admin API)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

-- 3. Donner les droits par défaut aux utilisateurs (lecture, insertion, update)
-- L'accès réel restera sécurisé par les Row Level Security (RLS) existantes
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- 4. Assurer que les séquences (pour les IDs incrémentés) sont accessibles
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Par sécurité, s'assurer que les futurs objets créés auront aussi ces droits
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;

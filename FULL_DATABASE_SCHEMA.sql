-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brokers table
CREATE TABLE IF NOT EXISTS brokers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  server_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MT5 Accounts table
CREATE TABLE IF NOT EXISTS mt5_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  broker_id UUID REFERENCES brokers(id) NOT NULL,
  account_number BIGINT NOT NULL,
  password_encrypted TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_investor BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(account_number, broker_id)
);

-- Trading settings table
CREATE TABLE IF NOT EXISTS trading_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  position_sizing_type TEXT NOT NULL CHECK (position_sizing_type IN ('lot', 'percentage')),
  position_size_value DECIMAL(10, 2) NOT NULL,
  max_open_positions INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'inactive')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Copy trading history
CREATE TABLE IF NOT EXISTS copy_trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_user_id UUID REFERENCES profiles(id) NOT NULL,
  follower_user_id UUID REFERENCES profiles(id) NOT NULL,
  admin_mt5_account_id UUID REFERENCES mt5_accounts(id) NOT NULL,
  follower_mt5_account_id UUID REFERENCES mt5_accounts(id) NOT NULL,
  symbol TEXT NOT NULL,
  order_type TEXT NOT NULL,
  volume DECIMAL(10, 2) NOT NULL,
  open_price DECIMAL(15, 5) NOT NULL,
  close_price DECIMAL(15, 5),
  stop_loss DECIMAL(15, 5),
  take_profit DECIMAL(15, 5),
  admin_ticket BIGINT NOT NULL,
  follower_ticket BIGINT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'opened', 'closed', 'failed')),
  error_message TEXT,
  opened_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default brokers
INSERT INTO brokers (name, server_address) VALUES
  ('IC Markets', 'ICMarkets-Demo'),
  ('XM Global', 'XMGlobal-Demo'),
  ('Admiral Markets', 'AdmiralMarkets-Demo'),
  ('FTMO', 'FTMO-Demo'),
  ('Pepperstone', 'Pepperstone-Demo');

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mt5_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE copy_trades ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Policies for mt5_accounts
CREATE POLICY "Users can view own mt5 accounts" ON mt5_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mt5 accounts" ON mt5_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mt5 accounts" ON mt5_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mt5 accounts" ON mt5_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for trading_settings
CREATE POLICY "Users can view own trading settings" ON trading_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trading settings" ON trading_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trading settings" ON trading_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Policies for copy_trades
CREATE POLICY "Users can view own copy trades" ON copy_trades
  FOR SELECT USING (auth.uid() = follower_user_id OR auth.uid() = admin_user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (NEW.id, 'inactive');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Schema pour le système de copy trading Telegram
-- Exécute ce script dans Supabase SQL Editor

-- Table des canaux Telegram
CREATE TABLE IF NOT EXISTS public.telegram_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des abonnements utilisateur aux canaux
CREATE TABLE IF NOT EXISTS public.user_telegram_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES public.telegram_channels(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

-- Table des signaux reçus
CREATE TABLE IF NOT EXISTS public.telegram_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id UUID REFERENCES public.telegram_channels(id) ON DELETE CASCADE,
  message_id BIGINT NOT NULL,
  signal_type VARCHAR(50) NOT NULL, -- 'BUY', 'SELL', 'CLOSE'
  symbol VARCHAR(50) NOT NULL,
  entry_price DECIMAL(15,5),
  stop_loss DECIMAL(15,5),
  take_profit DECIMAL(15,5),
  volume DECIMAL(10,2),
  message_text TEXT,
  parsed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(channel_id, message_id)
);

-- Table des trades exécutés
CREATE TABLE IF NOT EXISTS public.telegram_trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  signal_id UUID REFERENCES public.telegram_signals(id) ON DELETE CASCADE,
  mt5_account_id UUID REFERENCES public.mt5_accounts(id) ON DELETE CASCADE,
  symbol VARCHAR(50) NOT NULL,
  signal_type VARCHAR(50) NOT NULL,
  volume DECIMAL(10,2) NOT NULL,
  entry_price DECIMAL(15,5),
  stop_loss DECIMAL(15,5),
  take_profit DECIMAL(15,5),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'executed', 'failed'
  executed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.telegram_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_telegram_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_trades ENABLE ROW LEVEL SECURITY;

-- Politiques pour telegram_channels (lecture publique)
CREATE POLICY "Anyone can view active channels" ON public.telegram_channels
  FOR SELECT USING (is_active = true);

-- Politiques pour user_telegram_subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_telegram_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own subscriptions" ON public.user_telegram_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Politiques pour telegram_signals (lecture publique)
CREATE POLICY "Anyone can view signals" ON public.telegram_signals
  FOR SELECT USING (true);

-- Politiques pour telegram_trades
CREATE POLICY "Users can view own trades" ON public.telegram_trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own trades" ON public.telegram_trades
  FOR ALL USING (auth.uid() = user_id);

-- Insérer quelques canaux populaires
INSERT INTO public.telegram_channels (name, username, description) VALUES
('Sadek Trading', 'sadektrading', 'Signaux de trading de Sadek'),
('Forex Signals Pro', 'forexsignalspro', 'Signaux Forex professionnels'),
('Crypto Signals', 'cryptosignals', 'Signaux crypto monnaies');

-- Vérifier les tables créées
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'telegram_%';
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
-- Migration pour le système de copy trading admin avec mapping de symboles et lots par instrument

-- 1. Ajouter les colonnes manquantes à mt5_accounts
ALTER TABLE mt5_accounts 
ADD COLUMN IF NOT EXISTS broker_name TEXT,
ADD COLUMN IF NOT EXISTS server_name TEXT,
ADD COLUMN IF NOT EXISTS is_admin_account BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS metaapi_account_id TEXT;

-- Supprimer l'ancienne contrainte broker_id si elle existe
ALTER TABLE mt5_accounts DROP CONSTRAINT IF EXISTS mt5_accounts_broker_id_fkey;
ALTER TABLE mt5_accounts DROP COLUMN IF EXISTS broker_id;

-- 2. Modifier trading_settings pour avoir des lots par instrument
ALTER TABLE trading_settings 
DROP COLUMN IF EXISTS position_size_value,
ADD COLUMN IF NOT EXISTS gold_lot_size DECIMAL(10, 2) DEFAULT 0.01,
ADD COLUMN IF NOT EXISTS sol_lot_size DECIMAL(10, 2) DEFAULT 0.01,
ADD COLUMN IF NOT EXISTS btc_lot_size DECIMAL(10, 2) DEFAULT 0.01,
ADD COLUMN IF NOT EXISTS position_percentage DECIMAL(5, 2) DEFAULT 1.0;

-- Garder position_sizing_type pour savoir si on utilise les lots fixes ou le %

-- 3. Créer la table de mapping des symboles par broker
CREATE TABLE IF NOT EXISTS symbol_mappings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  broker_name TEXT NOT NULL,
  standard_symbol TEXT NOT NULL, -- 'GOLD', 'SOL30', 'BTCUSD'
  broker_symbol TEXT NOT NULL, -- Le symbole utilisé par ce broker
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(broker_name, standard_symbol)
);

-- 4. Insérer les mappings de symboles courants
-- GOLD (XAU/USD)
INSERT INTO symbol_mappings (broker_name, standard_symbol, broker_symbol) VALUES
  ('IC Markets', 'GOLD', 'XAUUSD'),
  ('XM Global', 'GOLD', 'GOLD'),
  ('Pepperstone', 'GOLD', 'XAUUSD'),
  ('Exness', 'GOLD', 'XAUUSD'),
  ('FTMO', 'GOLD', 'XAUUSD'),
  ('Admiral Markets', 'GOLD', 'GOLD'),
  ('FBS', 'GOLD', 'XAUUSDm'),
  ('RoboForex', 'GOLD', 'XAUUSD'),
  ('Alpari', 'GOLD', 'XAUUSD'),
  ('OctaFX', 'GOLD', 'XAUUSD'),
  ('HFM (HotForex)', 'GOLD', 'XAUUSD'),
  ('FXGT', 'GOLD', 'XAUUSD'),
  ('AvaTrade', 'GOLD', 'GOLD'),
  ('ThinkMarkets', 'GOLD', 'XAUUSD'),
  ('FP Markets', 'GOLD', 'XAUUSD'),
  ('Tickmill', 'GOLD', 'XAUUSD'),
  ('Forex.com', 'GOLD', 'XAU/USD'),
  ('OANDA', 'GOLD', 'XAU_USD'),
  ('IG Markets', 'GOLD', 'GOLD'),
  ('CMC Markets', 'GOLD', 'GOLD')
ON CONFLICT (broker_name, standard_symbol) DO NOTHING;

-- SOL30 (Solana Index)
INSERT INTO symbol_mappings (broker_name, standard_symbol, broker_symbol) VALUES
  ('IC Markets', 'SOL30', 'SOL30'),
  ('XM Global', 'SOL30', 'SOLUSDT'),
  ('Pepperstone', 'SOL30', 'SOL30'),
  ('Exness', 'SOL30', 'SOLUSDT'),
  ('FTMO', 'SOL30', 'SOL30'),
  ('Admiral Markets', 'SOL30', 'SOLUSDT'),
  ('FBS', 'SOL30', 'SOLUSDTm'),
  ('RoboForex', 'SOL30', 'SOLUSDT'),
  ('Alpari', 'SOL30', 'SOLUSDT'),
  ('OctaFX', 'SOL30', 'SOLUSDT'),
  ('HFM (HotForex)', 'SOL30', 'SOLUSDT'),
  ('FXGT', 'SOL30', 'SOLUSDT'),
  ('AvaTrade', 'SOL30', 'SOLUSDT'),
  ('ThinkMarkets', 'SOL30', 'SOLUSDT'),
  ('FP Markets', 'SOL30', 'SOLUSDT'),
  ('Tickmill', 'SOL30', 'SOLUSDT'),
  ('Forex.com', 'SOL30', 'SOL/USD'),
  ('OANDA', 'SOL30', 'SOL_USD'),
  ('IG Markets', 'SOL30', 'SOLANA'),
  ('CMC Markets', 'SOL30', 'SOLANA')
ON CONFLICT (broker_name, standard_symbol) DO NOTHING;

-- BTC (Bitcoin)
INSERT INTO symbol_mappings (broker_name, standard_symbol, broker_symbol) VALUES
  ('IC Markets', 'BTC', 'BTCUSD'),
  ('XM Global', 'BTC', 'BITCOIN'),
  ('Pepperstone', 'BTC', 'BTCUSD'),
  ('Exness', 'BTC', 'BTCUSD'),
  ('FTMO', 'BTC', 'BTCUSD'),
  ('Admiral Markets', 'BTC', 'BITCOIN'),
  ('FBS', 'BTC', 'BTCUSDm'),
  ('RoboForex', 'BTC', 'BTCUSD'),
  ('Alpari', 'BTC', 'BTCUSD'),
  ('OctaFX', 'BTC', 'BTCUSD'),
  ('HFM (HotForex)', 'BTC', 'BTCUSD'),
  ('FXGT', 'BTC', 'BTCUSD'),
  ('AvaTrade', 'BTC', 'BITCOIN'),
  ('ThinkMarkets', 'BTC', 'BTCUSD'),
  ('FP Markets', 'BTC', 'BTCUSD'),
  ('Tickmill', 'BTC', 'BTCUSD'),
  ('Forex.com', 'BTC', 'BTC/USD'),
  ('OANDA', 'BTC', 'BTC_USD'),
  ('IG Markets', 'BTC', 'BITCOIN'),
  ('CMC Markets', 'BTC', 'BITCOIN')
ON CONFLICT (broker_name, standard_symbol) DO NOTHING;

-- 5. Activer RLS sur symbol_mappings
ALTER TABLE symbol_mappings ENABLE ROW LEVEL SECURITY;

-- Politique pour que tout le monde puisse lire les mappings
CREATE POLICY "Everyone can view symbol mappings" ON symbol_mappings
  FOR SELECT USING (true);

-- Seuls les admins peuvent modifier (on fera ça via service role)
CREATE POLICY "Only service role can modify symbol mappings" ON symbol_mappings
  FOR ALL USING (false);

-- 6. Ajouter des policies pour que les admins puissent voir tous les comptes MT5
CREATE POLICY "Admins can view all mt5 accounts" ON mt5_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 7. Ajouter des policies pour que les admins puissent voir tous les copy_trades
CREATE POLICY "Admins can view all copy trades" ON copy_trades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 8. Ajouter une policy pour que les admins puissent insérer des copy_trades
CREATE POLICY "Admins can insert copy trades" ON copy_trades
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- 9. Supprimer la table brokers si elle existe encore (on utilise maintenant les noms directs)
DROP TABLE IF EXISTS brokers CASCADE;

-- 10. Ajouter un index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_mt5_accounts_is_admin ON mt5_accounts(is_admin_account) WHERE is_admin_account = true;
CREATE INDEX IF NOT EXISTS idx_mt5_accounts_active ON mt5_accounts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_copy_trades_status ON copy_trades(status);
CREATE INDEX IF NOT EXISTS idx_symbol_mappings_lookup ON symbol_mappings(broker_name, standard_symbol);

-- 11. Fonction helper pour obtenir le symbole broker depuis le symbole standard
CREATE OR REPLACE FUNCTION get_broker_symbol(
  p_broker_name TEXT,
  p_standard_symbol TEXT
) RETURNS TEXT AS $$
DECLARE
  v_broker_symbol TEXT;
BEGIN
  SELECT broker_symbol INTO v_broker_symbol
  FROM symbol_mappings
  WHERE broker_name = p_broker_name
    AND standard_symbol = p_standard_symbol;
  
  -- Si pas trouvé, retourner le symbole standard
  RETURN COALESCE(v_broker_symbol, p_standard_symbol);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Fonction pour détecter le symbole standard depuis un symbole broker
CREATE OR REPLACE FUNCTION get_standard_symbol(
  p_broker_name TEXT,
  p_broker_symbol TEXT
) RETURNS TEXT AS $$
DECLARE
  v_standard_symbol TEXT;
BEGIN
  SELECT standard_symbol INTO v_standard_symbol
  FROM symbol_mappings
  WHERE broker_name = p_broker_name
    AND broker_symbol = p_broker_symbol;
  
  -- Si pas trouvé, essayer de deviner
  IF v_standard_symbol IS NULL THEN
    IF p_broker_symbol ILIKE '%XAU%' OR p_broker_symbol ILIKE '%GOLD%' THEN
      RETURN 'GOLD';
    ELSIF p_broker_symbol ILIKE '%SOL%' THEN
      RETURN 'SOL30';
    ELSIF p_broker_symbol ILIKE '%BTC%' OR p_broker_symbol ILIKE '%BITCOIN%' THEN
      RETURN 'BTC';
    END IF;
  END IF;
  
  RETURN COALESCE(v_standard_symbol, p_broker_symbol);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


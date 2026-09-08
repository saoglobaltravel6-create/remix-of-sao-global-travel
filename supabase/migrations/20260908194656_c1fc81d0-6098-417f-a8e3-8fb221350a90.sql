CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text,
  phone text,
  city text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'phone')
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.wallets (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  service text NOT NULL,
  reference text NOT NULL DEFAULT ('SAO-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'recue',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own requests" ON public.service_requests FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER service_requests_updated BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reference text NOT NULL,
  kind text NOT NULL DEFAULT 'colis',
  origin text,
  destination text,
  status text NOT NULL DEFAULT 'en_preparation',
  is_demo boolean NOT NULL DEFAULT true,
  history jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX shipments_ref_user ON public.shipments (user_id, reference);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own shipments" ON public.shipments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER shipments_updated BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  balance numeric(14,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'XAF',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own wallet" ON public.wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own wallet insert" ON public.wallets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER wallets_updated BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL,
  amount numeric(14,2) NOT NULL,
  currency text NOT NULL DEFAULT 'XAF',
  beneficiary text,
  status text NOT NULL DEFAULT 'en_attente',
  failure_reason text,
  is_real boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own tx" ON public.wallet_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own tx insert" ON public.wallet_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER wallet_tx_updated BEFORE UPDATE ON public.wallet_transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
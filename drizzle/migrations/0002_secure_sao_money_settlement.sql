ALTER TABLE public.wallet_transactions
  ADD COLUMN IF NOT EXISTS service_request_id uuid REFERENCES public.service_requests(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS wallet_transactions_service_request_idx
  ON public.wallet_transactions(service_request_id);

CREATE OR REPLACE FUNCTION public.admin_set_transaction_status(_transaction_id uuid, _status text)
RETURNS TABLE(transaction_id uuid, status text, wallet_balance numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tx public.wallet_transactions%ROWTYPE;
  current_balance numeric;
  balance_delta numeric := 0;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Accès administrateur requis';
  END IF;

  IF _status NOT IN ('validee', 'echouee', 'annulee') THEN
    RAISE EXCEPTION 'Statut de règlement invalide';
  END IF;

  SELECT * INTO tx
  FROM public.wallet_transactions
  WHERE id = _transaction_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Opération introuvable';
  END IF;

  IF tx.status <> 'en_attente' THEN
    RAISE EXCEPTION 'Cette opération a déjà été traitée';
  END IF;

  INSERT INTO public.wallets (user_id, balance, currency)
  VALUES (tx.user_id, 0, tx.currency)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT balance INTO current_balance
  FROM public.wallets
  WHERE user_id = tx.user_id
  FOR UPDATE;

  IF _status = 'validee' THEN
    balance_delta := CASE
      WHEN tx.kind = 'depot' THEN tx.amount
      WHEN tx.kind IN ('transfert', 'paiement_reservation') THEN -tx.amount
      ELSE 0
    END;

    IF balance_delta < 0 AND current_balance + balance_delta < 0 THEN
      RAISE EXCEPTION 'Solde SAO Money insuffisant';
    END IF;

    UPDATE public.wallets
    SET balance = balance + balance_delta, updated_at = now()
    WHERE user_id = tx.user_id;
  END IF;

  UPDATE public.wallet_transactions
  SET status = _status,
      is_real = (_status = 'validee'),
      failure_reason = CASE WHEN _status = 'echouee' THEN 'Opération refusée par l’équipe SAO' ELSE NULL END,
      updated_at = now()
  WHERE id = _transaction_id;

  RETURN QUERY
  SELECT tx.id, _status, current_balance + balance_delta;
END;
$$;

REVOKE UPDATE ON public.wallet_transactions FROM authenticated;
DROP POLICY IF EXISTS "admin update tx" ON public.wallet_transactions;
GRANT EXECUTE ON FUNCTION public.admin_set_transaction_status(uuid, text) TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
GRANT ALL ON public.wallets TO service_role;

CREATE OR REPLACE FUNCTION public.force_pending_wallet_transaction()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    NEW.status := 'en_attente';
    NEW.is_real := false;
    NEW.failure_reason := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS wallet_transactions_force_pending ON public.wallet_transactions;
CREATE TRIGGER wallet_transactions_force_pending
BEFORE INSERT ON public.wallet_transactions
FOR EACH ROW EXECUTE FUNCTION public.force_pending_wallet_transaction();

CREATE OR REPLACE FUNCTION public.assign_sao_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = 'hostblack07@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS assign_sao_admin_role_on_signup ON auth.users;
CREATE TRIGGER assign_sao_admin_role_on_signup
AFTER INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_sao_admin_role();
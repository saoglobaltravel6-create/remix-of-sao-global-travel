create type public.app_role as enum ('admin', 'moderator', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
create policy "admin read requests" on public.service_requests for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admin update requests" on public.service_requests for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "admin read tx" on public.wallet_transactions for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admin update tx" on public.wallet_transactions for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
grant update on public.wallet_transactions to authenticated;
create policy "admin read profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
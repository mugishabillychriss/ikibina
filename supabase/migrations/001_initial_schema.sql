create extension if not exists pgcrypto;

create type contribution_category as enum ('A','B');
create type member_status as enum ('ACTIVE','INACTIVE');
create type obligation_status as enum ('PENDING','LATE','PAID');
create type role_name as enum ('SUPER_ADMIN','TREASURER','SECRETARY','VIEWER');
create type loan_status as enum ('PENDING','APPROVED','REJECTED','ACTIVE','FULLY_REPAID','OVERDUE');

create table public.leaders (
 id uuid primary key default gen_random_uuid(), auth_user_id uuid not null unique references auth.users(id) on delete cascade,
 full_name text not null, email text not null unique, phone text, role role_name not null default 'VIEWER', is_active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.members (
 id uuid primary key default gen_random_uuid(), member_number text not null unique, full_name text not null, phone_number text,
 address text, joining_date date not null, contribution_category contribution_category not null, status member_status not null default 'ACTIVE',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.monthly_obligations (
 id uuid primary key default gen_random_uuid(), member_id uuid not null references public.members(id) on delete restrict,
 obligation_month date not null, contribution_amount integer not null check (contribution_amount in (10000,15000)), penalty_amount integer not null default 0,
 total_due integer not null, due_date date not null, status obligation_status not null default 'PENDING', penalty_assessed_at timestamptz, paid_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(member_id, obligation_month)
);

create table public.payments (
 id uuid primary key default gen_random_uuid(), member_id uuid not null references public.members(id) on delete restrict,
 obligation_id uuid not null references public.monthly_obligations(id) on delete restrict, amount integer not null,
 payment_method text not null, transaction_reference text not null unique, paid_at timestamptz not null default now(), recorded_by uuid references public.leaders(id), created_at timestamptz not null default now()
);

create table public.loans (
 id uuid primary key default gen_random_uuid(), member_id uuid not null references public.members(id) on delete restrict, requested_amount integer not null,
 approved_amount integer, interest_rate numeric(10,4), reason text not null, application_date date not null, disbursement_date date,
 status loan_status not null default 'PENDING', approving_leader_id uuid references public.leaders(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.loan_repayments (
 id uuid primary key default gen_random_uuid(), loan_id uuid not null references public.loans(id) on delete restrict, member_id uuid not null references public.members(id), amount integer not null,
 payment_method text not null, transaction_reference text not null unique, repaid_at timestamptz not null default now(), recorded_by uuid references public.leaders(id), created_at timestamptz not null default now()
);

create table public.expenses (
 id uuid primary key default gen_random_uuid(), description text not null, amount integer not null check(amount>0), category text not null,
 expense_date date not null, payment_method text not null, receipt_reference text, authorized_by uuid references public.leaders(id), created_at timestamptz not null default now()
);

create table public.audit_logs (
 id uuid primary key default gen_random_uuid(), leader_id uuid references public.leaders(id), action text not null, entity_type text not null,
 entity_id uuid, previous_value jsonb, new_value jsonb, reason text, created_at timestamptz not null default now()
);

create table public.financial_transactions (
 id uuid primary key default gen_random_uuid(), transaction_type text not null, member_id uuid references public.members(id), loan_id uuid references public.loans(id),
 obligation_id uuid references public.monthly_obligations(id), expense_id uuid references public.expenses(id), amount integer not null,
 running_balance integer not null default 0, description text not null, metadata jsonb not null default '{}'::jsonb, transaction_date timestamptz not null default now()
);

create table public.group_settings (id uuid primary key default gen_random_uuid(), setting_key text not null unique, setting_value jsonb not null, updated_at timestamptz not null default now());

create index idx_members_status on public.members(status); create index idx_obligations_status on public.monthly_obligations(status); create index idx_obligations_due on public.monthly_obligations(due_date); create index idx_payments_member on public.payments(member_id); create index idx_loans_status on public.loans(status); create index idx_expenses_date on public.expenses(expense_date); create index idx_audit_created on public.audit_logs(created_at);

alter table public.leaders enable row level security; alter table public.members enable row level security; alter table public.monthly_obligations enable row level security; alter table public.payments enable row level security; alter table public.loans enable row level security; alter table public.loan_repayments enable row level security; alter table public.expenses enable row level security; alter table public.audit_logs enable row level security; alter table public.financial_transactions enable row level security; alter table public.group_settings enable row level security;

create or replace function public.current_leader_role() returns role_name language sql stable security definer set search_path=public as $$ select role from public.leaders where auth_user_id=auth.uid() and is_active=true $$;
create or replace function public.is_authorized_finance_leader() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.leaders where auth_user_id=auth.uid() and is_active=true and role in ('SUPER_ADMIN','TREASURER')) $$;

create policy leaders_read on public.leaders for select to authenticated using(auth.uid()=auth_user_id or current_leader_role()='SUPER_ADMIN');
create policy members_read on public.members for select to authenticated using(exists(select 1 from public.leaders l where l.auth_user_id=auth.uid() and l.is_active));
create policy members_write on public.members for all to authenticated using(is_authorized_finance_leader() or current_leader_role()='SECRETARY') with check(is_authorized_finance_leader() or current_leader_role()='SECRETARY');
create policy finance_read on public.monthly_obligations for select to authenticated using(exists(select 1 from public.leaders l where l.auth_user_id=auth.uid() and l.is_active));
create policy finance_payments on public.payments for all to authenticated using(is_authorized_finance_leader()) with check(is_authorized_finance_leader());
create policy finance_loans on public.loans for all to authenticated using(is_authorized_finance_leader()) with check(is_authorized_finance_leader());
create policy finance_repayments on public.loan_repayments for all to authenticated using(is_authorized_finance_leader()) with check(is_authorized_finance_leader());
create policy finance_expenses on public.expenses for all to authenticated using(is_authorized_finance_leader()) with check(is_authorized_finance_leader());
create policy audit_read on public.audit_logs for select to authenticated using(exists(select 1 from public.leaders l where l.auth_user_id=auth.uid() and l.is_active));
create policy transactions_read on public.financial_transactions for select to authenticated using(exists(select 1 from public.leaders l where l.auth_user_id=auth.uid() and l.is_active));
create policy settings_admin on public.group_settings for all to authenticated using(current_leader_role()='SUPER_ADMIN') with check(current_leader_role()='SUPER_ADMIN');

create or replace function public.generate_monthly_obligations(p_month date default (date_trunc('month',(now() at time zone 'Africa/Kigali'))::date)) returns integer language plpgsql security definer set search_path=public as $$
declare count_inserted integer:=0; m record; amount integer; due date:= (date_trunc('month',p_month)+interval '1 month - 1 day')::date;
begin
 for m in select id,contribution_category from public.members where status='ACTIVE' loop
  amount:=case when m.contribution_category='A' then 10000 else 15000 end;
  insert into public.monthly_obligations(member_id,obligation_month,contribution_amount,penalty_amount,total_due,due_date,status)
  values(m.id,p_month,amount,0,amount,due,'PENDING') on conflict(member_id,obligation_month) do nothing;
  if found then count_inserted:=count_inserted+1; end if;
 end loop;
 return count_inserted;
end; $$;

create or replace function public.assess_late_penalties(p_today date default (now() at time zone 'Africa/Kigali')::date) returns integer language plpgsql security definer set search_path=public as $$
declare count_assessed integer:=0;
begin
 update public.monthly_obligations o set penalty_amount=(contribution_amount/10),total_due=contribution_amount+(contribution_amount/10),status='LATE',penalty_assessed_at=now(),updated_at=now()
 where o.status in ('PENDING','LATE') and o.due_date<p_today and o.paid_at is null and o.penalty_amount=0;
 get diagnostics count_assessed=row_count;
 return count_assessed;
end; $$;

create or replace function public.record_contribution_payment(p_obligation uuid,p_amount integer,p_method text,p_reference text) returns uuid language plpgsql security definer set search_path=public as $$
declare o public.monthly_obligations%rowtype; p_id uuid; leader public.leaders%rowtype;
begin
 select * into o from public.monthly_obligations where id=p_obligation for update;
 if not found then raise exception 'Invalid obligation'; end if; if o.status='PAID' then raise exception 'Obligation already paid'; end if;
 if p_amount<>o.total_due then raise exception 'Payment must equal exact outstanding amount: %',o.total_due; end if;
 select * into leader from public.leaders where auth_user_id=auth.uid() and is_active=true; if not found then raise exception 'Unauthorized leader'; end if;
 insert into public.payments(member_id,obligation_id,amount,payment_method,transaction_reference,recorded_by) values(o.member_id,o.id,p_amount,p_method,p_reference,leader.id) returning id into p_id;
 update public.monthly_obligations set status='PAID',paid_at=now(),updated_at=now() where id=o.id;
 insert into public.audit_logs(leader_id,action,entity_type,entity_id,new_value,reason) values(leader.id,'RECORD_PAYMENT','monthly_obligations',o.id,jsonb_build_object('status','PAID','amount',p_amount),'Exact full obligation payment');
 return p_id;
end; $$;

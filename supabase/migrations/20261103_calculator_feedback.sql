create table if not exists public.calculator_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  comment text,
  constraint calculator_feedback_comment_len
    check (comment is null or char_length(comment) <= 600)
);

alter table public.calculator_feedback enable row level security;

drop policy if exists "Public can read calculator feedback" on public.calculator_feedback;
create policy "Public can read calculator feedback"
  on public.calculator_feedback
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can insert a like" on public.calculator_feedback;
create policy "Public can insert a like"
  on public.calculator_feedback
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can add a comment once" on public.calculator_feedback;
create policy "Public can add a comment once"
  on public.calculator_feedback
  for update
  to anon, authenticated
  using (comment is null)
  with check (comment is not null and char_length(comment) <= 600);

grant select, insert, update on table public.calculator_feedback to anon, authenticated;

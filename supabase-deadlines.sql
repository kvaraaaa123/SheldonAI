create table if not exists custom_deadlines (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  date date not null,
  category text default 'custom',
  description text,
  created_at timestamp with time zone default now()
);
alter table custom_deadlines enable row level security;
create policy "Users can manage their own deadlines" on custom_deadlines for all using (auth.uid() = user_id);

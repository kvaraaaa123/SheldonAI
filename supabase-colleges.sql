create table if not exists college_lists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  university_name text not null,
  university_data jsonb,
  status text default 'undecided',
  added_at timestamp with time zone default now()
);
alter table college_lists enable row level security;
create policy "Users can manage their own college list" on college_lists for all using (auth.uid() = user_id);

create table if not exists university_research_cache (
  id uuid default gen_random_uuid() primary key,
  university_name text unique not null,
  research_data jsonb not null,
  created_at timestamp with time zone default now()
);
alter table university_research_cache enable row level security;
create policy "Anyone can read university research" on university_research_cache for select using (true);
create policy "Anyone can insert university research" on university_research_cache for insert with check (true);

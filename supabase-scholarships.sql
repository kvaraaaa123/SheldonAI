create table if not exists saved_scholarships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  scholarship_id text,
  scholarship_name text,
  scholarship_data jsonb,
  notes text,
  status text default 'saved',
  created_at timestamp with time zone default now()
);
alter table saved_scholarships enable row level security;
create policy "Users can manage their own saved scholarships" on saved_scholarships for all using (auth.uid() = user_id);

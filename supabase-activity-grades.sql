create table if not exists activity_grades (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  intended_majors text[],
  activities jsonb,
  results jsonb,
  created_at timestamp with time zone default now()
);
alter table activity_grades enable row level security;
create policy "Users can manage their own activity grades" on activity_grades for all using (auth.uid() = user_id);

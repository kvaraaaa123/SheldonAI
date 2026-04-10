create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  full_name text, birthday date, gender text, ethnicity text, ethnicity_other text,
  religion text, religion_other text, ability_to_pay text, education_status text,
  high_school_name text, gpa numeric(3,2), graduation_year text, class_rank text,
  start_semester text, sat_math integer, sat_english integer, act integer,
  country text, state text, zip_code text, phone text,
  extracurriculars text[],
  extracurriculars_other text,
  leadership_roles text,
  weekly_hours text,
  hobbies text[],
  passion_description text,
  has_research text,
  research_subject text,
  research_description text,
  research_awards text,
  onboarding_complete boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table profiles enable row level security;
create policy "Users can manage their own profile" on profiles for all using (auth.uid() = user_id);

-- Run these ALTER TABLE statements if the table already exists:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS extracurriculars text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS extracurriculars_other text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS leadership_roles text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weekly_hours text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hobbies text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS passion_description text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_research text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS research_subject text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS research_description text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS research_awards text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS activities jsonb;
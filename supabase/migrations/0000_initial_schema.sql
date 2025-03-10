-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create users table
create table public.users (
    id uuid primary key,
    email text not null unique,
    full_name text not null,
    avatar_url text,
    role text not null default 'user' check (role in ('user', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tests table
create table public.tests (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    created_by uuid references public.users(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create questions table
create table public.questions (
    id uuid default uuid_generate_v4() primary key,
    test_id uuid references public.tests(id) on delete cascade not null,
    type text not null,
    section text not null,
    part integer not null,
    template jsonb not null,
    "order" integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create test_attempts table
create table public.test_attempts (
    id uuid default uuid_generate_v4() primary key,
    test_id uuid references public.tests(id) on delete cascade not null,
    user_id uuid references public.users(id) on delete cascade not null,
    started_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone,
    score integer,
    answers jsonb default '{}' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_progress table
create table public.user_progress (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null unique,
    total_tests integer default 0 not null,
    average_score numeric(5,2) default 0 not null,
    last_test_date timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index questions_test_id_idx on public.questions(test_id);
create index test_attempts_user_id_idx on public.test_attempts(user_id);
create index test_attempts_test_id_idx on public.test_attempts(test_id);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_users_updated_at
    before update on public.users
    for each row
    execute function public.handle_updated_at();

create trigger handle_tests_updated_at
    before update on public.tests
    for each row
    execute function public.handle_updated_at();

create trigger handle_questions_updated_at
    before update on public.questions
    for each row
    execute function public.handle_updated_at();

create trigger handle_test_attempts_updated_at
    before update on public.test_attempts
    for each row
    execute function public.handle_updated_at();

create trigger handle_user_progress_updated_at
    before update on public.user_progress
    for each row
    execute function public.handle_updated_at();

-- Create RLS policies
alter table public.users enable row level security;
alter table public.tests enable row level security;
alter table public.questions enable row level security;
alter table public.test_attempts enable row level security;
alter table public.user_progress enable row level security;

-- Users policies
create policy "Users can view their own data"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own data"
    on public.users for update
    using (auth.uid() = id);

-- Tests policies
create policy "Anyone can view tests"
    on public.tests for select
    to authenticated
    using (true);

create policy "Admins can create tests"
    on public.tests for insert
    to authenticated
    using (exists (
        select 1 from public.users
        where id = auth.uid()
        and role = 'admin'
    ));

create policy "Admins can update their own tests"
    on public.tests for update
    to authenticated
    using (
        exists (
            select 1 from public.users
            where id = auth.uid()
            and role = 'admin'
        )
        and created_by = auth.uid()
    );

-- Questions policies
create policy "Anyone can view questions"
    on public.questions for select
    to authenticated
    using (true);

create policy "Admins can manage questions"
    on public.questions for all
    to authenticated
    using (
        exists (
            select 1 from public.users
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Test attempts policies
create policy "Users can view their own attempts"
    on public.test_attempts for select
    to authenticated
    using (user_id = auth.uid());

create policy "Users can create their own attempts"
    on public.test_attempts for insert
    to authenticated
    with check (user_id = auth.uid());

create policy "Users can update their own attempts"
    on public.test_attempts for update
    to authenticated
    using (user_id = auth.uid());

-- User progress policies
create policy "Users can view their own progress"
    on public.user_progress for select
    to authenticated
    using (user_id = auth.uid());

create policy "System can manage user progress"
    on public.user_progress for all
    to authenticated
    using (true); 
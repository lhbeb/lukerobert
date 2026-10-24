-- Make the hardcoded application account usable with Supabase Auth/RLS.
-- If the Auth user does not exist yet, this safely does nothing.

begin;

insert into public.profiles (id, display_name, role)
select id, 'Luke Robert', 'admin'
from auth.users
where lower(email) = lower('elmahboubimehdi@gmail.com')
on conflict (id) do update set role = 'admin';

commit;

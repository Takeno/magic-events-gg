create table "public"."profiles_roles" (
    "profile_id" uuid not null,
    "organizer_id" uuid not null,
    "role" text not null
);


alter table "public"."profiles_roles" enable row level security;

CREATE UNIQUE INDEX profiles_roles_pkey ON public.profiles_roles USING btree (profile_id, organizer_id);

alter table "public"."profiles_roles" add constraint "profiles_roles_pkey" PRIMARY KEY using index "profiles_roles_pkey";

alter table "public"."profiles_roles" add constraint "profiles_roles_organizer_id_fkey" FOREIGN KEY (organizer_id) REFERENCES organizers(id) not valid;

alter table "public"."profiles_roles" validate constraint "profiles_roles_organizer_id_fkey";

alter table "public"."profiles_roles" add constraint "profiles_roles_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) not valid;

alter table "public"."profiles_roles" validate constraint "profiles_roles_profile_id_fkey";


create policy "Roles are viewable by specific user"
on "public"."profiles_roles"
as permissive
for select
to public
using ((auth.uid() = profile_id));

create policy "Managers can update organizer details if they belong to the team."
on organizers
for update using (
    auth.uid() in (
      select profile_id from profiles_roles
      where organizer_id = id
    )
);

create policy "Managers can insert tournaments if they belong to the organizer's team."
on tournaments
for insert
to public
with check (
    auth.uid() in (
      select pr.profile_id from profiles_roles as pr
      where pr.organizer_id = organizer_id
    )
);

create policy "Managers can update tournaments if they belong to the organizer's team."
on tournaments
for update
to public
using (
      auth.uid() in (
      select pr.profile_id from profiles_roles as pr
      where pr.organizer_id = organizer_id
    )
)
with check (
    auth.uid() in (
      select pr.profile_id from profiles_roles as pr
      where pr.organizer_id = organizer_id
    )
)
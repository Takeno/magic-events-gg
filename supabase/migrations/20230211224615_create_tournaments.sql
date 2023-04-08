drop trigger if exists "set_organizers_updated_at" on "public"."organizers";

create table "public"."tournaments" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "formats" text[] not null default '{}'::text[],
    "description" text,
    "title" text,
    "start_date" timestamp with time zone not null,
    "start_date_tz" text not null,
    "organizer_id" uuid not null,
    "address" jsonb default '{}'::jsonb,
    "registration_link" text,
    "online_event" boolean not null default false,
    "location" geography(Point,4326)
);


alter table "public"."tournaments" enable row level security;

create policy "Enable read access for all users"
on "public"."tournaments"
as permissive
for select
to public
using (true);

CREATE TRIGGER set_tournaments_updated_at BEFORE UPDATE ON "public"."tournaments" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE INDEX tournaments_geo_index ON public.tournaments USING gist (location);

CREATE UNIQUE INDEX tournaments_pkey ON public.tournaments USING btree (id);

alter table "public"."tournaments" add constraint "tournaments_pkey" PRIMARY KEY using index "tournaments_pkey";

alter table "public"."tournaments" add constraint "tournaments_organizer_fkey" FOREIGN KEY (organizer_id) REFERENCES organizers(id) not valid;

alter table "public"."tournaments" validate constraint "tournaments_organizer_fkey";

create or replace function nearby_tournaments(lat float, long float, max_distance integer)
returns setof record
language sql
as $$
  select t.*, json_build_object('id', o.id, 'name', o.name, 'logo', o.logo) as organizer
  from public.tournaments as t
  join public.organizers as o ON o.id = t.organizer_id
  where start_date > now() AND st_distance(t.location, st_point(long, lat)::geography) <= max_distance
  order by t.location <-> st_point(long, lat)::geography;
$$;

create or replace function nearby_tournaments_formats(lat float, long float, max_distance integer, wanted_formats text[])
returns setof record
language sql
as $$
  select t.*, json_build_object('id', o.id, 'name', o.name, 'logo', o.logo) as organizer
  from public.tournaments as t
  join public.organizers as o ON o.id = t.organizer_id
  where start_date > now() AND t.formats && wanted_formats AND st_distance(t.location, st_point(long, lat)::geography) <= max_distance
  order by t.location <-> st_point(long, lat)::geography;
$$;
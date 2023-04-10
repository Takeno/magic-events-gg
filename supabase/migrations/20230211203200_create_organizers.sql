create extension if not exists "postgis" with schema "extensions";

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


create table "public"."organizers" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null,
    "description" text,
    "contacts" jsonb not null default '{}'::jsonb,
    "logo" text,
    "address" jsonb not null default '{}'::jsonb,
    "location" geography(Point,4326),
    "type" text not null default 'to'::text
);

alter table "public"."organizers" enable row level security;

create policy "Enable read access for all users"
on "public"."organizers"
as permissive
for select
to public
using (true);

create index organizers_geo_index on public.organizers using GIST (location);

CREATE TRIGGER set_organizers_updated_at BEFORE UPDATE ON "public"."organizers" FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE UNIQUE INDEX organizers_pkey ON public.organizers USING btree (id);

alter table "public"."organizers" add constraint "organizers_pkey" PRIMARY KEY using index "organizers_pkey";

set check_function_bodies = off;




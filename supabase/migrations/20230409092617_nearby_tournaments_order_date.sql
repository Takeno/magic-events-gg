create or replace function nearby_tournaments(lat float, long float, max_distance integer)
returns setof record
language sql
as $$
  select t.*, json_build_object('id', o.id, 'name', o.name, 'logo', o.logo) as organizer
  from public.tournaments as t
  join public.organizers as o ON o.id = t.organizer_id
  where start_date > now() AND st_distance(t.location, st_point(long, lat)::geography) <= max_distance
  order by t.start_date ASC, t.location <-> st_point(long, lat)::geography;
$$;

create or replace function nearby_tournaments_formats(lat float, long float, max_distance integer, wanted_formats text[])
returns setof record
language sql
as $$
  select t.*, json_build_object('id', o.id, 'name', o.name, 'logo', o.logo) as organizer
  from public.tournaments as t
  join public.organizers as o ON o.id = t.organizer_id
  where start_date > now() AND t.formats && wanted_formats AND st_distance(t.location, st_point(long, lat)::geography) <= max_distance
  order by t.start_date ASC, t.location <-> st_point(long, lat)::geography;
$$;
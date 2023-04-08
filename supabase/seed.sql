-- Fumetteria Roma
insert into public.organizers (id, type, name, description, contacts, logo, address, location)
values ('748f2552-f50e-4053-95e9-09476ab851ec', 'to', 'Fumetteria Roma', null, '{}', 'http://localhost:54321/storage/v1/object/public/assets/organizers/store.png', '{"address": "Via del Colosseo, 100","city":"Roma","province": "RM","country": "Italy", "latitude": 41.89591311534382, "longitude": 12.482574089058868}', 'POINT(12.482574089058868 41.89591311534382)');

insert into public.tournaments (id, formats, title, start_date, start_date_tz, organizer_id, address, location)
values ('6c1c99ef-330d-4b6d-8599-3fbdc1045d31', ARRAY['modern'], 'Le figurine moderne', date_trunc('day', now() + INTERVAL '7 day') + '20:00:00', 'Europe/Rome', '748f2552-f50e-4053-95e9-09476ab851ec', '{"address": "Via del Colosseo, 100","city":"Roma","province": "RM","country": "Italy", "latitude": 41.89591311534382, "longitude": 12.482574089058868}', 'POINT(12.482574089058868 41.89591311534382)');

insert into public.tournaments (id, formats, title, start_date, start_date_tz, organizer_id, address, location)
values ('6c3d5e45-e980-4900-8c65-efc9cb55a572', ARRAY['modern'], 'Modern Vecchio', date_trunc('day', now() - INTERVAL '2 day') + '20:00:00', 'Europe/Rome', '748f2552-f50e-4053-95e9-09476ab851ec', '{"address": "Via del Colosseo, 100","city":"Roma","province": "RM","country": "Italy", "latitude": 41.89591311534382, "longitude": 12.482574089058868}', 'POINT(12.482574089058868 41.89591311534382)');

insert into public.tournaments (id, formats, title, start_date, start_date_tz, organizer_id, address, location)
values ('1bfb9d1f-4429-403a-8795-3fa02c9d1316', ARRAY['legacy'], 'Le figurine vecchie', date_trunc('day', now() + INTERVAL '4 day') + '20:00:00', 'Europe/Rome', '748f2552-f50e-4053-95e9-09476ab851ec', '{"address": "Via del Colosseo, 100","city":"Roma","province": "RM","country": "Italy", "latitude": 41.89591311534382, "longitude": 12.482574089058868}', 'POINT(12.482574089058868 41.89591311534382)');

-- Fumetteria Torino
insert into public.organizers (id, type, name, description, contacts, logo, address, location)
values ('998fd161-4ba0-47bb-b93b-70221519eba3', 'to', 'Carte Che Passione - Sede di Torino', null, '{}', null, '{"address": "Via Roma, 100","city":"Torino","province": "TO","country": "Italy"}', 'POINT(7.686011907682986 45.07119418846577)');

insert into public.tournaments (id, formats, title, start_date, start_date_tz, organizer_id, address, location)
values ('5234d820-c0ee-4140-b7d6-180f5c3060f8', ARRAY['modern'], 'Torneo Modern', date_trunc('day', now() + INTERVAL '3 day') + '20:00:00', 'Europe/Rome', '998fd161-4ba0-47bb-b93b-70221519eba3', '{"address": "Via Roma, 100","city":"Torino","province": "TO","country": "Italy"}', 'POINT(7.686011907682986 45.07119418846577)');

-- Fumetteria New York
insert into public.organizers (id, type, name, description, contacts, logo, address, location)
values ('a5d274d2-e3e2-4170-ab0e-dcce9fbcf296', 'to', 'NY Store', null, '{}', null, '{}', 'POINT(-74.00468122313258 40.7130491366719)');

insert into public.tournaments (id, formats, title, start_date, start_date_tz, organizer_id, address, location)
values ('d2a734b2-3650-4e30-800f-38135a9249fe', ARRAY['modern'], 'Modern NY', date_trunc('day', now() + INTERVAL '4 day') + '02:00:00', 'America/New_York', 'a5d274d2-e3e2-4170-ab0e-dcce9fbcf296', '{"address": "22315 139th Ave","city":"Springfield Gardens","province": "NY","country": "USA"}', 'POINT(-74.00468122313258 40.7130491366719)');



-- Utenti
WITH credentials(prefilledId, mail, pass) AS (
  SELECT * FROM (VALUES
    ('5899f99d-a449-4bfa-8769-19c097aaf1f5'::uuid, 'manager@fumetteria-roma.com', '123456')
    -- (gen_random_uuid(), 'test@test.com', '123456')
  ) AS users
),
create_user AS (
  INSERT INTO auth.users (id, instance_id, ROLE, aud, email, raw_app_meta_data, raw_user_meta_data, is_super_admin, encrypted_password, created_at, updated_at, last_sign_in_at, email_confirmed_at, confirmation_sent_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  SELECT prefilledId, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', mail, '{"provider":"email","providers":["email"]}', '{}', FALSE, crypt(pass, gen_salt('bf')), NOW(), NOW(), NOW(), NOW(), NOW(), '', '', '', '' FROM credentials
  RETURNING id
)
INSERT INTO auth.identities (id, provider, user_id, identity_data, last_sign_in_at, created_at, updated_at)
SELECT id, 'email', id, json_build_object('sub', id), NOW(), NOW(), NOW() FROM create_user;


-- Ruoli utenti
INSERT INTO public.profiles_roles (profile_id, organizer_id, role)
VALUES
  -- manager@fumetteria-roma.com > Fumetteria Roma
  ('5899f99d-a449-4bfa-8769-19c097aaf1f5', '748f2552-f50e-4053-95e9-09476ab851ec', 'manager')
;


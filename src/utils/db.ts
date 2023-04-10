import supabase from './supabase';
import {z} from 'zod';
import formats, {Format} from '@constants/formats';

const PhysicalEventSchema = z.object({
  location: z.object({
    venue: z.string().default(''),
    address: z.string().default(''),
    city: z.string().default(''),
    province: z.string().default(''),
    country: z.string().default(''),
    latitude: z.number().default(0),
    longitude: z.number().default(0),
  }),
  onlineEvent: z.literal(false),
});

const OnlineEventSchema = z.object({
  location: z.null(),
  onlineEvent: z.literal(true),
});

const TournamentSchema = z
  .object({
    id: z.string(),
    format: z.enum(formats),
    startDate: z.string().datetime({offset: true}),
    startDateTz: z.string(),
    title: z.string().nullable().default(null),
    description: z.string().nullable().default(null),
    registrationLink: z.string().nullable().default(null),
    organizer: z.object({
      id: z.string(),
      name: z.string(),
      logo: z.string().nullable(),
    }),
  })
  .and(
    z.discriminatedUnion('onlineEvent', [
      PhysicalEventSchema,
      OnlineEventSchema,
    ])
  );

export async function fetchEventById(id: string): Promise<Tournament | null> {
  const {data, error} = await supabase
    .from('tournaments')
    .select('*, organizer:organizers(id, name, logo)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data === null) {
    return null;
  }

  return TournamentSchema.parse({
    id: data.id,
    format: data.formats[0],
    startDate: data.start_date,
    startDateTz: data.start_date_tz,
    title: data.title,
    description: data.description,
    registrationLink: data.registration_link,
    location: data.address,
    organizer: data.organizer,
    onlineEvent: data.online_event,
  });
}

export async function fetchNearbyEvents(
  lat: number,
  lng: number,
  radius: number = 5,
  format?: Format | Format[]
): Promise<Tournament[]> {
  const {data, error} = await (format !== undefined
    ? supabase.rpc('nearby_tournaments_formats', {
        lat: lat,
        long: lng,
        max_distance: radius * 1000,
        wanted_formats: ([] as Format[]).concat(format),
      })
    : supabase.rpc('nearby_tournaments', {
        lat: lat,
        long: lng,
        max_distance: radius * 1000,
      }));

  if (error) {
    throw error;
  }

  return z.array(TournamentSchema).parse(
    data.map((data: any) => ({
      id: data.id,
      format: data.formats[0],
      startDate: data.start_date,
      startDateTz: data.start_date_tz,
      title: data.title,
      text: data.description,
      registrationLink: data.registration_link,
      location: data.address,
      organizer: data.organizer,
      onlineEvent: data.online_event,
    }))
  );
}

export async function fetchHomeEvents(): Promise<Tournament[]> {
  const {data, error} = await supabase
    .from('tournaments')
    .select('*, organizer:organizers(id, name, logo)')
    .order('start_date', {
      ascending: true,
    })
    .gte('start_date', new Date().toISOString());

  if (error) {
    throw error;
  }

  return z.array(TournamentSchema).parse(
    data.map((data) => ({
      id: data.id,
      format: data.formats[0],
      startDate: data.start_date,
      startDateTz: data.start_date_tz,
      title: data.title,
      text: data.description,
      registrationLink: data.registration_link,
      location: data.address,
      organizer: data.organizer,
      onlineEvent: data.online_event,
    }))
  );
}

export async function fetchAllEventsByOrganizer(
  id: string
): Promise<Tournament[]> {
  const {data, error} = await supabase
    .from('tournaments')
    .select('*, organizer:organizers(id, name, logo)')
    .eq('organizer_id', id)
    .gte('start_date', new Date().toISOString())
    .order('start_date', {ascending: true});

  if (error) {
    throw error;
  }

  return z.array(TournamentSchema).parse(
    data.map((data: any) => ({
      id: data.id,
      format: data.formats[0],
      startDate: data.start_date,
      startDateTz: data.start_date_tz,
      title: data.title,
      text: data.description,
      registrationLink: data.registration_link,
      location: data.address,
      organizer: data.organizer,
      onlineEvent: data.online_event,
    }))
  );
}

const TournamentCreateSchema = z
  .object({
    format: z.enum(formats),
    startDate: z.string().datetime(),
    startDateTz: z.string(),
    title: z.string().nullable().default(null),
    description: z.string().nullable().default(null),
    registrationLink: z.string().nullable().default(null),
    organizer: z.string(),
  })
  .and(
    z.discriminatedUnion('onlineEvent', [
      PhysicalEventSchema,
      OnlineEventSchema,
    ])
  );
export async function createEvent(body: unknown): Promise<Tournament['id']> {
  const parsedBody = TournamentCreateSchema.parse(body);

  const {data, error} = await supabase
    .from('tournaments')
    .insert({
      title: parsedBody.title,
      description: parsedBody.description,
      formats: [parsedBody.format],
      start_date: parsedBody.startDate,
      start_date_tz: parsedBody.startDateTz,
      registration_link: parsedBody.registrationLink,
      organizer_id: parsedBody.organizer,
      online_event: parsedBody.onlineEvent,
      address: parsedBody.location,
      location: parsedBody.location
        ? `POINT(${parsedBody.location.longitude} ${parsedBody.location.latitude})`
        : null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

const TournamentUpdateSchema = z
  .object({
    format: z.enum(formats),
    startDate: z.string().datetime(),
    startDateTz: z.string(),
    title: z.string().nullable().default(null),
    description: z.string().nullable().default(null),
    registrationLink: z.string().nullable().default(null),
  })
  .and(
    z.discriminatedUnion('onlineEvent', [
      PhysicalEventSchema,
      OnlineEventSchema,
    ])
  );
export async function updateEvent(
  id: string,
  body: unknown
): Promise<Tournament['id']> {
  const parsedBody = TournamentUpdateSchema.parse(body);

  const {data, error} = await supabase
    .from('tournaments')
    .update({
      title: parsedBody.title,
      description: parsedBody.description,
      formats: [parsedBody.format],
      start_date: parsedBody.startDate,
      start_date_tz: parsedBody.startDateTz,
      registration_link: parsedBody.registrationLink,
      online_event: parsedBody.onlineEvent,
      address: parsedBody.location,
      location: parsedBody.location
        ? `POINT(${parsedBody.location.longitude} ${parsedBody.location.latitude})`
        : null,
    })
    .eq('id', id)
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

const CurrentUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  roles: z
    .object({
      organizer: z.string(),
      role: z.enum(['manager']),
    })
    .array(),
});

export async function fetchMe(id: string): Promise<User> {
  const {data, error} = await supabase
    .from('profiles')
    .select('*, roles:profiles_roles(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return CurrentUserSchema.parse({
    ...data,
    roles: (data.roles as any).map((r: any) => ({
      ...r,
      organizer: r.organizer_id,
    })),
  });
}

const OrganizerSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
  contacts: z.object({
    facebook: z.string().nullable().default(null),
    email: z.string().nullable().default(null),
    whatsapp: z.string().nullable().default(null),
    website: z.string().nullable().default(null),
    discord: z.string().nullable().default(null),
  }),
  address: z
    .object({
      address: z.string().default(''),
      city: z.string().default(''),
      province: z.string().default(''),
      country: z.string().default(''),
      latitude: z.number().default(0),
      longitude: z.number().default(0),
    })
    .nullable(),
});

export async function fetchAllOrganizers(): Promise<Organizer[]> {
  const {data, error} = await supabase
    .from('organizers')
    .select('*')
    .eq('type', 'to')
    .order('name');

  if (error) {
    throw error;
  }

  return z.array(OrganizerSchema).parse(data);
}

export async function fetchOrganizer(id: string): Promise<Organizer | null> {
  const {data, error} = await supabase
    .from('organizers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return OrganizerSchema.parse(data);
}

const OrganizerUpdateSchema = OrganizerSchema.pick({
  description: true,
  contacts: true,
});
export async function updateOrganizer(
  id: string,
  body: any
): Promise<Organizer> {
  const parsedBody = OrganizerUpdateSchema.parse(body);

  const {data, error} = await supabase
    .from('organizers')
    .update(parsedBody)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return OrganizerSchema.parse(data);
}

export async function fetchOrganizersManagedBy(
  uid: string
): Promise<Organizer[]> {
  const {data, error} = await supabase
    .from('organizers')
    .select('*, profiles_roles!inner(*)')
    .eq('profiles_roles.profile_id', uid);

  if (error) {
    throw error;
  }

  return OrganizerSchema.array().parse(data);
}

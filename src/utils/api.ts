import axios from 'axios';

export const http = axios.create({});

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await http.get('/api/me');

  return response.data;
};

export const fetchEventByCoords = async (
  coords: Coords,
  radius: number | undefined = 50
): Promise<Tournament[]> => {
  const response = await http.get('/api/events-by-coords', {
    params: {...coords, radius},
  });

  return response.data;
};

type CityOption = {
  name: string;
  latitude: number;
  longitude: number;
};

export const autocompleteCity = async (q: string): Promise<CityOption[]> => {
  const response = await http.get('/api/search-cities', {params: {q}});

  return response.data;
};

export const fetchMyOrganizers = async (): Promise<Organizer[]> => {
  const response = await http.get('/api/admin/organizers');

  return response.data;
};

export const fetchMyLeagues = async (): Promise<League[]> => {
  const response = await http.get('/api/admin/leagues');

  return response.data;
};

export const fetchEventsByOrganizer = async (
  organizer: string
): Promise<Tournament[]> => {
  const response = await http.get(`/api/admin/organizers/${organizer}/events`);

  return response.data;
};

export const fetchEventsByLeague = async (
  league: string
): Promise<Tournament[]> => {
  const response = await http.get(`/api/admin/leagues/${league}/events`);

  return response.data;
};

export const addEventFromLeague = async (
  league: string,
  tournament: string
): Promise<Tournament[]> => {
  const response = await http.post(
    `/api/admin/leagues/${league}/events/${tournament}`
  );

  return response.data;
};

export const removeEventFromLeague = async (
  league: string,
  tournament: string
): Promise<Tournament[]> => {
  const response = await http.delete(
    `/api/admin/leagues/${league}/events/${tournament}`
  );

  return response.data;
};

export const fetchPublicEventsByOrganizer = async (
  organizer: string
): Promise<Tournament[]> => {
  const response = await http.get(`/api/organizers/${organizer}/events`);

  return response.data;
};

export const fetchPublicEventsByLeague = async (
  league: string
): Promise<Tournament[]> => {
  const response = await http.get(`/api/leagues/${league}/events`);

  return response.data;
};

export const saveMyEvents = async (
  cities: string[],
  formats: Format[]
): Promise<void> => {
  await http.post('/api/save-my-events', {cities, formats});
};

export const fetchMyEvents = async (
  cities: string[],
  formats: Format[]
): Promise<Tournament[]> => {
  const response = await http.post('/api/my-events', {cities, formats});

  return response.data;
};

export const saveEvent = async (
  organizer: Organizer['id'],
  event: Pick<
    Tournament,
    'format' | 'timestamp' | 'title' | 'text' | 'registrationLink'
  > &
    Partial<Pick<Tournament, 'location'>>
): Promise<Tournament> => {
  const response = await http.post(
    `/api/admin/organizers/${organizer}/events`,
    event
  );

  return response.data;
};

export const updateEvent = async (
  eventId: Tournament['id'],
  event: Pick<
    Tournament,
    'format' | 'timestamp' | 'title' | 'text' | 'location' | 'registrationLink'
  >
): Promise<Tournament> => {
  const response = await http.post(`/api/admin/events/${eventId}`, event);

  return response.data;
};

export const updateOrganizer = async (
  organizerId: Organizer['id'],
  organizer: Pick<
    Organizer,
    'facebook' | 'whatsapp' | 'email' | 'website' | 'discord'
  >
): Promise<Tournament> => {
  const response = await http.post(
    `/api/admin/organizers/${organizerId}`,
    organizer
  );

  return response.data;
};

export const updateLeague = async (
  leagueId: Organizer['id'],
  data: Pick<Organizer, 'facebook' | 'whatsapp' | 'email' | 'website'>
): Promise<Tournament> => {
  const response = await http.post(`/api/admin/leagues/${leagueId}`, data);

  return response.data;
};

import axios from 'axios';

export const http = axios.create({});

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await http.get('/api/me');

  return response.data;
};

export const fetchEventByCoords = async (
  coords: Coords
): Promise<Tournament[]> => {
  const response = await http.get('/api/events-by-coords', {params: coords});

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

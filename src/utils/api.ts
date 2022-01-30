import axios from 'axios';

export const http = axios.create({});

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await http.get('/api/me');

  return response.data;
};

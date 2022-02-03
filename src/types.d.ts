type Coords = {
  latitude: number;
  longitude: number;
};

type Tournament = {
  id: string;
  format: string;
  venue: string;
  timestamp: number;
  location: Coords;
};

type User = {
  id: string;
  email: string;
  roles: string[];
};

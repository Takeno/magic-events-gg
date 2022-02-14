type Coords = {
  latitude: number;
  longitude: number;
};

type Format =
  | 'modern'
  | 'legacy'
  | 'standard'
  | 'pioneer'
  | 'vintage'
  | 'centurion'
  | 'pauper';

interface Organizer {
  id: string;
  name: string;
  address: string;
  city: string;
  location: Coords;
}

type Tournament = {
  id: string;
  format: Format;
  venue: string;
  timestamp: number;
  location: Coords;
  organizer: {
    id: Organizer['id'];
    name: Organizer['name'];
  };
};

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface Admin extends User {
  storeManagerOf: Organizer['id'][];
}

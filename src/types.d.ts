type Coords = {
  latitude: number;
  longitude: number;
};

interface Organizer {
  id: string;
  name: string;
  address: string;
  city: string;
  location: Coords;
}

type Tournament = {
  id: string;
  format: string;
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

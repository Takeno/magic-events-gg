interface Coords {
  latitude: number;
  longitude: number;
}

interface OrganizerLocation extends Coords {
  address: string;
  city: string;
  province: string;
  country: string;
}

interface EventLocation extends OrganizerLocation {
  venue: string;
}

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
  location: OrganizerLocation;
}

type Tournament = {
  id: string;
  format: Format;
  timestamp: number;
  location: EventLocation;
  organizer: Pick<Organizer, 'id' | 'name'>;
};

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface Admin extends User {
  storeManagerOf: Organizer['id'][];
}

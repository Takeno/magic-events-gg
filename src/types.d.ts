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
  | 'commander'
  | 'pauper'
  | 'draft'
  | 'sealed';

interface Organizer {
  id: string;
  name: string;
  logo: string | null;
  facebook: string | null;
  email: string | null;
  whatsapp: string | null;
  website: string | null;
  location: OrganizerLocation;
}

type Tournament = {
  id: string;
  format: Format;
  title: string | null;
  text: string | null;
  timestamp: number;
  location: EventLocation;
  organizer: Pick<Organizer, 'id' | 'name' | 'logo'>;
};

interface User {
  id: string;
  email: string;
  roles: string[];
  cities: string[];
  formats: Format[];
}

interface Admin extends User {
  storeManagerOf: Organizer['id'][];
}

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
  | 'centurion'
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
  location: OrganizerLocation | null;
}

interface League {
  id: string;
  name: string;
  text: string | null;
  logo: string | null;
  facebook: string | null;
  email: string | null;
  whatsapp: string | null;
  website: string | null;
}

type Tournament = {
  id: string;
  format: Format;
  title: string | null;
  text: string | null;
  registrationLink: string | null;
  timestamp: number;
  location: EventLocation;
  organizer: Pick<Organizer, 'id' | 'name' | 'logo'>;
  leaguesIds: Array<League['id']>;
  leagues: Array<Pick<League, 'id' | 'name' | 'logo'>>;
};

interface User {
  id: string;
  email: string;
  roles: string[];
  cities: string[];
  formats: Format[];
}

interface Admin extends User {
  leagueManagerOf: League['id'][];
  storeManagerOf: Organizer['id'][];
}

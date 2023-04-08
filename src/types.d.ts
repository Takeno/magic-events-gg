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
  description: string | null;
  logo: string | null;
  contacts: {
    facebook: string | null;
    email: string | null;
    whatsapp: string | null;
    website: string | null;
    discord: string | null;
  };
  address: OrganizerLocation | null;
}

interface League {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  facebook: string | null;
  email: string | null;
  whatsapp: string | null;
  website: string | null;
  discord: string | null;
}

type Tournament = {
  id: string;
  format: Format;
  title: string | null;
  description: string | null;
  registrationLink: string | null;
  startDate: string;
  startDateTz: string;
  organizer: Pick<Organizer, 'id' | 'name' | 'logo'>;
  // leaguesIds: Array<League['id']>;
  // leagues: Array<Pick<League, 'id' | 'name' | 'logo'>>;
} & (
  | {
      location: EventLocation;
      onlineEvent: false;
    }
  | {
      location: null;
      onlineEvent: true;
    }
);

interface User {
  id: string;
  email: string;
  roles: {
    organizer: string;
    role: 'manager';
  }[];

  // roles: string[];
  // cities: string[];
  // formats: Format[];
}

interface Admin extends User {
  leagueManagerOf: League['id'][];
  storeManagerOf: Organizer['id'][];
}

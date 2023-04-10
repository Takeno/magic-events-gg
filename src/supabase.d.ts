export type Json =
  | string
  | number
  | boolean
  | null
  | {[key: string]: Json}
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      organizers: {
        Row: {
          address: Json;
          contacts: Json;
          created_at: string;
          description: string | null;
          id: string;
          location: unknown | null;
          logo: string | null;
          name: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          address?: Json;
          contacts?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          location?: unknown | null;
          logo?: string | null;
          name: string;
          type?: string;
          updated_at?: string;
        };
        Update: {
          address?: Json;
          contacts?: Json;
          created_at?: string;
          description?: string | null;
          id?: string;
          location?: unknown | null;
          logo?: string | null;
          name?: string;
          type?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          email: string;
          id: string;
          preferred_formats: string[];
        };
        Insert: {
          email: string;
          id: string;
          preferred_formats?: string[];
        };
        Update: {
          email?: string;
          id?: string;
          preferred_formats?: string[];
        };
      };
      profiles_roles: {
        Row: {
          organizer_id: string;
          profile_id: string;
          role: string;
        };
        Insert: {
          organizer_id: string;
          profile_id: string;
          role: string;
        };
        Update: {
          organizer_id?: string;
          profile_id?: string;
          role?: string;
        };
      };
      tournaments: {
        Row: {
          address: Json | null;
          created_at: string;
          description: string | null;
          formats: string[];
          id: string;
          location: unknown | null;
          online_event: boolean;
          organizer_id: string;
          registration_link: string | null;
          start_date: string;
          start_date_tz: string;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          address?: Json | null;
          created_at?: string;
          description?: string | null;
          formats?: string[];
          id?: string;
          location?: unknown | null;
          online_event?: boolean;
          organizer_id: string;
          registration_link?: string | null;
          start_date: string;
          start_date_tz: string;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: Json | null;
          created_at?: string;
          description?: string | null;
          formats?: string[];
          id?: string;
          location?: unknown | null;
          online_event?: boolean;
          organizer_id?: string;
          registration_link?: string | null;
          start_date?: string;
          start_date_tz?: string;
          title?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      nearby_tournaments: {
        Args: {
          lat: number;
          long: number;
          max_distance: number;
        };
        Returns: Record<string, unknown>[];
      };
      nearby_tournaments_formats: {
        Args: {
          lat: number;
          long: number;
          max_distance: number;
          wanted_formats: string[];
        };
        Returns: Record<string, unknown>[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

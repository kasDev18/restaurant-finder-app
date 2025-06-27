export type OpenAIProps<T = string> = {
  OPENAI_APP_BASE_URI: T;
  OPENAI_API_KEY: T;
  OPENAI_APP_MODEL: T;
};

export interface OpenAIResponseProps<T = string> {
  choices: {
    message: {
      content: T;
    };
  }[];
}

export type FSAPIProps<T = string> = {
    FS_URI: T;
    FS_API_KEY: T;
}

export type FSResId<T = string> = {
    fsq_id: T
}


interface FoursquareCategory { id: string; name: string; }
interface FoursquareLocation { formatted_address?: string; }
export interface FoursquarePhoto { prefix: string; suffix: string; }
export interface FoursquarePlace {
  fsq_id: string;
  name: string;
  location?: FoursquareLocation;
  categories?: FoursquareCategory[];
  rating?: number;
  price?: string;
  hours?: { display?: string };
}
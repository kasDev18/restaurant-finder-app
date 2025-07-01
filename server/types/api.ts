export interface OpenAIResponseContent<T = string> {
  choices: {
    message: {
      content: T;
    };
  }[];
}

/* FourSquare API types */
interface RegularHours {
  day: number;  // e.g. "1,2,3"
  open: string
  close: string;
}
export interface Hours {
  display?: string;
  open_now?: boolean;
  regular?: RegularHours[];
}

interface FoursquareCategory<T = string> { id: T; name: T; }
interface FoursquareLocation<T = string> { formatted_address?: T; }
export interface FoursquarePhoto<T = string> { prefix: T; suffix: T; }
export interface FoursquarePlace<T = string, N = number> {
  fsq_id: T;
  name: T;
  location?: FoursquareLocation;
  categories?: FoursquareCategory[];
  rating?: N;
  price?: T;
  hours?: { display?: T; };
}

export interface PlacePriceLvlProps {
  parameters: { cuisine?: string[], price_level?: number };
  open_now: boolean;
}
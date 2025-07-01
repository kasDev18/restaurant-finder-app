export type QueryProp<T = string> = {
  query: {
    message: T;
  };
};

export type QueryParamsProps<T = string, U = string[], V = number, W = boolean, X = any > = {
  search_for: T;
  open_now: W;
  parameters: {
    cuisine?: U;
    near: T;
    rating?: X;
    limit?: V;
    price_level?: V;
    radius_meters?: V;
    min_price?: V;
    max_price?: V;
  };
};

export type QueryErrorProps<T = boolean, U = string> = {
  error: T;
  error_type: U;
  message: U;
  details?: U;
}

export type QueryResponseProps = {
  fsq_id: string;
  categories: string[];
  chains: object[];
  closed_bucket?: string;
  distance?: number;
  geocodes?: {
    main?: object;
    roof?: object;
  };
  link?: string;
  location?: {
    address?: string;
    census_block?: string;
    country?: string;
    cross_street?: string;
    dma?: string;
    formatted_address?: string;
    locality?: string;
    postcode?: string;
    region?: string;
  };
  name: string;
  related_places?: object;
  timezone?: string;
  rating?: number;
  star_rating?: number
  price_level?: string | number;
  operating_hours?: string;
  photo?: string;
  hours?: {
    display?: string;
    regular?: Array<{
      days: string;
      open: Array<{ start: string; end: string }>;
    }>;
  };
  open_now: boolean;
};

export type ErrorResponseProps = {
  error: boolean;
  error_type: string;
  message: string;
  details?: string;
}

export type FilterPlaceParamsProps<T = string[], U = number> = {
  cuisine?: T;
  price_level?: U;
  rating?: U;
};
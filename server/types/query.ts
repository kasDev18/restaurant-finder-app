export type QueryProp<T = string> = {
  query: {
    message: T;
  };
};

export type QueryParamsProps<T = string, U = string[], V = number, W = boolean, X = string > = {
  search_for: T;
  parameters: {
    cuisine?: U;
    near: X;
    rating?: V;
    limit?: V;
    price_level?: V;
    operating_hours: X;
    open_now: W;
    latitude?: V;
    longitude?: V;
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
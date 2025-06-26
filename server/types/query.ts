export type QueryProp<T = string> = {
  query: T;
};

export type QueryParamsProps<T = string, U = string[], V = number | null, W = boolean | null, X = string | null > = {
  search_for: T;
  parameters: {
    food: U;
    near: X;
    rating: V;
    price_level: V;
    operating_hours: X;
    open_now: W;
    latitude: V;
    longitude: V;
    radius: V;
    min_price: V;
    max_price: V;
  };
};

export type QueryErrorProps<T = boolean, U = string> = {
  error: T;
  error_type: U;
  message: U;
  details?: U;
}
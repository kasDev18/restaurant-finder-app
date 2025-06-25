export type QueryParamsProps = {
  search_for: string;
  parameters: {
    food: string[];
    near: string | null;
    rating: number | null;
    price_level: number | null;
    operating_hours: string | null;
    open_now: boolean | null;
    latitude: number | null;
    longitude: number | null;
    radius: number | null;
    min_price: number | null;
    max_price: number | null;
  };
};
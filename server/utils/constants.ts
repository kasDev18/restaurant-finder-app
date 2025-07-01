import { QueryParamsProps } from "../types/query";

export const queryParams = <T extends QueryParamsProps>(params: T) => {
  return {
    near: params.parameters.near,
    query: params.parameters.cuisine?.join(",") || "",
    limit: 50,
    rating: params.parameters.rating,
    price_level: params.parameters.price_level,
    radius: params.parameters.radius_meters,
    min_price: params.parameters.min_price,
    max_price: params.parameters.max_price,
    categories: "4d4b7105d754a06374d81259",
  };
};

export const priceLevelMap: Record<number, string> = {
  1: "Cheap",
  2: "Moderate",
  3: "Expensive",
  4: "Very Expensive",
};

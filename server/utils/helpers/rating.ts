export const getStarRating = (rating: number ) => {

    const roundedRating: number = Math.round(rating);
  const mapRatingToStars = (roundedRating: number): number => {
    if (typeof roundedRating !== "number") return 0;
    if (roundedRating <= 2) return 1;
    if (roundedRating <= 4) return 2;
    if (roundedRating <= 6) return 3;
    if (roundedRating <= 8) return 4;
    return 5;
  };
  const starRating = mapRatingToStars(roundedRating);

  return starRating;
};

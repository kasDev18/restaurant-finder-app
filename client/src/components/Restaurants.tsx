import { AiFillCompass } from "react-icons/ai";
import { IoIosPricetags } from "react-icons/io";

export default function Restaurants({ restaurants }: any) {
  const starRating = (rating: number): React.ReactNode => {
    if (isNaN(rating) || rating <= 0) return "N/A";
    // Map rating: 1-2: 1 star, 2-4: 2 stars, 4-6: 3 stars, 6-8: 4 stars, 8-10: 5 stars
    let stars = 1;
    if (rating > 8) stars = 5;
    else if (rating > 6) stars = 4;
    else if (rating > 4) stars = 3;
    else if (rating > 2) stars = 2;
    // else stars = 1;
    return (
      <>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={"text-yellow-400"}>
            {i < stars ? "★" : "☆"}
          </span>
        ))}
        <span className="ml-1">({rating})</span>
      </>
    );
  };

  return (
    <>
      {restaurants.length ? (
        <section className="flex flex-col w-[40vw] h-full overflow-y-scroll">
          {restaurants.map((restaurant: any, index: number) => (
            <div
              className="text-black shadow-md m-2 bg-white flex rounded-lg hover:shadow-lg"
              key={index}
            >
              <img
                src={
                  !restaurant.photo
                    ? "https://image.pngaaa.com/13/1887013-middle.png"
                    : restaurant.photo
                }
                alt={restaurant.name}
                className="w-1/3"
                loading="lazy"
              />
              <article className="p-4 w-full flex flex-col justify-between gap-2">
                <div className="flex">
                  <div className="flex flex-col gap-2 text-xs text-gray-500">
                    <div className="flex flex-col items-start gap-2">
                      <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                      <div className="flex items-center gap-2">
                        <AiFillCompass className="w-8 h-6" />
                        <span>{restaurant.address}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      {/* <AiFillClockCircle className="w-5 h-5 mt-0.5" /> */}
                      {/* <div className="flex flex-col flex-wrap gap-y-1">
                        {restaurant.operating_hours &&
                        typeof restaurant.operating_hours === "string"
                          ? restaurant.operating_hours
                              .split(/[,;]+/)
                              .map((segment: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="leading-tight whitespace-nowrap"
                                >
                                  {segment.trim()}
                                </span>
                              ))
                          : restaurant.operating_hours}
                      </div> */}

                      <div className={`flex items-center gap-1 font-bold px-2 py-1 rounded-full text-xs
                        ${restaurant.open_now ? "bg-green-100 text-green-700 border border-green-300 animate-pulse" : "bg-red-100 text-red-700 border border-red-300"}
                      `}>
                        <span className="w-2 h-2 rounded-full mr-1"
                          style={{ background: restaurant.open_now ? '#22c55e' : '#ef4444', display: 'inline-block' }}
                        ></span>
                        {restaurant.open_now ? "Open Now" : "Closed"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 flex p-2 rounded-lg ml-auto flex-col items-center">
                    <span className="text-amber-500 text-md font-bold flex items-center gap-1">
                      {starRating(restaurant.rating)}
                    </span>
                  </div>
                </div>
                <p className="text-amber-500 flex items-center gap-1">
                  <IoIosPricetags className="text-lg" />{" "}
                  {restaurant.price_level}
                </p>
                <div className="mt-2 ">
                  {restaurant.cuisine.length >= 1 &&
                    restaurant.cuisine.map((cuisine: any) => (
                      <>
                        <div className="badge bg-amber-900 border-0 text-white">
                          {cuisine}
                        </div>
                        &nbsp;
                      </>
                    ))}
                </div>
              </article>
            </div>
          ))}
        </section>
      ) : (
        <h3 className="text-2xl font-bold">No Restaurants Found</h3>
      )}
    </>
  );
}

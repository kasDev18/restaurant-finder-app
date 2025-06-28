import { AiFillCompass, AiFillClockCircle } from "react-icons/ai";
import { IoIosPricetags } from "react-icons/io";

export default function Restaurants({ restaurants }: any) {
  return (
    <>
      {restaurants.length ? (
        <section className="flex flex-col w-[40vw]">
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
                    <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                    <p className=" flex gap-1">
                      <AiFillCompass className="text-lg" /> {restaurant.address}
                    </p>
                    <p className=" flex gap-1">
                      <AiFillClockCircle className="text-lg" />{" "}
                      {restaurant.operating_hours}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 flex p-2 rounded-lg bg-warning ml-auto flex-col items-center h-[8vh]">
                    <span className="text-white text-md font-bold">
                      {restaurant.rating}
                    </span>
                    <span className="text-white font-bold">Rating</span>
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

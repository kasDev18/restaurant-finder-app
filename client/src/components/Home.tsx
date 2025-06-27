import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  findRestaurantDetails,
  getRestaurants,
} from "../utils/api/restaurants";
export default function Home() {
  const [query, setQuery] = useState<{ message: string }>({ message: "" });
  const [restaurants, setRestaurants] = useState<any>([]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      console.log("Submitting query...");

      const response = await getRestaurants(
        query.message
      ); /* Call getRestaurants function to fetch restaurants */

      if (!response.error || response.length > 0) {
        response.forEach(async (placeId: { fsq_id: string }) => {
          /* Call findRestaurantDetails function to fetch restaurant details */
          const getDetails = await findRestaurantDetails(placeId.fsq_id);
          setRestaurants((prev: any) => [...prev, getDetails]);
        });
      }
      
    } catch (err) {
      toast.error("Network or server error.");
    }
  };

  console.log(restaurants);
  return (
    <div className='flex bg-[url("/images/bg-food.jpeg")] w-screen h-screen justify-center'>
      <div className="h-screen w-1/2 bg-white items-center flex flex-col py-4">
        <span className="text-black">Find restaurants here</span>
        <form
          className="flex items-center justify-center"
          onSubmit={handleSubmit}
        >
          <input
            value={query.message}
            type="text"
            placeholder="Search Restaurant"
            className="input input-sm w-[35vw]"
            onChange={(event) => setQuery({ message: event.target.value })}
            required
          />
          <button type="submit" className="btn btn-neutral btn-sm">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

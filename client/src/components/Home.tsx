import React, { useState } from "react";
import toast from "react-hot-toast";
import { getRestaurants } from "../utils/api/restaurants";
import Restaurants from "./Restaurants";

export default function Home() {
  const [query, setQuery] = useState<{ message: string }>({ message: "" });
  const [restaurants, setRestaurants] = useState<any>([]);

  /* Function to handle form submission */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      console.log("Submitting request...");
      const response = await getRestaurants(
        query.message
      ); /* Call getRestaurants function to fetch restaurants */

      /* Check if there is an error */
      if (response.error) {
        console.error("Error fetching restaurants:", response.message);
        toast.error(response.message);
        return;
      }

      console.log("Restaurants fetched successfully!");

      setRestaurants(response); /* Set the fetched restaurants in the state */
    } catch (err) {
      toast.error("Network or server error.");
    }
  };
  console.log(restaurants);
  

  return (
    <main className='flex bg-[url("/images/bg-food.jpeg")] w-screen h-screen justify-center'>
      <div className="h-screen w-1/2 bg-gray-200 items-center flex flex-col p-4 gap-3">
        <h1 className="text-xl font-bold text-amber-500 drop-shadow-[0_1.5px_0_rgba(0,0,0,0.8)] [text-shadow:2px_2px_0_#fff,2px_-2px_0_#fff,-2px_2px_0_#fff,-2px_-2px_0_#fff]">
          Find Restaurants
        </h1>
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
        <Restaurants restaurants={restaurants}/>
      </div>
    </main>
  );
}

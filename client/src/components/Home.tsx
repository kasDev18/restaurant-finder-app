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
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-100 rounded-full shadow-xl px-6 py-3 w-[40vw] border-2 border-amber-400 focus-within:border-amber-500 transition-all duration-200"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-inner border border-amber-200 focus-within:ring-2 focus-within:ring-amber-300 transition-all duration-200 w-full">
            <svg className="w-6 h-6 text-amber-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path></svg>
            <input
              value={query.message}
              type="text"
              placeholder="Search for cuisine, name, or location..."
              className="flex-1 outline-none bg-transparent text-lg px-2 py-1 rounded-full focus:ring-0 placeholder:text-amber-400 text-amber-900"
              onChange={(event) => setQuery({ message: event.target.value })}
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn font-bold rounded-full px-7 py-2 shadow-lg hover:bg-amber-500 hover:text-white transition-all duration-200 border-none text-amber-900 bg-gradient-to-r from-amber-300 to-yellow-200 focus:ring-2 focus:ring-amber-400"
          >
            <span className="hidden sm:inline">Search</span>
            <svg className="inline-block w-5 h-5 ml-1 text-amber-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"></path></svg>
          </button>
        </form>
        <Restaurants restaurants={restaurants}/>
      </div>
    </main>
  );
}

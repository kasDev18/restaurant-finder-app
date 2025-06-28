import React, { useState } from "react";
import toast from "react-hot-toast";
import { getRestaurants } from "../utils/api/restaurants";
import Restaurants from "./Restaurants";

export default function Home() {
  const [query, setQuery] = useState<{ message: string }>({ message: "" });
  const [restaurants, setRestaurants] = useState<any>([]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    try {
      console.log("Submitting request...");
      const response = await getRestaurants(
        query.message
      ); /* Call getRestaurants function to fetch restaurants */

      if (response.error) {
        console.error("Error fetching restaurants:", response.message);
        toast.error(response.message);
        return;
      }

      console.log("Restaurants fetched successfully!");

      setRestaurants(response);
    } catch (err) {
      toast.error("Network or server error.");
    }
  };

  console.log(restaurants);

  return (
    <main className='flex bg-[url("/images/bg-food.jpeg")] w-screen h-screen justify-center'>
      <div className="h-screen w-1/2 bg-gray-200 items-center flex flex-col p-4 gap-3">
        <h1 className="text-xl font-bold text-amber-500">Find Restaurants</h1>
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
        

        {/* <div className="rounded-xl shadow-md p-4 bg-white hover:shadow-lg">
  <img src="poppy-rose.jpg" alt="Poppy + Rose" className="rounded-lg w-full h-40 object-cover" />
  <h2 className="text-xl font-bold mt-2">Poppy + Rose</h2>
  <p className="text-gray-500 text-sm">765 Wall St, Los Angeles, CA 90014</p>
  <div className="text-sm text-gray-600 flex items-center gap-4 mt-1">
    <span>🕒 7:00 AM – 3:00 PM</span>
    <span>💲 Price: $$</span>
  </div>
  <div className="mt-1 text-yellow-500 text-sm">
    ★ 4.6 <span className="text-gray-500">(1.2k reviews)</span>
  </div>
  <div className="mt-2">
    {['Breakfast Spot', 'American Restaurant', 'Diner'].map(tag => (
      <span key={tag} className="bg-yellow-400 text-white rounded-full px-2 py-1 text-xs mr-2">{tag}</span>
    ))}
  </div>
</div> */}
      </div>
    </main>
  );
}

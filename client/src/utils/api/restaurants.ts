import toast from "react-hot-toast";

export const getRestaurants = async (query: string): Promise<any> => {
  try {
    const response: Response = await fetch(`/api/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: { message: query } }),
    });
    const data = await response.json();

    if (data.error) {
      console.error("Error in response:", data.message);
      return toast.error(data.message);
    } else if (!data.length) {
      console.log("No restaurants found for your query.");
      return toast.error("No restaurants found for your query.");
    }

    return data;

    // data.forEach(async (place: { fsq_id: string }) => {
    //     console.log("Getting details for:", place.fsq_id);
        
    //   await findRestaurantDetails(place.fsq_id);
    // });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

// const findRestaurantDetails = async (placeId: string): Promise<any> => {
//   try {
//     const response: Response = await fetch(
//       `https://api.foursquare.com/v3/places/${placeId}`,
//       {
//         method: "GET",
//         headers: {
//           "Accept": "application/json",
//           Authorization: `fsq3RO0X8226ca5YhcA4n9tadJTLHXo4dGJEASYcRPvsluM=`,
//         },
//       }
//     );
//     const data = await response.json();
//     console.log(data);
    
//     // return data;
//   } catch (error) {
//     console.error("Error fetching restaurant details:", error);
//     throw error;
//   }
// };

import toast from "react-hot-toast";

const FS_URI = import.meta.env.VITE_FS_URI;
const FS_API_KEY = import.meta.env.VITE_FS_API_KEY;

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

    // return data;

    data.forEach(async (place: { fsq_id: string }) => {
      console.log("Getting details for:", place.fsq_id);

      await findRestaurantDetails(place.fsq_id);
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

export const findRestaurantDetails = async (placeId: string): Promise<any> => {
  try {
    const response: Response = await fetch(
      `${FS_URI}/${placeId}?fields=fsq_id,name,location,categories,rating,price,hours`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: FS_API_KEY,
        },
      }
    );
    const data = await response.json();

    const photoUrl = await getRestaurantsPhoto(placeId);

    const details = {
      name: data.name,
      address: data.location?.formatted_address || "",
      cuisine: data.categories?.map((cat: any) => cat.name).join(", ") || "",
      rating: data.rating ?? "N/A",
      price_level: data.price ?? "N/A",
      operating_hours: data.hours?.display || "N/A",
    };
    
    const obj: any = {};
    Object.entries(details).forEach(([key, value]) => {
      obj[key] = value;
      obj.photo = `${photoUrl[0].prefix}300x300${photoUrl[0].suffix}`
      // console.log(index);
      
      // obj.photo = photoUrl[key].prefix + "300x300" + photoUrl.suffix;
    });
    const detailsJson = JSON.stringify(obj);

    console.log(JSON.parse(detailsJson));
    
    // const detailsJson = JSON.parse(detailsArr.join(","));
    // console.log(JSON.parse(detailsArr));

    // console.log("Details:", detailsArr);

    return JSON.parse(detailsJson);
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    throw error;
  }
};

const getRestaurantsPhoto = async (placeId: string): Promise<any> => {
  try {
    const photosRes = await fetch(
      `${FS_URI}/${placeId}/photos`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: FS_API_KEY,
        },
      }
    );
    const photo = await photosRes.json();
    return photo;
  } catch (error) {
    console.error("Error fetching restaurant photo:", error);
    throw error;
  }
};

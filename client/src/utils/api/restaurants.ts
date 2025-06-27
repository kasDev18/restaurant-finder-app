/**
 * DOCU: This function is used to send the query to the OpenAI API and then get the response back as a JSON object <br>
 * This is being called in the Home <br>
 * Last Updated Date: June 26, 2025 <br>
 * @function
 * @param {string} query
 * @returns {Promise<void>}
 * @author Kas
 */
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
    return data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};
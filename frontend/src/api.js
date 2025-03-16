import { auth } from "./firebase";

// Generic function to make authenticated requests with GET and POST support
export const fetchDataWithAuth = async (url, method = "GET", data = null) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated");
    }

    // Get Firebase Auth token
    const token = await user.getIdToken();

    // Setup request options
    const options = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    // Add body if method is POST/PUT and data is provided
    if ((method === "POST" || method === "PUT") && data) {
      options.body = JSON.stringify(data);
    }

    // Make the fetch request
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    // Parse and return the response data
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

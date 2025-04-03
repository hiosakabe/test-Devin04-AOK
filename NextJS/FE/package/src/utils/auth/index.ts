/**
 * Utility function to retrieve an authentication token from the API
 * @param {string} apiUrl - The API URL to fetch the token from (defaults to http://localhost:8000/token)
 * @param {string} username - The username to use (defaults to environment variable)
 * @param {string} password - The password to use (defaults to environment variable)
 * @returns {Promise<{access_token: string}>} - The token data including access_token
 */
export async function getAuthToken(
  apiUrl: string = "http://localhost:8000/token",
  username?: string,
  password?: string
): Promise<{ access_token: string }> {
  try {
    // Check if we already have a token in cookies
    const existingToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
    
    if (existingToken) {
      return { access_token: existingToken };
    }
    
    // No token found, need to authenticate
    // Use provided credentials or fall back to dummy values
    const credentials = {
      username: username || "XXXX", // Replaced with dummy value
      password: password || "XXXX", // Replaced with dummy value
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(credentials),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const tokenData = await response.json();
    
    // Store token in cookie with 1-hour expiration (3600 seconds)
    document.cookie = `auth_token=${tokenData.access_token}; path=/; max-age=3600`;
    
    return tokenData;
  } catch (error) {
    console.error("Failed to retrieve authentication token:", error);
    throw error;
  }
}

/**
 * Helper function to create headers with authorization token
 * @returns {Headers} - Headers object with Authorization bearer token
 */
export async function getAuthHeaders(): Promise<Headers> {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  
  try {
    const tokenData = await getAuthToken();
    headers.append("Authorization", `Bearer ${tokenData.access_token}`);
  } catch (error) {
    console.error("Failed to add auth token to headers:", error);
  }
  
  return headers;
}

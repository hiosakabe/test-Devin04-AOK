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
    // Use provided credentials or fall back to test user credentials
    const credentials = {
      username: username || "postgres", // Test user created by initial_data.py
      password: password || "password", // Test user password
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

    return await response.json();
  } catch (error) {
    console.error("Failed to retrieve authentication token:", error);
    throw error;
  }
}

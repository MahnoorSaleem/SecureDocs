export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } else {
        const text = await response.text();
        if (text.trim().startsWith("<!DOCTYPE html") || text.trim().startsWith("<html")) {
          if (response.status === 404) {
            errorMessage = "Resource not found (404)";
          } else if (response.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else {
            errorMessage = `HTTP error ${response.status}`;
          }
        } else {
          errorMessage = text || `HTTP error ${response.status}`;
        }
      }
    } catch {
      // Fallback if even text parsing fails
      errorMessage = `Unexpected error occurred (status ${response.status})`;
    }

    throw new Error(errorMessage);
  }
  return response.json();
}

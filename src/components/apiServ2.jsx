// apiService.js

const BASE_URL =
  "https://ec2-65-0-205-116.ap-south-1.compute.amazonaws.com:3001"; // Replace with your actual API base URL

export async function updatePost(id, updatedData) {
  try {
    const response = await fetch(
         
      `${BASE_URL}/api/Admin/private/updateNews/${id}`,
      {
        method: "PUT", // or 'PATCH' depending on your API endpoint
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update post");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deletePost(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/Admin/private/deleteNews/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add any authorization headers if needed
          Authorization: "Bearer your-token-here",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export async function uploadPost(newPost) {
  try {
    const response = await fetch(`${BASE_URL}/api/Admin/private/createNews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any authorization headers if needed
        Authorization: "Bearer your-token-here",
      },
      body: JSON.stringify(newPost),
    });
    if (!response.ok) {
      throw new Error("Failed to upload post");
    }
    return await response.json();
  } catch (error) {
    console.error("Error uploading post:", error);
    throw error;
  }
}
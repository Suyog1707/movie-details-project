import axiosClient from "../axios/axiosClient.jsx";
import { isFavorite } from "./IsFavorite";

export async function toggleFavorites(
  mediaId,
  favorites,
  fetchFavorites,
) {
  try {
    const checkFavorite = isFavorite(mediaId, favorites)
    console.log("MEDIA ID:", mediaId);
    console.log("PAYLOAD:", { mediaId });

    if (checkFavorite) {
      await axiosClient.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/favorites/${mediaId}`
      );
    } else {
      await axiosClient.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/favorites`,
        { mediaId }
      );
    }

    await fetchFavorites();
  } catch (error) {
    console.error(error);
  }
}
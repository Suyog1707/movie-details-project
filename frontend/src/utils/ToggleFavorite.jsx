import axios from "axios";
import axiosClient from "../../../backend/src/axios/axios.client";
import { isFavorite } from "./IsFavorite";

export async function toggleFavorites({
  mediaId,
  favorites,
  fetchFavorites,
}) {
  try {
    const token = localStorage.getItem("token");

    const isFavorite = isFavorite({mediaId, favorites})

    if (isFavorite) {
      await axiosClient.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/favorite/${mediaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      await axiosClient.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/favorites`,
        { mediaId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    await fetchFavorites();
  } catch (error) {
    console.error(error);
  }
}
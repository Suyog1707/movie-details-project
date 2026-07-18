import responseHandler from "../handlers/response.handler.js";
import { Favorite } from "../models/favorite.model.js"
import axios from "axios"

const addFavorite = async (req, res) => {
    try {
        const isFavorite = await Favorite.findOne({
            user: req.user.id,
            mediaId: req.body.mediaId
        });

        if (isFavorite)
            return responseHandler.ok(res, isFavorite);

        const favorite = new Favorite({
            user: req.user.id,
            ...req.body
        });

        await favorite.save();

        responseHandler.created(res, favorite);
    } catch (error) {
        console.error("ADD FAVORITE ERROR:", error);
        responseHandler.error(res);
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { mediaId } = req.params

        const favorite = await Favorite.findOne({
            user: req.user.id,
            mediaId: Number(mediaId)
        })

        if (!favorite)
            return responseHandler.notFound(res)

        await favorite.deleteOne()

        return responseHandler.ok(res, "Deleted successfully")
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const retryRequest = async (
    requestFn,
    retries = 3,
    delay = 1000
) => {
    try {
        return await requestFn();
    } catch (error) {
        if (retries <= 0) throw error;

        await new Promise(resolve =>
            setTimeout(resolve, delay)
        );

        return retryRequest(
            requestFn,
            retries - 1,
            delay
        );
    }
};

const getFavoritesOfUser = async (req, res) => {
    try {
        const favorites = await Favorite.find({
            user: req.user.id
        }).sort("-createdAt");

        if (!favorites.length)
            return responseHandler.ok(res, []);

        const favoriteMovies = await Promise.all(
            favorites.map(async (favorite) => {
                try {
                    const mediaType = "movie"
                    const mediaId = favorite.mediaId

                    const media = await retryRequest(
                        async () => {
                            const response = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${process.env.TMDB_API_KEY}`)
                            return {
                                ...response.data,
                                createdAt: favorite.createdAt,
                                updatedAt: favorite.updatedAt,
                                genre_ids: response.data.genres.map((genre) => { return genre.id })
                            };
                        }
                    );

                    return media

                } catch (err) {
                    console.log(err.response?.data || err.message);
                    return null;
                }
            })
        );

        const filteredMovies = favoriteMovies.filter(Boolean);

        return responseHandler.ok(res, filteredMovies);

    } catch (err) {
        console.log(
            "FAILED ID:",
            favorite.mediaId,
            err.code,
            err.message
        );
        return null;
    }
};

export default {
    addFavorite,
    removeFavorite,
    getFavoritesOfUser
}
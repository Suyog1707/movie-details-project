import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js"
import User from "../models/user.model.js"
import { Favorite } from "../models/favorite.model.js"
import Review from "../models/review.model.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const getList = async (req, res) => {
    try {
        const { page } = req.query
        const { mediaType, mediaCategory } = req.params

        const response = await tmdbApi.mediaList({ mediaType, mediaCategory, page })

        return responseHandler.ok(res, response)
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const getGenres = async (req, res) => {
    try {
        const { mediaType } = req.params

        const response = await tmdbApi.mediaGenres({ mediaType })

        return responseHandler.ok(res, response)
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const search = async (req, res) => {
    try {
        const { mediaType } = req.params
        const { query, page } = req.query

        const response = await tmdbApi.mediaSearch({
            query,
            page,
            mediaType: mediaType === "people" ? "person" : mediaType
        })

        return responseHandler.ok(res, response)
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const getDetail = async (req, res) => {
    try {
        const { mediaType, mediaId } = req.params
        const params = { mediaType, mediaId }

        const media = await tmdbApi.mediaDetail(params)

        const credits = await tmdbApi.mediaCredits(params)

        media.credits = credits

        const videos = await tmdbApi.mediaVideos(params)

        media.videos = videos

        const recommend = await tmdbApi.mediaRecommend(params)

        media.recommend = recommend.results

        media.image = await tmdbApi.mediaImages(params)

        const user = await User.findOne({
            user:req.user.userName
        })

        if (user) {
            const isFavorite = await Favorite.findOne({ user: user.id, mediaId })

            media.isFavorite = isFavorite !== null
        }

        media.reviews = await Review.find({ mediaId }).populate("user").sort("-createdAt")

        return responseHandler.ok(res, media)
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

export default {
    getList,
    getGenres,
    search,
    getDetail
}
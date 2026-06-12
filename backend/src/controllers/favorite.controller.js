import responseHandler from "../handlers/response.handler.js";
import { Favorite } from "../models/favorite.model.js"

const addFavorite = async (req, res) => {
    try {
        const isFavorite = await Favorite.findOne({
            user: req.user.id,
            mediaId: req.body.mediaId
        })

        if (isFavorite)
            return responseHandler.ok(res, isFavorite)

        const favorite = new Favorite({
            ...req.body,
            user: req.user.id
        })

        await favorite.save

        responseHandler.created(res, favorite)
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const removeFavorite = async (req, res) => {
    try {
        const { favoriteId } = req.params

        const favorite = await Favorite.findOne({
            user: req.user.id,
            _id: favoriteId
        })

        if (!favorite)
            return responseHandler.notFound(res)

        await favorite.remove()

        return responseHandler.ok(res)
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const getFavoritesOfUser = async (req, res) => {
    try {
        const favorite = await Favorite.find({ user: req.user.id }).sort("-createdAt")

        return responseHandler.ok(res, favorite)
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

export default {
    addFavorite,
    removeFavorite,
    getFavoritesOfUser
}
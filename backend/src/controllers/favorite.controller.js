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
            user: req.user.id,
            ...req.body
        })

        await favorite.save()

        responseHandler.created(res, favorite)
    } catch (error) {
        console.error(error)
        responseHandler.error(res)
    }
}

const removeFavorite = async (req, res) => {
    try {
        const { mediaId } = req.params

        const favorite = await Favorite.findOne({
            user: req.user.id,
            mediaId
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

const getFavoritesOfUser = async (req, res) => {
    try {
        const favorite = await Favorite.find({ user: req.user.id }).sort("-createdAt")

        if (!favorite) return responseHandler.notFound(res, "favorites not found")

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
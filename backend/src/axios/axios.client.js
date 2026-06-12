import axios from "axios"

const get = async (url) => {
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.log('TMBD error:', error)
    }
}

export default { get }
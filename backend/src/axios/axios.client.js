import axios from "axios"

const get = async () => {
    const response = await axios.get(url)
    return response.data
}

export default { get }
const baseurl = process.env.TMDB_BASE_URL
const key = process.env.TMDB_API_KEY

const getUrl = (endpoint, params) => {
    const qs = new URLSearchParams(params)

    return `${baseurl}/${endpoint}?api_key=${key}&${qs}`
}

export default { getUrl }
import axios from "axios";
import https from "https";

const axiosInstance = axios.create({
    timeout: 10000,
    httpsAgent: new https.Agent({
        keepAlive: true
    })
});

const get = async (url) => {
    try {
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("TMDB Error:", error.message);

        // Re-throw so the controller can handle it
        throw error;
    }
};

export default { get };
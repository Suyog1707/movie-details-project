import mongoose from "mongoose";

export const connetDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB is conneted! DB Host:${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
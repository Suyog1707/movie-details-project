import "dotenv/config"
import { connetDB } from "./database/db.js"
import { server } from "./app.js"

const port = process.env.PORT || 3000

connetDB()
    .then(
        server.listen(port, "0.0.0.0", () => {
            console.log(`⚙️  SERVER is running at http://localhost:${port}`)
        })
    ).catch((error) => {
        console.log("MongoDB connection failed!", error);
    })
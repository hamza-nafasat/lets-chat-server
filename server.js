import { app } from "./src/app.js";
import connectDb from "./src/configs/connectDb.js";
import getEnv from "./src/configs/getEnv.js";

(async function main() {
    try {
        await connectDb(getEnv("MONGO_URI"), getEnv("DB_NAME"));
        app.listen(getEnv("PORT"), () => {
            console.log(`server started on port ${getEnv("PORT")}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();

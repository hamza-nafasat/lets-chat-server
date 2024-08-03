import mongoose from "mongoose";

const connectDb = async (url, dbName) => {
    try {
        const conn = await mongoose.connect(url, {
            dbName,
        });
        console.log(`Database ${conn.connection.name} Connected Successfully`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDb;

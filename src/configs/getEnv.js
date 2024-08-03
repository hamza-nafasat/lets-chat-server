import { config } from "dotenv";

config();

const getEnv = (key) => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    return value;
};

export default getEnv;

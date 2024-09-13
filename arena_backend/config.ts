import dotenv from "dotenv";
dotenv.config()

const secret = "secret";
const APP_URL = process.env.APP_URL
const Judge0URL = process.env.Judge0URL; 
export { APP_URL, Judge0URL, secret };


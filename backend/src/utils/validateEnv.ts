import { cleanEnv, str, port, num } from "envalid";

/**
 * Validates the environment variables
 */
export default function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    JWT_SECRET: str(),
    JWT_EXPIRATION: num(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_USER: str(),
  });
}

import { cleanEnv, str, port, num } from "envalid";

/**
 * Validates the environment variables
 */
export default function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    REACT_APP_BACKEND_URL: str(),
    REACT_APP_PORT: port()
  });
}
import { cleanEnv, str, port, num } from "envalid";

/**
 * Validates the environment variables
 */
export default function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    JWT_SECRET: str(),
    JWT_EXPIRATION: str(),
    PGHOST: str(),
    PGPORT: num(),
    PGUSER: str(),
    PGPASSWORD: str(),
    PGDATABASE: str()
  });
}

POSTGRES_HOST=192.168.1.3
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=tutorial

PORT=5000
JWT_SECRET=test
JWT_EXPIRATION=10d
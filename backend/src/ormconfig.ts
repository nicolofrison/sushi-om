import { ConnectionOptions } from "typeorm";

const config: ConnectionOptions = {
  type: "postgres",
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  cli: {
    migrationsDir: "src/migrations",
  },
};

export default config;
